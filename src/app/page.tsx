"use client";

import { useState, useCallback } from "react";
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
  { value: "Montage", label: "Montage", desc: "No talking. Cool clips, one sentence on screen, music playing." },
  { value: "Day in the Life", label: "Day in the Life", desc: "Everyday clips with you narrating over them casually." },
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
        <strong key={`${i}-${match.index}`} className="font-semibold text-white">
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

function ScriptCard({
  content,
  index,
}: {
  content: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(stripMarkdown(content));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  return (
    <div
      className="animate-fade-in rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Script {index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-500 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="space-y-1 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
        {renderBoldMarkdown(content)}
      </div>
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
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          {label}
        </h2>
        <button
          onClick={onToggleAuto}
          className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <span className={isAuto ? "text-emerald-400" : "text-zinc-500"}>
            Auto
          </span>
          <div
            className={`relative h-5 w-9 rounded-full transition-colors ${
              isAuto ? "bg-emerald-500/30" : "bg-zinc-700"
            }`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
                isAuto
                  ? "left-[18px] bg-emerald-400"
                  : "left-0.5 bg-zinc-400"
              }`}
            />
          </div>
          <span className={!isAuto ? "text-zinc-300" : "text-zinc-500"}>
            Choose
          </span>
        </button>
      </div>
      {!isAuto && (
        <div className={`animate-fade-in grid grid-cols-2 gap-2 ${!hasDescs ? "sm:grid-cols-3" : ""}`}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`rounded-lg border text-left transition-all ${
                hasDescs ? "p-3" : "px-3 py-2.5"
              } ${
                value === opt.value
                  ? "border-white bg-white/10"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div className={`text-sm font-medium ${
                value === opt.value ? "text-white" : "text-zinc-300"
              }`}>
                {opt.label}
              </div>
              {opt.desc && (
                <div className="mt-0.5 text-xs text-zinc-500">{opt.desc}</div>
              )}
            </button>
          ))}
        </div>
      )}
      {isAuto && (
        <p className="text-xs text-zinc-600">AI will choose the best option.</p>
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-zinc-800/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Script Generator
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-8">
          {/* Driver */}
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-400">
              Driver
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {DRIVERS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDriver(d.value)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    driver === d.value
                      ? "border-white bg-white/10"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      driver === d.value ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {d.label}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">{d.desc}</div>
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
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-400">
              Scripts
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`h-10 w-10 rounded-lg border text-sm font-medium transition-all ${
                    count === n
                      ? "border-white bg-white/10 text-white"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  }`}
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
            className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-20"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="animate-fade-in rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
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
