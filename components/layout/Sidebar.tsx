"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/blog", label: "Blog", icon: "◉" },
  { href: "/projects", label: "Projects", icon: "◫" },
  { href: "/about", label: "About", icon: "◎" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-14 hover:w-40 transition-all duration-200 bg-bg-secondary border-r border-border-primary flex-col items-start py-8 z-50 group overflow-hidden">
        <div className="flex flex-col gap-1 w-full px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                isActive(item.href)
                  ? "text-accent bg-accent-muted"
                  : "text-fg-secondary hover:text-fg-primary hover:bg-bg-tertiary"
              }`}
            >
              <span className="font-mono text-base w-5 text-center flex-shrink-0">
                {item.icon}
              </span>
              <span className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
              {isActive(item.href) && (
                <span className="absolute left-0 w-0.5 h-5 bg-accent rounded-r" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary/90 backdrop-blur-md border-t border-border-primary z-50 flex justify-around py-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              isActive(item.href)
                ? "text-accent"
                : "text-fg-secondary"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="font-mono text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
