import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional, List

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from auth import create_token, get_current_user, hash_password, verify_password
from database import (
    init_indexes,
    projects_collection,
    tasks_collection,
    users_collection,
)
from models import (
    ProjectCreate,
    ProjectMemberAdd,
    ProjectOut,
    TaskCreate,
    TaskOut,
    TaskUpdate,
    TokenResponse,
    UserLogin,
    UserOut,
    UserSignup,
)

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_indexes()
    yield


app = FastAPI(title="Team Task Manager", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- helpers ----------

def parse_object_id(value: str, label: str = "id") -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid {label}")


async def fetch_users_map(user_oids: list) -> dict:
    out: dict = {}
    if not user_oids:
        return out
    async for u in users_collection.find(
        {"_id": {"$in": list(set(user_oids))}},
        {"name": 1, "email": 1},
    ):
        out[u["_id"]] = {"id": str(u["_id"]), "name": u["name"], "email": u["email"]}
    return out


async def resolve_user_id(value: str) -> ObjectId:
    if not value:
        raise HTTPException(status_code=400, detail="User reference is empty")
    try:
        oid = ObjectId(value)
        if await users_collection.find_one({"_id": oid}, {"_id": 1}):
            return oid
    except (InvalidId, TypeError):
        pass
    user = await users_collection.find_one({"email": value.lower()}, {"_id": 1})
    if user:
        return user["_id"]
    raise HTTPException(status_code=404, detail=f"User '{value}' not found")


async def serialize_project(doc: dict) -> dict:
    member_oids = list(doc.get("members", []))
    creator_oid = doc.get("createdBy")
    user_map = await fetch_users_map(member_oids + ([creator_oid] if creator_oid else []))
    creator = user_map.get(creator_oid, {})
    members = [
        user_map.get(mid, {"id": str(mid), "name": None, "email": None})
        for mid in member_oids
    ]
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "description": doc.get("description", ""),
        "createdBy": creator.get("id"),
        "adminId": creator.get("id"),
        "adminEmail": creator.get("email"),
        "adminName": creator.get("name"),
        "members": members,
        "createdAt": doc.get("createdAt"),
    }


def serialize_task_basic(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "projectId": str(doc["projectId"]),
        "title": doc["title"],
        "description": doc.get("description", ""),
        "assignedTo": str(doc["assignedTo"]) if doc.get("assignedTo") else None,
        "assignedToEmail": None,
        "assignedToName": None,
        "status": doc.get("status", "todo"),
        "priority": doc.get("priority", "medium"),
        "dueDate": doc.get("dueDate"),
        "createdBy": str(doc["createdBy"]),
        "createdAt": doc.get("createdAt"),
    }


async def serialize_tasks(docs: list) -> list:
    user_oids = [d["assignedTo"] for d in docs if d.get("assignedTo")]
    user_map = await fetch_users_map(user_oids) if user_oids else {}
    out = []
    for d in docs:
        s = serialize_task_basic(d)
        u = user_map.get(d.get("assignedTo"))
        if u:
            s["assignedToEmail"] = u.get("email")
            s["assignedToName"] = u.get("name")
        out.append(s)
    return out


async def serialize_task(doc: dict) -> dict:
    result = await serialize_tasks([doc])
    return result[0]


async def get_project_or_404(project_id: str) -> dict:
    oid = parse_object_id(project_id, "project id")
    project = await projects_collection.find_one({"_id": oid})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def is_project_admin(project: dict, user_id: str) -> bool:
    return str(project["createdBy"]) == user_id


def is_project_member(project: dict, user_id: str) -> bool:
    if is_project_admin(project, user_id):
        return True
    return user_id in [str(m) for m in project.get("members", [])]


def dump(model) -> dict:
    return model.model_dump(exclude_unset=True) if hasattr(model, "model_dump") else model.dict(exclude_unset=True)


@app.get("/")
async def root():
    return {"message": "Team Task Manager API is running"}


# ---------- AUTH ----------

@app.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(payload: UserSignup):
    email = payload.email.lower()
    if await users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already in use")

    user_doc = {
        "name": payload.name,
        "email": email,
        "password": hash_password(payload.password),
        "role": payload.role,
        "createdAt": datetime.now(timezone.utc),
    }
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_token({"id": user_id, "email": email, "role": payload.role})
    return {
        "token": token,
        "user": UserOut(id=user_id, name=payload.name, email=email, role=payload.role),
    }


@app.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    email = payload.email.lower()
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user_id = str(user["_id"])
    token = create_token({"id": user_id, "email": email, "role": user["role"]})
    return {
        "token": token,
        "user": UserOut(id=user_id, name=user["name"], email=email, role=user["role"]),
    }


# ---------- PROJECTS ----------

