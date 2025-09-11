"use client";

import ExtraFeatures from "@/components/home/ExtraFeatures";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Footer from "@/components/common/home/Footer";
import Header from "@/components/common/home/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-black text-[#ffffff]">
      <Header />
      <main className="flex flex-1 justify-center">
        <div className="pc:w-[1200px] tablet:w-[664px] w-[343px]">
          <Hero />
          <Features />
          <ExtraFeatures />
        </div>
      </main>
      <Footer />
    </div>
  );
}
