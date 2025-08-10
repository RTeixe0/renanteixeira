// lib/clarity.ts
import Clarity from "@microsoft/clarity";

export const initClarity = () => {
  if (typeof window === "undefined") return;
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (projectId) {
    Clarity.init(projectId);
  } else {
    console.warn("⚠️ NEXT_PUBLIC_CLARITY_PROJECT_ID não definido nas envs");
  }
};

export const clarityEvent = (eventName: string) => {
  if (typeof window !== "undefined") Clarity.event(eventName);
};

export const clarityTag = (key: string, value: string | string[]) => {
  if (typeof window !== "undefined") Clarity.setTag(key, value);
};
