# News Detail Page Implementation Plan (Dynamic DB Flow)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a 100% dynamic news detail page (`/tin-tuc/$slug`) that reads data exclusively from the database (Supabase table `news_posts` or `localStorage` `mock_news` in Mock Mode). Allow the Admin Dashboard to write to the database and have the changes reflect immediately in the public listing and detail views.

**Architecture:**
1. **Listing Page (`/tin-tuc`)**: Fetches all published posts from Supabase or LocalStorage.
2. **Detail Page (`/tin-tuc/$slug`)**: Fetches a single post by matching the `slug` route parameter in the database. Renders headings, tables, list items, and paragraphs dynamically.
3. **Admin Dashboard (`/admin`)**: Adds a "View" button for published posts to test the flow.

**Tech Stack:** React, TanStack Start/Router, Lucide Icons, Shadcn UI components, Tailwind CSS.

---

### Task 1: Update News Listing Page (/tin-tuc) to Fetch dynamically from Database
Update `/tin-tuc.tsx` to remove hardcoded article listings and instead retrieve posts dynamically from Supabase `news_posts` (or LocalStorage `mock_news` if in mock mode).

**Files:**
- Modify: `src/routes/tin-tuc.tsx`

- [ ] **Step 1: Implement Dynamic Loading state in NewsPage**
  Use React hooks to fetch posts. Check whether mock mode is enabled via the Admin panel configurations.

- [ ] **Step 2: Update News list items rendering**
  Link the cards to `/tin-tuc/$slug` dynamically.

- [ ] **Step 3: Update highlights & most-viewed widgets dynamically**
  Bind widgets to map from `posts` state.

- [ ] **Step 4: Update the layout structure rendering in NewsPage**
  Hook everything together.

---

### Task 2: Create Dynamic News Detail Page Route (/tin-tuc/$slug)
Create a new dynamic route `/tin-tuc/$slug` that reads a single article directly from the database by matching the slug.

**Files:**
- Create: `src/routes/tin-tuc.$slug.tsx`

- [ ] **Step 1: Create `src/routes/tin-tuc.$slug.tsx`**
  Write the dynamic detail route. Make sure it fetches from the Database (Supabase or LocalStorage mock) using the slug route parameter.

---

### Task 3: Update Admin Dashboard news view link
Modify `/admin` to add a "View" button in the news posts table/list to check published news articles directly.

**Files:**
- Modify: `src/routes/admin.tsx`

- [ ] **Step 1: Add eye button to route to news detail**
  Locate the news posts list rendering and add the view action button.

---

### Task 4: Compilation and Verification
Verify that the project compiles with no issues and runs perfectly.

- [ ] **Step 1: Compile Check**
  Run: `npm run build`
  Expected: Builds correctly.
