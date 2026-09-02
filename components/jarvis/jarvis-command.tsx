"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, CircleSlash, Radio } from "lucide-react";

interface CommandProps {
  onSendCommand: (cmd: string) => void;
  onStopAll: () => void;
  isListening: boolean;
  onMicToggle: () => void;
}

export const JarvisCommand: React.FC<CommandProps> = ({
  onSendCommand,
  onStopAll,
  isListening,
  onMicToggle,
}) => {
  const [text, setText] = useState("");
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [selectedDevice, setSelectedDevice] = useState("Default Input Channel");
  const [transcription, setTranscription] = useState("");
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeStreamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Helper: Stop active microphone stream tracks
  const stopStreamTracks = () => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      activeStreamRef.current = null;
    }
  };

  // Helper: Play simple web chime beep
  const playWakeBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Failed to play wake chime:", e);
    }
  };

  // Helper: Start command voice recording
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio capture device not supported in this browser.");
      return;
    }

    try {
      // Pause wake word listener while recording
      if (recognitionRef.current && isWakeWordActive) {
        recognitionRef.current.stop();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      activeStreamRef.current = stream;
      setMicPermission("granted");

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        setTranscription("Transcribing speech...");

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");

          const response = await fetch("/api/speech/stt", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Server returned code ${response.status}`);
          }

          const result = await response.json();
          if (result.text && result.text.trim()) {
            setTranscription(`"${result.text}"`);
            onSendCommand(result.text);
          } else {
            setTranscription("No speech detected. Please try again.");
          }
        } catch (err) {
          console.error("Transcribing audio failed:", err);
          setTranscription("Transcription failed. Verify backend is running.");
        } finally {
          setIsProcessing(false);
          stopStreamTracks();
          
          // Restart wake word monitoring if active
          if (isWakeWordActive) {
            try {
              recognitionRef.current.start();
            } catch {}
          }
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250); // Capture data chunks every 250ms
      onMicToggle();
    } catch (err) {
      console.warn("Recording mic failed:", err);
      setMicPermission("denied");
      alert("Could not access microphone.");
    }
  };

  // Helper: Stop command voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      onMicToggle();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendCommand(text);
    setText("");
  };

  // Effect 1: Initialize SpeechRecognition for wake word detection
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
        
        console.log("Wake word scanning:", transcript);
        if (transcript.includes("hey jarvis") || transcript.includes("hey, jarvis") || transcript.includes("hey jarves")) {
          console.log("Wake word 'Hey Jarvis' detected!");
          // Trigger the mic recording if not already listening or processing
          if (!isListening && !isProcessing) {
            playWakeBeep();
            startRecording();
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (e: any) => {
        console.warn("Wake word SpeechRecognition error:", e);
      };

      rec.onend = () => {
        // Automatically restart wake-word listener if enabled
        if (isWakeWordActive && !isListening && !isProcessing) {
          try {
            rec.start();
          } catch {
            // Ignore if already started
          }
        }
      };

      recognitionRef.current = rec;
    } else {
      console.warn("Web SpeechRecognition API is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWakeWordActive, isListening, isProcessing]);

  // Effect 2: Handle wake word active state changes
  useEffect(() => {
    if (recognitionRef.current) {
      if (isWakeWordActive) {
        try {
          recognitionRef.current.start();
          console.log("Wake word monitoring activated");
        } catch (e) {
          console.warn("Failed to start wake word listener:", e);
        }
      } else {
        try {
          recognitionRef.current.stop();
          console.log("Wake word monitoring deactivated");
        } catch {}
      }
    }
  }, [isWakeWordActive]);

  // Effect 3: Clean up stream tracks on unmount
  useEffect(() => {
    return () => {
      stopStreamTracks();
    };
  }, []);

  return (
    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.3)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-900 pb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMicClick}
            disabled={isProcessing}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
              isListening
                ? "bg-red-950/40 border-red-500/80 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse"
                : isProcessing
                ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800/80 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]"
            }`}
            title={isListening ? "Deactivate Voice Capture" : "Activate Voice Capture"}
          >
            {isListening ? <Mic className="w-5.5 h-5.5" /> : <MicOff className="w-5.5 h-5.5" />}
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-white tracking-wider">
                Voice Input Channel
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  micPermission === "granted"
                    ? "bg-emerald-500"
                    : micPermission === "denied"
                    ? "bg-rose-500"
                    : "bg-amber-500"
                }`}
              />
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="bg-transparent text-[10px] text-slate-500 border-none p-0 outline-none focus:ring-0 font-mono cursor-pointer"
              >
                <option value="default" className="bg-slate-950 text-slate-400">
                  Default Microphone Array
                </option>
                <option value="virtual" className="bg-slate-950 text-slate-400">
                  Virtual Stereo Mix
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Wake Word indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsWakeWordActive((prev) => !prev)}
            className={`flex items-center space-x-1.5 border px-2.5 py-1 rounded-lg transition-all duration-300 font-mono text-[10px] uppercase tracking-widest ${
              isWakeWordActive
                ? "bg-cyan-950/40 border-cyan-800/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                : "bg-slate-950/80 border-slate-900 text-slate-500 hover:text-slate-400"
            }`}
            title="Toggle background wake word listener"
          >
            <Radio className={`w-3.5 h-3.5 ${isWakeWordActive ? "animate-pulse" : ""}`} />
            <span>Hey Jarvis</span>
          </button>

          {/* Emergency Global Kill Switch */}
          <button
            onClick={onStopAll}
            className="flex items-center space-x-2 px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/80 hover:border-rose-600 text-rose-400 hover:text-rose-200 text-xs font-mono font-bold tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]"
          >
            <CircleSlash className="w-3.5 h-3.5" />
            <span>STOP</span>
          </button>
        </div>
      </div>

      {(isListening || isProcessing) && (
        <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 font-mono">LIVE TRANSCRIPTION PREVIEW</span>
            <span className="text-[9px] text-cyan-400 animate-pulse font-mono">
              {isListening ? "CAPTURING..." : "PROCESSING AUDIO..."}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono italic">
            {transcription || '"Listening for commands... Speak now"'}
          </p>
        </div>
      )}

      {/* Main command input form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Ask JARVIS (e.g. "Open project and run build tests...")'
          className="flex-1 bg-slate-950/80 border border-slate-900 focus:border-cyan-800/80 focus:ring-1 focus:ring-cyan-900/30 text-xs text-white placeholder-slate-600 rounded-lg px-4 py-2.5 outline-none transition-all duration-300 font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-950/60 to-indigo-950/40 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-800/40 hover:border-cyan-600 text-cyan-400 hover:text-cyan-200 rounded-lg transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
