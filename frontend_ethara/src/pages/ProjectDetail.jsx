import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api.js";
import "./TaskManager.css";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];
const PRIORITY_OPTIONS = ["low", "medium", "high"];


export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchProject = async () => {
    try {
      const res = await api.get(`/project/${id}`);
      setProject(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.detail || "Failed to load project");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/project/${id}/tasks`);
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(data);
    } catch {
      try {
        const res = await api.get("/tasks");
        const all = Array.isArray(res.data) ? res.data : res.data.tasks || [];
        setTasks(
          all.filter(
            (t) =>
              t.projectId === id || t.project === id || t.project_id === id
          )
        );
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load tasks");
      }
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const isAdmin =
    project &&
    (project.adminEmail === currentUser.email ||
      project.adminId === currentUser.id ||
      project.createdBy === currentUser.id);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo.trim()) return;
    setTaskLoading(true);
    setError("");
    try {
      await api.post(`/project/${id}/task`, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        assignedTo,
        status: "todo",
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setAssignedTo("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create task");
    } finally {
      setTaskLoading(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    setError("");
    try {
      await api.put(`/task/${task._id || task.id}`, { status });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update task");
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setError("");
    try {
      await api.delete(`/task/${task._id || task.id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete task");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setError("");
    try {
      await api.post(`/project/${id}/members`, { email: memberEmail });
      setMemberEmail("");
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberRef) => {
    setError("");
    try {
      await api.delete(
        `/project/${id}/members/${encodeURIComponent(memberRef)}`
      );
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to remove member");
    }
  };

  if (!project) {
    return (
      <div className="page-container">
        <div className="panel">
          <Link className="secondary-button" to="/projects">
            Back to Projects
          </Link>
          <p className="subtle">Loading project...</p>
          {error && <div className="error-box">{error}</div>}
        </div>
      </div>
    );
  }

  const members = (project.members || []).map((m) =>
    typeof m === "string" ? { id: m, email: m } : m
  );
  const adminEmail = project.adminEmail;
  const assignableMembers = members.filter((m) => m.id);

  return (
    <div className="page-container">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h1>{project.name}</h1>
            {project.description && <p className="subtle">{project.description}</p>}
            {isAdmin && <p className="subtle">You are admin of this project.</p>}
          </div>
          <Link className="secondary-button" to="/projects">
            Back to Projects
          </Link>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="panel">
          <h2>Members</h2>
          {members.length === 0 ? (
            <p className="subtle">No members yet.</p>
          ) : (
            <ul className="card-list">
              {members.map((m) => (
                <li key={m.id} className="card-item">
                  <div className="card-title">
                    <div>{m.email || m.id}</div>
                    {m.email === adminEmail && <span className="status-badge">Admin</span>}
                  </div>
                  {isAdmin && m.email !== currentUser.email && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {isAdmin && (
            <form className="form-grid" onSubmit={handleAddMember}>
              <div className="form-group">
                <label htmlFor="member-email">Member email</label>
                <input
                  id="member-email"
                  type="email"
                  placeholder="member@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
              </div>
              <button className="primary-button" type="submit">
                Add Member
              </button>
            </form>
          )}
        </div>

        <div className="panel">
          <h2>Create Task</h2>
          {!isAdmin ? (
            <p className="subtle">Only admins can create tasks.</p>
          ) : (
            <form className="form-grid" onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <input
                  id="task-description"
                  type="text"
                  placeholder="What needs doing?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-assigned">Assign to</label>
                <select
                  id="task-assigned"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                >
                  <option value="">-- select a member --</option>
                  {assignableMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.email || m.name || m.id}
                    </option>
                  ))}
                </select>
                {assignableMembers.length === 0 && (
                  <p className="subtle">Add members above before creating tasks.</p>
                )}
              </div>
              <button
                className="primary-button"
                type="submit"
                disabled={taskLoading || assignableMembers.length === 0}
              >
                {taskLoading ? "Creating..." : "Add Task"}
              </button>
            </form>
          )}
        </div>

        <div className="panel">
          <h2>Tasks</h2>
          {tasks.length === 0 ? (
            <p className="subtle">No tasks yet.</p>
          ) : (
            <ul className="card-list">
              {tasks.map((task) => {
            const canUpdate =
              isAdmin ||
              task.assignedToEmail === currentUser.email ||
              task.assignedTo === currentUser.id;
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== "done";
            return (
              <li key={task._id || task.id} className="card-item">
                <div className="card-title">
                  <div>
                    <strong>{task.title}</strong>
                    {task.description && <p className="subtle">{task.description}</p>}
                  </div>
                  <span className={`status-badge ${task.status || "todo"}`}>
                    {task.status || "todo"}
                  </span>
                </div>
                <p className="subtle">
                  Assigned: {task.assignedToEmail || task.assignedTo || "—"}
                </p>
                <p className="subtle">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                  {isOverdue && <span> • Overdue</span>}
                </p>
                <div className="button-row">
                  <select
                    value={task.status || "todo"}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    disabled={!canUpdate}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {isAdmin && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => handleDeleteTask(task)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}