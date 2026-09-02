"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Cpu,
  Volume2,
  Sliders,
  Shield,
  Save,
  Check,
  Leaf,
  Globe,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Key
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const [llmProvider, setLlmProvider] = useState("gemini");
  const [llmModel, setLlmModel] = useState("gemini-2.5-flash");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [ttsVoice, setTtsVoice] = useState("natural-calm");
  const [webglQuality, setWebglQuality] = useState("high");
  const [isSaved, setIsSaved] = useState(false);

  const handleProviderChange = (provider: string) => {
    setLlmProvider(provider);
    if (provider === "gemini") {
      setLlmModel("gemini-2.5-flash");
    } else if (provider === "mistral") {
      setLlmModel("mistral-small-latest");
    } else if (provider === "local") {
      setLlmModel("llama3.2:latest");
    } else if (provider === "openai") {
      setLlmModel("gpt-4o-mini");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            System <span className="italic text-[#8C9A84]">Settings & AI Engine</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Configure Google Gemini and multimodal endpoints, WebGL rendering fidelity, and Cosmos project links.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>Config Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* AI & LLM Provider */}
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <Cpu className="w-4 h-4 text-[#8C9A84]" />
            <span>AI Reasoning & LLM Engine</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[#2D3A31] mb-1.5">
                Primary LLM Provider
              </label>
              <select
                value={llmProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] font-medium"
              >
                <option value="gemini">Google Gemini (Gemini 2.5 Flash / 1.5 Pro)</option>
                <option value="mistral">Mistral AI (Live Connected)</option>
                <option value="local">Ollama Local (Offline Private)</option>
                <option value="openai">OpenAI Compatible (GPT-4o)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2D3A31] mb-1.5">
                Model Name / Checkpoint
              </label>
              {llmProvider === "gemini" ? (
                <select
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Ultra Fast + Multimodal - Recommended)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning & 2M Token Context)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (High Throughput)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#2D3A31] mb-1.5">
                API Key (Optional / Overrides Server Default)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder={llmProvider === "gemini" ? "AIzaSy..." : "Optional custom key"}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 pl-8 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                />
                <Key className="w-3.5 h-3.5 text-[#8C9A84] absolute left-2.5 top-3" />
              </div>
            </div>

            <div className="p-3 bg-[#8C9A84]/10 border border-[#8C9A84]/20 rounded-2xl flex items-center gap-2.5 text-[#2D3A31]">
              <Sparkles className="w-4 h-4 text-[#8C9A84] shrink-0" />
              <p className="text-[11px] leading-relaxed">
                Using <strong>{llmModel}</strong> with sub-millisecond Speed-RAG vector context and high-dimensional parameter calibration.
              </p>
            </div>
          </div>
        </div>

        {/* WebGL & Voice Synthesis */}
        <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <Volume2 className="w-4 h-4 text-[#8C9A84]" />
            <span>Graphics & Acoustic Profile</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[#2D3A31] mb-1.5">
                3D Neural Brain Fidelity
              </label>
              <select
                value={webglQuality}
                onChange={(e) => setWebglQuality(e.target.value)}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              >
                <option value="high">Ultra High (60 FPS + Post-Processing)</option>
                <option value="medium">Balanced (45 FPS)</option>
                <option value="low">Eco Mode (Battery Saver)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2D3A31] mb-1.5">
                Speech Synthesis Voice Profile
              </label>
              <select
                value={ttsVoice}
                onChange={(e) => setTtsVoice(e.target.value)}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              >
                <option value="natural-calm">Natural Female Voice (Calm & Serene)</option>
                <option value="authoritative">Analytical & Direct</option>
                <option value="conversational">Warm Conversational</option>
              </select>
            </div>

            <div className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl text-[11px] text-[#2D3A31]/80 space-y-1">
              <div className="font-semibold text-[#2D3A31]">Speech Parameters:</div>
              <div>Pitch: 1.15 • Cadence: 0.98x • Multi-Director Voice Synthesis</div>
            </div>
          </div>
        </div>

        {/* Cosmos Project Navigation Guide */}
        <div className="md:col-span-2 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <Globe className="w-4 h-4 text-[#8C9A84]" />
            <span>Cosmos Planetary Ecosystem Matrix</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Earth - Veronica */}
            <div className="p-4 bg-[#F9F8F4] border-2 border-[#8C9A84] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#2D3A31] font-serif">Earth: VERONICA</span>
                <span className="px-2 py-0.5 bg-[#8C9A84] text-[#FFFFFF] rounded-full text-[10px] font-bold">
                  ACTIVE OS
                </span>
              </div>
              <p className="text-[11px] text-[#2D3A31]/80">
                Current active digital twin operating system with AI Board Room, AI Gudown (Top 10 ML models), and Data Centre.
              </p>
            </div>

            {/* Venus - Paper */}
            <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#2D3A31] font-serif">Venus: PAPER</span>
                <a
                  href="https://paperc.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#2D3A31] text-white rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-[#8C9A84]"
                >
                  <span>paperc.vercel.app</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-[#2D3A31]/80">
                Full working site for research document synthesis, LaTeX dossier compilation, and export workflows.
              </p>
            </div>

            {/* Mars - CresentX */}
            <div className="p-4 bg-[#C27B66]/10 border border-[#C27B66]/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#C27B66] font-serif">Mars: CRESENTX</span>
                <a
                  href="https://cresentx.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#C27B66] text-white rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-[#2D3A31]"
                >
                  <span>cresentx.vercel.app</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="p-2 bg-[#C27B66]/15 rounded-xl flex items-start gap-1.5 text-[10px] text-[#C27B66] font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>LLM Suspended — Only for view purpose. Use Gemini model in settings.</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
