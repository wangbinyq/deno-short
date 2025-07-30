# Environment Variables

This project supports the following environment variables:

## Required

- `DASHBOARD_ACCESS_CODE` - Access code to view the admin dashboard

## Optional

- `DENO_KV_URL` - Remote Deno KV URL for remote database connection

## Usage Examples

### Local Development

For local development, you don't need to set any environment variables:

```bash
deno task start
```

### Remote KV Database

To use a remote Deno KV database, set the `DENO_KV_URL` environment variable:

```bash
DENO_KV_URL=https://api.deno.com/databases/YOUR_DATABASE_ID/connect deno task start
```

You may also need to set the `DENO_KV_ACCESS_TOKEN` environment variable for
authentication:

```bash
DENO_KV_URL=https://api.deno.com/databases/YOUR_DATABASE_ID/connect DENO_KV_ACCESS_TOKEN=your_access_token deno task start
```

### Using .env file

You can also create a `.env` file in the project root:

```env
DENO_KV_URL=https://api.deno.com/databases/YOUR_DATABASE_ID/connect
DENO_KV_ACCESS_TOKEN=your_access_token
DASHBOARD_ACCESS_CODE=your_dashboard_access_code
```
