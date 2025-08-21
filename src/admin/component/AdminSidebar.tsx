// src/admin/component/AdminSidebar.tsx
import React, { useEffect, useState, MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, LogOut, Briefcase, FileText, Settings, Menu, X } from "lucide-react";
import { SiTask } from "react-icons/si";

/** Optional callback fired when a nav link is clicked (useful to close mobile drawer). */
export interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  // Widened to support both lucide-react and react-icons
  Icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Services", Icon: Briefcase },
  { href: "/admin/client", label: "Clients", Icon: Users },
  { href: "/admin/tasks", label: "Tasks", Icon: SiTask },
  { href: "/admin/plan", label: "Plan", Icon: Users },
  {
    label: "Documents",
    Icon: FileText,
    children: [
      { href: "/admin/document/faqs", label: "FAQs" },
      { href: "/admin/document/terms-of-use", label: "Terms of Use" },
      { href: "/admin/document/shipping-delivery", label: "Shipping & Delivery Policy" },
      { href: "/admin/document/privacy-policy", label: "Privacy Policy" },
      { href: "/admin/document/returns-policy", label: "Returns Policy" },
      { href: "/admin/document/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

function classNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminSidebar({ onNavigate, className = "" }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDocs, setOpenDocs] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile drawer

  /** Auto-open Documents group if current route matches any child. */
  useEffect(() => {
    const docs = navItems.find((n) => n.children);
    if (!docs?.children) return;
    const activeChild = docs.children.some((c) => location.pathname.startsWith(c.href));
    if (activeChild) setOpenDocs(true);
  }, [location.pathname]);

  /** Close drawer whenever route changes (mobile). */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  /** Enable Esc to close on mobile */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /** Logout */
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
    onNavigate?.();
    setIsOpen(false);
  };

  /** Convenience nav click wrapper */
  const handleNavClick =
    (extra?: () => void) =>
    (_e: MouseEvent<HTMLElement>) => {
      extra?.();
      onNavigate?.();
      setIsOpen(false);
    };

  /** Sidebar inner content reused by mobile + desktop */
  const SidebarContent = () => (
    <div className="w-64 bg-white shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        {/* Close button (mobile drawer only) */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, Icon, children }) => {
          const isActive = href ? location.pathname.startsWith(href) : false;

          if (!children) {
            return (
              <Link
                key={href}
                to={href!}
                onClick={handleNavClick()}
                className={classNames(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5" /> {label}
              </Link>
            );
          }

          // Expand/collapse group (Documents)
          return (
            <div key={label}>
              <button
                type="button"
                onClick={() => setOpenDocs((v) => !v)}
                className={classNames(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors",
                  openDocs
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}
                aria-expanded={openDocs}
                aria-controls="admin-docs-subnav"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" /> {label}
                </div>
                <span
                  className={classNames("transform transition-transform", openDocs && "rotate-90")}
                  aria-hidden="true"
                >
                  &gt;
                </span>
              </button>

              {openDocs && (
                <div id="admin-docs-subnav" className="ml-6 mt-1 space-y-1">
                  {children.map(({ href: childHref, label: childLabel }) => {
                    const isChildActive = location.pathname.startsWith(childHref);
                    return (
                      <Link
                        key={childHref}
                        to={childHref}
                        onClick={handleNavClick()}
                        className={classNames(
                          "block px-3 py-1 rounded-md transition-colors text-sm",
                          isChildActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        )}
                      >
                        {childLabel}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <Link
          to="/admin/settings"
          onClick={handleNavClick()}
          className={classNames(
            "flex items-center gap-3 px-3 py-2 rounded-md mt-2 transition-colors",
            location.pathname.startsWith("/admin/settings")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          )}
        >
          <Settings className="w-5 h-5" /> Settings
        </Link>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 text-red-600 hover:text-red-800"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger (floating) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 inline-flex items-center justify-center p-2 rounded-md bg-white shadow hover:bg-gray-50"
        aria-label="Open menu"
        aria-controls="admin-mobile-drawer"
        aria-expanded={isOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer + backdrop */}
      <div
        id="admin-mobile-drawer"
        className={classNames(
          "md:hidden fixed inset-0 z-40",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <div
          className={classNames(
            "absolute inset-0 transition-opacity",
            isOpen ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <aside
          className={classNames(
            "absolute inset-y-0 left-0 w-72 max-w-full transform transition-transform",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={classNames(
          "hidden md:flex md:static md:translate-x-0 h-screen sticky top-0",
          className
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
