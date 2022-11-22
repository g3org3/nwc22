import '../styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body className="py-5 px-2 min-h-screen overflow-auto flex container flex-col bg-slate-100">
        {children}
      </body>
    </html>
  )
}
