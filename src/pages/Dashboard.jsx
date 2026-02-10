import MainLayout from "../Layouts/MainLayout"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const API_URL = "https://api.tafadzwa.co"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem("access")

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    axios
      .get(`${API_URL}/api/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setTasks(res.data))
      .catch(err => console.error(err))
  }, [token, navigate])

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status === "pending").length,
    progress: tasks.filter(t => t.status === "in_progress").length,
  }

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.progress },
  ]

  const lineData = [
    { name: "Tasks", Completed: stats.completed, Pending: stats.pending },
  ]

  return (
    <MainLayout>
      <div className="p-6 bg-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-200 rounded-lg">
              + Create New Task
            </button>

            <button
              onClick={() => {
                localStorage.clear()
                navigate("/login")
              }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Tasks" value={stats.total} />
          <StatCard title="Completed Tasks" value={stats.completed} />
          <StatCard title="Pending Tasks" value={stats.pending} />
          <StatCard title="In Progress Tasks" value={stats.progress} />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Task Completion Overview</h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Completed" stroke="#22c55e" />
                <Line type="monotone" dataKey="Pending" stroke="#facc15" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Tasks Breakdown</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#facc15" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2">Task</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {tasks.slice(0, 5).map(task => (
                <tr key={task.id} className="border-b last:border-0">
                  <td className="py-3">{task.title}</td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="text-xs text-gray-500">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </MainLayout>
  )
}

/* COMPONENTS */

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-semibold mt-2">{value}</h2>
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
      {status.replace("_", " ")}
    </span>
  )
}
