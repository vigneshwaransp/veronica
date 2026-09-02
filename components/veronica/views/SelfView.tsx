"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import {
  User,
  Sparkles,
  Award,
  Target,
  MessageSquare,
  Briefcase,
  Save,
  Check,
  Leaf
} from "lucide-react";

interface SelfViewProps {
  user: UserProfile;
}

export const SelfView: React.FC<SelfViewProps> = ({ user }) => {
  const [profile, setProfile] = useState<UserProfile>({ ...user });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const currentUser = veronicaStore.getUser();
    Object.assign(currentUser, profile);
    veronicaStore.logAuditEvent({
      agentRole: "PERSONA AGENT",
      agentName: "VERONICA Core",
      action: "Updated Digital Self Identity Matrix",
      impactLevel: "LOW",
      confirmationRequired: false,
      status: "SUCCESS",
      details: `Saved identity parameters for ${profile.name}.`,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 font-sans text-[#2D3A31]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E6E2DA] pb-4 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3A31]">
            The Digital <span className="italic text-[#8C9A84]">Self</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/70 mt-1">
            Foundational computational profile that seeds personality, core values, and baseline preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>Identity Synchronized</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Identity Matrix</span>
            </>
          )}
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Core Identity Card */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <User className="w-4 h-4 text-[#8C9A84]" />
            <span>Human Baseline Identity</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                Primary Title & Specialty
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl p-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D3A31] mb-1">
                Personal Bio & Behavioral Thesis
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-3 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
              />
            </div>
          </div>
        </div>

        {/* Right: Goals & Competencies */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9A84] border-b border-[#E6E2DA] pb-3">
            <Target className="w-4 h-4 text-[#8C9A84]" />
            <span>Active Goals & Milestones</span>
          </div>

          <div className="space-y-2">
            {profile.goals.map((g) => (
              <div
                key={g.id}
                className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-[#2D3A31] block">{g.title}</span>
                  <span className="text-[10px] text-[#8C9A84]">Priority: {g.priority}</span>
                </div>
                <span className="text-[#8C9A84] text-xs font-bold">{g.progress}% Done</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E6E2DA]">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase block mb-2">
              Interests & Research Vectors
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-full text-xs text-[#2D3A31]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
