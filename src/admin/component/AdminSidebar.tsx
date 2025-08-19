// src/admin/component/AdminSidebar.tsx
import React, { useEffect, useState, MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, LogOut, Briefcase, FileText, Settings } from "lucide-react";

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
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Services", Icon: Briefcase },
  { href: "/admin/client", label: "Clients", Icon: Users },
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

  /** Auto-open Documents group if current route matches any child. */
  useEffect(() => {
    const docs = navItems.find((n) => n.children);
    if (!docs?.children) return;
    const activeChild = docs.children.some((c) => location.pathname.startsWith(c.href));
    if (activeChild) setOpenDocs(true);
  }, [location.pathname]);

  /** Logout */
  const handleLogout = () => {
    // clear all possible keys we've seen in code
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
    onNavigate?.();
  };

  /** Convenience nav click wrapper */
  const handleNavClick =
    (extra?: () => void) =>
    (_e: MouseEvent<HTMLElement>) => {
      extra?.();
      onNavigate?.();
    };

  return (
    <aside className={classNames("w-64 bg-white shadow-lg p-6 flex flex-col", className)}>
      <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

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
                  className={classNames(
                    "transform transition-transform",
                    openDocs && "rotate-90"
                  )}
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
    </aside>
  );
}
