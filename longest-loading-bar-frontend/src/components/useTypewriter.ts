import { useState, useEffect, useRef } from "react";

export function useTypewriter(text: string, speed = 50, soundUrl?: string) {
  const [displayed, setDisplayed] = useState("");
  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!soundUrl) return;

    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    fetch(soundUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => audioContext.current!.decodeAudioData(arrayBuffer))
      .then((decodedBuffer) => {
        audioBuffer.current = decodedBuffer;
      })
      .catch((err) => console.error("Error loading audio:", err));
  }, [soundUrl]);

  useEffect(() => {
    let i = 0;
    let stopped = false;

    setDisplayed("");
    started.current = false;

    async function playClick(volume = 1) {
      if (!audioContext.current || !audioBuffer.current) return;
      if (audioContext.current.state === "suspended" && !started.current) {
        await audioContext.current.resume();
        started.current = true;
      }
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer.current!;

	  const gainNode = audioContext.current.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.current.currentTime);

	  source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      source.start();
    }

    const delayBeforeTyping = 500;

    const delayTimeout = setTimeout(() => {
      function type() {
        if (stopped) return;

        setDisplayed(text.slice(0, i + 1));

        if (soundUrl && i < text.length - 4) {
          playClick().catch(() => {});
        }

        i++;
        if (i < text.length) {
          setTimeout(type, speed);
        }
      }

      type();
    }, delayBeforeTyping);

	playClick(0.5).catch(() => {});


    return () => {
      stopped = true;
      clearTimeout(delayTimeout);
    };
  }, [text, speed, soundUrl]);

  return displayed;
}

