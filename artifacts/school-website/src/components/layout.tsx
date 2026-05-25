import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail, MapPin, Facebook, Twitter, ChevronDown } from "lucide-react";

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
      {/* Top bar */}
      <div className="bg-[#1a3c6e] text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:01234567890" className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
              <Phone className="w-3.5 h-3.5" /> 01234 567 890
            </a>
            <a href="mailto:info@greenfieldprimary.sch.uk" className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
              <Mail className="w-3.5 h-3.5" /> info@greenfieldprimary.sch.uk
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <MapPin className="w-3.5 h-3.5" /> Greenfield Lane, London, N1 4PQ
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-[#1a3c6e] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">GP</span>
            </div>
            <div>
              <div className="text-xl font-bold text-[#1a3c6e] leading-tight">Greenfield Primary School</div>
              <div className="text-xs text-gray-500 font-medium">Nurturing Minds, Inspiring Futures</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-6 text-sm font-semibold text-gray-700 hover:text-[#1a3c6e] hover:bg-gray-50 transition-colors">
                    {item.label} <ChevronDown className="w-3.5 h-3.5 mt-0.5" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-b-lg min-w-48 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-3 text-sm font-medium hover:bg-[#1a3c6e] hover:text-white transition-colors",
                            location === child.href ? "text-[#1a3c6e] bg-blue-50" : "text-gray-700"
                          )}
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
                  className={cn(
                    "px-4 py-6 text-sm font-semibold transition-colors border-b-3",
                    location === item.href
                      ? "text-[#1a3c6e] border-b-[3px] border-[#1a3c6e] bg-blue-50"
                      : "text-gray-700 hover:text-[#1a3c6e] hover:bg-gray-50 border-b-[3px] border-transparent"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white pb-4">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label}>
                  <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">{item.label}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-8 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1a3c6e] hover:bg-gray-50"
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
                  className={cn(
                    "block px-6 py-3 text-sm font-semibold",
                    location === item.href ? "text-[#1a3c6e] bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1a3c6e] text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1a3c6e] text-sm font-bold">GP</span>
              </div>
              <span className="font-bold text-lg">Greenfield Primary</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">Nurturing Minds, Inspiring Futures — a caring community school in the heart of London.</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-yellow-300">Quick Links</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/admissions", label: "Admissions" },
                { href: "/school-life", label: "School Life" },
                { href: "/staff", label: "Our Staff" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-yellow-300">Useful Info</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">School Policies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Term Dates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">School Uniform</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Free School Meals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SEND Information</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-yellow-300">Contact Us</h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>Greenfield Lane, London, N1 4PQ</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" /><a href="tel:01234567890" className="hover:text-white transition-colors">01234 567 890</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" /><a href="mailto:info@greenfieldprimary.sch.uk" className="hover:text-white transition-colors">info@greenfieldprimary.sch.uk</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-blue-300 text-xs">
            <p>&copy; 2026 Greenfield Primary School. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
