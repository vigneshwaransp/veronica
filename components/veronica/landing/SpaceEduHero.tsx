"use client";

import React, { useState, useEffect, useRef } from "react";

interface SpaceEduHeroProps {
  onEnterOS: () => void;
}

const ORDER = ["earth", "venus", "mars"] as const;
type PlanetKey = (typeof ORDER)[number];

const PLANETS: Record<
  PlanetKey,
  { name: string; still: string; clip: string; lede: string; cutout: string }
> = {
  earth: {
    name: "EARTH",
    still:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png",
    clip:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_3ffb4889-c520-432d-8458-038009eb40df.mp4",
    lede:
      "Learn more about the fascinating details that we call our home, Planet Earth. Course enrollment <br>starts today. Early Bird tickets typically last a week, don&rsquo;t miss out!",
    cutout:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202005_3346cc4d-ec3b-44ab-825c-b18e49f5021a.png",
  },
  venus: {
    name: "VENUS",
    still:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_cf55d1d8-7b59-4a64-80da-d72052ae974e.png",
    clip:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_b211cd74-013b-4dd3-bfd0-64491d8696fa.mp4",
    lede:
      "The hottest world in our solar system, wrapped in clouds of sulfuric acid. Course enrollment <br>starts today. Early Bird tickets typically last a week, don&rsquo;t miss out!",
    cutout:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202012_640b239a-d08a-4200-adb2-741bbe129ac8.png",
  },
  mars: {
    name: "MARS",
    still:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_0ba6de7c-285d-43dc-b7ab-8c54c73707cb.png",
    clip:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_51eae59a-2459-4c84-907c-cc5edfe5fea7.mp4",
    lede:
      "The rust-red desert world, home to the tallest volcano we know of. Course enrollment <br>starts today. Early Bird tickets typically last a week, don&rsquo;t miss out!",
    cutout:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202018_3d559490-f613-4ed7-a3bb-3b7e9fc90fb8.png",
  },
};

