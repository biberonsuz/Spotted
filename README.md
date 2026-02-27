## Spotted – Frontend & Backend

This project is a React + TypeScript + Vite frontend for exploring charity shops in London, plus a Node.js + Express + PostgreSQL backend that provides real shop data and basic authentication.

### Project structure

- **Frontend**:
  - `frontend/` – Vite React app.
  - `frontend/src/` – views, UI components, hooks, and data.
  - `frontend/src/data/shops.json` – seed data for shops (loaded into the database by the backend).
  - `frontend/src/api/` – API client modules for talking to the backend.
  - `frontend/src/context/` – `AuthContext` and `VisitedShopsContext` for auth and per-user visited shops.
- **Backend**:
  - `backend/` – Node.js + Express + Prisma server.
  - `backend/prisma/schema.prisma` – database schema for `Shop`, `User`, and `VisitedShop`.
  - `backend/prisma/seed.ts` – seeds the `Shop` table from `frontend/src/data/shops.json`.
  - `backend/src/` – Express app, routes, and helpers.

### Environment variables

#### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend/` folder (alongside its `package.json`) with:

- `VITE_MAPBOX_TOKEN` – your Mapbox access token for the map views.
- `VITE_API_BASE_URL` – base URL of the backend API (e.g. `http://localhost:4000`).

#### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and adjust:

- `PORT` – API port (default `4000`).
- `DATABASE_URL` – PostgreSQL connection string (database must exist).
- `JWT_SECRET` – a long random string for signing JWTs.

### Running the backend

1. **Install backend dependencies** (already done if you ran `npm install` in `backend/`):

   ```bash
   cd backend
   npm install
   ```

2. **Ensure PostgreSQL is running** and that the database in `DATABASE_URL` exists (e.g. `spotted_app`).

3. **Run Prisma migrations** to create tables:

   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client** (if needed):

   ```bash
   npx prisma generate
   ```

5. **Seed the database** with shops from `src/data/shops.json`:

   ```bash
   npx prisma db seed
   ```

6. **Start the backend server**:

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:4000` (or the `PORT` you set).

### Running the frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will start (by default on `http://localhost:5173`). Make sure:

- `VITE_API_BASE_URL` points to your running backend (e.g. `http://localhost:4000`).
- `VITE_MAPBOX_TOKEN` is correctly set.

### API overview

- **Shops**
  - `GET /shops` – list all shops.
  - `GET /shops/:id` – get a single shop.
- **Auth**
  - `POST /auth/register` – `{ name, email, password }` → returns `{ user, token }`.
  - `POST /auth/login` – `{ email, password }` → returns `{ user, token }`.
- **Current user** (authenticated with `Authorization: Bearer <token>`)
  - `GET /me` – returns the authenticated user’s profile (`id`, `email`, `name`, `createdAt`). Used to validate the token on app load and to refresh user data.
- **Visited shops** (authenticated with `Authorization: Bearer <token>`)
  - `GET /me/visited-shops` – list shops the current user has marked as visited.
  - `POST /me/visited-shops/:shopId/toggle` – toggle visited state for a given shop.

### Manual testing (auth and app gating)

1. **Logged out**
   - Open `http://localhost:5173/`. You should see the marketing landing page (hero, “Get started”, “Login”).
   - In the address bar, go to `http://localhost:5173/app`, `http://localhost:5173/app/map`, or `http://localhost:5173/app/profile`. You should be redirected to `/` (marketing). The app (Home, Map, Profile) should not be visible.

2. **Register**
   - From `/`, click **Register** (or “Get started for free”). Fill in name, email, password, confirm password and submit.
   - You should be taken to `/app` (Home) with the bottom nav (Home, Map, Profile) and header showing your name and **Logout**. No Login/Register buttons.

3. **Logout**
   - Click **Logout** in the header. You should end up on `/` (marketing). Visiting `/app` again should redirect you back to `/`.

4. **Login**
   - From `/`, click **Login** (or “I already have an account”). Enter the same email and password, submit.
   - You should land on `/app` with the same authenticated UI.

5. **Protected API**
   - While logged out, open DevTools → Network. Try visiting `/app` (you’ll be redirected). Then log in and use the app: requests to `/me` and `/me/visited-shops` should include `Authorization: Bearer <token>` and return 200. After logging out, if you had a tab open on `/app`, a refresh would send requests without a valid token and the backend should return 401 for `/me/*`; the frontend should then show the marketing page once you’re redirected after token validation on load.

