import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import '@/app/globals.css'
import { Providers } from '@/components/providers'
import { Header as Head1} from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { cn } from "@/lib/utils"
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}
interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >        <Providers
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    ><main className="flex flex-col flex-1 bg-muted/50">
        {children}</main>        </Providers>
</body>
    </html>
  )
}
