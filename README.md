# Team Task Manager — Python Backend (FastAPI + MongoDB)

Minimal FastAPI backend with JWT auth, password hashing, and basic role-based access.

## Folder structure

```
backend_ethara/
├── main.py            # FastAPI app + routes
├── auth.py            # JWT + password hashing + dependencies
├── database.py        # Mongo (motor) connection
├── models.py          # Pydantic schemas
├── requirements.txt
└── .env               # copy from .env.example
```

## Setup

1. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   venv\Scripts\activate          # Windows
   # source venv/bin/activate     # macOS / Linux
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file from `.env.example`:
   ```
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=team_task_manager
   JWT_SECRET=your_super_secret_key_change_me
   JWT_ALGO=HS256
   JWT_EXPIRE_MINUTES=10080
   ```

4. Run the server:
   ```
   uvicorn main:app --reload
   ```

   API will be available at `http://localhost:8000`.
   Interactive docs: `http://localhost:8000/docs`.

## Endpoints

| Method | Path           | Auth        | Body                                                              |
|--------|----------------|-------------|-------------------------------------------------------------------|
| POST   | /signup        | public      | `{ name, email, password, role? }`                                |
| POST   | /login         | public      | `{ email, password }`                                             |
| POST   | /task          | admin only  | `{ title, description?, assignedTo, status?, deadline? }`         |
| GET    | /tasks         | any user    | admins see all, members see only tasks assigned to them           |
| PUT    | /task/{id}     | any user    | admins can doc = payload.dict()anything; members can only change `status`      |

Auth header: `Authorization: Bearer <token>`.
Status values: `pending`, `in-progress`, `done`.

## Quick test

```bash
# Signup as admin
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"secret123\",\"role\":\"admin\"}"

# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"secret123\"}"

# Create task (replace TOKEN)
curl -X POST http://localhost:8000/task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d "{\"title\":\"Write docs\",\"assignedTo\":\"alice@example.com\"}"

# List tasks
curl http://localhost:8000/tasks -H "Authorization: Bearer TOKEN"

# doc = payload.dict()status
curl -X PUT http://localhost:8000/task/<TASK_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d "{\"status\":\"done\"}"
```
