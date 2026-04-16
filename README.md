# auth_visualizer

auth_visualizer is a learning-focused tool for visualizing authentication flows in a realistic system setup. It uses an actual client/server/database architecture and models secured endpoints as they would exist in production in principle.

What makes this project special is flow introspection: every authentication flow can be intercepted, paused, and resumed step by step, while exposing internal state and intermediate data. This makes it possible to study how each flow works without reducing it to a toy example.

## Project Structure

- `packages/common` - Shared auth flow contracts and spy session types.
- `packages/server` - Express server, middleware, resources, and database code.
- `packages/client` - React client to select and inspect auth flows.
- `tsconfig.base.json` - Shared TypeScript compiler options.
- `tsconfig.json` - Workspace TypeScript project references.

## Scripts

- `npm run dev` - Run the specified package in development mode.
- `npm run build` - Build common, server, and client packages, copy build client to server.
- `npm run artifact:build` - Build the app and stage a runnable runtime artifact in `artifacts/runtime`.
- `npm start` - Run the built server package.
- `npm run lint` - Run linting across all workspaces.

## Run On Another Machine

1. Download and extract the release from the Releases page.
2. In the extracted folder, create a `.env.production` file in the root.
3. Start the server from the artifact root:
   - `node --env-file=.env.production packages/server/dist/index.js`
