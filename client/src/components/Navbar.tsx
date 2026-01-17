import { Link, useLocation } from "wouter";
import { Menu, X, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/donate", label: "Donate Food" },
    { href: "/request", label: "NGO Request" },
    { href: "/admin", label: "Dashboard" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-primary hover:opacity-90 transition-opacity">
          <HeartHandshake className="h-8 w-8" />
          <span>AharSetu</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/donate">
            <Button size="sm" className="font-semibold shadow-md shadow-primary/20">
              Donate Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-8">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link href="/donate" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20">
                    Donate Food Now
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
