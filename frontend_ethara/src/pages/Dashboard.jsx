// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api.js";

// const S = {
//   root: {
//     minHeight: "100vh",
//     background: "#f0f2f5",
//     fontFamily: "'Plus Jakarta Sans', sans-serif",
//   },
//   topbar: {
//     background: "#ffffff",
//     borderBottom: "1px solid #e8eaed",
//     padding: "0 32px",
//     height: 60,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "sticky",
//     top: 0,
//     zIndex: 100,
//   },
//   logo: {
//     fontWeight: 700,
//     fontSize: 18,
//     color: "#1a1a2e",
//     letterSpacing: "-0.5px",
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },
//   logoDot: {
//     width: 8,
//     height: 8,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea, #764ba2)",
//     display: "inline-block",
//   },
//   topbarRight: { display: "flex", alignItems: "center", gap: 16 },
//   navLink: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "#6b7280",
//     textDecoration: "none",
//     padding: "6px 14px",
//     borderRadius: 8,
//     transition: "background 0.15s, color 0.15s",
//   },
//   logoutBtn: {
//     fontSize: 13,
//     fontWeight: 600,
//     color: "#ef4444",
//     background: "#fef2f2",
//     border: "1px solid #fecaca",
//     borderRadius: 8,
//     padding: "6px 14px",
//     cursor: "pointer",
//   },
//   userBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     fontSize: 13,
//     color: "#374151",
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #667eea, #764ba2)",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: 700,
//     fontSize: 13,
//     flexShrink: 0,
//   },
//   body: { padding: "32px", maxWidth: 1100, margin: "0 auto" },
//   pageTitle: {
//     fontSize: 26,
//     fontWeight: 700,
//     color: "#111827",
//     marginBottom: 4,
//     letterSpacing: "-0.5px",
//   },
//   pageSubtitle: { fontSize: 14, color: "#6b7280", marginBottom: 32 },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: 16,
//     marginBottom: 28,
//   },
//   statCard: (accent) => ({
//     background: "#ffffff",
//     borderRadius: 16,
//     padding: "20px 24px",
//     borderLeft: `4px solid ${accent}`,
//     boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//   }),
//   statLabel: {
//     fontSize: 12,
//     fontWeight: 600,
//     color: "#9ca3af",
//     textTransform: "uppercase",
//     letterSpacing: "0.06em",
//     marginBottom: 6,
//   },
//   statValue: {
//     fontSize: 32,
//     fontWeight: 700,
//     color: "#111827",
//     lineHeight: 1,
//   },
//   grid2: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 20,
//     marginBottom: 20,
//   },
//   card: {
//     background: "#ffffff",
//     borderRadius: 16,
//     padding: "24px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//     marginBottom: 0,
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: 700,
//     color: "#111827",
//     marginBottom: 16,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },
//   cardTitleIcon: (bg) => ({
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     background: bg,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 14,
//     flexShrink: 0,
//   }),
//   projectItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "10px 0",
//     borderBottom: "1px solid #f3f4f6",
//   },
//   projectName: {
//     fontSize: 14,
//     fontWeight: 600,
//     color: "#4f46e5",
//     textDecoration: "none",
//   },
//   roleBadge: (isAdmin) => ({
//     fontSize: 11,
//     fontWeight: 600,
//     padding: "2px 8px",
//     borderRadius: 99,
//     background: isAdmin ? "#ede9fe" : "#f0fdf4",
//     color: isAdmin ? "#7c3aed" : "#16a34a",
//   }),
//   statusRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 10,
//   },
//   statusLabel: { fontSize: 13, color: "#374151", width: 90, fontWeight: 500 },
//   progressBar: {
//     flex: 1,
//     height: 8,
//     background: "#f3f4f6",
//     borderRadius: 99,
//     overflow: "hidden",
//   },
//   progressFill: (color, pct) => ({
//     height: "100%",
//     width: `${pct}%`,
//     background: color,
//     borderRadius: 99,
//   }),
//   statusCount: { fontSize: 13, fontWeight: 700, color: "#111827", width: 24, textAlign: "right" },
//   taskItem: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 12,
//     padding: "12px 0",
//     borderBottom: "1px solid #f3f4f6",
//   },
//   taskDot: (status) => ({
//     width: 10,
//     height: 10,
//     borderRadius: "50%",
//     marginTop: 4,
//     flexShrink: 0,
//     background:
//       status === "done" ? "#10b981" :
//       status === "in-progress" ? "#f59e0b" : "#e5e7eb",
//   }),
//   taskTitle: { fontSize: 14, fontWeight: 600, color: "#111827" },
//   taskMeta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
//   priorityChip: (p) => ({
//     fontSize: 11,
//     fontWeight: 600,
//     padding: "1px 7px",
//     borderRadius: 99,
//     marginLeft: 6,
//     background: p === "high" ? "#fef2f2" : p === "medium" ? "#fffbeb" : "#f0fdf4",
//     color: p === "high" ? "#ef4444" : p === "medium" ? "#d97706" : "#16a34a",
//   }),
//   overdueItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     padding: "10px 14px",
//     borderRadius: 10,
//     background: "#fef2f2",
//     border: "1px solid #fecaca",
//     marginBottom: 8,
//     fontSize: 13,
//   },
//   emptyState: {
//     textAlign: "center",
//     padding: "28px 0",
//     color: "#9ca3af",
//     fontSize: 14,
//   },
//   userRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     padding: "8px 0",
//     borderBottom: "1px solid #f3f4f6",
//   },
//   userAvatar: {
//     width: 28,
//     height: 28,
//     borderRadius: "50%",
//     background: "#ede9fe",
//     color: "#7c3aed",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 11,
//     fontWeight: 700,
//     flexShrink: 0,
//   },
//   errorBanner: {
//     background: "#fef2f2",
//     border: "1px solid #fecaca",
//     borderRadius: 10,
//     padding: "12px 16px",
//     color: "#dc2626",
//     fontSize: 14,
//     marginBottom: 20,
//   },
//   divider: {
//     borderTop: "1px solid #f3f4f6",
//     margin: "16px 0",
//   },
// };

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [error, setError] = useState("");

