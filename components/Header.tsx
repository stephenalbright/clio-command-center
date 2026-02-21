"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Good morning
            </h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{dateString}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light tracking-tight">{currentTime}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
