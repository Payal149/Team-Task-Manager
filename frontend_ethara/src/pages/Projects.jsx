import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import "./TaskManager.css";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchProjects = async () => {
    setError("");
    try {
      const res = await api.get("/projects");
      const data = Array.isArray(res.data) ? res.data : res.data.projects || [];
      setProjects(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.detail || "Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const isAdminOf = (p) =>
    p.adminEmail === currentUser.email ||
    p.adminId === currentUser.id ||
    p.createdBy === currentUser.id;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/project", { name, description });
      const created = res.data;
      const newId = created?._id || created?.id;
      setName("");
      setDescription("");
      if (newId) {
        navigate(`/projects/${newId}`);
        return;
      }
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const adminProjects = projects.filter(isAdminOf);
  const memberProjects = projects.filter((p) => !isAdminOf(p));

  return (
    <div className="page-container">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h1>Projects</h1>
            <p className="subtle">Create and manage your team projects.</p>
          </div>
          <Link className="secondary-button" to="/dashboard">
            Dashboard
          </Link>
        </div>

        <div className="panel">
          <h2>New Project</h2>
          <p className="subtle">You become admin of any project you create.</p>
          <form className="form-grid" onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="project-name">Project name</label>
              <input
                id="project-name"
                type="text"
                placeholder="Team website redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="project-desc">Description</label>
              <input
                id="project-desc"
                type="text"
                placeholder="Short project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </button>
          </form>
          {error && <div className="error-box">{error}</div>}
        </div>

        <div className="panel">
          <h2>Admin Projects</h2>
          {adminProjects.length === 0 ? (
            <p className="subtle">You are not admin of any project yet.</p>
          ) : (
            <ul className="card-list">
              {adminProjects.map((p) => {
                const pid = p._id || p.id;
                return (
                  <li key={pid} className="card-item">
                    <div className="card-title">
                      <Link to={`/projects/${pid}`}>{p.name}</Link>
                      <span className="status-badge">Admin</span>
                    </div>
                    {p.description && <p className="subtle">{p.description}</p>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="panel">
          <h2>Member Projects</h2>
          {memberProjects.length === 0 ? (
            <p className="subtle">You are not a member of any project yet.</p>
          ) : (
            <ul className="card-list">
              {memberProjects.map((p) => {
                const pid = p._id || p.id;
                return (
                  <li key={pid} className="card-item">
                    <div className="card-title">
                      <Link to={`/projects/${pid}`}>{p.name}</Link>
                      <span className="status-badge">Member</span>
                    </div>
                    {p.description && <p className="subtle">{p.description}</p>}
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