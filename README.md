## Label App

Label App is a Next.js project that generates labels for a very specific use case. It provides a focused workflow for building and previewing labels, with fast iteration via the Next.js App Router and a local development server.

## Features

- Purpose-built label generation flow
- Fast local preview for layout tweaks
- Next.js App Router architecture
- TypeScript-first codebase

## Requirements

- Node.js 18+ (LTS recommended)
- pnpm 8+

## Getting Started (pnpm)

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Scripts

```bash
pnpm dev        # Start the dev server
pnpm build      # Create a production build
pnpm start      # Run the production server
pnpm lint       # Run linting
```

## Project Structure

```
app/            # App Router routes and pages
public/         # Static assets
```

## Configuration

If you need environment variables, create a `.env.local` file at the project root. Add only the keys your deployment environment expects. Do not commit secrets.

## Deployment

This project can be deployed to any Node.js host that supports Next.js. If you use Vercel, the default settings work well for App Router projects.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
