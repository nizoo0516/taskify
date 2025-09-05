export default function Loading() {
  return (
    <div className="bg-brand-gray-100 flex h-screen items-center justify-center">
      <video autoPlay loop muted playsInline preload="auto" className="h-[280px] w-[280px]">
        <source src="/video/Puzzle_Loader.webm" type="video/webm" />
      </video>
    </div>
  );
}
