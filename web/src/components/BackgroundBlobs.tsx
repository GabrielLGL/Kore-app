export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-full blur-[80px] opacity-40 animate-[floatBlob_10s_infinite_alternate_ease-in-out]"
        style={{
          width: "50vw",
          height: "50vw",
          background: "var(--blob-1)",
          top: "-10%",
          left: "-10%",
        }}
      />
      <div
        className="absolute rounded-full blur-[80px] opacity-40 animate-[floatBlob_10s_infinite_alternate_ease-in-out]"
        style={{
          width: "40vw",
          height: "40vw",
          background: "var(--blob-2)",
          bottom: "-10%",
          right: "-10%",
          animationDelay: "-5s",
        }}
      />
    </div>
  );
}
