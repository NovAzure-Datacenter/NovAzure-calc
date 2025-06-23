"use client";

import { Button } from "@/components/ui/button"
import HeroText from "./hero-text"
import { useUser } from "@/hooks/useUser"
import Link from "next/link"

export default function Hero() {
  const { heading, subheading, description, primaryCta, secondaryCta } = HeroText
  const { isUserLoggedIn, isLoading } = useUser()

  return (
    <section className="py-28 md:py-34 lg:py-44 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">{heading}</h1>
            <h2 className="text-xl font-medium sm:text-2xl md:text-3xl">{subheading}</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 min-[400px]">
            {!isLoading && (
              <>
                {isUserLoggedIn ? (
                  <>
                    <Link href="/dashboard">
                      <Button size="lg">Go to Dashboard</Button>
                    </Link>
                    <Button size="lg" variant="outline">
                      Book a demo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg">{primaryCta}</Button>
                    <Button size="lg" variant="outline">
                      {secondaryCta}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
