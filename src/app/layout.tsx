import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "knowledge-base — オープンソースのヘルプセンター",
    template: "%s | knowledge-base",
  },
  description:
    "Zendesk Guide / Helpjuice の代替OSS。AI検索・コンテンツワークフロー・マルチブランド対応のセルフホスト可能なヘルプセンター。",
  openGraph: {
    title: "knowledge-base — オープンソースのヘルプセンター",
    description:
      "Zendesk Guide / Helpjuice の代替OSS。AI検索・コンテンツワークフロー・マルチブランド対応のセルフホスト可能なヘルプセンター。",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
