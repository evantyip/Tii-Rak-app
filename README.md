# Tii Rak

A relationship app for partners to keep in touch with each other during the busy days of today

# Tech Stack

- Frontend [Svelte Kit](https://kit.svelte.dev/docs/introduction)
- Backend [Pocketbase](https://github.com/pocketbase/pocketbase)

## Developing

1. Download [pocketbase](https://github.com/pocketbase/pocketbase/releases) release

2. Download repo and create local env file with the following keys

```bash
PUBLIC_POCKETBASE_URL='http://127.0.0.1:8090'
PUBLIC_ENVIRONMENT='development'
```

3. Start Svelte Kit development server

```bash
npm install

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

4. CD into folder containing pocketbase executable and start pocketbase server

```bash
cd {path to pocketbase} && ./pocketbase serve
```

## Building Svelte Kit

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

# Deployment

Currently using fly.io to deploy pocketbase instance with storage for DB. Vercel is used for Svelte Kit deployment
