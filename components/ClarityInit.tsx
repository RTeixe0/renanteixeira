"use client";

import { useEffect } from "react";
import { initClarity } from "@/lib/clarity";

export default function ClarityInit() {
  useEffect(() => {
    initClarity();
  }, []);
  return null;
}
