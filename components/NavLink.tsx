"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}
const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    { href, children, className, activeClassName, exact = false, ...props },
    ref,
  ) => {
    const pathname = usePathname();

    // Determine if the link is active
    // exact: matches the path perfectly
    // !exact: matches if the path starts with the href (useful for nested dashboard routes)
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