@app.post("/project", response_model=ProjectOut, status_code=201)
async def create_project(
    payload: ProjectCreate,
    user: dict = Depends(get_current_user),
):
    creator_oid = ObjectId(user["id"])
    doc = {
        "name": payload.name,
        "description": payload.description or "",
        "createdBy": creator_oid,
        "members": [creator_oid],
        "createdAt": datetime.now(timezone.utc),
    }
    result = await projects_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return await serialize_project(doc)


@app.get("/projects", response_model=List[ProjectOut])
async def list_projects(user: dict = Depends(get_current_user)):
    user_oid = ObjectId(user["id"])
    cursor = projects_collection.find(
        {"$or": [{"createdBy": user_oid}, {"members": user_oid}]}
    ).sort("createdAt", -1)
    return [await serialize_project(doc) async for doc in cursor]


@app.get("/project/{project_id}", response_model=ProjectOut)
async def get_project(project_id: str, user: dict = Depends(get_current_user)):
    project = await get_project_or_404(project_id)
    if not is_project_member(project, user["id"]):
        raise HTTPException(status_code=403, detail="Not a project member")
    return await serialize_project(project)


@app.post("/project/{project_id}/members", response_model=ProjectOut)
async def add_project_member(
    project_id: str,
    payload: ProjectMemberAdd,
    user: dict = Depends(get_current_user),
):
    project = await get_project_or_404(project_id)
    if not is_project_admin(project, user["id"]):
        raise HTTPException(status_code=403, detail="Only project admin can add members")

    member = await users_collection.find_one({"email": payload.email.lower()})
    if not member:
        raise HTTPException(status_code=404, detail="User with this email not found")

    if member["_id"] in project.get("members", []):
        raise HTTPException(status_code=400, detail="User already a member")

    await projects_collection.update_one(
        {"_id": project["_id"]},
        {"$addToSet": {"members": member["_id"]}},
    )
    project = await projects_collection.find_one({"_id": project["_id"]})
    return await serialize_project(project)


@app.delete("/project/{project_id}/members/{member_ref}", response_model=ProjectOut)
async def remove_project_member(
    project_id: str,
    member_ref: str,
    user: dict = Depends(get_current_user),
):
    project = await get_project_or_404(project_id)
    if not is_project_admin(project, user["id"]):
        raise HTTPException(status_code=403, detail="Only project admin can remove members")

    member_oid = await resolve_user_id(member_ref)
    if member_oid == project["createdBy"]:
        raise HTTPException(status_code=400, detail="Cannot remove the project admin")

    await projects_collection.update_one(
        {"_id": project["_id"]},
        {"$pull": {"members": member_oid}},
    )
    project = await projects_collection.find_one({"_id": project["_id"]})
    return await serialize_project(project)


# ---------- TASKS ----------

async def _create_task(payload: TaskCreate, project_id: str, user: dict) -> dict:
    project = await get_project_or_404(project_id)
    if not is_project_admin(project, user["id"]):
        raise HTTPException(status_code=403, detail="Only project admin can create tasks")

    assignee_oid = await resolve_user_id(payload.assignedTo)
    if assignee_oid not in project.get("members", []):
        raise HTTPException(status_code=400, detail="Assignee must be a project member")

    doc = {
        "projectId": project["_id"],
        "title": payload.title,
        "description": payload.description or "",
        "assignedTo": assignee_oid,
        "status": payload.status,
        "priority": payload.priority,
        "dueDate": payload.dueDate,
        "createdBy": ObjectId(user["id"]),
        "createdAt": datetime.now(timezone.utc),
    }
    result = await tasks_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return await serialize_task(doc)


@app.post("/task", response_model=TaskOut, status_code=201)
async def create_task(
    payload: TaskCreate,
    user: dict = Depends(get_current_user),
):
    if not payload.projectId:
        raise HTTPException(status_code=400, detail="projectId is required")
    return await _create_task(payload, payload.projectId, user)


@app.post("/project/{project_id}/task", response_model=TaskOut, status_code=201)
async def create_task_in_project(
    project_id: str,
    payload: TaskCreate,
    user: dict = Depends(get_current_user),
):
    return await _create_task(payload, project_id, user)


@app.get("/project/{project_id}/tasks", response_model=List[TaskOut])
async def list_tasks_in_project(
    project_id: str,
    user: dict = Depends(get_current_user),
):
    project = await get_project_or_404(project_id)
    if not is_project_member(project, user["id"]):
        raise HTTPException(status_code=403, detail="Not a project member")

    query: dict = {"projectId": project["_id"]}
    if not is_project_admin(project, user["id"]):
        query["assignedTo"] = ObjectId(user["id"])

    docs = [doc async for doc in tasks_collection.find(query).sort("createdAt", -1)]
    return await serialize_tasks(docs)


