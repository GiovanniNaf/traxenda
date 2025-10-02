// app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { esMX } from "@clerk/localizations"; 

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Consultas en Línea",
  description: "Sistema de gestión de consultas en línea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={esMX}>
      <html lang="es" className="h-full">
        <body
          className={`${urbanist.variable} font-urbanist h-full antialiased bg-gray-50`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
