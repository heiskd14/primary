import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail, MapPin, Facebook, Twitter, ChevronDown } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

const navItems = [
  { href: "/", label: "Home" },
  {
    label: "About Us",
    children: [
      { href: "/about", label: "About Our School" },
      { href: "/staff", label: "Our Staff" },
    ],
  },
  { href: "/admissions", label: "Admissions" },
  { href: "/school-life", label: "School Life" },
  { href: "/news", label: "News & Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top info bar */}
      <div style={{ backgroundColor: NAVY }} className="text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+2348012345678" className="flex items-center gap-1.5 hover:text-red-300 transition-colors">
              <Phone className="w-3.5 h-3.5" /> +234 (0) 801 234 5678
            </a>
            <a href="mailto:info@tripletee.edu.ng" className="flex items-center gap-1.5 hover:text-red-300 transition-colors">
              <Mail className="w-3.5 h-3.5" /> info@tripletee.edu.ng
            </a>
          </div>
          <span className="flex items-center gap-1.5 text-blue-200">
            <MapPin className="w-3.5 h-3.5" /> Oke-Ola, Oro, Irepodun LGA, Kwara State, Nigeria
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="Triple Tee Montessori Academy Logo"
              className="w-14 h-14 object-contain rounded-full border border-gray-200"
            />
            <div>
              <div className="text-base md:text-lg font-bold leading-tight" style={{ color: NAVY }}>
                Triple Tee Montessori Academy
              </div>
              <div className="text-xs font-medium" style={{ color: RED }}>
                Building God Centered Future
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{ color: openDropdown === item.label ? NAVY : undefined }}
                  >
                    {item.label} <ChevronDown className="w-3.5 h-3.5 mt-0.5" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-b-lg min-w-48 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-3 text-sm font-medium transition-colors",
                            location === child.href
                              ? "text-white"
                              : "text-gray-700 hover:text-white"
                          )}
                          style={
                            location === child.href
                              ? { backgroundColor: NAVY }
                              : undefined
                          }
                          onMouseEnter={(e) => { if (location !== child.href) (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; }}
                          onMouseLeave={(e) => { if (location !== child.href) (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="px-4 py-6 text-sm font-semibold transition-colors"
                  style={{
                    color: location === item.href ? NAVY : undefined,
                    borderBottom: location === item.href ? `3px solid ${NAVY}` : "3px solid transparent",
                    backgroundColor: location === item.href ? "#f0f4ff" : undefined,
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white pb-4">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">{item.label}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-8 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="block px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  style={location === item.href ? { color: NAVY, backgroundColor: "#f0f4ff" } : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="text-white mt-12" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 object-contain rounded-full bg-white p-0.5" />
              <span className="font-bold text-base leading-tight">Triple Tee<br />Montessori Academy</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Building God Centered Future — a caring, faith-based school nurturing young minds in Oke-Ola, Oro, Kwara State.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: RED }}>
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: RED }}>
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-red-300">Quick Links</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/admissions", label: "Admissions" },
                { href: "/school-life", label: "School Life" },
                { href: "/staff", label: "Our Staff" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-red-300">Useful Info</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">School Policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Term Dates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">School Uniform</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WAEC / NECO Prep</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PTA Information</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-red-300">Contact Us</h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Oke-Ola, Oro, Irepodun LGA, Kwara State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-white transition-colors">+234 (0) 801 234 5678</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@tripletee.edu.ng" className="hover:text-white transition-colors">info@tripletee.edu.ng</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-900 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-blue-300 text-xs">
            <p>&copy; 2026 Triple Tee Montessori Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
