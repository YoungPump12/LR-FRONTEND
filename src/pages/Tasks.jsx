import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5174/api'
  : 'https://api.tafadzwa.co'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()

  const token = localStorage.getItem("access")

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(res.data)
    } catch (err) {
      console.error("Failed to load tasks", err)
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    fetchTasks()
  }, [token, navigate, fetchTasks])

  const createTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)

    try {
      await axios.post(
        `${API_URL}/api/tasks/`,
        { title, description, status: "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTitle("")
      setDescription("")
      fetchTasks()
    } catch (err) {
      console.error("Create failed", err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/tasks/${id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (err) {
      console.error("Update failed", err)
    }
  }

  const deleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await axios.delete(
          `${API_URL}/api/tasks/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        fetchTasks()
      } catch (err) {
        console.error("Delete failed", err)
      }
    }
  }

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(t => t.status === filter)

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status === "pending").length,
    progress: tasks.filter(t => t.status === "in_progress").length,
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-sm text-slate-500 mt-0.5">Organize and track your learning tasks</p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            
            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <QuickStat label="Total" value={stats.total} icon="📋" />
              <QuickStat label="Completed" value={stats.completed} icon="✓" />
              <QuickStat label="In Progress" value={stats.progress} icon="🔄" />
              <QuickStat label="Pending" value={stats.pending} icon="⏱️" />
            </div>

            {/* CREATE TASK FORM */}
            <div className="glass-card mb-8" style={{ padding: "2rem" }}>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Task</h2>
              <form onSubmit={createTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    className="field"
                    placeholder="Task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <textarea
                    className="field w-full"
                    placeholder="Task description (optional)..."
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ padding: "0.9rem 1rem", fontFamily: "inherit" }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>
              </form>
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {["all", "pending", "in_progress", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {status === "all" ? "All Tasks" : status.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* TASKS LIST */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="glass-card text-center py-12" style={{ padding: "3rem 2rem" }}>
                  <p className="text-slate-500 text-lg">No tasks found</p>
                  <p className="text-slate-400 text-sm mt-2">Create one to get started!</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={updateStatus}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="glass-card" style={{ padding: "1.25rem" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}

function TaskCard({ task, onStatusChange, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 border-emerald-300"
      case "in_progress":
        return "bg-blue-100 border-blue-300"
      case "pending":
        return "bg-amber-100 border-amber-300"
      default:
        return "bg-slate-100 border-slate-300"
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500"
      case "in_progress":
        return "bg-blue-500"
      case "pending":
        return "bg-amber-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <div className={`glass-card border-l-4 ${getStatusColor(task.status)}`} style={{ padding: "1.5rem", borderLeft: `4px solid currentColor` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${getStatusDot(task.status)}`} />
            <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
          </div>
          {task.description && (
            <p className="text-sm text-slate-600 mt-2">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-xs text-slate-500">
              Created: {new Date(task.created_at).toLocaleDateString()}
            </span>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="text-xs px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
