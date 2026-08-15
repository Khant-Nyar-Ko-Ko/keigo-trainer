"use client";

import { useEffect, useState } from "react";
import Hero from "./Hero";

const STORAGE_KEY = "keigo-trainer-welcome-dismissed";

export default function HomeIntro() {
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setShowHero(true);
    }
  }, []);

  if (!showHero) return null;
  return <Hero />;
}
