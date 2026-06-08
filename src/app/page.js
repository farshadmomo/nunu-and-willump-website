"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import SnowParticles from "@/components/SnowParticles";
import CinemaBackdrop from "@/components/CinemaBackdrop";
import HeroOverlay from "@/components/HeroOverlay";
import StoryOverlay from "@/components/StoryOverlay";
import StoriesSection from "@/components/StoriesSection";
import SnowballSection from "@/components/SnowballSection";
import SkinsSection from "@/components/SkinsSection";
import BiteTransition from "@/components/BiteTransition";

export default function Home() {
  const [heroFrames, setHeroFrames] = useState(null);

  return (
    <SmoothScroll>
      <LoadingScreen onReady={setHeroFrames} />
      <Navbar />
      <SnowParticles />
      <CinemaBackdrop frames={heroFrames} />
      <main className="relative z-10">
        <HeroOverlay />
        <StoryOverlay />
        <StoriesSection />
        <SnowballSection />
        <SkinsSection />
        <BiteTransition />
      </main>
    </SmoothScroll>
  );
}
