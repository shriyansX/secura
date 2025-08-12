# Secura 🔐
A modern, open-source password manager built with **Next.js 15**, **TypeScript**, **Tailwind CSS** and **Clerk** authentication.

![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

[🌐 **Live Demo**](https://secura-ten.vercel.app/)

Secura lets you create, store and autofill strong passwords—fully encrypted, accessible from anywhere.

## 🚀 Features

* **End-to-end encryption** – AES-256 + PBKDF2-HMAC-SHA512
* **Clerk authentication** – social login and magic links
* **Password generator** – custom length, charset & entropy meter
* **Secure notes & cards** – store recovery codes, credit cards, TOTP seeds
* **Responsive UI** – dark mode, keyboard shortcuts

## 🛠️ Tech Stack

| Category | Tech |
| -------- | ---- |
| Front-end | Next.js 15 (App Router), React 19, TypeScript |
| Styling & UI | Tailwind CSS 4, Radix UI, [Shadcn UI](https://ui.shadcn.com/), clsx |
| Auth | Clerk |
| Form & Validation | React-Hook-Form, Zod |
| State Management | React Context / useReducer |
| Testing | Vitest, React Testing Library |
| Deployment | Vercel |

## 📂 Folder Structure

```text
secura/
├─ app/              # Next.js routes
│  ├─ api/           # Edge functions
│  └─ (components)   # Page components
├─ components/       # Reusable UI components
├─ lib/              # Utility helpers & context
├─ public/           # Static assets
├─ styles/           # Global styles
└─ tests/            # Unit & integration tests
```

## ⚙️ Environment Variables

To run this application, you need to set up the following environment variables:

### Required Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### Getting Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Go to API Keys section
4. Copy your Publishable Key and Secret Key
5. Add them to your environment variables

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the required environment variables
4. Redeploy your application

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🧑‍💻 Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

Make sure to run `pnpm test` before submitting.

## 📜 License

MIT © 2025 [Shriyans Mukherjee].

---

> Built with ❤️ & ☕ by Shriyans Mukherjee


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
