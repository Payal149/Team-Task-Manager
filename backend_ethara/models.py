from typing import Optional, Literal, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ---------- User ----------

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    role: Literal["admin", "member"] = "member"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str


class TokenResponse(BaseModel):
    token: str
    user: UserOut


# ---------- Project ----------

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class ProjectMemberAdd(BaseModel):
    email: EmailStr


class UserBrief(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None


class ProjectOut(BaseModel):
    id: str
    name: str
    description: str = ""
    createdBy: Optional[str] = None      # admin user id (kept for back-compat)
    adminId: Optional[str] = None
    adminEmail: Optional[str] = None
    adminName: Optional[str] = None
    members: List[UserBrief] = []
    createdAt: Optional[datetime] = None


# ---------- Task ----------

TaskStatus = Literal["todo", "in-progress", "done"]
TaskPriority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    projectId: Optional[str] = None  # required when posting to /task; optional when nested under /project/{id}/task
    title: str
    description: Optional[str] = ""
    assignedTo: str  # user id (must be a project member)
    status: TaskStatus = "todo"
    priority: TaskPriority = "medium"
    dueDate: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignedTo: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    dueDate: Optional[datetime] = None


class TaskOut(BaseModel):
    id: str
    projectId: str
    title: str
    description: str = ""
    assignedTo: Optional[str] = None       # user id
    assignedToEmail: Optional[str] = None
    assignedToName: Optional[str] = None
    status: str
    priority: str
    dueDate: Optional[datetime] = None
    createdBy: str
    createdAt: Optional[datetime] = None
