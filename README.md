This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Neptune Integration

This project is designed to work with Neptune as a backend solution. Below are some important configurations needed to ensure seamless integration.

### API Proxy Configuration (CORS Handling)

When developing locally, CORS can be an obstacle due to the API being hosted on a different domain than the website. To bypass this, the development server is used as a proxy for all API requests. This can be set up in `next.config.ts` as follows:

```ts
const nextConfig = (phase: string): NextConfig => {
  return {
    ...
    rewrites:
      phase === PHASE_DEVELOPMENT_SERVER
        ? async () => {
            return [
              {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
              },
            ];
          }
        : undefined,
    ...
  };
};
```

This configuration uses the `NEXT_PUBLIC_API_BASE_URL` environment variable to determine the API base URL. This variable should be set in `.env`, for example:

```
NEXT_PUBLIC_API_BASE_URL="https://pheno-dev.neptune-software.cloud"
```

### Base Path Configuration

Neptune websites are usually deployed on a URL with a base path, for example:
`https://pheno-dev.neptune-software.cloud/webapp/app-name`.
To ensure proper routing in production, modify the `basePath` property in `next.config.ts`:

```ts
const nextConfig = (phase: string): NextConfig => {
  return {
    ...
    basePath: phase === PHASE_PRODUCTION_BUILD ? "/webapp/app-name" : undefined,
    ...
  };
};
```

### Authentication Setup

Neptune uses Basic Auth for authentication. If your Neptune website is protected behind a login, ensure that a username and password are sent with every request when querying the API during local development. In production, this should be automatically included by the browser if the user is already logged in. Example:

```ts
const username = process.env.NEXT_PUBLIC_NEPTUNE_USERNAME;
const password = process.env.NEXT_PUBLIC_NEPTUNE_PASSWORD;
const headers = new Headers();
if (username && password) {
  headers.set("Authorization", "Basic " + btoa(username + ":" + password));
}
const result = await fetch(url, { headers });
```

Store these credentials in `.env.local`, ensuring they are not included in `.env`, which would expose them in production.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Neptune

- Build your project ( npm run build )
- Log in to the Neptune WebApp Admin and select tour webapp
- Click Upload the click Select Folder
- Select your projects out folder (generated with npm run build)
- Upload folder
- When list of files appears select index.html as startup file and then click upload
- All set! Click the run button to see your page :)
