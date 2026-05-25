# Salary Management Tool

```
├── server/   # NestJS API (port 4000)
└── web/      # Next.js frontend (port 3000)
```

Run all commands from the respective folder (`server/` or `web/`).

## Server

```bash
cd server
npm install
cp .env.example .env   # if needed

npm run migration:run
npm run seed:employees
npm run start:dev
```

## Web

```bash
cd web
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_API_URL
npm run dev
```

## API

- `GET/POST/PATCH/DELETE /employees`
- `GET /salary-insights?country=&jobTitle=&department=`
