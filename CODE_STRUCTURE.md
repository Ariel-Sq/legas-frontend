# Code Structure Documentation

This document outlines the standard code structure and patterns we follow in our Next.js application for handling data fetching, mutations, and UI interactions.

## Overview

Our application follows a layered architecture that separates concerns between server-side data operations, server components for initial rendering, and client components for interactivity. This pattern leverages Next.js App Router features including Server Actions, Server Components, and Client Components with optimistic updates.

## Architecture Layers

### 1. Server Actions (`lib/` directory)

Server Actions are asynchronous functions marked with `'use server'` that run on the server. They handle all data mutations and business logic.

**Location:** `lib/*.ts`
**Key Features:**

- Marked with `'use server'` directive
- Handle API calls, database operations, and business logic
- Can be called from Server Components and Client Components
- Support for error handling and validation

**Example:**

```typescript
// lib/users.ts
'use server';

export async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function addUser(name: string) {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}
```

### 2. Server Components (`app/` directory)

Server Components run on the server and are responsible for initial data fetching and rendering static content. They pass data as props to Client Components.

**Location:** `app/*.tsx` (page components)
**Key Features:**

- Run on server by default
- Can call Server Actions directly
- Pass initial data as props to Client Components
- Cannot use browser APIs or event handlers

**Example:**

```typescript
// app/page.tsx
import { getUsers } from '@/lib/users'
import { ClientList } from './ClientList'

export default async function Page() {
  const users = await getUsers()
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <ClientList users={users} />
    </main>
  )
}
```

### 3. Client Components (`app/` or `components/` directory)

Client Components handle user interactions, state management, and optimistic updates. They use React hooks for interactivity.

**Location:** `app/*.tsx` or `components/*.tsx`
**Key Features:**

- Marked with `'use client'` directive
- Use React hooks (useState, useOptimistic, useTransition)
- Handle user interactions and form submissions
- Implement optimistic UI updates

**Example:**

```typescript
// app/ClientList.tsx
'use client'

import { addUser } from '@/lib/users'
import { useState, useOptimistic, useTransition } from 'react'

type User = {
  id: number
  name: string
}

export function ClientList({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [optimisticUsers, addOptimisticUser] = useOptimistic(
    users,
    (state, newName: string) => [
      ...state,
      { id: Date.now(), name: newName }
    ]
  )
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleAdd = async (formData: FormData) => {
    const name = formData.get('name') as string
    if (!name.trim()) return

    startTransition(async () => {
      addOptimisticUser(name)
      setError('')

      try {
        const newUser = await addUser(name)
        setUsers([...users, newUser])
      } catch (err) {
        setError('Failed to add user. Please try again.')
        console.error(err)
      }
    })
  }

  return (
    <div>
      <form action={handleAdd} className="mb-6 flex gap-2">
        <input
          name="name"
          placeholder="Enter name..."
          required
          disabled={isPending}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isPending ? 'Adding...' : 'Add User'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <ul className="space-y-2">
        {optimisticUsers.map((user) => (
          <li
            key={user.id}
            className="border p-3 rounded hover:bg-gray-50"
          >
            {user.name}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-gray-500">
        Total: {optimisticUsers.length} users
      </p>
    </div>
  )
}
```

## Data Flow

1. **Initial Load:**
   - Server Component calls Server Action to fetch initial data
   - Data is passed as props to Client Component
   - Client Component initializes state with server data

2. **User Interaction:**
   - User triggers action (form submission, button click)
   - `useTransition` wraps the async operation
   - `useOptimistic` immediately updates UI with predicted state
   - Server Action executes on server
   - On success: Real data updates state, optimistic update is replaced
   - On failure: Error is shown, optimistic update is automatically reverted

## Key Patterns Used

### Optimistic Updates

- `useOptimistic` provides instant UI feedback
- Updates are automatically reverted on errors
- Improves perceived performance

### Pending States

- `useTransition` prevents UI blocking during async operations
- Provides loading indicators and disables interactions
- Maintains responsive user experience

### Error Handling

- Try/catch blocks in async operations
- User-friendly error messages
- Automatic rollback of optimistic updates

### TypeScript Integration

- End-to-end type safety
- Shared types between server and client
- Compile-time error checking

## Advantages

- **Performance:** Server-side rendering for initial load, optimistic updates for interactions
- **User Experience:** Instant feedback, loading states, error handling
- **Developer Experience:** Type safety, clear separation of concerns, no API routes needed
- **Maintainability:** Modular structure, reusable Server Actions
- **Scalability:** Server Actions can be used across multiple components

## Best Practices

1. **Server Actions:**
   - Keep business logic in Server Actions
   - Use descriptive function names
   - Handle errors appropriately
   - Validate input data

2. **Server Components:**
   - Use for initial data fetching only
   - Keep them simple and focused on composition
   - Pass data as props, not context

3. **Client Components:**
   - Use `'use client'` only when necessary
   - Implement optimistic updates for mutations
   - Handle loading and error states
   - Use TypeScript interfaces for props

4. **State Management:**
   - Use `useState` for server-synced data
   - Use `useOptimistic` for predicted state changes
   - Use `useTransition` for non-blocking updates

5. **File Organization:**
   - Server Actions in `lib/` directory
   - Page components in `app/` directory
   - Shared components in `components/` directory
   - Utility functions in `lib/utils.ts`

## File Structure Summary

```
├── lib/
│   └── *.ts          # Server Actions with 'use server'
├── app/
│   ├── *.tsx         # Server Components (pages)
│   └── *-client.tsx  # Client Components
└── components/
    └── *.tsx         # Reusable components
```
