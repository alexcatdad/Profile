# Professional Profile Website

A modern, professional single-page website showcasing a developer's career, skills, and contributions. Features email capture for lead generation, modal-based cover letter with URL trigger capability, and smooth transitions throughout.

## Features

- **Access Gate**: Visitor information capture modal before granting profile access
- **i18n Support**: English and Dutch language support with automatic locale detection
- **Cover Letter Modal**: Editable cover letter with auto-save and PDF download (stub)
- **Contact Obfuscation**: Protects contact information from bot scraping
- **Animations**: Smooth Framer Motion animations with reduced motion support
- **Accessibility**: Full React Aria integration for keyboard navigation and screen readers
- **Type Safety**: Strict TypeScript types with Zod runtime validation for all content
- **Server-Side Ready**: Next.js 15 App Router with server components

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Accessibility**: React Aria
- **UI Components**: shadcn/ui
- **Validation**: Zod
- **Linting**: Biome
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Bun installed ([bun.sh](https://bun.sh))

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Lint and format
bun lint
bun lint:fix
```

### Environment Variables

Create a `.env.local` file (optional):

```env
API_ENDPOINT=https://your-api.com
ANALYTICS_KEY=your-analytics-key
```

## Project Structure

```
├── app/
│   ├── [lang]/              # i18n routes
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Layout with locale
│   │   └── page.tsx         # Main page
│   ├── dictionaries/        # i18n dictionaries
│   ├── globals.css          # Global styles
│   └── proxy.ts             # Locale detection proxy
├── components/
│   ├── sections/            # Page sections
│   ├── ui/                  # shadcn components
│   ├── AccessGate.tsx       # Access control
│   ├── AccessModal.tsx      # Access request modal
│   ├── CoverLetterModal.tsx # Cover letter editor
│   └── ...
├── data/                    # JSON content files
├── lib/                     # Utilities
├── types/                   # TypeScript types
└── ...
```

## Content Management

All content is stored in JSON files under `/data` with strict TypeScript types:

- `profile.json` - Personal information
- `skills.json` - Technical skills
- `experience.json` - Work experience
- `projects.json` - Projects and contributions
- `education.json` - Education history
- `certifications.json` - Certifications
- `cover-letter-template.json` - Cover letter template

Content is validated at runtime using Zod schemas defined in `lib/content-loader.ts`.

## Features in Detail

### Access Gate

Visitors must provide their name and email before accessing the profile. Data is stored in localStorage and submitted to `/api/access-request`. Returning visitors skip the modal.

### Cover Letter Modal

- Editable inline fields
- Auto-save to localStorage every 2 seconds
- URL trigger: `?coverLetter=true`, `?cover=true`, or `?cl=1`
- Reset to template functionality
- PDF download (stub implementation)

### Contact Obfuscation

Email addresses are encoded and only revealed on user interaction to prevent bot scraping.

### i18n

Automatic locale detection based on browser `Accept-Language` header. Supported locales: `en`, `nl`. Routes are prefixed with locale: `/en/...`, `/nl/...`

## Deployment

### Vercel

The project is ready for Vercel deployment:

```bash
# Deploy to Vercel
bunx vercel
```

### Environment Variables

Set these in your Vercel dashboard:
- `API_ENDPOINT` (optional)
- `ANALYTICS_KEY` (optional)

## Development

### Adding New Content

1. Update the relevant JSON file in `/data`
2. Ensure it matches the TypeScript types in `/types/content.ts`
3. The Zod schema will validate at runtime

### Adding New Locale

1. Add locale to `app/proxy.ts` locales array
2. Create dictionary file: `app/dictionaries/[locale].json`
3. Update `app/dictionaries.ts` to include new locale
4. Add to `generateStaticParams` in layout

### Customizing Styles

- Tailwind config: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Component styles: Use Tailwind classes or CSS modules

## Accessibility

- All interactive elements use React Aria for keyboard navigation
- Screen reader announcements for modal states
- Focus management in modals
- Reduced motion support via CSS media query
- ARIA labels and roles throughout

## License

MIT
