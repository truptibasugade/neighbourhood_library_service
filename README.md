# Neighbourhood Library Service

A small web app for library staff to manage books, members, and lending
(borrow/return) operations.

- **Backend**: Python, Django + Django REST Framework, PostgreSQL
- **Frontend**: React (Create React App) + TypeScript, MobX, Material UI
- **API**: REST

## Project structure

```
neighbourhood_library_service/
├── backend/                 Django project
│   ├── apps/
│   │   ├── books/            Book model, admin, serializer, viewset, urls, tests
│   │   ├── members/           Member model, admin, serializer, viewset, urls, tests
│   │   └── loans/              Loan model, admin, serializer, viewset, urls, tests
│   ├── config/                 settings, root urls, wsgi/asgi
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 React app
│   └── src/
│       ├── components/        UI components, grouped by feature (books/, members/, loans/, layout/)
│       ├── routes/             route definitions (index.tsx) and nav menu config (config.tsx)
│       ├── store/               MobX stores (one per domain) + the API request wrapper
│       ├── view-models/         typed domain models + factories for API responses
│       ├── contexts.tsx         instantiates stores, exposes them via React context
│       └── hooks-use-stores.tsx  useStores() hook to consume the context
├── sample_client.py            example script exercising the full API flow
└── README.md
```

## Database schema

- **Book** — title-level metadata (isbn, title, author, genre, publisher, published_year)
  plus `total_copies` / `available_copies` for inventory tracking.
- **Member** — first/last name, email (unique), phone, address, membership date,
  status (`active` / `suspended`).
- **Loan** — links a `Book` and a `Member`, with `borrowed_at`, `due_date`
  (14 days from borrow), `returned_at`, and `status` (`borrowed` / `returned`).

Borrowing decrements `Book.available_copies`; returning increments it back.
Both operations run inside a DB transaction with `select_for_update()` to avoid
race conditions if two staff members act on the same book at once.

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (see step-by-step install below if you don't have it yet)

## 1. Database setup

This is a one-time setup: install PostgreSQL if needed, then create one
database and one user for this app.

### 1a. Install PostgreSQL (skip if already installed)

- **Windows**: download the installer from
  [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
  and run it (or `winget install PostgreSQL.PostgreSQL.16`). It will ask you
  to set a password for the `postgres` superuser during install — remember
  it, you'll need it in the next step.
- **macOS**: `brew install postgresql@16 && brew services start postgresql@16`
- **Linux (Debian/Ubuntu)**: `sudo apt install postgresql && sudo systemctl start postgresql`

### 1b. Create the app's database and user

Open a terminal and connect to PostgreSQL as the superuser:

```bash
psql -U postgres
```

> On Windows, if `psql` isn't recognized, either add PostgreSQL's `bin`
> folder to your PATH (e.g. `C:\Program Files\PostgreSQL\16\bin`), or open
> the **SQL Shell (psql)** app installed alongside PostgreSQL instead. It
> will prompt for the `postgres` password you set during install.

Once connected, run these commands one at a time (each ends with `;`):

```sql
CREATE USER library_user WITH PASSWORD 'library_password';
CREATE DATABASE library_service OWNER library_user;
GRANT ALL PRIVILEGES ON DATABASE library_service TO library_user;
ALTER USER library_user CREATEDB;
```

(The last line lets `library_user` create the throwaway test database used
by `python manage.py test` — see below.)

Then exit:

```sql
\q
```

The backend's `backend/.env.example` already has matching values
(`POSTGRES_DB=library_service`, `POSTGRES_USER=library_user`, etc.), so as
long as you used the same name/password above, no further configuration is
needed.

### 1c. Verify it worked (optional)

```bash
psql -U library_user -d library_service -h localhost
```

If it asks for the password (`library_password`) and then drops you into a
`library_service=>` prompt, the database is ready. Type `\q` to exit.

## 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash; use .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env             # defaults already match the DB setup above
python manage.py migrate
python manage.py runserver 8000
```

The API is now available at `http://localhost:8000/api/`.

- Django admin (optional, for quick data inspection): run
  `python manage.py createsuperuser`, then visit `http://localhost:8000/admin/`

### Environment variables (`backend/.env`)

| Variable | Default | Purpose |
|---|---|---|
| `DJANGO_SECRET_KEY` | dev key | Django secret key |
| `DJANGO_DEBUG` | `True` | Debug mode |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Allowed hosts |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | `library_service` / `library_user` / `library_password` | DB connection |
| `POSTGRES_HOST` / `POSTGRES_PORT` | `localhost` / `5432` | DB connection |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Allowed frontend origin |

### Running backend tests

```bash
cd backend
python manage.py test apps
```

Covers, among other things: rejecting `available_copies > total_copies`,
duplicate ISBN/email, borrowing a book with zero copies left, borrowing as a
suspended member, double-returning a loan, and the overdue-loans filter.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env    # or just rely on the default in src/env-config.ts
npm start
```

The app runs at `http://localhost:3000` and talks to the backend at
`http://localhost:8000/api` (override via `REACT_APP_API_BASE_URL`).

## 4. Trying it out

- **Sample client script** — exercises the full flow (create book, create
  member, borrow, attempt a second borrow with no copies left, list a
  member's loans, return, attempt a double return):

  ```bash
  # with the backend running and the backend venv activated
  python sample_client.py
  ```

- **Manual API calls**, e.g.:

  ```bash
  curl -X POST http://localhost:8000/api/books/ -H "Content-Type: application/json" \
    -d '{"isbn":"978-0141439518","title":"Pride and Prejudice","author":"Jane Austen","total_copies":2}'

  curl -X POST http://localhost:8000/api/loans/ -H "Content-Type: application/json" \
    -d '{"book": 1, "member": 1}'

  curl -X POST http://localhost:8000/api/loans/1/return_book/
  ```

- **Frontend** — open `http://localhost:3000`, use the nav to manage Books,
  Members, and Loans (borrowing/returning) through the UI.

## API reference

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/api/books/` | List/search books, create a book |
| GET/PATCH/DELETE | `/api/books/{id}/` | Retrieve/update/delete a book |
| GET/POST | `/api/members/` | List/search members, create a member |
| GET/PATCH/DELETE | `/api/members/{id}/` | Retrieve/update/delete a member |
| GET/POST | `/api/loans/` | List loans (filter by `?book=`, `?member=`, `?status=`), borrow a book |
| GET | `/api/loans/{id}/` | Retrieve a loan |
| POST | `/api/loans/{id}/return_book/` | Return a borrowed book |
| GET | `/api/loans/overdue/` | List loans past their due date and not yet returned |

Borrowing rejects (400) if the book has no available copies or the member is
suspended. Returning rejects (400) if the loan was already returned.