//   const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     const link = document.createElement("link");
//     link.href =
//       "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
//     link.rel = "stylesheet";
//     document.head.appendChild(link);
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const res = await api.get("/dashboard");
//       setStats(res.data);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/login");
//         return;
//       }
//       setError(err.response?.data?.detail || "Failed to load dashboard stats");
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const res = await api.get("/tasks");
//       const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
//       setTasks(data);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const res = await api.get("/projects");
//       const data = Array.isArray(res.data) ? res.data : res.data.projects || [];
//       setProjects(data);
//     } catch {}
//   };

//   useEffect(() => {
//     setError("");
//     fetchStats();
//     fetchTasks();
//     fetchProjects();
//   }, []);

//   const isAdminOf = (p) =>
//     p.adminEmail === currentUser.email ||
//     p.adminId === currentUser.id ||
//     p.createdBy === currentUser.id;

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const now = new Date();
//   const overdueTasks = tasks.filter(
//     (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
//   );

//   const total = stats?.totalTasks || 0;
//   const byStatus = stats?.byStatus || { todo: 0, "in-progress": 0, done: 0 };
//   const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

//   const initials = (currentUser.email || "U")
//     .split("@")[0]
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <div style={S.root}>
//       {/* Topbar */}
//       <div style={S.topbar}>
//         <div style={S.logo}>
//           <span style={S.logoDot} />
//           TaskFlow
//         </div>
//         <div style={S.topbarRight}>
//           <div style={S.userBadge}>
//             <div style={S.avatar}>{initials}</div>
//             <span style={{ fontWeight: 600 }}>{currentUser.email}</span>
//             {currentUser.role && (
//               <span style={S.roleBadge(currentUser.role === "admin")}>
//                 {currentUser.role}
//               </span>
//             )}
//           </div>
//           <Link to="/projects" style={S.navLink}>
//             Projects
//           </Link>
//           <button style={S.logoutBtn} onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       <div style={S.body}>
//         <div style={S.pageTitle}>Dashboard</div>
//         <div style={S.pageSubtitle}>
//           Welcome back — here's what's happening across your projects.
//         </div>

