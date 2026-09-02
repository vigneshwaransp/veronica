"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AvatarState } from "@/types/veronica";
import { cn } from "@/lib/utils";

interface VeronicaBrainProps {
  avatarState?: AvatarState;
  interactive?: boolean;
  className?: string;
  onClusterSelect?: (clusterName: string) => void;
}

const CLUSTERS = [
  { name: "IDENTITY", color: "#8C9A84", pos: [0, 0, 0], count: 80, radius: 0.8 },
  { name: "PERSONA", color: "#A3B19B", pos: [-1.8, 1.2, 0.5], count: 50, radius: 0.6 },
  { name: "MEMORY", color: "#DCCFC2", pos: [1.8, 1.2, -0.5], count: 70, radius: 0.7 },
  { name: "KNOWLEDGE", color: "#B5C4AE", pos: [0, 2.2, 0.4], count: 60, radius: 0.6 },
  { name: "BEHAVIOR", color: "#C27B66", pos: [-1.6, -1.2, 0.8], count: 50, radius: 0.6 },
  { name: "GOALS", color: "#98A892", pos: [1.6, -1.2, -0.6], count: 45, radius: 0.5 },
  { name: "DECISIONS", color: "#D18E7B", pos: [0, -2.0, -0.4], count: 55, radius: 0.6 },
  { name: "AGENTS", color: "#7C8B74", pos: [2.2, 0, 1.2], count: 50, radius: 0.55 },
];

