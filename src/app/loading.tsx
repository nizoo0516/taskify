import { cn } from "@/lib/utils/cn";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={cn(
          "h-[180px] w-[180px]",
          "tablet:h-[250px] tablet:w-[250px]",
          "pc:h-[280px] pc:w-[280px]",
        )}
      >
        <source src="/video/Puzzle_Loader.webm" type="video/webm" />
      </video>
    </div>
  );
}
