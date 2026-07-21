import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foto Slides",
  description: "Slideshow de fotos para eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="grain-bg antialiased">
        {children}
      </body>
    </html>
  );
}
