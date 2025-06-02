import { Button } from "@/components/ui/button"
import CTAText from "./cta-text"

export default function CTA() {
  const { heading, cta, secondaryCta } = CTAText

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{heading}</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg">{cta}</Button>
            <Button size="lg" variant="outline">
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
