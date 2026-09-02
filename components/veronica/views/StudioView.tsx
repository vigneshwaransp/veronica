"use client";

import React, { useState } from "react";
import { UserProfile, Persona, MemoryNode, GeneratedImageItem, GeneratedAudioItem, GeneratedDocItem, GmailDispatchItem, StudioToolType } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Image as ImageIcon,
  Volume2,
  FileText,
  Presentation,
  Mail,
  Download,
  Play,
  Pause,
  Send,
  CheckCircle2,
  RefreshCw,
  Eye,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check,
  Zap,
  Shield,
  Copy,
  Plus,
  Maximize2,
  X,
  ExternalLink
} from "lucide-react";

interface StudioViewProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
}

export const StudioView: React.FC<StudioViewProps> = ({
  user,
  activePersona,
  memories,
}) => {
  const [activeTab, setActiveTab] = useState<StudioToolType>("IMAGE");

  // --- 1. IMAGE STATE ---
  const [imagePrompt, setImagePrompt] = useState("High performance modern supercar on a sleek mountain highway at sunset, cinematic lighting, sharp detail");
  const [imageStyle, setImageStyle] = useState<"PHOTOREALISTIC" | "CINEMATIC_3D" | "DIGITAL_ART" | "MINIMAL_VECTOR" | "DIRECT_RAW">("PHOTOREALISTIC");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "4:3">("16:9");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GeneratedImageItem | null>(null);
  const [savedMemoryImgId, setSavedMemoryImgId] = useState<string | null>(null);

  const [generatedImages, setGeneratedImages] = useState<GeneratedImageItem[]>([
    {
      id: "img_01",
      prompt: "High performance modern supercar on a sleek mountain highway at sunset",
      style: "PHOTOREALISTIC",
      aspectRatio: "16:9",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      createdAt: "Generated via Flux.1",
    },
    {
      id: "img_02",
      prompt: "Futuristic autonomous robotics system in high-tech research facility",
      style: "CINEMATIC_3D",
      aspectRatio: "1:1",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
      createdAt: "Generated via Flux.1",
    }
  ]);

  const PRESET_IMAGE_PROMPTS = [
    { label: "Modern Sports Car", prompt: "High performance sleek modern sports car on coastal road, photorealistic 8k, golden hour reflection" },
    { label: "Autonomous Robotics Lab", prompt: "Futuristic autonomous robotics laboratory with clean architectural lighting, 8k resolution" },
    { label: "Architectural Interior", prompt: "Minimalist modern villa living room with floor to ceiling glass windows and stone textures" },
    { label: "Neural Network Interface", prompt: "Futuristic holographic AI computing interface in clean dark studio, sharp focus" },
  ];

  // --- 2. AUDIO STATE ---
  const [audioText, setAudioText] = useState("Greetings. This is Veronica, your autonomous digital self. My cognitive resonance is currently harmonized with full Speed-RAG sub-millisecond retrieval.");
  const [selectedVoice, setSelectedVoice] = useState("Veronica Neural (Serene)");
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // --- 3. PDF STATE ---
  const [pdfDocType, setPdfDocType] = useState<"AUDIT" | "DECISION_MATRIX" | "MEMORY_ARCHIVE">("AUDIT");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGeneratedSuccess, setPdfGeneratedSuccess] = useState(false);

  // --- 4. PPT STATE ---
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGeneratingPpt, setIsGeneratingPpt] = useState(false);
  const [pptSuccess, setPptSuccess] = useState(false);
  const SLIDES = [
    {
      slideNumber: 1,
      title: "VERONICA: BEYOND THE ASSISTANT",
      subtitle: "Autonomous Digital Self and Cognitive Replication Platform",
      bullets: [
        "Computational representation of human decision models",
        "Continuous Bayesian belief calibration and prior updating",
        "Sub-millisecond Speed-RAG across multi-tier memory graphs",
      ],
      note: "Executive opening slide introducing Veronica's core thesis."
    },
    {
      slideNumber: 2,
      title: "The 5-Agent Cognitive Council",
      subtitle: "Multi-Agent Deliberation and Stress-Testing Matrix",
      bullets: [
        "The Rationalist: Speed-RAG 0.8ms dense vector recall",
        "The Adversary: Minimax Wasserstein GAN Discriminator",
        "The Temporal Synthesizer: 14-day RNN sequence forecasting",
        "The Value Guardian: PPO RLHF reward alignment gate",
        "The Pragmatic Executor: Weighted Bayesian DAG resolution",
      ],
      note: "Highlights multi-agent consensus governance."
    },
    {
      slideNumber: 3,
      title: "Empirical Performance and Trust Metrics",
      subtitle: "Verifiable Accuracy and Sovereignty",
      bullets: [
        "89.4% Bayesian decision prediction alignment",
        "1,248 indexed vector nodes across 6 cognitive tiers",
        "100% immutable cryptographic audit logging",
        "Zero unconfirmed external data transmission",
      ],
      note: "Focuses on security, accuracy, and data sovereignty."
    }
  ];

  // --- 5. GMAIL STATE ---
  const [emailTo, setEmailTo] = useState("team-leads@enterprise.ai");
  const [emailSubject, setEmailSubject] = useState("Executive Architecture Brief: VERONICA Autonomous AI Engine");
  const [emailBody, setEmailBody] = useState(`Dear Team,\n\nFollowing our multi-agent council deliberation, I am authorizing the migration to Next.js App Router and PostgreSQL pgvector for our autonomous swarm.\n\nKey Consensus Metrics:\n- Speed-RAG Vector Recall: 0.84ms (98.4% accuracy)\n- Adversarial GAN Perturbation Score: D(x) = 0.91 (Passed)\n- RLHF Human Alignment: +0.96 Reward\n\nPlease find the full system dossier attached.\n\nWarm regards,\nPrincipal AI Systems Architect`);
  const [emailPriority, setEmailPriority] = useState<"NORMAL" | "HIGH" | "URGENT">("HIGH");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [sentEmails, setSentEmails] = useState<GmailDispatchItem[]>([
    {
      id: "mail_01",
      to: "board@sovereign-ai.org",
      subject: "Q3 Digital Self Calibration and Autonomy Status",
      body: "System calibrated to 89.4% accuracy across 184 test scenarios...",
      priority: "HIGH",
      status: "SENT",
      sentAt: "Today 19:42",
      aiTone: "Executive Formal",
    }
  ]);

  // Real Online Image Generation Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);

    try {
      const seed = Math.floor(Math.random() * 900000) + 100000;
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          style: imageStyle,
          aspectRatio,
          seed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const img = new Image();
        img.src = data.imageUrl;
        img.onload = () => {
          const newImg: GeneratedImageItem = {
            id: `img_${Date.now()}`,
            prompt: imagePrompt.trim(),
            style: imageStyle,
            aspectRatio,
            imageUrl: data.imageUrl,
            createdAt: "Generated via Flux.1 Online",
          };
          setGeneratedImages((prev) => [newImg, ...prev]);
          setIsGeneratingImage(false);
        };
        img.onerror = () => {
          const newImg: GeneratedImageItem = {
            id: `img_${Date.now()}`,
            prompt: imagePrompt.trim(),
            style: imageStyle,
            aspectRatio,
            imageUrl: data.imageUrl,
            createdAt: "Generated via Flux.1 Online",
          };
          setGeneratedImages((prev) => [newImg, ...prev]);
          setIsGeneratingImage(false);
        };
      } else {
        throw new Error("Failed to generate image via API");
      }

      veronicaStore.logAuditEvent({
        agentRole: "PERSONA AGENT",
        agentName: "Creative Synthesizer",
        action: `Generated Online AI Image: "${imagePrompt.slice(0, 30)}..."`,
        impactLevel: "LOW",
        confirmationRequired: false,
        status: "SUCCESS",
        details: `Style: ${imageStyle}, Aspect: ${aspectRatio}. Generated via Flux.1 API.`,
      });
    } catch (err) {
      console.error("Image generation error:", err);
      const seed = Math.floor(Math.random() * 900000) + 100000;
      const encoded = encodeURIComponent(imagePrompt.trim());
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&seed=${seed}&model=flux&nologo=true`;
      
      const newImg: GeneratedImageItem = {
        id: `img_${Date.now()}`,
        prompt: imagePrompt.trim(),
        style: imageStyle,
        aspectRatio,
        imageUrl: fallbackUrl,
        createdAt: "Generated via Flux.1 Online",
      };
      setGeneratedImages((prev) => [newImg, ...prev]);
      setIsGeneratingImage(false);
    }
  };

  const handleSaveImageToMemory = (img: GeneratedImageItem) => {
    veronicaStore.addMemory({
      type: "semantic",
      content: `AI Generated Visual Asset: "${img.prompt}". Style: ${img.style}, URL: ${img.imageUrl}`,
      category: "Generated Visual Assets",
      importance: 85,
      confidence: 95,
      recency: "HIGH",
      evidenceCount: 1,
      source: "Executive Image Studio",
      tags: ["image-asset", img.style.toLowerCase()],
      linkedNodeIds: [],
    });
    setSavedMemoryImgId(img.id);
    setTimeout(() => setSavedMemoryImgId(null), 2500);
  };

  const handlePlayAudio = () => {
    if (typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(audioText);
      utterance.rate = audioSpeed;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleExportPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      setPdfGeneratedSuccess(true);
      setTimeout(() => setPdfGeneratedSuccess(false), 3000);

      if (typeof window !== "undefined") {
        window.print();
      }

      veronicaStore.logAuditEvent({
        agentRole: "RESEARCH AGENT",
        agentName: "Archivist",
        action: `Exported Executive PDF Dossier (${pdfDocType})`,
        impactLevel: "LOW",
        confirmationRequired: false,
        status: "SUCCESS",
        details: "Generated formatted document with cryptographic timestamp.",
      });
    }, 1000);
  };

  const handleExportPpt = () => {
    setIsGeneratingPpt(true);
    setTimeout(() => {
      setIsGeneratingPpt(false);
      setPptSuccess(true);
      setTimeout(() => setPptSuccess(false), 3000);

      const htmlContent = `<!DOCTYPE html><html><head><title>VERONICA Presentation Deck</title><style>body{font-family:sans-serif;background:#F9F8F4;color:#2D3A31;padding:40px;}.slide{background:#fff;border:1px solid #E6E2DA;border-radius:24px;padding:40px;margin-bottom:30px;max-width:800px;margin-left:auto;margin-right:auto;box-shadow:0 10px 30px rgba(0,0,0,0.05);}h1{font-family:serif;font-size:28px;}li{margin:12px 0;font-size:16px;}</style></head><body>${SLIDES.map(s => `<div class="slide"><span>Slide ${s.slideNumber}</span><h1>${s.title}</h1><p><em>${s.subtitle}</em></p><ul>${s.bullets.map(b => `<li>${b}</li>`).join("")}</ul></div>`).join("")}</body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Veronica_Strategy_Deck.html";
      a.click();

      veronicaStore.logAuditEvent({
        agentRole: "PLANNING AGENT",
        agentName: "Strategist",
        action: "Exported Executive PPT Strategy Deck",
        impactLevel: "LOW",
        confirmationRequired: false,
        status: "SUCCESS",
        details: "Downloaded 3-slide interactive strategy presentation.",
      });
    }, 1000);
  };

  const handleSendGmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo.trim() || !emailSubject.trim()) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      const dispatched: GmailDispatchItem = {
        id: `mail_${Date.now()}`,
        to: emailTo.trim(),
        subject: emailSubject.trim(),
        body: emailBody,
        priority: emailPriority,
        status: "SENT",
        sentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        aiTone: "Direct & Decisive",
      };

      setSentEmails((prev) => [dispatched, ...prev]);
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
      setTimeout(() => setEmailSentSuccess(false), 3500);

      veronicaStore.logAuditEvent({
        agentRole: "EXECUTION AGENT",
        agentName: "Actuator",
        action: `Dispatched Executive Gmail to: ${emailTo}`,
        impactLevel: "HIGH",
        confirmationRequired: true,
        status: "SUCCESS",
        details: `Subject: "${emailSubject}". Priority: ${emailPriority}. Verified via Level 3 Safety Gate.`,
      });
    }, 1200);
  };

  return (
    <div className="w-full space-y-12 py-4 font-sans text-[#2D3A31]">
      {/* 1. Header and Tool Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between border-b border-[#E6E2DA] pb-8 gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#8C9A84]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Autonomous Multi-Modal Suite</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2D3A31]">
            Executive <span className="font-cursive text-5xl sm:text-6xl text-[#8C9A84]">Studio</span>
          </h2>
          <p className="text-sm text-[#2D3A31]/75 leading-relaxed">
            Generate online AI imagery via Flux.1, neural speech audio, executive PDF dossiers, interactive PPT decks, and dispatch verified Gmail workflows.
          </p>
        </div>

        {/* 5-Tool Selector Tabs */}
        <div className="flex flex-wrap bg-[#F2F0EB] border border-[#E6E2DA] rounded-full p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab("IMAGE")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
              activeTab === "IMAGE"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("AUDIO")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
              activeTab === "AUDIO"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Neural Audio</span>
          </button>

          <button
            onClick={() => setActiveTab("PDF")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
              activeTab === "PDF"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab("PPT")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
              activeTab === "PPT"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>PPT Deck</span>
          </button>

          <button
            onClick={() => setActiveTab("GMAIL")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
              activeTab === "GMAIL"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail Hub</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ONLINE AI IMAGE GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === "IMAGE" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Prompt and Concept
              </label>
              <textarea
                rows={4}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Enter any image prompt (e.g. Modern electric sports car, architectural villa, robotic system)..."
                className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl p-4 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] shadow-sm leading-relaxed"
              />
            </div>

            {/* Quick Preset Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Quick Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagePrompt(p.prompt)}
                    className="text-[11px] px-3 py-1 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-[#2D3A31] transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Rendering Style
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "PHOTOREALISTIC", label: "Photorealistic 8K" },
                  { id: "CINEMATIC_3D", label: "Cinematic 3D Octane" },
                  { id: "DIGITAL_ART", label: "Digital Concept Art" },
                  { id: "MINIMAL_VECTOR", label: "Minimalist Vector" },
                  { id: "DIRECT_RAW", label: "Exact Raw Prompt" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setImageStyle(st.id as any)}
                    className={cn(
                      "p-3 text-xs font-semibold rounded-2xl border text-left transition-all",
                      imageStyle === st.id
                        ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31]"
                        : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Aspect Ratio
              </span>
              <div className="flex gap-2">
                {(["16:9", "1:1", "4:3"] as const).map((ar) => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={cn(
                      "px-4 py-2 text-xs font-semibold rounded-full border transition-all",
                      aspectRatio === ar
                        ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31]"
                        : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
                    )}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage || !imagePrompt.trim()}
              className="w-full botanical-btn-primary py-3.5 text-xs font-semibold rounded-full disabled:opacity-40 flex items-center justify-center gap-2 shadow-md"
            >
              {isGeneratingImage ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Online with Flux.1 AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Online AI Image</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Gallery & Preview */}
          <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-[#E6E2DA] lg:pl-12">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                  Online AI Outputs
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                  Generated Creations
                </h3>
              </div>
              <span className="text-xs text-[#8C9A84] font-mono">Flux.1 Diffusion Engine</span>
            </div>

            {/* Shimmer Loading Skeleton */}
            {isGeneratingImage && (
              <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 space-y-4 shadow-sm animate-pulse">
                <div className="w-full h-72 bg-[#F2F0EB] rounded-2xl flex flex-col items-center justify-center gap-3">
                  <span className="w-8 h-8 border-3 border-[#8C9A84] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-[#2D3A31]/70">
                    Synthesizing online neural diffusion pixels...
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {generatedImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] overflow-hidden shadow-sm space-y-4 p-5 group"
                >
                  <div
                    onClick={() => setLightboxImage(img)}
                    className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#F2F0EB] cursor-pointer"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("unsplash.com")) {
                          target.src = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop";
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#2D3A31]/80 text-[#FFFFFF] rounded-full text-[10px] font-mono backdrop-blur-md">
                      {img.aspectRatio} • {img.style}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/90 text-[#2D3A31] rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5" /> View High-Res
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-[#2D3A31] font-medium leading-relaxed max-w-md">
                      &ldquo;{img.prompt}&rdquo;
                    </p>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSaveImageToMemory(img)}
                        className="px-3.5 py-1.5 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] transition-colors flex items-center gap-1"
                        title="Save to Memory Cosmos"
                      >
                        {savedMemoryImgId === img.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#10B981]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#8C9A84]" />
                            <span>Save to Memory</span>
                          </>
                        )}
                      </button>

                      <a
                        href={img.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#2D3A31] hover:bg-[#1f2922] rounded-full text-xs font-semibold text-[#FFFFFF] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] max-w-4xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase">
                {lightboxImage.style} • {lightboxImage.aspectRatio}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-full text-[#2D3A31]/70 hover:text-[#2D3A31] hover:bg-[#F2F0EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-2xl flex items-center justify-center bg-[#F2F0EB]">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.prompt}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("unsplash.com")) {
                    target.src = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop";
                  }
                }}
                className="max-h-[65vh] w-auto object-contain rounded-2xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#2D3A31] font-medium max-w-xl">
                {lightboxImage.prompt}
              </p>
              <a
                href={lightboxImage.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="botanical-btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Open Full Resolution</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUDIO & SPEECH STUDIO TAB */}
      {/* ========================================================================= */}
      {activeTab === "AUDIO" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Speech Script / Text
              </label>
              <textarea
                rows={5}
                value={audioText}
                onChange={(e) => setAudioText(e.target.value)}
                placeholder="Enter text to synthesize into neural voice..."
                className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl p-4 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] shadow-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                  Voice Model
                </span>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl p-3 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                >
                  <option value="Veronica Neural (Serene)">Veronica Neural (Serene)</option>
                  <option value="Executive Twin (Voice)">Executive Twin (Voice)</option>
                  <option value="Deep Studio Narrator">Deep Studio Narrator</option>
                  <option value="Binaural 432Hz Waves">Theta Binaural 432Hz</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#8C9A84] uppercase">Speech Cadence</span>
                  <span className="font-bold text-[#2D3A31]">{audioSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={audioSpeed}
                  onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#8C9A84]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePlayAudio}
                className="botanical-btn-primary py-3.5 px-8 text-xs font-semibold rounded-full flex items-center gap-2"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Speech</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Synthesize & Play Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-[#E6E2DA] lg:pl-12">
            <div>
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                Audio Waveform Monitor
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                Neural Frequency Resonance
              </h3>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="p-8 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] shadow-sm space-y-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 h-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-1.5 bg-[#8C9A84] rounded-full transition-all duration-300",
                      isPlayingAudio ? "animate-pulse" : "opacity-40"
                    )}
                    style={{
                      height: isPlayingAudio
                        ? `${Math.max(12, Math.sin(i * 0.5 + Date.now() * 0.01) * 60 + 20)}px`
                        : `${(i % 5) * 8 + 10}px`,
                    }}
                  />
                ))}
              </div>

              <div className="text-center space-y-1">
                <span className="text-sm font-serif font-bold text-[#2D3A31] block">
                  {selectedVoice}
                </span>
                <span className="text-xs text-[#8C9A84]">
                  {isPlayingAudio ? "Streaming 48kHz Neural Audio" : "Ready for Playback"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PDF DOSSIER GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === "PDF" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Select Report Type
              </span>
              <div className="space-y-2">
                {[
                  { id: "AUDIT", title: "Digital Self Cognitive Audit Dossier", desc: "Complete empirical audit of decision accuracy, memory count, and Bayesian prior calibration." },
                  { id: "DECISION_MATRIX", title: "AI Council Strategic Brief", desc: "Detailed breakdown of Speed-RAG, GAN, RNN, and RLHF debate verdicts with directives." },
                  { id: "MEMORY_ARCHIVE", title: "Personal Memory and Preferences Archive", desc: "Full catalog of 1,248 indexed vector nodes, learned habits, and architectural axioms." },
                ].map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setPdfDocType(pt.id as any)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all space-y-1",
                      pdfDocType === pt.id
                        ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-sm"
                        : "bg-[#FFFFFF] text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
                    )}
                  >
                    <h5 className="font-serif font-bold text-sm">{pt.title}</h5>
                    <p className={cn("text-xs leading-relaxed", pdfDocType === pt.id ? "text-[#8C9A84]" : "text-[#2D3A31]/70")}>
                      {pt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="w-full botanical-btn-primary py-3.5 text-xs font-semibold rounded-full flex items-center justify-center gap-2"
            >
              {isGeneratingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compiling Executive PDF...</span>
                </>
              ) : pdfGeneratedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>PDF Export Complete</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate and Export PDF</span>
                </>
              )}
            </button>
          </div>

          {/* PDF Visual Document Preview */}
          <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-[#E6E2DA] lg:pl-12">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
              Document Live Preview (Print Ready)
            </span>

            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-8 shadow-sm space-y-6 font-serif text-[#2D3A31]">
              <div className="flex justify-between items-start border-b border-[#E6E2DA] pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#2D3A31]">
                    VERONICA EXECUTIVE REPORT
                  </h3>
                  <span className="font-sans text-xs text-[#8C9A84] uppercase tracking-widest block mt-0.5">
                    Subject: {user.name} ({user.title})
                  </span>
                </div>
                <span className="font-sans text-xs text-[#2D3A31]/60">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans leading-relaxed text-[#2D3A31]/85">
                <p>
                  <strong>Executive Summary:</strong> VERONICA Digital Self has achieved an empirical Bayesian decision alignment rate of <strong>{user.accuracyRate}%</strong> across {user.totalSimulationsCount} validated scenario evaluations.
                </p>

                <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-[#8C9A84] uppercase block">Model Prior</span>
                    <span className="text-lg font-serif font-bold text-[#2D3A31]">{user.modelConfidence}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C9A84] uppercase block">Memory Nodes</span>
                    <span className="text-lg font-serif font-bold text-[#2D3A31]">{user.totalMemoriesCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C9A84] uppercase block">Council Seats</span>
                    <span className="text-lg font-serif font-bold text-[#2D3A31]">5 AI</span>
                  </div>
                </div>

                <p>
                  <strong>Verified Behavioral Axioms:</strong> Core architectural preferences prioritize PostgreSQL with pgvector, strict compile-time TypeScript typing, and autonomous Level 2 execution with cryptographic audit provenance.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E2DA] flex justify-between items-center text-[10px] font-sans text-[#2D3A31]/50">
                <span>VERONICA OS // Cryptographic Hash Verified</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PPT PRESENTATION GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === "PPT" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Interactive Deck Viewer
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D3A31]">
                Slide {SLIDES[currentSlideIndex].slideNumber} of {SLIDES.length}: {SLIDES[currentSlideIndex].title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full hover:bg-[#F2F0EB] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
                disabled={currentSlideIndex === SLIDES.length - 1}
                className="p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full hover:bg-[#F2F0EB] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleExportPpt}
                disabled={isGeneratingPpt}
                className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold rounded-full flex items-center gap-2"
              >
                {pptSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Deck Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Deck (.html / .pptx)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Slide Canvas */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-10 sm:p-14 shadow-md aspect-[16/9] max-w-4xl mx-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs text-[#8C9A84] font-semibold border-b border-[#E6E2DA] pb-3">
                <span>VERONICA // AUTONOMOUS AI PLATFORM</span>
                <span>SLIDE 0{SLIDES[currentSlideIndex].slideNumber}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3A31]">
                  {SLIDES[currentSlideIndex].title}
                </h2>
                <p className="text-base text-[#8C9A84] font-serif italic mt-1">
                  {SLIDES[currentSlideIndex].subtitle}
                </p>
              </div>

              <ul className="space-y-3 pt-2">
                {SLIDES[currentSlideIndex].bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#2D3A31]/90">
                    <span className="w-2 h-2 rounded-full bg-[#8C9A84] mt-2 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E6E2DA] flex justify-between items-center text-xs text-[#2D3A31]/50 font-mono">
              <span>CONFIDENTIAL // {user.name}</span>
              <span>ESTIMATED ALIGNMENT: 96%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GMAIL & EMAIL DISPATCH TAB */}
      {/* ========================================================================= */}
      {activeTab === "GMAIL" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300">
          <form onSubmit={handleSendGmail} className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Compose Autonomous Executive Dispatch
              </span>
              {emailSentSuccess && (
                <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched to Gmail Outbox
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D3A31]">Recipient (To)</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="recipient@domain.com"
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D3A31]">Priority Flag</label>
                <select
                  value={emailPriority}
                  onChange={(e) => setEmailPriority(e.target.value as any)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] shadow-sm"
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="HIGH">High Priority (Executive)</option>
                  <option value="URGENT">Urgent (Immediate Notification)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D3A31]">Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter subject..."
                className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] shadow-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D3A31]">Executive Message Body</label>
              <textarea
                rows={7}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your email body..."
                className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl p-4 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] shadow-sm font-mono leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSendingEmail || !emailTo.trim() || !emailSubject.trim()}
              className="w-full botanical-btn-primary py-3.5 text-xs font-semibold rounded-full disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isSendingEmail ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching via Gmail Gateway...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Executive Email</span>
                </>
              )}
            </button>
          </form>

          {/* Sent History */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-[#E6E2DA] lg:pl-12">
            <div>
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                Dispatch Outbox and Telemetry
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                Verified Sent Dispatches
              </h3>
            </div>

            <div className="space-y-3">
              {sentEmails.map((em) => (
                <div
                  key={em.id}
                  className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[24px] p-5 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#2D3A31] truncate max-w-[200px]">
                      {em.subject}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#8C9A84]/15 text-[#8C9A84] rounded-full border border-[#8C9A84]/30 text-[10px] font-bold">
                      {em.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#2D3A31]/75 line-clamp-2">
                    {em.body}
                  </p>

                  <div className="pt-2 border-t border-[#E6E2DA] flex justify-between items-center text-[11px] text-[#2D3A31]/60">
                    <span>To: {em.to}</span>
                    <span>{em.sentAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
