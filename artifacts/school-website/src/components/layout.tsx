import { Link, useLocation } from "wouter";
import { BookOpen, Trophy, Sparkles, Home, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home, color: "text-primary" },
    { href: "/subjects", label: "Subjects", icon: BookOpen, color: "text-accent" },
    { href: "/quiz", label: "Play Quiz", icon: Play, color: "text-success" },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy, color: "text-secondary" },
    { href: "/facts", label: "Fun Facts", icon: Sparkles, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b-4 border-foreground shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 bg-primary rounded-xl border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold font-['Bricolage_Grotesque'] tracking-tight">
              Learn <span className="text-secondary">&</span> Play
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "font-bold text-lg flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all",
                  location === item.href 
                    ? "bg-foreground text-background border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    : "border-transparent hover:border-foreground hover:bg-muted"
                )}
              >
                <item.icon className={cn("w-5 h-5", location === item.href ? "text-background" : item.color)} />
                {item.label}
              </Link>
            ))}
          </nav>

          <Button asChild size="lg" className="md:hidden border-2 border-foreground shadow-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
             <Link href="/quiz">Play!</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
      
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t-4 border-foreground pb-safe z-50 flex items-center justify-around p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              location === item.href ? "bg-muted scale-110" : "opacity-70"
            )}
          >
            <item.icon className={cn("w-6 h-6", item.color)} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
