import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const links = [
  { name: "Team", href: "/portal/team" },
  { name: "Users", href: "/portal/users" },
  { name: "Sponsors", href: "/portal/sponsors" },
  { name: "Invitations", href: "/portal/invitations" },
  { name: "Recruitment", href: "/portal/recruitment" },
  { name: "Our Work", href: "/portal/our-work" },
  { name: "Alumni", href: "/portal/alumni" },
] as const;

export default function NavMenu() {
  return (
    <NavigationMenu>
      {links.map((link) => (
        <NavigationMenuLink key={link.name} asChild>
          <Link href={link.href}>{link.name}</Link>
        </NavigationMenuLink>
      ))}
    </NavigationMenu>
  );
}
