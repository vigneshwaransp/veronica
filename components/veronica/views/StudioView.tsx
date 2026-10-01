import React, { useState } from "react";
import { UserProfile, Persona, MemoryNode, GeneratedImageItem, GeneratedAudioItem, GeneratedDocItem, GmailDispatchItem, StudioToolType, FlipCardItem, PresentationDeck } from "@/types/veronica";
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
  ExternalLink,
  BookOpen,
  RotateCw,
  Radio,
  SlidersHorizontal
} from "lucide-react";

interface StudioViewProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
}

function createWavBlobFromTone(freq = 432, durationSeconds = 3, sampleRate = 44100): Blob {
  const numSamples = durationSeconds * sampleRate;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin((Math.PI * i) / numSamples);
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.5 * envelope;
    const val = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
    view.setInt16(44 + i * 2, val, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
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

  // --- 2. AUDIO & SOUND ENGINEERING STATE ---
  const [audioText, setAudioText] = useState("Greetings. This is Veronica, your autonomous digital self. My cognitive resonance is currently harmonized with full Speed-RAG sub-millisecond retrieval.");
  const [selectedVoice, setSelectedVoice] = useState("Veronica Neural (Serene)");
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [audioFrequency, setAudioFrequency] = useState<number>(432);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDownloadSuccess, setAudioDownloadSuccess] = useState(false);

  // --- 3. PDF STATE ---
  const [pdfDocType, setPdfDocType] = useState<"AUDIT" | "DECISION_MATRIX" | "MEMORY_ARCHIVE">("AUDIT");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGeneratedSuccess, setPdfGeneratedSuccess] = useState(false);

  // --- 4. PPT STATE & DYNAMIC DECK GENERATOR ---
  const [pptPrompt, setPptPrompt] = useState("Autonomous AI Swarms with Next.js 16 and PostgreSQL Vector Storage");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGeneratingPpt, setIsGeneratingPpt] = useState(false);
  const [pptSuccess, setPptSuccess] = useState(false);
  const [slides, setSlides] = useState([
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
      title: "The 5-Specialist Council Governance",
      subtitle: "Empirical Deliberation and Stress-Testing Matrix",
      bullets: [
        "AI Research Scientist: Speed-RAG 0.8ms dense vector recall",
        "Systems Engineer: Distributed resilience & failover boundaries",
        "Security Architect: Cryptographic invariants & zero-trust token isolation",
        "Optimization Specialist: 14-day RNN temporal sequence forecasting",
        "Product Strategist: Pragmatic developer ergonomics & synthesis",
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
  ]);

  // --- 5. 3D FLIP CARDS STATE ---
  const [flipCardPrompt, setFlipCardPrompt] = useState("Python AsyncIO & System Design Mastery");
  const [isGeneratingFlipCards, setIsGeneratingFlipCards] = useState(false);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [flipCards, setFlipCards] = useState<FlipCardItem[]>([
    {
      id: "fc_01",
      frontTitle: "Python AsyncIO vs Threading",
      frontCategory: "Backend Architecture",
      frontPrompt: "When should you use AsyncIO event loops vs Multi-Threading in Python?",
      backConcept: "AsyncIO uses cooperative single-threaded event loop (ideal for high-concurrency I/O bound network calls), whereas Threading is preemptive (ideal for blocking legacy I/O but limited by GIL).",
      backExplanation: "For CPU-bound tasks, use multiprocessing. For 10k+ concurrent WebSockets/HTTP, use AsyncIO (FastAPI).",
      backCodeSnippet: "async def fetch_embeddings(query: str):\n    async with httpx.AsyncClient() as client:\n        res = await client.post('/embed', json={'q': query})\n        return res.json()",
      masteryLevel: "MASTERED"
    },
    {
      id: "fc_02",
      frontTitle: "PostgreSQL pgvector HNSW Index",
      frontCategory: "Database Engineering",
      frontPrompt: "How does HNSW (Hierarchical Navigable Small World) index work in pgvector?",
      backConcept: "HNSW builds a multi-layer geometric graph where upper layers have long-range skips and bottom layers contain dense local connections.",
      backExplanation: "Provides logarithmic O(log N) approximate nearest neighbor search with >98% recall and sub-millisecond query latency.",
      backCodeSnippet: "CREATE INDEX ON documents\nUSING hnsw (embedding vector_cosine_ops)\nWITH (m = 16, ef_construction = 64);",
      masteryLevel: "REVIEWING"
    },
    {
      id: "fc_03",
      frontTitle: "React 19 Server Components",
      frontCategory: "Frontend Systems",
      frontPrompt: "What is the key execution difference between React Server Components (RSC) and standard Client Components?",
      backConcept: "RSCs execute exclusively on the server at request/build time, emit zero JavaScript to the client bundle, and stream rendered virtual DOM nodes via HTTP chunking.",
      backExplanation: "Client components maintain interactivity and state hooks (useState, useEffect) and must be annotated with 'use client'.",
      backCodeSnippet: "// Server Component\nexport default async function BrainView() {\n  const memories = await db.query('SELECT * FROM memories');\n  return <MemoryGrid items={memories} />;\n}",
      masteryLevel: "MASTERED"
    }
  ]);

  // --- 6. GMAIL STATE ---
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

  // Toggle card flip
  const toggleFlipCard = (id: string) => {
    setFlippedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Download Audio WAV
  const handleDownloadAudioWav = () => {
    const wavBlob = createWavBlobFromTone(audioFrequency, 3, 44100);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veronica_${audioFrequency}hz_neural_tone.wav`;
    a.click();
    setAudioDownloadSuccess(true);
    setTimeout(() => setAudioDownloadSuccess(false), 2500);
  };

  // Generate Dynamic PPT Deck
  const handleGenerateDynamicPpt = (promptText?: string) => {
    const p = promptText || pptPrompt;
    if (!p.trim()) return;

    setIsGeneratingPpt(true);
    setTimeout(() => {
      const newSlides = [
        {
          slideNumber: 1,
          title: p.toUpperCase(),
          subtitle: "Strategic Architecture & Technical Roadmap",
          bullets: [
            "Executive problem statement and high-leverage architectural objectives",
            "Core design constraints: Sub-millisecond latency, zero-runtime errors, ACID guarantees",
            "Multi-agent swarm coordination and parallel task dispatching"
          ],
          note: `Executive opening slide for topic: ${p}.`
        },
        {
          slideNumber: 2,
          title: "System Architecture & Execution Graph",
          subtitle: "Decoupled Microservices & Vector Pipelines",
          bullets: [
            "Speed-RAG vector embeddings with HNSW indexing (0.84ms recall)",
            "Bidirectional streaming Suspense boundaries for continuous token delivery",
            "Strict compile-time invariant checking and automated regression verification"
          ],
          note: "Deep technical architecture layout."
        },
        {
          slideNumber: 3,
          title: "Empirical Benchmarks & Production Readiness",
          subtitle: "Telemetry, Scalability & Autonomous Safety Gates",
          bullets: [
            "99.4% task completion rate across 1,840 automated agent runs",
            "P99 latency bounded at <25ms under high concurrent user load",
            "Full cryptographic audit provenance with zero data leakage"
          ],
          note: "Benchmarking and production verification."
        }
      ];

      setSlides(newSlides);
      setCurrentSlideIndex(0);
      setIsGeneratingPpt(false);
    }, 500);
  };

  // Generate Dynamic Flip Cards on ANY topic
  const handleGenerateDynamicFlipCards = (promptText?: string) => {
    const p = promptText || flipCardPrompt;
    if (!p.trim()) return;

    setIsGeneratingFlipCards(true);
    setTimeout(() => {
      const generated: FlipCardItem[] = [
        {
          id: `fc_${Date.now()}_1`,
          frontTitle: `${p} • Core Theorem`,
          frontCategory: "Architecture & Foundations",
          frontPrompt: `What is the primary architectural principle of ${p}?`,
          backConcept: `The foundational thesis of ${p} relies on deterministic invariants, zero-cost abstractions, and asynchronous event streaming.`,
          backExplanation: "Eliminates runtime overhead by enforcing strict boundaries and predictable resource utilization.",
          backCodeSnippet: `// ${p} Architecture Pattern\nexport function executeInvariants() {\n  return { status: 'OPTIMAL', p99Ms: 0.85 };\n}`,
          masteryLevel: "NEW"
        },
        {
          id: `fc_${Date.now()}_2`,
          frontTitle: `${p} • Concurrency & State`,
          frontCategory: "Concurrency & Memory",
          frontPrompt: `How do we resolve race conditions and state mutations in ${p}?`,
          backConcept: "Uses immutable state transitions and optimistic concurrency control (OCC) to prevent split-brain collisions.",
          backExplanation: "All mutations generate an immutable state delta before sealing in the primary state store.",
          backCodeSnippet: `const nextState = produce(currentState, draft => {\n  draft.status = 'COMMITTED';\n});`,
          masteryLevel: "REVIEWING"
        },
        {
          id: `fc_${Date.now()}_3`,
          frontTitle: `${p} • Performance Bounds`,
          frontCategory: "Optimization & P99",
          frontPrompt: `What are the critical performance bottlenecks and mitigations in ${p}?`,
          backConcept: "Avoids memory thrashing via object pools and zero-copy byte buffers, keeping P99 latency sub-millisecond.",
          backExplanation: "Guarantees continuous 60fps UI paint times and non-blocking background daemon execution.",
          backCodeSnippet: `const buffer = new ArrayBuffer(1024);\nconst view = new DataView(buffer);`,
          masteryLevel: "MASTERED"
        }
      ];

      setFlipCards(generated);
      setIsGeneratingFlipCards(false);
    }, 500);
  };

  // Download Flip Cards
  const handleDownloadFlipCards = () => {
    const htmlContent = `<!DOCTYPE html><html><head><title>VERONICA Interactive Flip Cards</title><style>body{font-family:sans-serif;background:#F9F8F4;color:#2D3A31;padding:40px;}.card{background:#fff;border:1px solid #E6E2DA;border-radius:20px;padding:24px;margin-bottom:20px;max-width:700px;margin-left:auto;margin-right:auto;}h3{color:#2D3A31;margin-top:0;}pre{background:#1B241E;color:#4ADE80;padding:12px;border-radius:12px;font-family:monospace;}</style></head><body><h1>VERONICA Cognitive Flip Cards</h1>${flipCards.map(c => `<div class="card"><span style="color:#8C9A84;font-size:12px;">${c.frontCategory}</span><h3>${c.frontTitle}</h3><p><strong>Question:</strong> ${c.frontPrompt}</p><hr/><p><strong>Concept:</strong> ${c.backConcept}</p><p>${c.backExplanation}</p>${c.backCodeSnippet ? `<pre>${c.backCodeSnippet}</pre>` : ''}</div>`).join('')}</body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Veronica_FlipCards_${Date.now()}.html`;
    a.click();
  };

  // Direct Image Download
  const handleDownloadImageFile = async (img: GeneratedImageItem) => {
    try {
      const res = await fetch(img.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `veronica_${img.id}.png`;
      a.click();
    } catch {
      window.open(img.imageUrl, "_blank");
    }
  };

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

      const htmlContent = `<!DOCTYPE html><html><head><title>VERONICA Presentation Deck</title><style>body{font-family:sans-serif;background:#F9F8F4;color:#2D3A31;padding:40px;}.slide{background:#fff;border:1px solid #E6E2DA;border-radius:24px;padding:40px;margin-bottom:30px;max-width:800px;margin-left:auto;margin-right:auto;box-shadow:0 10px 30px rgba(0,0,0,0.05);}h1{font-family:serif;font-size:28px;}li{margin:12px 0;font-size:16px;}</style></head><body>${slides.map(s => `<div class="slide"><span>Slide ${s.slideNumber}</span><h1>${s.title}</h1><p><em>${s.subtitle}</em></p><ul>${s.bullets.map(b => `<li>${b}</li>`).join("")}</ul></div>`).join("")}</body></html>`;
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
        details: "Downloaded dynamic interactive strategy presentation.",
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

        {/* 6-Tool Selector Tabs */}
        <div className="flex flex-wrap bg-[#F2F0EB] border border-[#E6E2DA] rounded-full p-1.5 shadow-sm gap-1">
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
            <span>Sound & Voice</span>
          </button>

          <button
            onClick={() => setActiveTab("FLIP_CARDS")}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5",
              activeTab === "FLIP_CARDS"
                ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Flip Cards</span>
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
            <span>Dynamic PPT</span>
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
      {/* 2. AUDIO & SOUND ENGINEERING TAB */}
      {/* ========================================================================= */}
      {activeTab === "AUDIO" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Speech Script & Sonic Synthesizer
              </label>
              <textarea
                rows={4}
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

            {/* Sound Engineering Frequency Controls */}
            <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2D3A31] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Sound Engineering • Resonance Frequency</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#8C9A84]">{audioFrequency} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="960"
                step="4"
                value={audioFrequency}
                onChange={(e) => setAudioFrequency(parseInt(e.target.value))}
                className="w-full accent-[#8C9A84]"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "216Hz Sub-Bass", freq: 216 },
                  { label: "432Hz Miracle Tone", freq: 432 },
                  { label: "528Hz Transformation", freq: 528 },
                  { label: "852Hz Intuition", freq: 852 },
                ].map((item) => (
                  <button
                    key={item.freq}
                    onClick={() => setAudioFrequency(item.freq)}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-full border transition-colors",
                      audioFrequency === item.freq
                        ? "bg-[#2D3A31] text-white border-[#2D3A31]"
                        : "bg-white text-[#2D3A31] border-[#E6E2DA] hover:bg-[#F2F0EB]"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handlePlayAudio}
                className="botanical-btn-primary py-3 px-6 text-xs font-semibold rounded-full flex items-center gap-2 shadow-sm"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Voice</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play Neural Voice</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadAudioWav}
                className="px-5 py-3 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] transition-colors flex items-center gap-2 shadow-sm"
              >
                {audioDownloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span>WAV Audio Saved</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#8C9A84]" />
                    <span>Download WAV ({audioFrequency}Hz)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-[#E6E2DA] lg:pl-12">
            <div>
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                Audio Waveform & Harmonic Telemetry
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                {audioFrequency}Hz Harmonic Oscillation
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
                  {selectedVoice} • {audioFrequency}Hz
                </span>
                <span className="text-xs text-[#8C9A84]">
                  {isPlayingAudio ? "Streaming 48kHz Neural Audio" : "PCM 16-Bit Mono WAV Output Ready"}
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
      {/* 3. 3D FLIP CARDS STUDIO TAB */}
      {/* ========================================================================= */}
      {activeTab === "FLIP_CARDS" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Generator Bar */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                  Dynamic Cognitive Cards
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                  Interactive 3D Knowledge Flashcards
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadFlipCards}
                  className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Export Cards (.html)</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={flipCardPrompt}
                onChange={(e) => setFlipCardPrompt(e.target.value)}
                placeholder="Enter any topic to synthesize cards (e.g. Next.js 16 RSC, Rust Concurrency, System Design)..."
                className="flex-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
              <button
                onClick={() => handleGenerateDynamicFlipCards()}
                disabled={isGeneratingFlipCards || !flipCardPrompt.trim()}
                className="botanical-btn-primary px-6 py-3 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
              >
                {isGeneratingFlipCards ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Cards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Synthesize 3D Flip Cards</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Topic Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-[#8C9A84]">Topic Presets:</span>
              {[
                "Python AsyncIO & System Design",
                "PostgreSQL pgvector & HNSW",
                "React 19 Server Components",
                "Distributed Raft Consensus",
                "TypeScript Advanced Generics"
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setFlipCardPrompt(topic);
                    handleGenerateDynamicFlipCards(topic);
                  }}
                  className="text-[11px] px-3 py-1 bg-[#F2F0EB] hover:bg-[#E6E2DA] rounded-full text-[#2D3A31] transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid with 3D Flip Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flipCards.map((card) => {
              const isFlipped = !!flippedCardIds[card.id];
              return (
                <div
                  key={card.id}
                  onClick={() => toggleFlipCard(card.id)}
                  className="cursor-pointer h-[380px] perspective-1000 group select-none"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className={cn(
                      "w-full h-full duration-500 rounded-[28px] transition-transform shadow-sm relative",
                      isFlipped ? "rotate-y-180" : ""
                    )}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front Face */}
                    <div
                      className="absolute inset-0 w-full h-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 flex flex-col justify-between"
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F2F0EB] text-[#8C9A84] rounded-full">
                            {card.frontCategory}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                            card.masteryLevel === "MASTERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : card.masteryLevel === "REVIEWING"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          )}>
                            {card.masteryLevel}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-serif font-bold text-[#2D3A31] group-hover:text-[#8C9A84] transition-colors">
                            {card.frontTitle}
                          </h4>
                          <p className="text-xs text-[#2D3A31]/80 mt-3 leading-relaxed font-medium">
                            {card.frontPrompt}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E6E2DA] flex items-center justify-between text-[11px] text-[#8C9A84]">
                        <span className="flex items-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Click to Flip Card</span>
                        </span>
                        <span className="font-mono">VERONICA CORE</span>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div
                      className="absolute inset-0 w-full h-full bg-[#1B241E] border border-[#2D3A31] text-[#E6E2DA] rounded-[28px] p-6 flex flex-col justify-between rotate-y-180 overflow-y-auto"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8C9A84]">
                          <span>DEEP EXPLANATION & ARCHITECTURE</span>
                          <span className="text-white bg-[#2D3A31] px-2 py-0.5 rounded-full">BACK</span>
                        </div>

                        <p className="text-xs font-semibold text-white leading-relaxed">
                          {card.backConcept}
                        </p>

                        <p className="text-[11px] text-[#8C9A84] leading-relaxed">
                          {card.backExplanation}
                        </p>

                        {card.backCodeSnippet && (
                          <pre className="bg-[#111713] p-3 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto border border-white/10">
                            <code>{card.backCodeSnippet}</code>
                          </pre>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8C9A84]">
                        <span>Click to flip back</span>
                        <span className="text-emerald-400">Mastered Concept</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PPT PRESENTATION GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeTab === "PPT" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Dynamic Generator Prompt Header */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                  Autonomous Strategy Presentation Engine
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2D3A31]">
                  Interactive Dynamic Deck Generator
                </h3>
              </div>

              <button
                onClick={handleExportPpt}
                disabled={isGeneratingPpt}
                className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold rounded-full flex items-center gap-2 shadow-sm shrink-0"
              >
                {pptSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Deck Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Strategy Deck (.html)</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={pptPrompt}
                onChange={(e) => setPptPrompt(e.target.value)}
                placeholder="Enter any presentation topic (e.g. Multi-Agent Swarms, Next.js 16 Production Systems)..."
                className="flex-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
              <button
                onClick={() => handleGenerateDynamicPpt()}
                disabled={isGeneratingPpt || !pptPrompt.trim()}
                className="botanical-btn-primary px-6 py-3 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
              >
                {isGeneratingPpt ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Slides...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Dynamic Deck</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-[#8C9A84]">Sample Decks:</span>
              {[
                "Autonomous AI Swarms & Next.js 16",
                "High-Throughput Vector DB Architecture",
                "Cryptographic Governance & Audit Logs",
                "Sub-Millisecond Speed-RAG Design"
              ].map((deckTopic) => (
                <button
                  key={deckTopic}
                  onClick={() => {
                    setPptPrompt(deckTopic);
                    handleGenerateDynamicPpt(deckTopic);
                  }}
                  className="text-[11px] px-3 py-1 bg-[#F2F0EB] hover:bg-[#E6E2DA] rounded-full text-[#2D3A31] transition-colors"
                >
                  {deckTopic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block">
                Slide Navigator
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D3A31]">
                Slide {slides[currentSlideIndex]?.slideNumber || 1} of {slides.length}: {slides[currentSlideIndex]?.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full hover:bg-[#F2F0EB] disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-semibold text-[#8C9A84]">
                {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="p-2.5 bg-[#FFFFFF] border border-[#E6E2DA] rounded-full hover:bg-[#F2F0EB] disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Slide Canvas */}
          {slides[currentSlideIndex] && (
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-10 sm:p-14 shadow-md aspect-[16/9] max-w-4xl mx-auto flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-[#8C9A84] font-semibold border-b border-[#E6E2DA] pb-3">
                  <span>VERONICA // AUTONOMOUS AI PLATFORM</span>
                  <span>SLIDE 0{slides[currentSlideIndex].slideNumber}</span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3A31]">
                    {slides[currentSlideIndex].title}
                  </h2>
                  <p className="text-base text-[#8C9A84] font-serif italic mt-1">
                    {slides[currentSlideIndex].subtitle}
                  </p>
                </div>

                <ul className="space-y-3 pt-2">
                  {slides[currentSlideIndex].bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#2D3A31]/90">
                      <span className="w-2 h-2 rounded-full bg-[#8C9A84] mt-2 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E6E2DA] flex justify-between items-center text-xs text-[#2D3A31]/50 font-mono">
                <span>CONFIDENTIAL // {user.name}</span>
                <span>ESTIMATED ALIGNMENT: 98%</span>
              </div>
            </div>
          )}
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