//         {error && <div style={S.errorBanner}>{error}</div>}

//         {/* Stat cards */}
//         <div style={S.statsGrid}>
//           {[
//             { label: "Total Tasks", value: total, accent: "#6366f1", color: "#4f46e5" },
//             { label: "To Do", value: byStatus.todo || 0, accent: "#d1d5db", color: "#6b7280" },
//             { label: "In Progress", value: byStatus["in-progress"] || 0, accent: "#f59e0b", color: "#d97706" },
//             { label: "Done", value: byStatus.done || 0, accent: "#10b981", color: "#059669" },
//             { label: "Overdue", value: stats?.overdueTasks ?? overdueTasks.length, accent: "#ef4444", color: "#dc2626" },
//           ].map(({ label, value, accent, color }) => (
//             <div key={label} style={S.statCard(accent)}>
//               <div style={S.statLabel}>{label}</div>
//               <div style={{ ...S.statValue, color }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Projects + Status/Users */}
//         <div style={S.grid2}>
//           {/* Projects */}
//           <div style={S.card}>
//             <div style={S.cardTitle}>
//               <span style={S.cardTitleIcon("#ede9fe")}>📁</span>
//               My Projects ({projects.length})
//             </div>
//             {projects.length === 0 ? (
//               <div style={S.emptyState}>
//                 No projects yet.{" "}
//                 <Link to="/projects" style={{ color: "#6366f1" }}>
//                   Create one
//                 </Link>
//               </div>
//             ) : (
//               projects.map((p) => {
//                 const pid = p._id || p.id;
//                 const admin = isAdminOf(p);
//                 return (
//                   <div key={pid} style={S.projectItem}>
//                     <Link to={`/projects/${pid}`} style={S.projectName}>
//                       {p.name}
//                     </Link>
//                     <span style={S.roleBadge(admin)}>
//                       {admin ? "Admin" : "Member"}
//                     </span>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Status breakdown + per user */}
//           <div style={S.card}>
//             <div style={S.cardTitle}>
//               <span style={S.cardTitleIcon("#fef9c3")}>📊</span>
//               Task Status
//             </div>
//             {[
//               { label: "To Do", key: "todo", color: "#d1d5db" },
//               { label: "In Progress", key: "in-progress", color: "#f59e0b" },
//               { label: "Done", key: "done", color: "#10b981" },
//             ].map(({ label, key, color }) => (
//               <div key={key} style={S.statusRow}>
//                 <span style={S.statusLabel}>{label}</span>
//                 <div style={S.progressBar}>
//                   <div style={S.progressFill(color, pct(byStatus[key] || 0))} />
//                 </div>
//                 <span style={S.statusCount}>{byStatus[key] || 0}</span>
//               </div>
//             ))}

//             <div style={S.divider} />

