import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} aaharsevaX. All rights reserved.
        </div>
        
        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          <span>for a hunger-free world</span>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
