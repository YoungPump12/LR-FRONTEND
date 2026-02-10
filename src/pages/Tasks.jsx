import { useEffect, useState, useCallback } from "react"
import axios from "axios"
// Use app-level CSS layout classes instead of importing the MainLayout component
import { motion as Motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  PlayCircleIcon,
  CheckCircleIcon,
  TrashIcon
} from "@heroicons/react/24/solid"

const API_URL = "https://api.tafadzwa.co"

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
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

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_URL}/api/tasks/${id}/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (err) {
      console.error("Update failed", err)
    }
  }

  const deleteTask = async (id) => {
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

  return (
    <div className="page-shell">
      <div className="glass-card p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tasks</h1>
          <p className="text-gray-600 mb-8">Manage and track your tasks</p>
        </motion.div>

        {/* CREATE TASK */}
        <motion.form 
          onSubmit={createTask} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-200"
        >
          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 mb-4 rounded min-h-24"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </motion.form>

        {/* TASK LIST */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl text-center border border-gray-200"
            >
              <p className="text-gray-600">No tasks yet. Create your first task!</p>
            </motion.div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center border border-gray-200"
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">{task.title}</h2>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="mt-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.status === 'pending' ? '⏳ Pending' :
                       task.status === 'in_progress' ? '🚀 In Progress' :
                       '✓ Completed'}
                    </span>
                  </div>
                  
                  {/* Date and Time Info */}
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    {task.started_at && (
                      <p>📅 Started: {new Date(task.started_at).toLocaleString()}</p>
                    )}
                    {task.completed_at && (
                      <p>✅ Completed: {new Date(task.completed_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {task.status !== 'in_progress' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(task.id, "in_progress")}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg transition"
                      title="Start task"
                    >
                      <PlayCircleIcon className="w-5 h-5" />
                    </motion.button>
                  )}

                  {task.status !== 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(task.id, "completed")}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
                      title="Complete task"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    title="Delete task"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
