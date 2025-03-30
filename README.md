

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

Start development servers:
   ```bash
   npm run dev
   ```


