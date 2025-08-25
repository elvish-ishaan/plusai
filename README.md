# Plus AI

Plus AI is a modern AI-powered chat application built with [Next.js](https://nextjs.org), TypeScript, Prisma, and NextAuth. It supports multiple LLM providers (Gemini, OpenAI), file attachments, and user authentication.

## Features

- Next.js 14+ App Router
- TypeScript & ESLint integration
- User authentication with NextAuth
- Chat with LLMs (Gemini, OpenAI)
- File attachment support
- Prisma ORM with PostgreSQL (or other supported DBs)
- Tailwind CSS for styling
- Modular, scalable codebase

---
## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/plus-ai.git
cd plus-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and set the following variables:

- `DATABASE_URL` (Prisma DB connection string)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY` (for OpenAI integration)
- `GOOGLE_API_KEY` (for Gemini integration, if used)
- Any other required keys as per `.env.example`

### 4. Set Up the Database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev
```

(Optional) Generate Prisma client:

```bash
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `app/` - Next.js app directory (routes, API, pages)
- `components/` - Reusable React components
- `libs/` - Utility libraries (auth, helpers, etc.)
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets
- `types/` - TypeScript types

---

## Linting & Formatting

Run ESLint:

```bash
npm run lint
```

---

## Deployment

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or your preferred platform.

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request describing your changes.

**Guidelines:**

- Write clear, concise commit messages.
- Follow the existing code style and structure.
- Add tests for new features when possible.
- Ensure the app builds and passes linting before submitting.

---

## License

This project is licensed under the MIT License.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth Documentation](https://next-auth.js.org/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
