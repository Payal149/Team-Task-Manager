🚀 Team Task Manager (Full-Stack Web Application)
📌 Description

A full-stack Team Task Manager application where users can create, assign, and track tasks within a team. It includes authentication, role-based access control, and task management features.

✨ Features

🔐 User Authentication (Signup/Login using JWT)
👥 Role-Based Access (Admin & Member)
📝 Task Creation & Assignment
🔄 Task Status Tracking (Pending, In Progress, Completed)
📊 Dashboard to view tasks
🌐 REST API integration
✅ Input validation & secure backend
🛠️ Tech Stack

Frontend
⚛️ React.js (Vite)
🔗 Axios
Backend
⚡ FastAPI (Python)
🔑 JWT Authentication
Database
🍃 MongoDB Atlas (NoSQL)

🌐 Live Demo

🔗 Frontend:
https://team-task-manager-three-beryl.vercel.app

🔗 Backend API Docs:
https://team-task-manager-production-a7ca.up.railway.app/docs

📂 GitHub Repository

👉 https://github.com/Payal149/Team-Task-Manager

⚙️ How to Run Locally

🔹 Clone the repository
git clone https://github.com/Payal149/Team-Task-Manager

🔹 Backend Setup

cd backend_ethara
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload

🔹 Frontend Setup

cd frontend_ethara
npm install
npm run dev

🔑 Environment Variables

Backend (.env)
MONGO_URI=your_mongodb_connection_string
DB_NAME=team_task_manager
JWT_SECRET=your_secret_key
JWT_ALGO=HS256
JWT_EXPIRE_MINUTES=10080
Frontend (.env)

VITE_API_URL=https://team-task-manager-production-a7ca.up.railway.app

📁 Project Structure

Team-Task-Manager/
│
├── backend_ethara/      # FastAPI backend
├── frontend_ethara/     # React frontend
├── README.md

🎯 Key Functionalities

Admin can create and assign tasks
Members can view and update tasks
Secure authentication system
Task tracking with status updates

🔮 Future Improvements
📌 Project management module
🔔 Notification system
📊 Advanced analytics dashboard
📎 File attachments support

👩‍💻 Author
Payal
