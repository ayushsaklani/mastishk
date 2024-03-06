"use client";

import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  return (

    <aside className="grid grid-rows-12  h-[calc(100vh_-_3rem)] w-60 bg-slate-700 py-6 ">
      <div className='grid row-span-1 place-items-center font-bold'>
        <span>Mastishk</span>
      </div>
      <div className='grid gap-4 row-span-10 justify-center items-start font-semibold'>
        
        <nav className='grid gap-10'>
            <p><a className={`mr-4 ${pathname === "/" ? "text-white border-b" : ""}`} href="/">🏴‍☠️ Chat</a></p>
            <p><a className={`mr-4 ${pathname === "/documentqa" ? "text-white border-b" : ""}`} href="/documentqa">Document Question Answering</a></p>
       </nav>
        
      </div>
      <div className='grid row-span-1 place-items-center'>
        <span>Welcome</span>
      </div>
  </aside>
  );
}