//             <div style={S.cardTitle}>
//               <span style={S.cardTitleIcon("#dcfce7")}>👤</span>
//               Tasks per User
//             </div>
//             {(stats?.perUser || []).length === 0 ? (
//               <div style={{ fontSize: 13, color: "#9ca3af" }}>No assignments yet</div>
//             ) : (
//               (stats?.perUser || []).map((u) => (
//                 <div key={u.userId} style={S.userRow}>
//                   <div style={S.userAvatar}>
//                     {(u.email || u.name || "?").slice(0, 2).toUpperCase()}
//                   </div>
//                   <span style={{ flex: 1, fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                     {u.email || u.name || u.userId}
//                   </span>
//                   <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", background: "#ede9fe", padding: "2px 8px", borderRadius: 99, flexShrink: 0 }}>
//                     {u.count}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Overdue tasks */}
//         {overdueTasks.length > 0 && (
//           <div style={{ ...S.card, marginBottom: 20 }}>
//             <div style={S.cardTitle}>
//               <span style={S.cardTitleIcon("#fee2e2")}>⚠️</span>
//               Overdue Tasks ({overdueTasks.length})
//             </div>
//             {overdueTasks.map((t) => (
//               <div key={t._id || t.id} style={S.overdueItem}>
//                 <span style={{ flex: 1, fontWeight: 600, color: "#dc2626" }}>{t.title}</span>
//                 <span style={{ fontSize: 12, color: "#b91c1c" }}>
//                   Due {new Date(t.dueDate).toLocaleDateString()}
//                 </span>
//                 {(t.assignedToEmail || t.assignedTo) && (
//                   <span style={{ fontSize: 12, color: "#9ca3af" }}>
//                     → {t.assignedToEmail || t.assignedTo}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* All tasks */}
//         <div style={S.card}>
//           <div style={S.cardTitle}>
//             <span style={S.cardTitleIcon("#e0f2fe")}>✅</span>
//             All Tasks ({tasks.length})
//           </div>
//           {tasks.length === 0 ? (
//             <div style={S.emptyState}>
//               No tasks yet.{" "}
//               <Link to="/projects" style={{ color: "#6366f1" }}>Go to Projects</Link>{" "}
//               to create some.
//             </div>
//           ) : (
//             tasks.map((t) => (
//               <div key={t._id || t.id} style={S.taskItem}>
//                 <div style={S.taskDot(t.status)} />
//                 <div style={{ flex: 1 }}>
//                   <div style={S.taskTitle}>
//                     {t.title}
//                     {t.priority && (
//                       <span style={S.priorityChip(t.priority)}>{t.priority}</span>
//                     )}
//                   </div>
//                   <div style={S.taskMeta}>
//                     {t.status || "todo"}
//                     {(t.assignedToEmail || t.assignedTo) &&
//                       ` · ${t.assignedToEmail || t.assignedTo}`}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import "./TaskManager.css";

