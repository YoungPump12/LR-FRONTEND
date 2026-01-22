import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircleIcon, PlayCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

const API_URL = "https://api.tafadzwa.co/";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login"; // hard redirect for cPanel
      return;
    }
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await api.get("/api/tasks/");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/tasks/", {
        title,
        description,
        scheduled_date: scheduledDate,
        status: "pending",
      });
      setTitle("");
      setDescription("");
      setScheduledDate("");
      loadTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/tasks/${id}/`, { status });
      loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}/`);
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login"; // hard redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card bg-base-100 shadow p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Learning Tracker</h1>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>

        <p className="text-sm mb-2">
          Progress: {completedCount} / {totalCount} completed ({progress}%)
        </p>

        <div className="relative w-full bg-base-200 rounded-full h-4 overflow-hidden mb-4">
          <motion.div
            className="h-4 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <form onSubmit={createTask} className="bg-white p-4 rounded shadow mb-4">
          <input className="input input-bordered w-full mb-2" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input input-bordered w-full mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="datetime-local" className="input input-bordered w-full mb-2" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
          <button className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <small>{task.status.replace("_", " ")}</small>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(task.id, "in_progress")} className="btn btn-warning btn-xs">
                  <PlayCircleIcon className="w-4 h-4" />
                </button>
                <button onClick={() => updateStatus(task.id, "completed")} className="btn btn-success btn-xs">
                  <CheckCircleIcon className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTask(task.id)} className="btn btn-error btn-xs">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
