"use client";

import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 text-lg h-[8dvh]">
      <a className={`mr-4 ${pathname === "/" ? "text-white border-b" : ""}`} href="/"> Chat</a>
      <a className={`mr-4 ${pathname === "/documentqa" ? "text-white border-b" : ""}`} href="/documentqa"> Document QA</a>
    </nav>
  );
}
