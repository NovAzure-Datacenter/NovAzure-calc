import { Shield } from "lucide-react"
import DataSecurityText from "./data-security-text"

export default function DataSecurity() {
  const { heading, description, securityFeatures } = DataSecurityText

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-center rounded-lg border bg-background p-4 h-16">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{heading}</h2>
            <p className="text-muted-foreground">{description}</p>
            <ul className="space-y-2">
              {securityFeatures.map((feature, index) => (
                <li key={index} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
