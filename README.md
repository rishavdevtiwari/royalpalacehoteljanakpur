
# Royal Palace Hotel Janakpur

This monorepo contains both the frontend and backend code for the Royal Palace Hotel Janakpur website.

## Project Structure

```
royalpalacehotel/
│
├── apps/
│   ├── backend/                 → Node.js, Prisma, Backend code
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
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishavdevtiwari/royalpalacehotel.git
   cd royalpalacehotel
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

### Frontend - GitHub Pages

The frontend is deployed on GitHub Pages. See `GITHUB_PAGES_DEPLOYMENT.md` for details.

### Backend - Render.com

The backend is deployed on Render.com with a PostgreSQL database. See `apps/backend/render.yaml` for configuration details.

## License

This project is private and is not licensed for public use.
