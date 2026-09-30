"use client";

import { useState } from "react";
import { navLinks } from "@/data/navLinks";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-lg font-bold text-brand">StudyBoard</p>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Main" className="flex flex-col gap-1 border-t border-slate-100 p-3">
          {navLinks.map((label, i) => (
            <a
              key={label}
              href="#"
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                i === 0 ? "bg-brand-soft text-brand" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
