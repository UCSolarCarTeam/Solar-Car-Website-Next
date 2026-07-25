"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "public/assets/logo-nav.png";
import { useEffect, useState } from "react";

import Chevron from "@/app/_components/svgs/Chevron";
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

const Navbar = () => {
  const { width } = useViewport();
  const pathname = usePathname();
  const router = useRouter();
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

  const toggleHambugerMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
          "fixed top-0 right-0 left-0 z-[100] flex items-center transition-[padding] duration-300",
          isDesktop
            ? "flex-row justify-between gap-0 px-10 py-[15px]"
            : "flex-col justify-center gap-2.5 px-5 py-[15px]",
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
        <div className="flex">
          <Image
            alt="Logo"
            className="h-auto w-auto cursor-pointer drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]"
            height={50}
            loading="eager"
            onClick={() => {
              if (isDesktop) {
                void router.push("/");
              } else {
                toggleHambugerMenu();
              }
            }}
            priority
            src={Logo}
          />
        </div>

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
              onClick={toggleHambugerMenu}
              type="button"
            >
              {menuOpen ? (
                <CloseButton className="h-7 w-7" fill="white" />
              ) : (
                <Chevron className="rotate-90 fill-white drop-shadow-[2px_2px_10px_#000000]" />
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
          <button
            aria-label="Close menu"
            className="absolute top-5 right-5 cursor-pointer border-none bg-transparent p-0"
            onClick={toggleHambugerMenu}
            type="button"
          >
            <CloseButton fill="white" />
          </button>
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
