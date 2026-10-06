"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "public/assets/logo-center-black.png";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import useViewport from "@/app/_hooks/useViewport";
import { portalNavItems } from "@/app/_types";
import { cn } from "@/lib/utils";

interface PortalPageHeaderProps {
  isAdmin: boolean;
  username: string;
}

const PortalPageHeader = ({ isAdmin, username }: PortalPageHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { width } = useViewport();
  const isMobile = width !== undefined && width <= 640;

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const renderNavLinks = (mobile = false) =>
    portalNavItems.map(({ href, label }) => (
      <Link
        aria-current={pathname === href ? "page" : undefined}
        className={cn(
          "shrink-0 cursor-pointer rounded-lg no-underline",
          mobile
            ? "p-3 font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sc-red [@media(max-width:320px)]:p-2.5"
            : "flex items-center justify-center px-3 py-2.5",
          pathname === href
            ? "bg-[#fff1f2] font-semibold text-[#9f1239]"
            : "text-inherit hover:bg-slate-100",
        )}
        href={href}
        key={href}
        onClick={closeMenu}
      >
        {label}
      </Link>
    ));

  return (
    <>
      <header className="sticky top-0 left-0 z-100 flex h-16 w-full max-w-dvw items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 text-sm text-[#1f2937] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-sc-red [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-sc-red [@media(max-width:1024px)]:gap-2.5 [@media(max-width:1024px)]:px-4 [@media(max-width:768px)]:px-3 [@media(max-width:320px)]:[&&]:gap-1.5 [@media(max-width:320px)]:[&&]:px-2">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-5 font-medium [@media(max-width:1024px)]:gap-3 [@media(max-width:768px)]:gap-2 [@media(max-width:320px)]:[&&]:gap-1.5">
          <Link
            className="flex size-12 shrink-0 items-center justify-center rounded-lg"
            href="/"
          >
            <Image
              alt="Calgary Solar Car home"
              className="shrink-0"
              height={48}
              src={logo}
              unoptimized
              width={48}
            />
          </Link>
          {isAdmin && (
            <>
              {!isMobile && (
                <nav
                  aria-label="Portal"
                  className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto overflow-y-hidden p-1 font-medium whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [@media(max-width:640px)]:hidden"
                >
                  {renderNavLinks()}
                </nav>
              )}
              {isMobile && (
                <button
                  aria-controls="portal-mobile-navigation"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation menu"
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 p-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  ref={menuButton}
                  type="button"
                >
                  <FaChevronRight
                    aria-hidden
                    className="size-6 -rotate-90 fill-current transition-transform duration-300"
                  />
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex min-w-0 shrink-0 items-center justify-center gap-2.5">
          <span className="max-w-35 truncate [@media(max-width:768px)]:hidden">
            {username}
          </span>
          <UserButton />
        </div>
      </header>
      {isMobile && isMenuOpen && isAdmin && (
        <nav
          aria-label="Portal"
          className="fixed inset-x-0 top-16 z-99 flex max-h-[calc(100dvh-64px)] animate-in flex-col gap-1 overflow-y-auto border-b border-slate-200 bg-white p-3 text-[#1f2937] shadow-[0_8px_16px_rgba(15,23,42,0.08)] duration-300 fade-in slide-in-from-top-2.5 motion-reduce:animate-none [@media(max-width:320px)]:px-3 [@media(max-width:320px)]:py-1.5"
          id="portal-mobile-navigation"
        >
          {renderNavLinks(true)}
        </nav>
      )}
    </>
  );
};

export default PortalPageHeader;