export const SpaceEduHero: React.FC<SpaceEduHeroProps> = ({ onEnterOS }) => {
  const [currentPlanet, setCurrentPlanet] = useState<PlanetKey>("earth");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    // Play active video and pause others
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
    // Initial Earth playback
    const earthVid = videoRefs.current["earth"];
    if (earthVid) {
      earthVid.play().catch(() => {});
    }

    // Warm remaining videos during idle
    const timer = setTimeout(() => {
      setLoadedVideos({ earth: true, venus: true, mars: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
          --cyan: #79dce8;
          --cyan-logo: #5fd0e1;
          --rule: rgba(255, 255, 255, 0.23);
          --btn-ink: #071227;
          --font-serif: "Prata", Georgia, serif;
          --font-body: "Hanken Grotesk", system-ui, -apple-system, sans-serif;
          --font-logo: "Poppins", sans-serif;
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

        @media (prefers-reduced-motion: reduce) {
          .spaceedu-sky video {
            display: none;
          }
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
          background: var(--rule);
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
          font-family: var(--font-logo);
          font-weight: 600;
          font-size: calc(18.4 * var(--u));
          letter-spacing: calc(-0.15 * var(--u));
          line-height: 1;
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
          position: relative;
          top: calc(-1 * var(--u));
        }

        .spaceedu-logo i {
          font-style: normal;
          color: var(--cyan-logo);
        }

        .spaceedu-burger {
          display: none;
          position: relative;
          width: calc(46 * var(--u));
          height: calc(46 * var(--u));
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: calc(6 * var(--u));
          flex: none;
        }

        .spaceedu-burger span {
          display: block;
          width: calc(24 * var(--u));
          height: calc(2 * var(--u));
          border-radius: calc(2 * var(--u));
          background: #fff;
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.18s linear;
        }

        .spaceedu-navrow[data-open="true"] .spaceedu-burger span:nth-child(1) {
          transform: translateY(calc(8 * var(--u))) rotate(45deg);
        }
        .spaceedu-navrow[data-open="true"] .spaceedu-burger span:nth-child(2) {
          opacity: 0;
        }
        .spaceedu-navrow[data-open="true"] .spaceedu-burger span:nth-child(3) {
          transform: translateY(calc(-8 * var(--u))) rotate(-45deg);
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
          font-size: calc(18.4 * var(--u));
          font-weight: 400;
          line-height: 1;
          color: #fff;
          text-decoration: none;
          padding: 0 calc(17.5 * var(--u));
          letter-spacing: calc(-1 * var(--u));
          white-space: nowrap;
          background: none;
          border: 0;
          cursor: pointer;
        }

        .spaceedu-links a[aria-current="page"]::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: calc(83.5 * var(--u));
          height: calc(4 * var(--u));
          background: var(--cyan);
          border-radius: calc(1 * var(--u));
        }

        .spaceedu-links a:nth-child(3) {
          letter-spacing: calc(-1.75 * var(--u));
        }
        .spaceedu-links a:nth-child(2) {
          margin-left: calc(24 * var(--u));
        }
        .spaceedu-links a:nth-child(3) {
          margin-left: calc(26 * var(--u));
        }
        .spaceedu-links a:nth-child(4) {
          margin-left: calc(27 * var(--u));
        }

        .spaceedu-links .spaceedu-enroll {
          margin-left: calc(28.5 * var(--u));
          width: calc(107 * var(--u));
          height: calc(38 * var(--u));
          border-radius: calc(19 * var(--u));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: calc(17 * var(--u));
          font-weight: 600;
          letter-spacing: calc(-0.75 * var(--u));
          line-height: 1;
          color: var(--btn-ink);
          text-decoration: none;
          padding-top: calc(2 * var(--u));
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #d8ecfe 9%,
            #dceefe 72%,
            #f4f9ff 100%
          );
          box-shadow: 0 calc(3 * var(--u)) calc(14 * var(--u))
              rgba(255, 255, 255, 0.22),
            inset 0 0 0 calc(1.5 * var(--u)) rgba(255, 255, 255, 0.92);
          flex: none;
          cursor: pointer;
        }

        .spaceedu-copy {
          position: absolute;
          inset: 0;
          transform: translateY(var(--vshift));
          pointer-events: none;
        }

        .spaceedu-copy a,
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
          font-size: calc(30.45 * var(--u));
          font-weight: 500;
          line-height: 1;
          letter-spacing: calc(4 * var(--u));
          text-indent: calc(4 * var(--u));
          color: #fff;
        }

        h1.spaceedu-title {
          top: calc(268 * var(--u));
          font-family: var(--font-serif);
          font-weight: 400;
          font-size: calc(112.4 * var(--u));
          line-height: 1;
          letter-spacing: calc(2 * var(--u));
          text-indent: calc(2 * var(--u));
          color: #fff;
        }

        .spaceedu-rule {
          top: calc(405.5 * var(--u));
          height: calc(5 * var(--u));
          font-size: 0;
          line-height: 0;
          padding-right: calc(2 * var(--u));
        }

        .spaceedu-rule span {
          display: inline-block;
          vertical-align: top;
          width: calc(100 * var(--u));
          height: 100%;
          border-radius: calc(2.5 * var(--u));
          background: var(--cyan);
        }

        p.spaceedu-lede {
          top: calc(433.2 * var(--u));
          font-size: calc(18.36 * var(--u));
          font-weight: 400;
          line-height: calc(30 * var(--u));
          color: rgba(255, 255, 255, 0.95);
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
          width: calc(216 * var(--u));
          height: calc(66 * var(--u));
          border-radius: calc(33 * var(--u));
          font-size: calc(17 * var(--u));
          font-weight: 700;
          letter-spacing: 0;
          text-indent: 0;
          line-height: 1;
          color: var(--btn-ink);
          border: 0;
          cursor: pointer;
          padding-top: calc(2 * var(--u));
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #d6e8f8 4%,
            #d9ecfe 72%,
            #ffffff 100%
          );
          box-shadow: 0 calc(10 * var(--u)) calc(18 * var(--u))
              calc(-8 * var(--u)) rgba(255, 255, 255, 0.5),
            0 0 calc(26 * var(--u)) rgba(255, 255, 255, 0.18),
            inset 0 0 0 calc(2 * var(--u)) rgba(255, 255, 255, 0.9);
          transition: transform 0.2s ease;
        }

        .spaceedu-cta button.spaceedu-start-btn:hover {
          transform: scale(1.03);
        }

        .spaceedu-planet {
          position: absolute;
          z-index: -1;
          padding: 0;
          border: 0;
          background: none;
          -webkit-appearance: none;
          appearance: none;
          line-height: 0;
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
          transform: scale(1.045);
        }

        .spaceedu-planet:active {
          transform: scale(0.99);
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
          background: rgba(24, 30, 42, 0.7);
          -webkit-backdrop-filter: blur(calc(6 * var(--u)));
          backdrop-filter: blur(calc(6 * var(--u)));
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .spaceedu-scroll svg {
          width: calc(20 * var(--u));
          height: calc(25 * var(--u));
          display: block;
        }

        /* RESPONSIVE TIERS */
        @media (max-width: 1030px), (max-height: 620px) {
          .spaceedu-navrow {
            left: calc(25 * var(--u));
            right: calc(25 * var(--u));
          }
          .spaceedu-burger {
            display: flex;
          }
          .spaceedu-links {
            position: absolute;
            top: calc(96 * var(--u));
            right: 0;
            z-index: 5;
            width: min(calc(324 * var(--u)), calc(100vw - 50 * var(--u)));
            flex-direction: column;
            align-items: stretch;
            padding: calc(12 * var(--u));
            border-radius: calc(20 * var(--u));
            background: rgba(9, 21, 42, 0.84);
            backdrop-filter: blur(calc(18 * var(--u)));
            border: calc(1 * var(--u)) solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 calc(18 * var(--u)) calc(44 * var(--u))
              rgba(2, 8, 20, 0.55);
            opacity: 0;
            visibility: hidden;
            transform: translateY(calc(-10 * var(--u)));
            transition: opacity 0.24s ease,
              transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.28s;
          }
          .spaceedu-navrow[data-open="true"] .spaceedu-links {
            opacity: 1;
            visibility: visible;
            transform: none;
          }
          .spaceedu-links a:nth-child(n),
          .spaceedu-links button:nth-child(n) {
            margin-left: 0;
            height: auto;
            justify-content: flex-start;
            padding: calc(14 * var(--u)) calc(16 * var(--u));
            font-size: calc(19 * var(--u));
            letter-spacing: calc(-0.6 * var(--u));
          }
          .spaceedu-links a + a,
          .spaceedu-links a + button {
            border-top: calc(1 * var(--u)) solid rgba(255, 255, 255, 0.08);
          }
          .spaceedu-links a[aria-current="page"]::after {
            top: auto;
            bottom: calc(9 * var(--u));
            left: calc(16 * var(--u));
            right: auto;
            width: calc(26 * var(--u));
            height: calc(3 * var(--u));
          }
          .spaceedu-links .spaceedu-enroll {
            margin: calc(14 * var(--u)) 0 calc(2 * var(--u));
            width: 100%;
            height: calc(46 * var(--u));
            border-radius: calc(23 * var(--u));
            justify-content: center;
            padding-top: calc(2 * var(--u));
            font-size: calc(18 * var(--u));
            letter-spacing: calc(-0.4 * var(--u));
            border-top: 0;
          }
        }

        @media (min-width: 580px) and (max-width: 1030px) and (min-height: 621px) {
          .spaceedu-scope {
            --gutter: 0;
            --u: min(
              max(
                min(0.85px, calc(100vh / 780)),
                min(calc(100vw / 900), calc(100vh / 1163))
              ),
              1.15px
            );
            --dh-px: calc(1120 * var(--u));
            --vshift: calc(max(0px, (100vh - var(--dh-px))) * 0.38);
          }
          .spaceedu-navbar::after {
            left: calc(25 * var(--u));
            right: calc(25 * var(--u));
          }
          p.spaceedu-lede br {
            display: none;
          }
          p.spaceedu-lede {
            max-width: calc(620 * var(--u));
            margin-left: auto;
            margin-right: auto;
            text-wrap: pretty;
          }
          .spaceedu-label.label-r {
            right: calc(116 * var(--u));
          }
        }

        @media (max-width: 579px), (max-height: 620px) {
          .spaceedu-scope {
            --gutter: 0;
            --u: max(
              min(0.92px, calc(100vh / 620)),
              min(calc(100vw / 430), calc(100vh / 880))
            );
            --dh-px: calc(880 * var(--u));
            --vshift: calc(max(0px, (100vh - var(--dh-px))) * 0.34);
          }
          .spaceedu-navbar {
            height: calc(76 * var(--u));
          }
          .spaceedu-navbar::after {
            left: calc(24 * var(--u));
            right: calc(24 * var(--u));
            top: calc(74 * var(--u));
          }
          .spaceedu-navrow {
            left: calc(24 * var(--u));
            right: calc(24 * var(--u));
            height: calc(74 * var(--u));
          }
          .spaceedu-links {
            top: calc(84 * var(--u));
          }
          .spaceedu-copy {
            top: calc(76 * var(--u));
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: calc(56 * var(--u)) calc(26 * var(--u)) 0;
          }
          .spaceedu-col {
            position: static;
            width: 100%;
            right: auto;
          }
          .spaceedu-eyebrow {
            font-size: calc(20 * var(--u));
            letter-spacing: calc(5 * var(--u));
            text-indent: calc(5 * var(--u));
          }
          h1.spaceedu-title {
            font-size: calc(86 * var(--u));
            margin-top: calc(15 * var(--u));
          }
          .spaceedu-rule {
            margin-top: calc(20 * var(--u));
            height: calc(5 * var(--u));
            padding-right: 0;
          }
          .spaceedu-rule span {
            width: calc(84 * var(--u));
          }
          p.spaceedu-lede {
            margin-top: calc(19 * var(--u));
            font-size: calc(15.5 * var(--u));
            line-height: calc(26 * var(--u));
            max-width: calc(400 * var(--u));
            text-wrap: balance;
          }
          p.spaceedu-lede br {
            display: none;
          }
          .spaceedu-cta {
            top: auto;
            margin-top: calc(32 * var(--u));
            height: calc(60 * var(--u));
            position: relative;
          }
          .spaceedu-cta button.spaceedu-start-btn {
            width: calc(190 * var(--u));
            height: calc(60 * var(--u));
            border-radius: calc(30 * var(--u));
          }
          .spaceedu-label {
            top: 50%;
            transform: translateY(-50%);
            font-size: calc(16 * var(--u));
            letter-spacing: calc(4 * var(--u));
          }
          .spaceedu-label.label-l {
            left: calc(56 * var(--u));
          }
          .spaceedu-label.label-r {
            right: calc(60 * var(--u));
          }
          .spaceedu-planet-l {
            width: calc(89 * var(--u));
            left: calc(-44.5 * var(--u));
            top: calc(-17 * var(--u));
          }
          .spaceedu-planet-r {
            width: calc(89 * var(--u));
            right: calc(-44.5 * var(--u));
            top: calc(-18.3 * var(--u));
          }
          .spaceedu-scroll {
            width: calc(74 * var(--u));
            height: calc(74 * var(--u));
            margin-left: calc(-37 * var(--u));
            bottom: calc(49 * var(--u));
          }
          .spaceedu-scroll svg {
            width: calc(15.5 * var(--u));
            height: calc(19.5 * var(--u));
          }
        }

        @media (max-height: 660px) {
          .spaceedu-scroll {
            display: none;
          }
        }

        @media (max-height: 620px) {
          .spaceedu-scope {
            --u: max(
              min(0.85px, calc(100vh / 470)),
              min(calc(100vw / 640), calc(100vh / 560))
            );
            --dh-px: calc(560 * var(--u));
            --vshift: 0px;
          }
          .spaceedu-copy {
            padding-top: calc(26 * var(--u));
          }
          h1.spaceedu-title {
            font-size: calc(64 * var(--u));
            margin-top: calc(8 * var(--u));
          }
          .spaceedu-rule {
            margin-top: calc(12 * var(--u));
          }
          p.spaceedu-lede {
            margin-top: calc(12 * var(--u));
          }
          .spaceedu-cta {
            margin-top: calc(20 * var(--u));
          }
          .spaceedu-label {
            top: 50%;
            transform: translateY(-50%);
            font-size: calc(15 * var(--u));
          }
          .spaceedu-label.label-l {
            left: calc(58 * var(--u));
          }
          .spaceedu-label.label-r {
            right: calc(58 * var(--u));
          }
        }

        @media (max-width: 500px) {
          .spaceedu-label {
            top: calc(100% + 34 * var(--u));
            transform: none;
            font-size: calc(15 * var(--u));
          }
          .spaceedu-label.label-l {
            left: calc(6 * var(--u));
          }
          .spaceedu-label.label-r {
            right: calc(6 * var(--u));
          }
        }
      `}</style>

      {/* 3 Background Videos with Poster fallback */}
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

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Navigation */}
        <header className="spaceedu-navbar pointer-events-auto">
          <div
            className="spaceedu-navrow"
            data-open={isMenuOpen ? "true" : "false"}
          >
            <button
              onClick={onEnterOS}
              className="spaceedu-logo text-left flex items-center gap-1.5"
            >
              <span>
                space<i>edu</i>
              </span>
              <span className="text-[10px] text-[#79DCE8] px-1.5 py-0.5 bg-[#09152A] rounded-full ml-2">
                VERONICA
              </span>
            </button>

            <nav className="spaceedu-links" id="site-nav">
              <a href="#" aria-current="page">
                Planets
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onEnterOS(); }}>
                Tution
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onEnterOS(); }}>
                Tutorials
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onEnterOS(); }}>
                Blog
              </a>
              <button
                type="button"
                onClick={onEnterOS}
                className="spaceedu-enroll"
              >
                Enroll
              </button>
            </nav>

            <button
              className="spaceedu-burger"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="spaceedu-copy pointer-events-none">
          <div className="spaceedu-col spaceedu-eyebrow">
            <span>PLANET</span>
          </div>

          <h1 className="spaceedu-col spaceedu-title">
            <span>{PLANETS[currentPlanet].name}</span>
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
              onClick={onEnterOS}
              className="spaceedu-start-btn"
            >
              GET STARTED
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
          onClick={onEnterOS}
          className="spaceedu-scroll pointer-events-auto"
          type="button"
          aria-label="Enter Veronica OS"
        >
          <svg viewBox="0 0 26 33" fill="none" aria-hidden="true">
            <path
              d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
