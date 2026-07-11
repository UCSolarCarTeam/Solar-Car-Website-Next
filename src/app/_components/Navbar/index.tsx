"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "public/assets/logo-nav.png";
import { useEffect, useState } from "react";
import useViewport from "@/app/_hooks/useViewport";
import { cn } from "@/lib/utils";
import CloseButton from "../Buttons/CloseButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/cars", label: "Cars" },
  { href: "/team", label: "Team" },
  { href: "/support-us", label: "Support Us" },
  { href: "/our-work", label: "Our Work" },
  { href: "/sponsors", label: "Sponsors" },
] as const;

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    className={className}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7h16M4 12h16M4 17h16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);

const Navbar = () => {
  const { width } = useViewport();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const isDesktop = width !== undefined && width > 1024;

  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.72]);
  const blurAmount = useTransform(scrollY, [0, 50], [0, 20]);
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(240, 239, 236, 0)", "rgba(240, 239, 236, 0.08)"],
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 right-0 left-0 z-[100] flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-6",
          isDesktop ? "px-10 py-[15px]" : "h-16",
        )}
        style={{
          backgroundColor: useTransform(
            bgOpacity,
            (v) => `rgba(10, 10, 11, ${v})`,
          ),
          backdropFilter: useTransform(
            blurAmount,
            (v) => `blur(${v}px) saturate(120%)`,
          ),
          borderBottom: useTransform(borderColor, (v) => `1px solid ${v}`),
        }}
      >
        <Link className="min-w-0 shrink" href="/">
          <Image
            alt="University of Calgary Solar Car Team"
            className="h-9 w-auto max-w-[min(100%,220px)] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] sm:h-10"
            height={40}
            loading="eager"
            priority
            src={Logo}
            width={180}
          />
        </Link>

        {isDesktop ? (
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                className={cn(
                  "sc-mono text-sm no-underline transition-colors duration-200",
                  isActive(link.href)
                    ? "font-semibold text-sc-red"
                    : "font-normal text-sc-white",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : (
          width !== undefined && (
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-none bg-transparent text-white"
              onClick={() => setMenuOpen((prev) => !prev)}
              type="button"
            >
              {menuOpen ? (
                <CloseButton className="h-7 w-7" fill="white" />
              ) : (
                <MenuIcon />
              )}
            </button>
          )
        )}
      </motion.nav>

      {width !== undefined && !isDesktop && (
        <div
          aria-hidden={!menuOpen}
          className={cn(
            "fixed inset-0 z-[99] flex flex-col bg-black/95 pt-20 transition-[visibility,opacity] duration-300",
            menuOpen
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0",
          )}
        >
          <nav className="flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto px-5 pb-10">
            {links.map((link) => (
              <Link
                className={cn(
                  "sc-heading w-full max-w-sm py-3 text-center text-3xl no-underline",
                  isActive(link.href) ? "text-sc-red" : "text-white",
                )}
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
