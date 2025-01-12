import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun, Search } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            <Link to="/" className="font-medium">
              Beranda
            </Link>
            <a
              href="https://artmozai.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
            >
              Blog
            </a>
            <a
              href="https://artmozai.hashnode.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
            >
              Hashnode
            </a>
            <a
              href="https://stock.adobe.com/uk/contributor/211463521/artmozai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
            >
              Buy Image
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="mr-2"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search across our content
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-[400px]">
            <script async src="https://cse.google.com/cse.js?cx=651d1b956c0ff4371"></script>
            <div className="gcse-search"></div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}