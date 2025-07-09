"use client";

import { useEffect, useState, useRef } from "react";

export function useTypewriter(text: string, speed = 50, soundUrl?: string) {
  const [displayed, setDisplayed] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      if (!soundUrl) return;
      try {
        const context = new AudioContext();
        const response = await fetch(soundUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer);
        if (isMounted) {
          audioContextRef.current = context;
          audioBufferRef.current = buffer;
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
    };
  }, [soundUrl]);

  useEffect(() => {
    let currentIndex = 0;
    let interval: NodeJS.Timeout;

    setDisplayed(""); // reset text when text prop changes

    function type() {
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
    }

    if (text.length > 0) {
      interval = setInterval(type, speed);
    }

    return () => clearInterval(interval);
  }, [text, speed, soundUrl]);

  return displayed;
}

