import type { Metadata } from 'next';
import './globals.css';
import BottomNavigation from '@/components/BottomNavigation';

export const metadata: Metadata = {
  title: 'Premium Mobile UI',
  description: 'A luxurious mobile prototype',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark overflow-hidden overscroll-none">
      <body className="antialiased bg-background text-foreground h-[100dvh] w-full overflow-hidden flex justify-center">
        {/* Mobile Container Boundary constraint */}
        <div className="w-full max-w-md h-full relative flex flex-col bg-slate-900 border-x border-slate-800/50 shadow-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24 scroll-smooth">
            {children}
          </div>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
