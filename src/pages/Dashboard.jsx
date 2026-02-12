import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

const API_URL = "https://api.tafadzwa.co"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [streak, setStreak] = useState(0)
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
      .then(res => {
        setTasks(res.data)
        calculateStreak(res.data)
      })
      .catch(err => console.error(err))
  }, [token, navigate])

  const calculateStreak = (taskList) => {
    let count = 0
    const today = new Date()
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      const hasTaskForDay = taskList.some(t => 
        new Date(t.created_at).toDateString() === checkDate.toDateString()
      )
      
      if (hasTaskForDay) count++
      else break
    }
    
    setStreak(count)
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status === "pending").length,
    progress: tasks.filter(t => t.status === "in_progress").length,
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const pieData = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.progress },
  ]

  const lineData = [
    { month: "Jan", Completed: 10, Pending: 8 },
    { month: "Feb", Completed: 20, Pending: 15 },
    { month: "Mar", Completed: 30, Pending: 12 },
    { month: "Apr", Completed: 45, Pending: 18 },
    { month: "May", Completed: 55, Pending: 20 },
    { month: "Jun", Completed: stats.completed, Pending: stats.pending },
  ]

  const weekData = [
    { day: "Mon", tasks: Math.floor(Math.random() * 10) },
    { day: "Tue", tasks: Math.floor(Math.random() * 10) },
    { day: "Wed", tasks: Math.floor(Math.random() * 10) },
    { day: "Thu", tasks: Math.floor(Math.random() * 10) },
    { day: "Fri", tasks: Math.floor(Math.random() * 10) },
    { day: "Sat", tasks: Math.floor(Math.random() * 10) },
    { day: "Sun", tasks: Math.floor(Math.random() * 10) },
  ]

  const handleCreateTask = () => {
    navigate("/tasks")
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome back! Track your learning progress</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleCreateTask}
              className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
            >
              + Create New Task
            </button>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-8">

            {/* PERFORMANCE METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <PerformanceCard 
                title="Overall Performance" 
                percentage={completionRate} 
                icon="📊"
                color="emerald"
              />
              <StreakCard streak={streak} />
              <StatCard 
                title="Tasks Completed" 
                value={stats.completed} 
                icon="✓"
                color="from-emerald-500 to-emerald-600"
              />
              <StatCard 
                title="Tasks Pending" 
                value={stats.pending} 
                icon="⏱️"
                color="from-blue-500 to-blue-600"
              />
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Performance Overview */}
              <div className="lg:col-span-2 glass-card" style={{ padding: "1.5rem" }}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Performance Overview</h2>
                  <p className="text-sm text-slate-500 mt-1">Monthly progress tracking</p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Completed" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Pending" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Tasks Distribution */}
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Task Distribution</h2>
                  <p className="text-sm text-slate-500 mt-1">By status</p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* WEEKLY ACTIVITY & QUICK STATS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Weekly Activity */}
              <div className="lg:col-span-2 glass-card" style={{ padding: "1.5rem" }}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Weekly Activity</h2>
                  <p className="text-sm text-slate-500 mt-1">Tasks completed this week</p>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff"
                      }}
                    />
                    <Bar dataKey="tasks" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stats */}
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <QuickStatItem label="Total Tasks" value={stats.total} icon="📋" />
                  <QuickStatItem label="Completion Rate" value={`${completionRate}%`} icon="📈" />
                  <QuickStatItem label="In Progress" value={stats.progress} icon="🔄" />
                  <QuickStatItem label="Current Streak" value={`${streak} days`} icon="🔥" />
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ paddingBottom: "1rem", borderBottom: "1px solid rgba(148, 163, 184, 0.35)", marginBottom: "1rem" }}>
                <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                <p className="text-sm text-slate-500 mt-1">Your latest tasks</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid rgba(148, 163, 184, 0.35)" }}>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Task</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Progress</th>
                    </tr>
                  </thead>

                  <tbody style={{ borderTop: "1px solid rgba(148, 163, 184, 0.35)" }}>
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                          No tasks yet. Create one to get started!
                        </td>
                      </tr>
                    ) : (
                      tasks.slice(0, 8).map(task => (
                        <tr 
                          key={task.id}
                          style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.35)" }}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {task.title}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={task.status} />
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(task.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  task.status === 'completed' 
                                    ? 'bg-emerald-500 w-full'
                                    : task.status === 'in_progress'
                                    ? 'bg-blue-500 w-2/3'
                                    : 'bg-gray-400 w-1/3'
                                }`}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

/* COMPONENTS */

function PerformanceCard({ title, percentage, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      
      <div className="flex items-end gap-4">
        <div>
          <div className="text-3xl font-bold text-slate-900">{percentage}%</div>
          <p className="text-xs text-slate-500 mt-1">Pro Learner</p>
        </div>
        
        <div className="flex-1 flex flex-col gap-1">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">Learning progress</p>
        </div>
      </div>
    </div>
  )
}

function StreakCard({ streak }) {
  return (
    <div className="glass-card bg-gradient-to-br from-orange-50 to-red-50" style={{ padding: "1.5rem" }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">Current Streak</p>
          <div className="text-3xl font-bold text-red-600 mt-2">{streak}</div>
          <p className="text-xs text-slate-500 mt-1">🔥 days in a row</p>
        </div>
        <div className="text-5xl">🔥</div>
      </div>
      <div className="mt-4 pt-4 border-t border-red-200">
        <p className="text-xs text-slate-600">Keep it up! Don't break the chain.</p>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`glass-card bg-gradient-to-br ${color} p-6 cursor-pointer hover:scale-105 transition-transform duration-200`} style={{ 
      background: color === "from-emerald-500 to-emerald-600" 
        ? "linear-gradient(to bottom right, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))" 
        : "linear-gradient(to bottom right, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95))",
      color: "white"
    }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-opacity-90 text-sm font-medium">{title}</p>
          <h2 className="text-4xl font-bold mt-2">{value}</h2>
        </div>
        <div className="text-5xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}

function QuickStatItem({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const statusConfig = {
    completed: {
      bg: "rgba(16, 185, 129, 0.1)",
      text: "#065f46",
      label: "Completed",
      icon: "✓"
    },
    pending: {
      bg: "rgba(59, 130, 246, 0.1)",
      text: "#1e40af",
      label: "Pending",
      icon: "⏱️"
    },
    in_progress: {
      bg: "rgba(59, 130, 246, 0.1)",
      text: "#1e40af",
      label: "In Progress",
      icon: "🔄"
    },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span style={{ 
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375rem",
      padding: "0.375rem 0.75rem",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: config.bg,
      color: config.text,
      border: `1px solid ${status === "completed" ? "rgba(16, 185, 129, 0.25)" : "rgba(59, 130, 246, 0.25)"}`
    }}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
