

 
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"


import Providers from "./providers"
import "./globals.css"
 


export const metadata: Metadata = {
  title: "Product Management Dashboard",
  description: "E-commerce product management dashboard with cart and admin features",
  generator: "My App",
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body  >
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

 