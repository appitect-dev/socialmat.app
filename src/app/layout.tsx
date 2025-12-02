import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const clash = localFont({
  src: [{ path: "./fonts/ClashDisplay-Bold.woff2", weight: "700" }],
  variable: "--font-clash",
  display: "swap",
});
const archivo = localFont({
  src: [
    { path: "./fonts/Archivo-Regular.woff2", weight: "400" },
    { path: "./fonts/Archivo-Medium.woff2", weight: "500" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${clash.variable} ${archivo.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