const S = {
  root: {
    minHeight: "100vh",
    background: "#07090f",
    fontFamily: "'Outfit', sans-serif",
  },
  topbar: {
    background: "#0d1117",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "0 32px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontWeight: 700,
    fontSize: 17,
    color: "#e2e8f0",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f7ef7, #34d399)",
    display: "inline-block",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 12 },
  navLink: {
    fontSize: 13.5,
    fontWeight: 500,
    color: "#64748b",
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
    transition: "border-color 0.15s, color 0.15s",
  },
  logoutBtn: {
    fontSize: 13,
    fontWeight: 600,
    color: "#fca5a5",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#94a3b8",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f7ef7, #6b92f8)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 12,
    flexShrink: 0,
  },
  body: { padding: "32px", maxWidth: 1100, margin: "0 auto" },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "#e2e8f0",
    marginBottom: 4,
    letterSpacing: "-0.5px",
  },
  pageSubtitle: { fontSize: 13.5, color: "#64748b", marginBottom: 32 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 24,
  },
  statCard: (accent) => ({
    background: "#111827",
    borderRadius: 12,
    padding: "18px 22px",
    borderLeft: `3px solid ${accent}`,
    border: `1px solid rgba(255,255,255,0.06)`,
    borderLeftColor: accent,
    boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
  }),
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 8,
    fontFamily: "'JetBrains Mono', monospace",
  },
  statValue: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: "#111827",
    borderRadius: 12,
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#94a3b8",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  cardTitleIcon: (bg) => ({
    width: 26,
    height: 26,
    borderRadius: 7,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    flexShrink: 0,
  }),
  projectItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  projectName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#6b92f8",
    textDecoration: "none",
  },
  roleBadge: (isAdmin) => ({
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 99,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.06em",
    background: isAdmin ? "rgba(79,126,247,0.12)" : "rgba(16,185,129,0.1)",
    color: isAdmin ? "#6b92f8" : "#34d399",
    border: isAdmin ? "1px solid rgba(79,126,247,0.25)" : "1px solid rgba(16,185,129,0.2)",
  }),
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  statusLabel: { fontSize: 13, color: "#94a3b8", width: 90, fontWeight: 500 },
  progressBar: {
    flex: 1,
    height: 6,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: (color, pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: 99,
    transition: "width 0.4s ease",
  }),
  statusCount: { fontSize: 12, fontWeight: 700, color: "#e2e8f0", width: 24, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },
  taskItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  taskDot: (status) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginTop: 5,
    flexShrink: 0,
    background:
      status === "done" ? "#10b981" :
      status === "in-progress" ? "#f59e0b" : "#334155",
  }),
  taskTitle: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" },
  taskMeta: { fontSize: 12, color: "#64748b", marginTop: 3 },
  priorityChip: (p) => ({
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 99,
    marginLeft: 7,
    fontFamily: "'JetBrains Mono', monospace",
    background: p === "high" ? "rgba(239,68,68,0.1)" : p === "medium" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
    color: p === "high" ? "#fca5a5" : p === "medium" ? "#fbbf24" : "#34d399",
    border: p === "high" ? "1px solid rgba(239,68,68,0.2)" : p === "medium" ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(16,185,129,0.2)",
  }),
  overdueItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    background: "rgba(239,68,68,0.07)",
    border: "1px solid rgba(239,68,68,0.2)",
    marginBottom: 8,
    fontSize: 13,
  },
  emptyState: {
    textAlign: "center",
    padding: "28px 0",
    color: "#64748b",
    fontSize: 13.5,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(79,126,247,0.15)",
    color: "#6b92f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'JetBrains Mono', monospace",
  },
  errorBanner: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: 13.5,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  divider: {
    borderTop: "1px solid rgba(255,255,255,0.05)",
    margin: "16px 0",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(err.response?.data?.detail || "Failed to load dashboard stats");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      const data = Array.isArray(res.data) ? res.data : res.data.projects || [];
      setProjects(data);
    } catch {}
  };

  useEffect(() => {
    setError("");
    fetchStats();
    fetchTasks();
    fetchProjects();
  }, []);

  const isAdminOf = (p) =>
    p.adminEmail === currentUser.email ||
    p.adminId === currentUser.id ||
    p.createdBy === currentUser.id;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
  );

  const total = stats?.totalTasks || 0;
  const byStatus = stats?.byStatus || { todo: 0, "in-progress": 0, done: 0 };
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const initials = (currentUser.email || "U")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={S.root}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.logo}>
          <span style={S.logoDot} />
          TaskFlow
        </div>
        <div style={S.topbarRight}>
          <div style={S.userBadge}>
            <div style={S.avatar}>{initials}</div>
            <span style={{ fontWeight: 600, color: "#94a3b8" }}>{currentUser.email}</span>
            {currentUser.role && (
              <span style={S.roleBadge(currentUser.role === "admin")}>
                {currentUser.role}
              </span>
            )}
          </div>
          <Link to="/projects" style={S.navLink}>
            Projects
          </Link>
          <button style={S.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={S.body}>
        <div style={S.pageTitle}>Dashboard</div>
        <div style={S.pageSubtitle}>
          Welcome back — here's what's happening across your projects.
        </div>

        {error && <div style={S.errorBanner}>⚠ {error}</div>}

        {/* Stat cards */}
        <div style={S.statsGrid}>
          {[
            { label: "Total Tasks", value: total, accent: "#4f7ef7", color: "#6b92f8" },
            { label: "To Do", value: byStatus.todo || 0, accent: "#475569", color: "#94a3b8" },
            { label: "In Progress", value: byStatus["in-progress"] || 0, accent: "#f59e0b", color: "#fbbf24" },
            { label: "Done", value: byStatus.done || 0, accent: "#10b981", color: "#34d399" },
            { label: "Overdue", value: stats?.overdueTasks ?? overdueTasks.length, accent: "#ef4444", color: "#fca5a5" },
          ].map(({ label, value, accent, color }) => (
            <div key={label} style={S.statCard(accent)}>
              <div style={S.statLabel}>{label}</div>
              <div style={{ ...S.statValue, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Projects + Status/Users */}
        <div style={S.grid2}>
          {/* Projects */}
          <div style={S.card}>
            <div style={S.cardTitle}>
              <span style={S.cardTitleIcon("rgba(79,126,247,0.15)")}>📁</span>
              My Projects ({projects.length})
            </div>
            {projects.length === 0 ? (
              <div style={S.emptyState}>
                No projects yet.{" "}
                <Link to="/projects" style={{ color: "#6b92f8" }}>
                  Create one
                </Link>
              </div>
            ) : (
              projects.map((p) => {
                const pid = p._id || p.id;
                const admin = isAdminOf(p);
                return (
                  <div key={pid} style={S.projectItem}>
                    <Link to={`/projects/${pid}`} style={S.projectName}>
                      {p.name}
                    </Link>
                    <span style={S.roleBadge(admin)}>
                      {admin ? "Admin" : "Member"}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Status breakdown + per user */}
          <div style={S.card}>
            <div style={S.cardTitle}>
              <span style={S.cardTitleIcon("rgba(245,158,11,0.15)")}>📊</span>
              Task Status
            </div>
            {[
              { label: "To Do", key: "todo", color: "#475569" },
              { label: "In Progress", key: "in-progress", color: "#f59e0b" },
              { label: "Done", key: "done", color: "#10b981" },
            ].map(({ label, key, color }) => (
              <div key={key} style={S.statusRow}>
                <span style={S.statusLabel}>{label}</span>
                <div style={S.progressBar}>
                  <div style={S.progressFill(color, pct(byStatus[key] || 0))} />
                </div>
                <span style={S.statusCount}>{byStatus[key] || 0}</span>
              </div>
            ))}

            <div style={S.divider} />

            <div style={S.cardTitle}>
              <span style={S.cardTitleIcon("rgba(16,185,129,0.15)")}>👤</span>
              Tasks per User
            </div>
            {(stats?.perUser || []).length === 0 ? (
              <div style={{ fontSize: 13, color: "#64748b" }}>No assignments yet</div>
            ) : (
              (stats?.perUser || []).map((u) => (
                <div key={u.userId} style={S.userRow}>
                  <div style={S.userAvatar}>
                    {(u.email || u.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.email || u.name || u.userId}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6b92f8", background: "rgba(79,126,247,0.12)", padding: "2px 8px", borderRadius: 99, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(79,126,247,0.25)" }}>
                    {u.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue tasks */}
        {overdueTasks.length > 0 && (
          <div style={{ ...S.card, marginBottom: 16 }}>
            <div style={S.cardTitle}>
              <span style={S.cardTitleIcon("rgba(239,68,68,0.15)")}>⚠️</span>
              Overdue Tasks ({overdueTasks.length})
            </div>
            {overdueTasks.map((t) => (
              <div key={t._id || t.id} style={S.overdueItem}>
                <span style={{ flex: 1, fontWeight: 600, color: "#fca5a5" }}>{t.title}</span>
                <span style={{ fontSize: 12, color: "#f87171" }}>
                  Due {new Date(t.dueDate).toLocaleDateString()}
                </span>
                {(t.assignedToEmail || t.assignedTo) && (
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    → {t.assignedToEmail || t.assignedTo}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* All tasks */}
        <div style={S.card}>
          <div style={S.cardTitle}>
            <span style={S.cardTitleIcon("rgba(79,126,247,0.12)")}>✅</span>
            All Tasks ({tasks.length})
          </div>
          {tasks.length === 0 ? (
            <div style={S.emptyState}>
              No tasks yet.{" "}
              <Link to="/projects" style={{ color: "#6b92f8" }}>Go to Projects</Link>{" "}
              to create some.
            </div>
          ) : (
            tasks.map((t) => (
              <div key={t._id || t.id} style={S.taskItem}>
                <div style={S.taskDot(t.status)} />
                <div style={{ flex: 1 }}>
                  <div style={S.taskTitle}>
                    {t.title}
                    {t.priority && (
                      <span style={S.priorityChip(t.priority)}>{t.priority}</span>
                    )}
                  </div>
                  <div style={S.taskMeta}>
                    {t.status || "todo"}
                    {(t.assignedToEmail || t.assignedTo) &&
                      ` · ${t.assignedToEmail || t.assignedTo}`}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}