@app.get("/tasks", response_model=List[TaskOut])
async def list_tasks(
    project_id: Optional[str] = Query(default=None),
    user: dict = Depends(get_current_user),
):
    user_oid = ObjectId(user["id"])

    project_ids: list = []
    admin_project_ids: list = []
    async for p in projects_collection.find(
        {"$or": [{"createdBy": user_oid}, {"members": user_oid}]},
        {"_id": 1, "createdBy": 1},
    ):
        project_ids.append(p["_id"])
        if p["createdBy"] == user_oid:
            admin_project_ids.append(p["_id"])

    if not project_ids:
        return []

    if project_id:
        oid = parse_object_id(project_id, "project id")
        if oid not in project_ids:
            raise HTTPException(status_code=403, detail="Not a member of this project")
        query: dict = {"projectId": oid}
        if oid not in admin_project_ids:
            query["assignedTo"] = user_oid
    else:
        member_only_ids = [pid for pid in project_ids if pid not in admin_project_ids]
        clauses = []
        if admin_project_ids:
            clauses.append({"projectId": {"$in": admin_project_ids}})
        if member_only_ids:
            clauses.append(
                {"projectId": {"$in": member_only_ids}, "assignedTo": user_oid}
            )
        query = clauses[0] if len(clauses) == 1 else {"$or": clauses}

    docs = [doc async for doc in tasks_collection.find(query).sort("createdAt", -1)]
    return await serialize_tasks(docs)


@app.put("/task/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: str,
    payload: TaskUpdate,
    user: dict = Depends(get_current_user),
):
    oid = parse_object_id(task_id, "task id")
    task = await tasks_collection.find_one({"_id": oid})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project = await projects_collection.find_one({"_id": task["projectId"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    is_admin = is_project_admin(project, user["id"])
    is_assignee = str(task.get("assignedTo")) == user["id"]
    if not is_admin and not is_assignee:
        raise HTTPException(status_code=403, detail="Not allowed to update this task")

    update = {k: v for k, v in dump(payload).items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")

    if not is_admin and set(update.keys()) - {"status"}:
        raise HTTPException(status_code=403, detail="Members can only update status")

    if "assignedTo" in update:
        assignee_oid = await resolve_user_id(update["assignedTo"])
        if assignee_oid not in project.get("members", []):
            raise HTTPException(status_code=400, detail="Assignee must be a project member")
        update["assignedTo"] = assignee_oid

    await tasks_collection.update_one({"_id": oid}, {"$set": update})
    updated = await tasks_collection.find_one({"_id": oid})
    return await serialize_task(updated)


@app.delete("/task/{task_id}", status_code=200)
async def delete_task(
    task_id: str,
    user: dict = Depends(get_current_user),
):
    oid = parse_object_id(task_id, "task id")
    task = await tasks_collection.find_one({"_id": oid})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project = await projects_collection.find_one({"_id": task["projectId"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not is_project_admin(project, user["id"]):
        raise HTTPException(status_code=403, detail="Only project admin can delete tasks")

    await tasks_collection.delete_one({"_id": oid})
    return {"message": "Task deleted successfully"}


# ---------- DASHBOARD ----------

@app.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user)):
    user_oid = ObjectId(user["id"])

    project_ids: list = []
    async for p in projects_collection.find(
        {"$or": [{"createdBy": user_oid}, {"members": user_oid}]},
        {"_id": 1},
    ):
        project_ids.append(p["_id"])

    empty_status = {"todo": 0, "in-progress": 0, "done": 0}
    if not project_ids:
        return {
            "totalTasks": 0,
            "byStatus": empty_status,
            "perUser": [],
            "overdueTasks": 0,
        }

    base_query = {"projectId": {"$in": project_ids}}

    total = await tasks_collection.count_documents(base_query)

    by_status = dict(empty_status)
    async for row in tasks_collection.aggregate([
        {"$match": base_query},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
    ]):
        if row["_id"] in by_status:
            by_status[row["_id"]] = row["count"]

    per_user_raw = [
        row async for row in tasks_collection.aggregate([
            {"$match": base_query},
            {"$group": {"_id": "$assignedTo", "count": {"$sum": 1}}},
        ])
    ]
    user_ids = [r["_id"] for r in per_user_raw if r["_id"] is not None]
    user_map: dict = {}
    if user_ids:
        async for u in users_collection.find(
            {"_id": {"$in": user_ids}}, {"name": 1, "email": 1}
        ):
            user_map[u["_id"]] = {"name": u["name"], "email": u["email"]}

    per_user = [
        {
            "userId": str(r["_id"]),
            "name": user_map.get(r["_id"], {}).get("name"),
            "email": user_map.get(r["_id"], {}).get("email"),
            "count": r["count"],
        }
        for r in per_user_raw
        if r["_id"] is not None
    ]

    overdue = await tasks_collection.count_documents({
        **base_query,
        "dueDate": {"$ne": None, "$lt": datetime.now(timezone.utc)},
        "status": {"$ne": "done"},
    })

    return {
        "totalTasks": total,
        "byStatus": by_status,
        "perUser": per_user,
        "overdueTasks": overdue,
    }