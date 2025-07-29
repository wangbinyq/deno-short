# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a short link service built with Deno, Deno KV, and Deno Fresh. The
service allows users to create short URLs that redirect to longer URLs, with a
dashboard for managing links.

## Commands

### Development

- `deno task start` - Start the development server with hot reloading
- `deno task build` - Build the project for production
- `deno task preview` - Preview the production build

### Code Quality

- `deno task check` - Run formatting, linting, and type checking

## Project Structure

- `routes/` - Contains all the HTTP routes
  - `index.tsx` - Main page for creating short links
  - `s/[id].tsx` - Route for handling short link redirection
  - `dashboard/index.tsx` - Admin dashboard for managing links
- `services/` - Contains business logic
  - `linkService.ts` - Service for managing links with Deno KV
- `components/` - Reusable UI components
- `islands/` - Interactive client-side components

## Key Features

1. **Short Link Generation**: Users can create short links by submitting URLs on
   the homepage
2. **Link Redirection**: Short links redirect to their original URLs with click
   tracking
3. **Dashboard**: Admin dashboard to view and manage all links, protected by
   access code
4. **Data Storage**: Uses Deno KV for persistent storage of links

## Environment Variables

- `DASHBOARD_ACCESS_CODE` - Required access code to view the admin dashboard

## Implementation Details

- Links are stored in Deno KV with the key structure `["links", id]`
- Short IDs are generated using random alphanumeric characters
- Click counts are incremented each time a short link is accessed
- The dashboard requires an access code parameter to view (`?accesscode=CODE`)
