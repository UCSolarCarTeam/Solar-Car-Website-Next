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

  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.72]);
  const blurAmount = useTransform(scrollY, [0, 50], [0, 20]);
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(240, 239, 236, 0)", "rgba(240, 239, 236, 0.08)"],
  );

  const toggleHambugerMenu = () => {
    setHamburgerMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setHamburgerMenuOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 right-0 left-0 z-100 flex items-center transition-[padding] duration-300",
          isDesktop
            ? "flex-row justify-between gap-0 px-10 py-3.75"
            : "flex-col justify-center gap-2.5 px-5 py-3.75",
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

        {isDesktop && (
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
        )}

        {!isDesktop && width !== undefined && (
          <button
            aria-label="Open menu"
            className="absolute top-6.25 right-5 cursor-pointer border-none bg-transparent p-0"
            onClick={toggleHambugerMenu}
            type="button"
          >
            <Chevron className="rotate-90 fill-white drop-shadow-[2px_2px_10px_#000000]" />
          </button>
        )}
      </motion.nav>

      {width !== undefined && !isDesktop && (
        <div
          className={cn(
            "fixed inset-x-0 top-0 z-99 flex flex-col items-center justify-center text-white transition-all duration-500",
            hamburgerMenuOpen
              ? "h-dvh bg-black/90 opacity-100 [&_a]:pointer-events-auto"
              : "pointer-events-none h-0 bg-transparent opacity-0 [&_a]:pointer-events-none",
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
          {links.map((link) => (
            <Link
              className={cn(
                "sc-heading my-4 text-3xl no-underline",
                isActive(link.href) ? "text-sc-red" : "text-white",
              )}
              href={link.href}
              key={link.href}
              onClick={toggleHambugerMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
