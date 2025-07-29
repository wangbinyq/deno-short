# Short Link Service

A simple short link service built with Deno, Deno KV, and Deno Fresh.

## Features

- Create short links for long URLs
- Track click counts for each short link
- Admin dashboard for managing links (protected by access code)
- Built-in redirection service

## Tech Stack

- [Deno](https://deno.land/)
- [Deno KV](https://deno.land/manual/runtime/kv) for data storage
- [Fresh](https://fresh.deno.dev/) web framework

## Getting Started

1. Install Deno (version 1.35 or later)
2. Clone this repository
3. Create a `.env` file based on `.env.example`:
   ```
   DASHBOARD_ACCESS_CODE=your_secret_access_code
   ```
4. Run the development server:
   ```bash
   deno task start
   ```

## Usage

### Creating Short Links

1. Visit the homepage (`http://localhost:8000`)
2. Enter a URL in the form and submit
3. Copy the generated short link

### Accessing the Dashboard

1. Visit `/dashboard?accesscode=YOUR_ACCESS_CODE`
2. View all created links and their click counts
3. Delete links as needed

## Project Structure

```
├── routes/
│   ├── index.tsx          # Homepage for creating short links
│   ├── s/[id].tsx         # Short link redirection
│   └── dashboard/index.tsx # Admin dashboard
├── services/
│   └── linkService.ts     # Link management with Deno KV
├── components/            # UI components
└── islands/               # Interactive components
```

## Commands

- `deno task start` - Start development server
- `deno task build` - Build for production
- `deno task preview` - Preview production build
- `deno task check` - Run formatting, linting, and type checking

## Environment Variables

- `DASHBOARD_ACCESS_CODE` - Access code for the admin dashboard