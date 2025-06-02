import Image from "next/image"
import { Check } from "lucide-react"
import ValueCalculationText from "./value-calculation-text"

export default function ValueCalculation() {
  const { heading, description, features } = ValueCalculationText

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{heading}</h2>
            <p className="text-muted-foreground">{description}</p>
            <ul className="grid gap-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-lg border bg-background">
              <Image
                src="/placeholder.svg?height=300&width=500"
                width={500}
                height={300}
                alt="Value calculation interface"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
