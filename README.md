This monorepo contains both the frontend and backend code for the Royal Palace Hotel Janakpur website.

## Project Structure

```
royalpalacehotel/
│
├── apps/
│   ├── backend/                 → NestJS, Prisma, Backend code
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                → Vite + React Frontend code
│       ├── src/
│       ├── public/
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── package.json                 → root workspace package.json
├── tsconfig.json                → root tsconfig for monorepo
├── turbo.json                   → Turborepo configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm, npm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishavdevtiwari/royalpalacehoteljanakpur.git
   cd royalpalacehoteljanakpur
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `apps/backend/.env.example` to `apps/backend/.env` and update values
   - Copy `apps/frontend/.env.example` to `apps/frontend/.env` and update values

4. Start development servers:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment on Render.com. See render.yaml for details.

## License

This project is private and is not licensed for public use.
