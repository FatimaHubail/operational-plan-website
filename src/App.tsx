import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "@/routes/AppLayout"
import Dashboard from "@/routes/Dashboard"
import Calendar from "@/routes/Calendar"
import Notifications from "@/routes/Notifications"
import Catalysts from "@/routes/Catalysts"
import Enablers from "@/routes/Enablers"
import Beneficiary from "@/routes/Beneficiary"
import Stakeholders from "@/routes/Stakeholders"
import AddObjective from "@/routes/AddObjective"
import AddAction from "@/routes/AddAction"
import ActionPlan from "@/routes/ActionPlan"
import Login from "@/routes/Login"
import ContributerDashboard from "@/routes/ContributerDashboard"
import SubmissionStatus from "@/routes/SubmissionStatus"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contributer-dashboard" element={<ContributerDashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/submission-status" element={<SubmissionStatus />} />
          <Route path="/catalysts" element={<Catalysts />} />
          <Route path="/enablers" element={<Enablers />} />
          <Route path="/beneficiary" element={<Beneficiary />} />
          <Route path="/stakeholders" element={<Stakeholders />} />
          <Route path="/:planSection/add-objective" element={<AddObjective />} />
          <Route path="/:planSection/add-action" element={<AddAction />} />
          <Route path="/:planSection/action-plan" element={<ActionPlan />} />
          <Route path="/add-objective" element={<Navigate to="/catalysts/add-objective" replace />} />

          <Route path="/contributor" element={<Navigate to="/contributor/dashboard" replace />} />
          <Route path="/contributor/dashboard" element={<ContributerDashboard />} />
          <Route path="/contributor/calendar" element={<Calendar />} />
          <Route path="/contributor/notifications" element={<Notifications />} />
          <Route path="/contributor/submission-status" element={<SubmissionStatus />} />
          <Route path="/contributor/catalysts" element={<Catalysts />} />
          <Route path="/contributor/enablers" element={<Enablers />} />
          <Route path="/contributor/beneficiary" element={<Beneficiary />} />
          <Route path="/contributor/stakeholders" element={<Stakeholders />} />
          <Route path="/contributor/:planSection/add-objective" element={<AddObjective />} />
          <Route path="/contributor/:planSection/add-action" element={<AddAction />} />
          <Route path="/contributor/:planSection/action-plan" element={<ActionPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}