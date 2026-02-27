"use client";

import { useState, useCallback, useEffect } from "react";
import type { Driver, Pillar, Delivery } from "@/lib/types";

const DRIVERS: { value: Driver; label: string; desc: string }[] = [
  { value: "Income", label: "Income", desc: "Push a paid product or service" },
  { value: "Leads", label: "Leads", desc: "Grow your email list" },
  { value: "Growth", label: "Growth", desc: "Reach new people" },
  { value: "Nurture", label: "Nurture", desc: "Build connection & loyalty" },
];

const PILLARS: { value: Pillar; label: string }[] = [
  { value: "The Book", label: "The Book" },
  { value: "Personal Journey", label: "Personal Journey" },
  { value: "Black People in Entertainment", label: "Black in Entertainment" },
  { value: "Coffee", label: "Coffee" },
  { value: "Music", label: "Music" },
];

const DELIVERIES: { value: Delivery; label: string; desc: string }[] = [
  { value: "Face to Camera", label: "Face to Camera", desc: "Look at your phone and just talk. Short and punchy." },
  { value: "Montage", label: "Montage", desc: "B-roll clips of you living life. No voiceover — just text on screen and music." },
  { value: "Day in the Life", label: "Day in the Life", desc: "B-roll clips of you living life with a voiceover narrating what the viewer sees." },
  { value: "Reaction", label: "Reaction", desc: "React to something on screen. Stitch it or green screen it." },
];

function parseScriptContent(raw: string): string[] {
  return raw
    .split(/\n===\n|^===$/m)
    .map((s) => s.trim())
    .filter(Boolean);
}

function renderBoldMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`${i}-${match.index}`} className="font-semibold text-[#4ADE80]">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    return (
      <span key={i}>
        {parts.length > 0 ? parts : line}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/---/g, "———");
}

/* Leaf icon for copy toast */
function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

/* Sprouting seeds loading animation */
function SproutLoader() {
  return (
    <span className="inline-flex items-end gap-1 h-5">
      <span className="sprout-1 inline-block w-1 h-4 rounded-full bg-[#4ADE80]" />
      <span className="sprout-2 inline-block w-1 h-5 rounded-full bg-[#22C55E]" />
      <span className="sprout-3 inline-block w-1 h-3 rounded-full bg-[#2DD4BF]" />
    </span>
  );
}

function ScriptCard({
  content,
  index,
}: {
  content: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastLeaving, setToastLeaving] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(stripMarkdown(content));
    setCopied(true);
    setToastVisible(true);
    setToastLeaving(false);
    setTimeout(() => {
      setToastLeaving(true);
      setTimeout(() => {
        setToastVisible(false);
        setToastLeaving(false);
        setCopied(false);
      }, 250);
    }, 1500);
  }, [content]);

  return (
    <div
      className="animate-card-in glass rounded-2xl p-6 relative overflow-hidden"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Subtle green gradient at top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4ADE80]/20 to-transparent" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4ADE80]/60">
          Script {index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-[#94A3B8] transition-all hover:border-[#4ADE80]/30 hover:text-[#4ADE80] hover:shadow-[0_0_12px_rgba(74,222,128,0.1)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="text-sm leading-relaxed text-[#CBD5E1] whitespace-pre-wrap">
        {renderBoldMarkdown(content)}
      </div>

      {/* Toast */}
      {toastVisible && (
        <div
          className={`absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 px-3 py-1.5 text-xs text-[#4ADE80] ${
            toastLeaving ? "toast-out" : "toast-in"
          }`}
        >
          <LeafIcon />
          Copied
        </div>
      )}
    </div>
  );
}

function ToggleSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  isAuto,
  onToggleAuto,
}: {
  label: string;
  options: { value: T; label: string; desc?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  isAuto: boolean;
  onToggleAuto: () => void;
}) {
  const hasDescs = options.some((o) => o.desc);
  const [showGrid, setShowGrid] = useState(!isAuto);

  useEffect(() => {
    if (!isAuto) {
      setShowGrid(true);
    } else {
      const t = setTimeout(() => setShowGrid(false), 300);
      return () => clearTimeout(t);
    }
  }, [isAuto]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4ADE80]/60">
          {label}
        </h2>
        {/* Power switch toggle */}
        <button
          onClick={onToggleAuto}
          className="flex items-center gap-2.5 text-xs transition-colors"
        >
          <span className={`text-[11px] font-medium transition-colors duration-300 ${isAuto ? "text-[#4ADE80]" : "text-[#475569]"}`}>
            Auto
          </span>
          <div
            className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
              isAuto
                ? "bg-[#4ADE80]/15 shadow-[0_0_12px_rgba(74,222,128,0.15)]"
                : "bg-[#F59E0B]/15 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
            }`}
            style={{
              border: isAuto
                ? "1px solid rgba(74, 222, 128, 0.3)"
                : "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <div
              className={`absolute top-[3px] h-[18px] w-[18px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAuto
                  ? "left-[3px] bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                  : "left-[23px] bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              }`}
            />
          </div>
          <span className={`text-[11px] font-medium transition-colors duration-300 ${!isAuto ? "text-[#F59E0B]" : "text-[#475569]"}`}>
            Choose
          </span>
        </button>
      </div>

      {isAuto && !showGrid && (
        <p className="text-xs text-[#475569]">AI will choose the best option.</p>
      )}

      {showGrid && !isAuto && (
        <div className={`grid grid-cols-2 gap-2.5 ${!hasDescs ? "sm:grid-cols-3" : ""}`}>
          {options.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`animate-tile-in rounded-2xl text-left transition-all duration-200 ${
                hasDescs ? "p-3.5" : "px-3.5 py-3"
              } ${
                value === opt.value
                  ? "bg-[#4ADE80]/[0.07] shadow-[0_0_16px_rgba(74,222,128,0.08)]"
                  : "bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
              style={{
                animationDelay: `${i * 50}ms`,
                border: value === opt.value
                  ? "1px solid rgba(74, 222, 128, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              <div className={`text-sm font-medium ${
                value === opt.value ? "text-[#4ADE80]" : "text-[#CBD5E1]"
              }`}>
                {opt.label}
              </div>
              {opt.desc && (
                <div className="mt-1 text-xs leading-relaxed text-[#64748B]">{opt.desc}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [pillarAuto, setPillarAuto] = useState(true);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [deliveryAuto, setDeliveryAuto] = useState(true);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!driver) {
      setError("Pick a driver first.");
      return;
    }

    setLoading(true);
    setError("");
    setScripts([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver,
          pillar: pillarAuto ? "Auto" : pillar,
          delivery: deliveryAuto ? "Auto" : delivery,
          count,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      const parsed = parseScriptContent(data.scripts);
      setScripts(parsed);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0F0A] overflow-hidden">
      {/* Background organic blobs */}
      <div className="bg-blob-1" />
      <div className="bg-blob-2" />
      <div className="bg-blob-3" />

      {/* Vine pattern SVG - very subtle */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-[0.015]" viewBox="0 0 1000 1000">
        <path d="M0,500 Q250,400 500,500 T1000,500" fill="none" stroke="#4ADE80" strokeWidth="2" />
        <path d="M0,300 Q200,200 400,300 T800,250 T1000,300" fill="none" stroke="#4ADE80" strokeWidth="1.5" />
        <path d="M0,700 Q300,600 600,700 T1000,650" fill="none" stroke="#2DD4BF" strokeWidth="1" />
        <circle cx="250" cy="400" r="3" fill="#4ADE80" opacity="0.3" />
        <circle cx="600" cy="500" r="2" fill="#2DD4BF" opacity="0.2" />
        <circle cx="800" cy="300" r="2.5" fill="#4ADE80" opacity="0.25" />
      </svg>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            {/* Small leaf icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#4ADE80]">
              <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-lg font-semibold tracking-tight text-[#E2E8F0]">
              Script Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-10">
          {/* Driver */}
          <div>
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4ADE80]/60">
              Driver
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {DRIVERS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDriver(d.value)}
                  className={`rounded-2xl p-3.5 text-left transition-all duration-200 ${
                    driver === d.value
                      ? "bg-[#4ADE80]/[0.07] shadow-[0_0_16px_rgba(74,222,128,0.08)]"
                      : "bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                  style={{
                    border: driver === d.value
                      ? "1px solid rgba(74, 222, 128, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <div
                    className={`text-sm font-medium ${
                      driver === d.value ? "text-[#4ADE80]" : "text-[#CBD5E1]"
                    }`}
                  >
                    {d.label}
                  </div>
                  <div className="mt-1 text-xs text-[#64748B]">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pillar */}
          <ToggleSelector
            label="Pillar"
            options={PILLARS}
            value={pillar}
            onChange={setPillar}
            isAuto={pillarAuto}
            onToggleAuto={() => setPillarAuto(!pillarAuto)}
          />

          {/* Delivery */}
          <ToggleSelector
            label="Delivery"
            options={DELIVERIES}
            value={delivery}
            onChange={setDelivery}
            isAuto={deliveryAuto}
            onToggleAuto={() => setDeliveryAuto(!deliveryAuto)}
          />

          {/* Count */}
          <div>
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4ADE80]/60">
              Scripts
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`h-11 w-11 rounded-xl text-sm font-medium transition-all duration-200 ${
                    count === n
                      ? "bg-[#4ADE80]/[0.07] text-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.08)]"
                      : "bg-white/[0.02] text-[#64748B] hover:bg-white/[0.04] hover:text-[#94A3B8]"
                  }`}
                  style={{
                    border: count === n
                      ? "1px solid rgba(74, 222, 128, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={loading || !driver}
            className={`w-full rounded-2xl py-4 text-sm font-semibold transition-all duration-300 ${
              loading
                ? "bg-[#4ADE80]/10 text-[#4ADE80]/60 cursor-wait"
                : driver
                  ? "bg-gradient-to-r from-[#22C55E] to-[#4ADE80] text-[#0A0F0A] hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] glow-pulse"
                  : "bg-white/[0.03] text-[#475569] cursor-not-allowed"
            }`}
            style={{
              border: driver && !loading
                ? "1px solid rgba(74, 222, 128, 0.4)"
                : "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <SproutLoader />
                <span>Growing scripts...</span>
              </span>
            ) : (
              "Generate"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="animate-card-in rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-5 py-3.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Output */}
          {scripts.length > 0 && (
            <div className="space-y-4 pb-12">
              {scripts.map((s, i) => (
                <ScriptCard key={i} content={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
