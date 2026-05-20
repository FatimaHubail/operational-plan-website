import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AdminDashboard from "./AdminDashboard"
import AuditorDashboard from "./AuditorDashboard"
import ContributerDashboard from "./ContributerDashboard"
import PresidentDashboard from "./PresidentDashboard"
import Dashboard from "./Dashboard"

export default function DashboardByRole() {
  const { user } = useAuth()

  switch (user?.role) {
    case "administrator":
      return <AdminDashboard />
    case "auditor":
      return <AuditorDashboard />
    case "contributor":
      return <ContributerDashboard />
    case "president":
      return <PresidentDashboard />
    case "indicator_owner":
      return <Dashboard />
    default:
      return <Navigate to="/login" replace />
  }
}
