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
import ActionPlan from "@/routes/ActionPlan"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/catalysts" element={<Catalysts />} />
          <Route path="/enablers" element={<Enablers />} />
          <Route path="/beneficiary" element={<Beneficiary />} />
          <Route path="/stakeholders" element={<Stakeholders />} />
          <Route path="/:planSection/add-objective" element={<AddObjective />} />
          <Route path="/:planSection/action-plan" element={<ActionPlan />} />
          <Route path="/add-objective" element={<Navigate to="/catalysts/add-objective" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}