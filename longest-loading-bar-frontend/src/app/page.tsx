import BarSwitcher from "@/components/BarSwitcher";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black relative">
      <BarSwitcher />

      <div
        style={{
          position: "fixed",
          bottom: 9,
          width: "100%",
          textAlign: "center",
          fontSize: "0.6rem",
          color: "rgba(255, 255, 255, 0.6)",
          fontFamily: '"Share Tech Mono", monospace',
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        built by muxxe_ 080725
      </div>
    </main>
  );
}

