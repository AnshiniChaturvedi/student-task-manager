import { navLinks } from "@/data/navLinks";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-6 md:flex">
      <p className="text-xl font-bold text-brand">StudyBoard</p>
      <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
        {navLinks.map((label, i) => (
          <a
            key={label}
            href="#"
            aria-current={i === 0 ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              i === 0 ? "bg-brand-soft text-brand" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
