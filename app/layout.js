import './globals.css'
import { ThemeProvider } from './utils/ThemeContext'

export const metadata = {
  title: 'Code Editor',
  description: 'Professional code editor with theme support',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" data-theme="dark">
      <body className="h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
