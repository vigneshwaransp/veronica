"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { KnowledgeGraphData, KnowledgeGraphNode } from "@/types/veronica";
import { cn } from "@/lib/utils";
import { X, Network, Share2, Layers, Leaf } from "lucide-react";

interface KnowledgeGraph3DProps {
  data: KnowledgeGraphData;
  className?: string;
}

const NODE_TYPE_COLORS: Record<string, string> = {
  USER: "#8C9A84",
  PERSONA: "#A3B19B",
  PROJECT: "#C27B66",
  SKILL: "#B5C4AE",
  TECH: "#DCCFC2",
  PREF: "#7C8B74",
  TASK: "#98A892",
  GOAL: "#D18E7B",
  DECISION: "#8C9A84",
  TOOL: "#A3B19B",
};

export const KnowledgeGraph3D: React.FC<KnowledgeGraph3DProps> = ({
  data,
  className,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04101F");

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8c9a84, 2, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Build Node Meshes
    const nodeMeshes: { id: string; mesh: THREE.Mesh; node: KnowledgeGraphNode }[] = [];

    data.nodes.forEach((n) => {
      const geo = new THREE.SphereGeometry(0.35, 20, 20);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(NODE_TYPE_COLORS[n.type] || "#8C9A84"),
        roughness: 0.3,
        metalness: 0.2,
      });
      const pos = n.position || [0, 0, 0];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      graphGroup.add(mesh);
      nodeMeshes.push({ id: n.id, mesh, node: n });
    });

    // Build Edges
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8c9a84,
      transparent: true,
      opacity: 0.3,
    });

    data.edges.forEach((e) => {
      const src = data.nodes.find((n) => n.id === e.source);
      const tgt = data.nodes.find((n) => n.id === e.target);
      if (src && tgt) {
        const p1 = src.position || [0, 0, 0];
        const p2 = tgt.position || [0, 0, 0];
        const points = [
          new THREE.Vector3(p1[0], p1[1], p1[2]),
          new THREE.Vector3(p2[0], p2[1], p2[2]),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        graphGroup.add(line);
      }
    });

    // Interaction Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((m) => m.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((m) => m.mesh === intersects[0].object);
        if (hit) setSelectedNode(hit.node);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      graphGroup.rotation.y += 0.002;
      graphGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [data]);

  return (
    <div className={cn("relative w-full h-[520px] bg-[#04101F] overflow-hidden rounded-2xl", className)}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#2D3A31]/80 border border-[#E6E2DA]/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none text-[#FFFFFF] font-sans text-xs">
        <Network className="w-4 h-4 text-[#8C9A84]" />
        <span className="font-semibold">Knowledge Graph</span>
        <span className="text-[#8C9A84] border-l border-[#E6E2DA]/30 pl-2">
          {data.nodes.length} Nodes • {data.edges.length} Relations
        </span>
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-80 bg-[#FFFFFF] border border-[#E6E2DA] p-5 z-20 rounded-2xl shadow-xl font-sans text-[#2D3A31]">
          <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-2 mb-3">
            <span
              className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full text-[#FFFFFF]"
              style={{
                backgroundColor: NODE_TYPE_COLORS[selectedNode.type] || "#8C9A84",
              }}
            >
              {selectedNode.type}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-full text-[#2D3A31]/60 hover:text-[#2D3A31]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-base font-serif font-bold text-[#2D3A31] mb-2">{selectedNode.label}</h4>
          <div className="space-y-1.5 text-xs text-[#2D3A31]/70">
            {Object.entries(selectedNode.properties).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#F2F0EB] py-1">
                <span className="capitalize">{k}:</span>
                <span className="text-[#2D3A31] font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
