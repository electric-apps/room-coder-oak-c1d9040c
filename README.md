# Todos

A real-time todo app built with Electric SQL + TanStack DB. Add, complete, and delete todos with instant optimistic updates synced across all connected clients.

![Screenshot placeholder](https://via.placeholder.com/800x400?text=Todo+App+Screenshot)

## Features

- Add todos with a title
- Mark todos as complete/incomplete
- Delete individual todos
- Clear all completed todos at once
- Real-time sync across browser tabs and devices (via Electric SQL)
- Optimistic UI updates — changes feel instant

## How to Run

```bash
pnpm install
pnpm dev:start
```

The app runs at `http://localhost:5173`.

## Tech Stack

- **Electric SQL** — Postgres-to-client real-time sync
- **TanStack DB** — Reactive collections and live queries
- **Drizzle ORM** — Schema definition and migrations
- **TanStack Start** — React meta-framework with SSR
- **Radix UI Themes** — Accessible component library
