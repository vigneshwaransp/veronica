"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, ExternalLink, X } from "lucide-react";

interface VeronicaSpaceHeroProps {
  onEnterOS: () => void;
}

const ORDER = ["earth", "venus", "mars"] as const;
type PlanetKey = (typeof ORDER)[number];

interface PlanetData {
  name: string;
  still: string;
  clip: string;
  lede: string;
  cutout: string;
  url?: string;
  banner?: string;
  btnLabel: string;
}

const PLANETS: Record<PlanetKey, PlanetData> = {
  earth: {
    name: "EARTH",
    still:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png",
    clip:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_3ffb4889-c520-432d-8458-038009eb40df.mp4",
    lede:
      "A living computational digital self that learns how you operate, predicts your decisions, and harmonizes with your mind. <br>Welcome to VERONICA — Beyond the Assistant.",
    cutout:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202005_3346cc4d-ec3b-44ab-825c-b18e49f5021a.png",
    btnLabel: "ENTER DIGITAL TWIN",
  },
  venus: {
    name: "VENUS",
    still:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_cf55d1d8-7b59-4a64-80da-d72052ae974e.png",
    clip:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_b211cd74-013b-4dd3-bfd0-64491d8696fa.mp4",
    lede:
      "Paper Project — Full working site for autonomous document synthesis, research dossiers, and LaTeX publishing at paperc.vercel.app.",
    cutout:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202012_640b239a-d08a-4200-adb2-741bbe129ac8.png",
    url: "https://paperc.vercel.app/",
    btnLabel: "LAUNCH PAPERC",
  },
  mars: {
    name: "MARS",
    still:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_0ba6de7c-285d-43dc-b7ab-8c54c73707cb.png",
    clip:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_51eae59a-2459-4c84-907c-cc5edfe5fea7.mp4",
    lede:
      "Previous generation AI platform CresentX. <br><span style='color: #D18E7B; font-weight: 600;'>LLM Suspended — Only for view purpose. Use Gemini model in settings.</span>",
    cutout:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202018_3d559490-f613-4ed7-a3bb-3b7e9fc90fb8.png",
    url: "https://cresentx.vercel.app/",
    banner: "LLM Suspended — Only for view purpose. Use Gemini model in settings",
    btnLabel: "LAUNCH CRESENTX (VIEW ONLY)",
  },
};

