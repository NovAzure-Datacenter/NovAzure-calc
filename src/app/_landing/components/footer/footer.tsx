import Link from "next/link"
import FooterText from "./footer-text"

export default function Footer() {
  const { companyName, links, copyright } = FooterText

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center">
        <div className="flex flex-col gap-6 md:flex-row md:gap-12 lg:gap-16">
          <Link href="/" className="font-semibold text-lg">
            {companyName}
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs hover:underline underline-offset-4">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="md:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
