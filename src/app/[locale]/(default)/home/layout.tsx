import { ReactNode } from "react";
import ThemeToggle from "@/components/theme/toggle";
import LocaleToggle from "@/components/locale/toggle";

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {/* 轻量级Header - 只包含必要功能 */}
      <header className="py-3 border-b">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Base64s" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">Base64s.com</span>
          </div>
          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="bg overflow-x-hidden min-h-screen">
        {children}
      </main>
      
      {/* 轻量级Footer */}
      <footer className="py-8 border-t bg-muted/30">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Base64s.com - The best online Base64 encoder and decoder
          </p>
        </div>
      </footer>
    </>
  );
} 