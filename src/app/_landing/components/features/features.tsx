import Image from "next/image"
import FeaturesText from "./features-text"

export default function Features() {
  const { heading, subheading, features } = FeaturesText

  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{heading}</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {subheading}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:gap-12 lg:gap-16 py-12">
          {features.map((feature, index) => (
            <div key={index} className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className={`space-y-4 ${index % 2 !== 0 ? "lg:order-last" : ""}`}>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-lg border bg-background">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    width={500}
                    height={300}
                    alt={feature.title}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
