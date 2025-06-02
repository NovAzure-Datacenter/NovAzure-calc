import Image from "next/image"
import DashboardText from "./dashboard-text"

export default function Dashboard() {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex justify-center">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-lg border shadow-xl">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              width={1200}
              height={600}
              alt="NovAzure Net Zero Dashboard"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <p className="text-sm text-muted-foreground">{DashboardText.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
