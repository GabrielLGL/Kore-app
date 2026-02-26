"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "dark") setTheme("dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("kore-theme", next);
  }

  return (
    <button
      onClick={toggle}
      className="fixed top-5 right-5 z-[100] w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full
        bg-[var(--bg)] border-none cursor-pointer shadow-neu-out
        flex items-center justify-center text-2xl
        transition-all duration-300
        hover:text-[var(--accent)] hover:scale-110
        active:shadow-neu-in active:scale-95"
      aria-label="Changer le theme clair/sombre"
      title="Changer de theme"
    >
      <span aria-hidden="true">
        {theme === "light" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
      </span>
    </button>
  );
}
