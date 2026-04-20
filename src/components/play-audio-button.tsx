"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import type { ContentBlock } from "@/types";

type Props = {
  title: string;
  excerpt: string;
  blocks: ContentBlock[];
};

type Status = "idle" | "playing" | "paused" | "unsupported";

const VOICE_PREFERENCE = [
  "Samantha",
  "Karen",
  "Tessa",
  "Moira",
  "Serena",
  "Allison",
  "Ava",
  "Susan",
  "Google US English",
  "Microsoft Aria Online",
  "Microsoft Jenny Online",
  "Microsoft Guy Online",
];

function pickBestVoice(voices: SpeechSynthesisVoice[]) {
  for (const name of VOICE_PREFERENCE) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  return (
    voices.find((v) => v.lang === "en-US" && v.localService) ??
    voices.find((v) => v.lang.startsWith("en-")) ??
    voices[0] ??
    null
  );
}

function blocksToText(title: string, excerpt: string, blocks: ContentBlock[]) {
  const parts: string[] = [title, excerpt];
  for (const b of blocks) {
    switch (b.type) {
      case "paragraph":
      case "heading":
      case "blockquote":
        parts.push(b.text);
        break;
      case "unordered-list":
      case "ordered-list":
        parts.push(b.items.join(". "));
        break;
      case "image":
        if (b.caption) parts.push(b.caption);
        break;
    }
  }
  return parts.filter(Boolean).join(". ");
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function PlayAudioButton({ title, excerpt, blocks }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const totalCharsRef = useRef(0);
  const startedAtRef = useRef(0);
  const pausedElapsedRef = useRef(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("unsupported");
      return;
    }
    const synth = window.speechSynthesis;
    function loadVoice() {
      voiceRef.current = pickBestVoice(synth.getVoices());
    }
    loadVoice();
    synth.addEventListener("voiceschanged", loadVoice);
    return () => {
      synth.removeEventListener("voiceschanged", loadVoice);
      synth.cancel();
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
    };
  }, []);

  function stopTicker() {
    if (tickRef.current) {
      cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
    }
  }

  function startTicker() {
    stopTicker();
    const loop = () => {
      const now = performance.now();
      const e = pausedElapsedRef.current + (now - startedAtRef.current) / 1000;
      setElapsed(e);
      tickRef.current = requestAnimationFrame(loop);
    };
    tickRef.current = requestAnimationFrame(loop);
  }

  function resetProgress() {
    stopTicker();
    setProgress(0);
    setElapsed(0);
    setDuration(0);
    pausedElapsedRef.current = 0;
    totalCharsRef.current = 0;
  }

  function handleClick() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (status === "playing") {
      synth.pause();
      pausedElapsedRef.current =
        pausedElapsedRef.current +
        (performance.now() - startedAtRef.current) / 1000;
      stopTicker();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      synth.resume();
      startedAtRef.current = performance.now();
      startTicker();
      setStatus("playing");
      return;
    }

    const text = blocksToText(title, excerpt, blocks);
    const u = new SpeechSynthesisUtterance(text);
    const voice = voiceRef.current ?? pickBestVoice(synth.getVoices());
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    }
    u.rate = 1;
    u.pitch = 1;

    totalCharsRef.current = text.length;
    const estimated = Math.max(1, text.length / 15);
    setDuration(estimated);
    pausedElapsedRef.current = 0;

    u.onstart = () => {
      startedAtRef.current = performance.now();
      startTicker();
    };
    u.onboundary = (e) => {
      if (totalCharsRef.current > 0) {
        setProgress(Math.min(1, e.charIndex / totalCharsRef.current));
      }
    };
    u.onend = () => {
      setProgress(1);
      setStatus("idle");
      stopTicker();
      setTimeout(() => resetProgress(), 600);
    };
    u.onerror = () => {
      setStatus("idle");
      resetProgress();
    };

    utteranceRef.current = u;
    synth.cancel();
    synth.speak(u);
    setStatus("playing");
  }

  if (status === "unsupported") return null;

  const label =
    status === "playing"
      ? "Pause audio"
      : status === "paused"
        ? "Resume audio"
        : "Play audio";

  const showProgress = status === "playing" || status === "paused";
  const pct = Math.round(progress * 100);
  const shownElapsed = status === "idle" ? 0 : elapsed;
  const shownDuration = duration || 0;

  return (
    <>
      <span aria-hidden className="text-border-strong">
        ·
      </span>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={showProgress ? pct : undefined}
        className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted transition hover:border-brand hover:text-foreground"
      >
        {showProgress ? (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-brand/10 transition-[width] duration-150 ease-linear"
            style={{ width: `${pct}%` }}
          />
        ) : null}
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {status === "playing" ? (
            <Pause size={11} aria-hidden />
          ) : status === "paused" ? (
            <Play size={11} aria-hidden className="fill-current" />
          ) : (
            <Volume2 size={11} aria-hidden />
          )}
          <span>
            {status === "playing"
              ? "Pause"
              : status === "paused"
                ? "Resume"
                : "Play audio"}
          </span>
          {showProgress ? (
            <span className="font-mono tabular-nums text-muted/80">
              {formatTime(shownElapsed)} / {formatTime(shownDuration)}
            </span>
          ) : null}
        </span>
      </button>
    </>
  );
}