export const VeronicaSpaceHero: React.FC<VeronicaSpaceHeroProps> = ({ onEnterOS }) => {
  const [currentPlanet, setCurrentPlanet] = useState<PlanetKey>("earth");
  const [loadedVideos, setLoadedVideos] = useState<Record<string, boolean>>({
    earth: true,
  });

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const rest = ORDER.filter((p) => p !== currentPlanet);
  const leftPlanet = rest[0];
  const rightPlanet = rest[1];

  const handleSelectPlanet = (planet: PlanetKey) => {
    if (planet === currentPlanet) return;
    setLoadedVideos((prev) => ({ ...prev, [planet]: true }));
    setCurrentPlanet(planet);

    ORDER.forEach((p) => {
      const vid = videoRefs.current[p];
      if (vid) {
        if (p === planet) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  };

  const warmVideo = (planet: PlanetKey) => {
    if (!loadedVideos[planet]) {
      setLoadedVideos((prev) => ({ ...prev, [planet]: true }));
    }
  };

  useEffect(() => {
    const earthVid = videoRefs.current["earth"];
    if (earthVid) {
      earthVid.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      setLoadedVideos({ earth: true, venus: true, mars: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleAction = () => {
    if (currentPlanet === "earth") {
      onEnterOS();
    } else if (currentPlanet === "venus") {
      window.open("https://paperc.vercel.app/", "_blank");
    } else if (currentPlanet === "mars") {
      window.open("https://cresentx.vercel.app/", "_blank");
    }
  };

  return (
    <div className="spaceedu-scope relative w-full h-screen overflow-hidden select-none">
      <style jsx global>{`
        .spaceedu-scope {
          --dw: 1353;
          --dh: 1163;
          --gutter: 25;
          --u: max(
            min(0.72px, calc(100vh / 700)),
            min(calc(100vw / 1353), calc(100vh / 1163))
          );
          --dh-px: calc(1163 * var(--u));
          --vshift: calc(max(0px, (100vh - var(--dh-px))) * 0.42);
          --ink: #ffffff;
          --cyan: #8c9a84;
          --cyan-logo: #dfe104;
          --font-serif: "Playfair Display", "Prata", Georgia, serif;
          --font-cursive: "Alex Brush", "Dancing Script", "Great Vibes", cursive;
          --font-body: "Source Sans 3", system-ui, -apple-system, sans-serif;
          --font-logo: "Alex Brush", "Dancing Script", "Playfair Display", cursive;
          font-family: var(--font-body);
          background: #04101f;
          color: var(--ink);
        }

        @supports (height: 100dvh) {
          .spaceedu-scope {
            --u: max(
              min(0.72px, calc(100dvh / 700)),
              min(calc(100vw / 1353), calc(100dvh / 1163))
            );
            --vshift: calc(max(0px, (100dvh - var(--dh-px))) * 0.42);
          }
        }

        .spaceedu-sky {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: background-image 0.22s linear;
        }

        .spaceedu-sky video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.22s linear;
        }

        .spaceedu-sky video.is-active {
          opacity: 1;
        }

        .spaceedu-navbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 6;
          height: calc(88 * var(--u));
        }

        .spaceedu-navbar::after {
          content: "";
          position: absolute;
          left: calc(25 * var(--u));
          right: calc(49 * var(--u));
          top: calc(86 * var(--u));
          height: calc(2 * var(--u));
          background: rgba(255, 255, 255, 0.2);
        }

        .spaceedu-navrow {
          position: absolute;
          left: calc(25 * var(--u));
          right: calc(49 * var(--u));
          top: 0;
          height: calc(86 * var(--u));
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spaceedu-logo {
          font-family: var(--font-cursive);
          font-weight: 400;
          font-size: calc(30 * var(--u));
          line-height: 1;
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }

        .spaceedu-links {
          display: flex;
          align-items: center;
        }

        .spaceedu-links a,
        .spaceedu-links button {
          position: relative;
          display: flex;
          align-items: center;
          height: calc(86 * var(--u));
          font-size: calc(18 * var(--u));
          font-weight: 400;
          line-height: 1;
          color: #fff;
          text-decoration: none;
          padding: 0 calc(17.5 * var(--u));
          white-space: nowrap;
          background: none;
          border: 0;
          cursor: pointer;
        }

        .spaceedu-links .spaceedu-enroll {
          margin-left: calc(28.5 * var(--u));
          width: calc(160 * var(--u));
          height: calc(42 * var(--u));
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: calc(15 * var(--u));
          font-weight: 600;
          letter-spacing: 0.05em;
          line-height: 1;
          color: #ffffff;
          text-decoration: none;
          background: #8c9a84;
          box-shadow: 0 4px 14px rgba(140, 154, 132, 0.4);
          transition: all 0.3s ease;
        }

        .spaceedu-links .spaceedu-enroll:hover {
          background: #c27b66;
          transform: translateY(-2px);
        }

        .spaceedu-copy {
          position: absolute;
          inset: 0;
          transform: translateY(var(--vshift));
          pointer-events: none;
        }

        .spaceedu-copy button {
          pointer-events: auto;
        }

        .spaceedu-col {
          position: absolute;
          left: 0;
          right: calc(var(--gutter) * var(--u));
          text-align: center;
        }

        .spaceedu-eyebrow {
          top: calc(188.8 * var(--u));
          font-family: var(--font-body);
          font-size: calc(22 * var(--u));
          font-weight: 600;
          line-height: 1;
          letter-spacing: calc(4 * var(--u));
          color: #8c9a84;
        }

        h1.spaceedu-title {
          top: calc(255 * var(--u));
          font-family: var(--font-serif);
          font-weight: 600;
          font-size: calc(118 * var(--u));
          line-height: 1;
          letter-spacing: calc(-1 * var(--u));
          color: #fff;
        }

        h1.spaceedu-title.is-cursive {
          top: calc(225 * var(--u));
          font-family: var(--font-cursive);
          font-weight: 400;
          font-size: calc(152 * var(--u));
          line-height: 1;
          letter-spacing: calc(2 * var(--u));
          color: #fff;
        }

        .spaceedu-rule {
          top: calc(405.5 * var(--u));
          height: calc(3 * var(--u));
          font-size: 0;
          line-height: 0;
        }

        .spaceedu-rule span {
          display: inline-block;
          vertical-align: top;
          width: calc(80 * var(--u));
          height: 100%;
          border-radius: 9999px;
          background: #8c9a84;
        }

        p.spaceedu-lede {
          top: calc(428 * var(--u));
          font-size: calc(20 * var(--u));
          font-weight: 400;
          line-height: calc(32 * var(--u));
          color: rgba(255, 255, 255, 0.9);
          max-width: calc(780 * var(--u));
          margin: 0 auto;
        }

        .spaceedu-cta {
          top: calc(597 * var(--u));
          height: calc(66 * var(--u));
          isolation: isolate;
        }

        .spaceedu-cta button.spaceedu-start-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: calc(270 * var(--u));
          height: calc(64 * var(--u));
          border-radius: 9999px;
          font-size: calc(15 * var(--u));
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #ffffff;
          border: 0;
          cursor: pointer;
          background: #2d3a31;
          box-shadow: 0 10px 30px rgba(45, 58, 49, 0.4);
          transition: all 0.3s ease;
        }

        .spaceedu-cta button.spaceedu-start-btn:hover {
          background: #c27b66;
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(194, 123, 102, 0.4);
        }

        .spaceedu-planet {
          position: absolute;
          z-index: -1;
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
          pointer-events: auto;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .spaceedu-planet img {
          display: none;
          width: 100%;
          height: auto;
        }

        .spaceedu-planet img.is-shown {
          display: block;
        }

        .spaceedu-planet:hover {
          transform: scale(1.05);
        }

        .spaceedu-planet-l {
          width: calc(143 * var(--u));
          left: calc(-69.5 * var(--u));
          top: calc(-38.3 * var(--u));
        }

        .spaceedu-planet-r {
          width: calc(143 * var(--u));
          right: calc(-64.7 * var(--u));
          top: calc(-40.6 * var(--u));
        }

        .spaceedu-label {
          position: absolute;
          top: calc(33 * var(--u));
          font-family: var(--font-serif);
          font-weight: 400;
          font-size: calc(17.8 * var(--u));
          letter-spacing: calc(4.6 * var(--u));
          line-height: 1;
          color: #fff;
          white-space: nowrap;
        }

        .spaceedu-label.label-l {
          left: calc(111 * var(--u));
        }

        .spaceedu-label.label-r {
          right: calc(104 * var(--u));
        }

        .spaceedu-scroll {
          position: absolute;
          z-index: 4;
          left: 50%;
          margin-left: calc((-48 - (var(--gutter) / 2)) * var(--u));
          bottom: calc(68 * var(--u));
          width: calc(96 * var(--u));
          height: calc(96 * var(--u));
          border-radius: 50%;
          background: rgba(45, 58, 49, 0.7);
          backdrop-filter: blur(calc(6 * var(--u)));
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .spaceedu-scroll:hover {
          background: #8c9a84;
          transform: translateY(3px);
        }

        .spaceedu-scroll svg {
          width: calc(20 * var(--u));
          height: calc(25 * var(--u));
          display: block;
        }
      `}</style>

      {/* 3 Background Videos */}
      <div
        className="spaceedu-sky"
        style={{ backgroundImage: `url("${PLANETS[currentPlanet].still}")` }}
      >
        {ORDER.map((p) => {
          const isFeatured = p === currentPlanet;
          return (
            <video
              key={p}
              ref={(el) => {
                videoRefs.current[p] = el;
              }}
              data-planet={p}
              className={isFeatured ? "is-active" : ""}
              autoPlay={isFeatured}
              muted
              loop
              playsInline
              preload={isFeatured ? "auto" : "none"}
              src={loadedVideos[p] ? PLANETS[p].clip : undefined}
              poster={PLANETS[p].still}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Top Banner Notice when Mars / CresentX is Selected */}
      {PLANETS[currentPlanet].banner && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-[#C27B66]/90 backdrop-blur-md py-2 px-4 text-center text-xs font-semibold text-[#FFFFFF] flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FFFFFF]" />
          <span>{PLANETS[currentPlanet].banner}</span>
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Navigation */}
        <header className={cn("spaceedu-navbar pointer-events-auto", PLANETS[currentPlanet].banner && "top-7")}>
          <div className="spaceedu-navrow">
            <button
              onClick={onEnterOS}
              className="spaceedu-logo text-left flex items-center gap-2"
            >
              <span className="font-cursive text-3xl sm:text-4xl text-[#FFFFFF] tracking-wide pt-1">
                Veronica
              </span>
              <span className="text-[11px] text-[#8C9A84] px-2.5 py-0.5 bg-[#2D3A31]/80 rounded-full font-sans font-medium">
                DIGITAL SELF
              </span>
            </button>

            <nav className="spaceedu-links">
              <button
                type="button"
                onClick={() => handleSelectPlanet("earth")}
                className={cn(currentPlanet === "earth" && "text-[#8C9A84] font-semibold")}
              >
                Earth
              </button>
              <button
                type="button"
                onClick={() => handleSelectPlanet("venus")}
                className={cn(currentPlanet === "venus" && "text-[#8C9A84] font-semibold")}
              >
                Venus (Paper)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPlanet("mars")}
                className={cn(currentPlanet === "mars" && "text-[#8C9A84] font-semibold")}
              >
                Mars (Cresent)
              </button>
              <button
                type="button"
                onClick={onEnterOS}
                className="spaceedu-enroll"
              >
                ENTER VERONICA
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Content */}
        <div className="spaceedu-copy pointer-events-none">
          <div className="spaceedu-col spaceedu-eyebrow">
            <span>BEYOND THE ASSISTANT</span>
          </div>

          <h1 className={cn("spaceedu-col spaceedu-title", currentPlanet === "earth" && "is-cursive")}>
            <span>{currentPlanet === "earth" ? "Veronica" : PLANETS[currentPlanet].name}</span>
          </h1>

          <div className="spaceedu-col spaceedu-rule">
            <span />
          </div>

          <p
            className="spaceedu-col spaceedu-lede"
            dangerouslySetInnerHTML={{ __html: PLANETS[currentPlanet].lede }}
          />

          <div className="spaceedu-col spaceedu-cta pointer-events-auto">
            {/* Left Slot Planet Button */}
            <button
              className="spaceedu-planet spaceedu-planet-l"
              type="button"
              data-slot="l"
              aria-label={`Show ${PLANETS[leftPlanet].name}`}
              onClick={() => handleSelectPlanet(leftPlanet)}
              onPointerEnter={() => warmVideo(leftPlanet)}
              onFocus={() => warmVideo(leftPlanet)}
            >
              {ORDER.map((p) => (
                <img
                  key={p}
                  data-planet={p}
                  alt=""
                  src={PLANETS[p].cutout}
                  className={p === leftPlanet ? "is-shown" : ""}
                />
              ))}
            </button>

            {/* Right Slot Planet Button */}
            <button
              className="spaceedu-planet spaceedu-planet-r"
              type="button"
              data-slot="r"
              aria-label={`Show ${PLANETS[rightPlanet].name}`}
              onClick={() => handleSelectPlanet(rightPlanet)}
              onPointerEnter={() => warmVideo(rightPlanet)}
              onFocus={() => warmVideo(rightPlanet)}
            >
              {ORDER.map((p) => (
                <img
                  key={p}
                  data-planet={p}
                  alt=""
                  src={PLANETS[p].cutout}
                  className={p === rightPlanet ? "is-shown" : ""}
                />
              ))}
            </button>

            <button
              type="button"
              onClick={handleAction}
              className="spaceedu-start-btn"
            >
              {PLANETS[currentPlanet].btnLabel}
            </button>

            <span className="spaceedu-label label-l">
              {PLANETS[leftPlanet].name}
            </span>
            <span className="spaceedu-label label-r">
              {PLANETS[rightPlanet].name}
            </span>
          </div>
        </div>

        {/* Scroll button */}
        <button
          onClick={handleAction}
          className="spaceedu-scroll pointer-events-auto"
          type="button"
          aria-label="Enter OS or Launch Project"
        >
          <svg viewBox="0 0 26 33" fill="none" aria-hidden="true">
            <path
              d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
