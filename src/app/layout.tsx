import "./globals.css"
import { BlitzProvider } from "./blitz-client"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: { title: "UniShop Inventory", template: "%s – UniShop Bamberg" },
  description: "Internal inventory tracking system for UniShop Bamberg",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BlitzProvider>
          <NextTopLoader />
          <>{children}</>
        </BlitzProvider>
      </body>
    </html>
  )
}
