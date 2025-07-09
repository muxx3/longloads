"use client";

import { useEffect, useState, useRef } from "react";

export function useTypewriter(text: string, speed = 50, soundUrl?: string) {
  const [displayed, setDisplayed] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!soundUrl) return;

    const loadSound = async () => {
      try {
        const context = new AudioContext();
        const response = await fetch(soundUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer);
        audioContextRef.current = context;
        audioBufferRef.current = buffer;
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadSound();
  }, [soundUrl]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayed(text.slice(0, currentIndex));

      if (soundUrl && audioContextRef.current && audioBufferRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.connect(audioContextRef.current.destination);
        source.start(0);
      }

      if (currentIndex >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, soundUrl]);

  return displayed;
}

