import IntegrationsText from "./integrations-text"

export default function Integrations() {
  const { heading, description, integrationTypes, integrationLogos } = IntegrationsText

  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{heading}</h2>
            <p className="text-muted-foreground">{description}</p>
            <ul className="space-y-2">
              {integrationTypes.map((type, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm">{type}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4">
              {integrationLogos.map((logo, index) => (
                <div key={index} className="flex items-center justify-center rounded-lg border bg-background p-4">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
