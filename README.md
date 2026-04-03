# auth_visualizer

auth_visualizer is a learning-focused tool for visualizing authentication flows in a realistic system setup. It uses an actual client/server/database architecture and models secured endpoints as they would exist in production in principle.

What makes this project special is flow introspection: every authentication flow can be intercepted, paused, and resumed step by step, while exposing internal state and intermediate data. This makes it possible to study how each flow works without reducing it to a toy example.

## Scripts

- `npm run dev` - Run the server package in development mode.
- `npm run dev:wstest` - Run the websocket client test package.
- `npm run build` - Build common, server, and client packages.
- `npm start` - Run the built server package.
- `npm run lint` - Run linting across all workspaces.

## Project Structure

- `packages/common` - Shared auth flow contracts and spy session types.
- `packages/server` - Express server, middleware, resources, and database code.
- `packages/client` - Client-side websocket testing harness.
- `tsconfig.base.json` - Shared TypeScript compiler options.
- `tsconfig.json` - Workspace TypeScript project references.
