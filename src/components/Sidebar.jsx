import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Learning Tracker
      </div>

      <nav className="p-4 space-y-2">
        <SidebarLink to="/dashboard" label="Dashboard" />
        <SidebarLink to="/tasks" label="Tasks" />
      </nav>
    </aside>
  )
}

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg ${
          isActive ? "bg-slate-700" : "hover:bg-slate-800"
        }`
      }
    >
      {label}
    </NavLink>
  )
}
