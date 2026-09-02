"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MemoryNode, MemoryType } from "@/types/veronica";
import { cn } from "@/lib/utils";
import { X, Search, Filter, Database, ShieldCheck, Clock } from "lucide-react";

interface MemoryVisualizer3DProps {
  memories: MemoryNode[];
  onSelectMemory?: (memory: MemoryNode) => void;
  className?: string;
}

const TIER_COLORS: Record<MemoryType, string> = {
  short_term: "#A3B19B",
  long_term: "#8C9A84",
  episodic: "#C27B66",
  semantic: "#B5C4AE",
  procedural: "#DCCFC2",
  preference: "#7C8B74",
};

export const MemoryVisualizer3D: React.FC<MemoryVisualizer3DProps> = ({
  memories,
  onSelectMemory,
  className,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryNode | null>(null);
  const [typeFilter, setTypeFilter] = useState<MemoryType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMemories = memories.filter((m) => {
    if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
    if (!searchQuery) return true;
    return (
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x09090b, 1);
    container.appendChild(renderer.domElement);

    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    // Coordinate grid helper
    const grid = new THREE.GridHelper(10, 20, 0x3f3f46, 0x18181b);
    grid.position.y = -2;
    scene.add(grid);

    // Create 3D Nodes for each memory
    const nodeMeshes: THREE.Mesh[] = [];
    const memoryMap = new Map<string, MemoryNode>();

    filteredMemories.forEach((mem, idx) => {
      const radius = 0.1 + (mem.importance / 100) * 0.15;
      const geometry = new THREE.SphereGeometry(radius, 16, 16);
      const color = new THREE.Color(TIER_COLORS[mem.type] || "#DFE104");
      const material = new THREE.MeshBasicMaterial({
        color,
        wireframe: mem.confidence < 80,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Compute spherical / spiral positioning
      const angle = (idx / Math.max(1, filteredMemories.length)) * Math.PI * 2 * 3;
      const dist = 1.2 + (idx % 4) * 0.6;
      const heightVal = Math.sin(idx * 1.5) * 1.4;

      mesh.position.set(
        Math.cos(angle) * dist,
        heightVal,
        Math.sin(angle) * dist
      );

      mesh.name = mem.id;
      cosmosGroup.add(mesh);
      nodeMeshes.push(mesh);
      memoryMap.set(mem.id, mem);
    });

    // Connector Lines between consecutive or related nodes
    const lineGroup = new THREE.Group();
    cosmosGroup.add(lineGroup);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3f3f46,
      transparent: true,
      opacity: 0.3,
    });

    for (let i = 0; i < nodeMeshes.length - 1; i++) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        nodeMeshes[i].position,
        nodeMeshes[i + 1].position,
      ]);
      lineGroup.add(new THREE.Line(lineGeo, lineMat));
    }

    // Controls and Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        cosmosGroup.rotation.y += deltaX * 0.006;
        cosmosGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.name;
        const mem = memoryMap.get(hitId);
        if (mem) {
          setSelectedMemory(mem);
          if (onSelectMemory) onSelectMemory(mem);
        }
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        cosmosGroup.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);
      scene.clear();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [filteredMemories, onSelectMemory]);

  return (
    <div className={cn("relative w-full h-full min-h-[500px] border border-[#3F3F46] bg-[#09090B] font-mono", className)}>
      {/* 3D Viewport Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Search & Filter Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 z-10 pointer-events-auto bg-[#0D0D11]/90 border border-[#3F3F46] p-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search 3D memory cosmos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#FAFAFA] focus:outline-none placeholder:text-[#71717A]"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mr-1">TIER:</span>
          {(["ALL", "preference", "procedural", "semantic", "episodic", "long_term", "short_term"] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full border transition-all",
                  typeFilter === t
                    ? "bg-[#8C9A84] text-[#FFFFFF] border-[#8C9A84]"
                    : "bg-[#2D3A31]/70 text-[#E6E2DA] border-[#E6E2DA]/20 hover:bg-[#2D3A31]"
                )}
              >
                {t.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Legend & Stats Overlay */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-none text-xs font-sans">
        {Object.entries(TIER_COLORS).map(([tier, color]) => (
          <div key={tier} className="flex items-center gap-1.5 bg-[#2D3A31]/80 border border-[#E6E2DA]/30 px-2.5 py-1 rounded-full text-[#FFFFFF]">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
            <span className="capitalize">{tier.replace("_", " ")}</span>
          </div>
        ))}
      </div>

      {/* Memory Node Inspection Drawer */}
      {selectedMemory && (
        <div className="absolute top-16 right-4 bottom-4 w-full max-w-md bg-[#FFFFFF] border border-[#E6E2DA] p-6 z-20 rounded-[28px] overflow-y-auto flex flex-col justify-between shadow-2xl font-sans text-[#2D3A31]">
          <div>
            <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: TIER_COLORS[selectedMemory.type] }}
                />
                <span className="text-xs uppercase text-[#8C9A84] font-bold tracking-wider">
                  {selectedMemory.type.replace("_", " ")} Node
                </span>
              </div>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-1 rounded-full text-[#2D3A31]/60 hover:text-[#2D3A31] hover:bg-[#F2F0EB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-base font-serif font-bold text-[#2D3A31] leading-relaxed mb-4">
              &ldquo;{selectedMemory.content}&rdquo;
            </p>

            <div className="space-y-2.5 text-xs text-[#2D3A31]/70">
              <div className="flex justify-between border-b border-[#F2F0EB] pb-2">
                <span>Category:</span>
                <span className="text-[#2D3A31] font-semibold">{selectedMemory.category}</span>
              </div>
              <div className="flex justify-between border-b border-[#F2F0EB] pb-2">
                <span>Confidence Calibration:</span>
                <span className="text-[#8C9A84] font-bold">{selectedMemory.confidence}%</span>
              </div>
              <div className="flex justify-between border-b border-[#F2F0EB] pb-2">
                <span>Evidence Observations:</span>
                <span className="text-[#2D3A31] font-semibold">{selectedMemory.evidenceCount} verified samples</span>
              </div>
              <div className="flex justify-between border-b border-[#F2F0EB] pb-2">
                <span>Provenance Source:</span>
                <span className="text-[#2D3A31] font-semibold">{selectedMemory.source}</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[11px] text-[#8C9A84] font-semibold block mb-1.5">
                Semantic Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMemory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs bg-[#F2F0EB] text-[#2D3A31] rounded-full border border-[#E6E2DA]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E2DA] mt-4 flex items-center justify-between text-xs text-[#2D3A31]/60">
            <span>Synchronized {selectedMemory.updated_at.slice(0, 10)}</span>
            <span className="text-[#8C9A84] font-bold">Verified Provenance</span>
          </div>
        </div>
      )}
    </div>
  );
};
