# NovAzure

A modern Next.js application built with TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [dnd kit](https://dndkit.com/) - Drag and drop toolkit
- [GSAP](https://greensock.com/gsap/) - Animation library
- [nuqs](https://nuqs.47ng.com/) - Type-safe URL state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
├── app/                # Next.js App Router
├── components/         # React components
├── lib/               # Utility functions
├── public/            # Static assets
└── styles/            # Global styles
```

## Development Guidelines

- Use functional components with TypeScript interfaces
- Follow the file structure: exports, subcomponents, helpers, types
- Implement responsive design with Tailwind CSS
- Optimize for Web Vitals (LCP, CLS, FID)
- Prefer Server Components where possible
- Use `use client` directive sparingly

## License

MIT