export const VeronicaBrain: React.FC<VeronicaBrainProps> = ({
  avatarState = "IDLE",
  interactive = true,
  className,
  onClusterSelect,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCluster, setActiveCluster] = useState<string>("IDENTITY");
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Root Group for brain
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // 3. Create Cluster Particle Clouds
    const clusterMeshes: THREE.Points[] = [];
    const allPositions: THREE.Vector3[] = [];

    CLUSTERS.forEach((cluster) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(cluster.count * 3);
      const colors = new Float32Array(cluster.count * 3);
      const baseColor = new THREE.Color(cluster.color);

      for (let i = 0; i < cluster.count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * cluster.radius;
        const sinPhi = Math.sin(phi);

        const x = cluster.pos[0] + r * sinPhi * Math.cos(theta);
        const y = cluster.pos[1] + r * sinPhi * Math.sin(theta);
        const z = cluster.pos[2] + r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;

        allPositions.push(new THREE.Vector3(x, y, z));
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // Particle Material
      const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      points.name = cluster.name;
      brainGroup.add(points);
      clusterMeshes.push(points);
    });

    // 4. Create Synaptic Connections (Lines between cluster centers)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3f3f46,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const activeLineMaterial = new THREE.LineBasicMaterial({
      color: 0xdfe104,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const lineGroup = new THREE.Group();
    brainGroup.add(lineGroup);

    for (let i = 0; i < CLUSTERS.length; i++) {
      for (let j = i + 1; j < CLUSTERS.length; j++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(CLUSTERS[i].pos[0], CLUSTERS[i].pos[1], CLUSTERS[i].pos[2]),
          new THREE.Vector3(CLUSTERS[j].pos[0], CLUSTERS[j].pos[1], CLUSTERS[j].pos[2]),
        ]);
        const line = new THREE.Line(lineGeo, lineMaterial);
        lineGroup.add(line);
      }
    }

    // 5. Data Packets (Pulsing moving spheres along synapses)
    const packetCount = 20;
    const packetGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xdfe104 });
    const packetMeshes: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

    for (let i = 0; i < packetCount; i++) {
      const c1 = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
      const c2 = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      brainGroup.add(mesh);
      packetMeshes.push({
        mesh,
        start: new THREE.Vector3(c1.pos[0], c1.pos[1], c1.pos[2]),
        end: new THREE.Vector3(c2.pos[0], c2.pos[1], c2.pos[2]),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.015,
      });
    }

    // 6. Central Neural Core Aura
    const coreGeo = new THREE.IcosahedronGeometry(0.4, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xdfe104,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    brainGroup.add(coreMesh);

    // 7. Mouse & Raycasting Interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      targetRotationY = mouse.x * 0.8;
      targetRotationX = -mouse.y * 0.5;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clusterMeshes);
      if (intersects.length > 0 && intersects[0].object.name) {
        const name = intersects[0].object.name;
        setActiveCluster(name);
        if (onClusterSelect) onClusterSelect(name);
      }
    };

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("click", handleClick);
    }

    // 8. Animation Loop with Avatar State Adaptation
    let animationFrameId: number;
    let frameCount = 0;
    let lastTime = performance.now();
    let lastAnimTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastAnimTime) / 1000, 0.1);
      lastAnimTime = now;
      const time = now * 0.001;

      // State Modulation Multipliers
      let speedMult = 1.0;
      let pulseIntensity = 1.0;

      switch (avatarState) {
        case "THINKING":
        case "ANALYZING":
          speedMult = 2.4;
          pulseIntensity = 2.0;
          break;
        case "EXECUTING":
          speedMult = 1.8;
          pulseIntensity = 1.5;
          break;
        case "LEARNING":
          speedMult = 1.6;
          pulseIntensity = 1.8;
          break;
        case "ERROR":
        case "WARNING":
          speedMult = 0.5;
          pulseIntensity = 0.5;
          break;
        case "SUCCESS":
          speedMult = 1.2;
          pulseIntensity = 1.2;
          break;
        default:
          speedMult = 1.0;
          pulseIntensity = 1.0;
      }

      // Smooth brain rotation towards mouse target + idle procedural rotation
      brainGroup.rotation.y += (targetRotationY - brainGroup.rotation.y) * 0.05 + 0.002 * speedMult;
      brainGroup.rotation.x += (targetRotationX - brainGroup.rotation.x) * 0.05;
      brainGroup.rotation.z = Math.sin(time * 0.5) * 0.04;

      // Pulse Central Core
      const coreScale = 1.0 + Math.sin(time * 4 * speedMult) * 0.15 * pulseIntensity;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      coreMesh.rotation.x += 0.01 * speedMult;
      coreMesh.rotation.y += 0.015 * speedMult;

      // Move Data Packets along Synapses
      packetMeshes.forEach((p) => {
        p.progress += p.speed * speedMult;
        if (p.progress >= 1.0) {
          p.progress = 0;
          const c1 = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
          const c2 = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
          p.start.set(c1.pos[0], c1.pos[1], c1.pos[2]);
          p.end.set(c2.pos[0], c2.pos[1], c2.pos[2]);
        }
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });

      // Measure FPS
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("click", handleClick);
      }
      geometryDispose(scene);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [avatarState, interactive, onClusterSelect]);

  return (
    <div className={cn("relative w-full h-full min-h-[420px] bg-[#04101F] overflow-hidden rounded-2xl", className)}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Telemetry Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 font-sans text-xs bg-[#2D3A31]/80 border border-[#E6E2DA]/30 px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none text-[#FFFFFF]">
        <span className="w-2 h-2 bg-[#8C9A84] rounded-full animate-pulse" />
        <span className="font-semibold">Neural Twin: {avatarState}</span>
        <span className="text-[#8C9A84] border-l border-[#E6E2DA]/30 pl-2">{fps} FPS</span>
      </div>

      {/* Cluster Navigation HUD */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 font-sans">
        <div className="flex flex-wrap gap-1.5 max-w-[80%]">
          {CLUSTERS.map((c) => (
            <span
              key={c.name}
              className={cn(
                "px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition-all",
                activeCluster === c.name
                  ? "bg-[#8C9A84] text-[#FFFFFF] border-[#8C9A84]"
                  : "bg-[#2D3A31]/70 text-[#E6E2DA] border-[#E6E2DA]/20"
              )}
            >
              {c.name}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-[#E6E2DA]/80 bg-[#2D3A31]/80 border border-[#E6E2DA]/30 px-2.5 py-0.5 rounded-full">
          WebGL 2.0
        </span>
      </div>
    </div>
  );
};

// Memory cleanup utility
function geometryDispose(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}
