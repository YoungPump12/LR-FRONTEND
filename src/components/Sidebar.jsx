import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? "16rem" : "0",
          background: "linear-gradient(to bottom, rgb(15, 23, 42), rgb(30, 41, 59))",
          color: "white",
          minHeight: "100vh",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          transition: "width 0.3s ease",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(148, 163, 184, 0.35)", fontSize: "1.25rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ fontSize: "1.875rem" }}>📋</div>
            <div>
              <p style={{ fontSize: "1.25rem", margin: 0 }}>Learning</p>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>Tracker</p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.375rem",
              background: "#10b981",
              border: "none",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              flexShrink: 0
            }}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav style={{ padding: "1rem", marginTop: "1.5rem" }}>
          <SidebarLink to="/dashboard" label="Dashboard" icon="📊" />
          <SidebarLink to="/tasks" label="Tasks" icon="✓" />
        </nav>
      </aside>
    </>
  )
}

function SidebarLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        transition: "all 0.2s",
        textDecoration: "none",
        color: isActive ? "white" : "#cbd5e1",
        background: isActive 
          ? "linear-gradient(to right, rgba(16, 185, 129, 0.8), rgba(59, 130, 246, 0.8))" 
          : "transparent",
        fontWeight: isActive ? "600" : "500",
        boxShadow: isActive ? "0 8px 16px rgba(16, 185, 129, 0.25)" : "none",
        marginBottom: "0.5rem"
      })}
    >
      <span style={{ fontSize: "1.125rem" }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}
