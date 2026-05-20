import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { RequireAuth } from "@/components/RequireAuth"
import { ScrollToTop } from "@/components/scroll-to-top"
import AppLayout from "@/routes/AppLayout"
import DashboardByRole from "@/routes/dashboards/DashboardByRole"
import Calendar from "@/routes/Calendar"
import Notifications from "@/routes/notifications/Notifications"
import AuditorNotifications from "@/routes/notifications/AuditorNotifications"
import AdminNotifications from "@/routes/notifications/AdminNotifications"
import Catalysts from "@/routes/strategic-perpectives/Catalysts"
import Enablers from "@/routes/strategic-perpectives/Enablers"
import Beneficiary from "@/routes/strategic-perpectives/Beneficiary"
import Stakeholders from "@/routes/strategic-perpectives/Stakeholders"
import AddObjective from "@/routes/actions/AddObjective"
import AddAction from "@/routes/actions/AddAction"
import AddTask from "@/routes/actions/AddTask"
import ActionPlan from "@/routes/actions/ActionPlan"
import Login from "@/routes/Login"
import ChangePassword from "@/routes/ChangePassword"
import StrategicPerspectivesOverview from "@/routes/president/StrategicPerspectivesOverview"
import PlansOverview from "@/routes/president/PlansOverview"
import BudgetAndFinancialResources from "@/routes/president/BudgetAndFinancialResources"
import SubmissionStatus from "@/routes/proposals/ProposalsStatus"
import AdminUsers from "@/routes/admin/AdminUsers"
import AddUser from "@/routes/admin/AddUser"
import ActionQueue from "@/routes/auditor/ActionQueue"
import ObjectiveQueue from "@/routes/auditor/ObjectiveQueue"
import TaskQueue from "@/routes/auditor/TaskQueue"
import ReviewAction from "@/routes/auditor/ReviewAction"
import ReviewObjective from "@/routes/auditor/ReviewObjective"
import ReviewTask from "@/routes/auditor/ReviewTask"
import ViewActionEdits from "@/routes/proposals/ViewActionEdits"
import ViewObjEdits from "@/routes/proposals/ViewObjEdits"
import ViewTaskEdits from "@/routes/proposals/ViewTaskEdits"
import EditAction from "@/routes/proposals/EditAction"
import EditObjective from "@/routes/proposals/EditObjective"
import EditTask from "@/routes/proposals/EditTask"

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auditor/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard-admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard-auditor" element={<Navigate to="/dashboard" replace />} />
        <Route path="/president/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/contributor/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/contributer-dashboard" element={<Navigate to="/dashboard" replace />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardByRole />} />
            <Route path="/action-queue" element={<ActionQueue />} />
            <Route path="/objective-queue" element={<ObjectiveQueue />} />
            <Route path="/task-queue" element={<TaskQueue />} />
            <Route path="/review-action" element={<ReviewAction />} />
            <Route path="/review-task" element={<ReviewTask />} />
            <Route path="/review-objective" element={<ReviewObjective />} />
            <Route path="/proposal/review/action" element={<ReviewAction />} />
            <Route path="/proposal/review/task" element={<ReviewTask />} />
            <Route path="/proposal/review/objective" element={<ReviewObjective />} />
            <Route path="/proposal/view/action-edits" element={<ViewActionEdits />} />
            <Route path="/proposal/view/task-edits" element={<ViewTaskEdits />} />
            <Route path="/proposal/view/objective-edits" element={<ViewObjEdits />} />
            <Route path="/proposal/edit/action" element={<EditAction />} />
            <Route path="/proposal/edit/task" element={<EditTask />} />
            <Route path="/proposal/edit/objective" element={<EditObjective />} />
            <Route path="/auditor/review-action" element={<Navigate to="/review-action" replace />} />
            <Route path="/auditor/review-task" element={<Navigate to="/review-task" replace />} />
            <Route path="/auditor/review-objective" element={<Navigate to="/review-objective" replace />} />
            <Route path="/auditor/queue-actions" element={<Navigate to="/action-queue" replace />} />
            <Route path="/auditor/queue-objectives" element={<Navigate to="/objective-queue" replace />} />
            <Route path="/auditor/queue-tasks" element={<Navigate to="/task-queue" replace />} />
            <Route path="/auditor/task-queue" element={<Navigate to="/task-queue" replace />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/auditor/notifications" element={<AuditorNotifications />} />
            <Route path="/proposals-status" element={<SubmissionStatus />} />
            <Route path="/submission-status" element={<Navigate to="/proposals-status" replace />} />
            <Route path="/catalysts" element={<Catalysts />} />
            <Route path="/enablers" element={<Enablers />} />
            <Route path="/beneficiary" element={<Beneficiary />} />
            <Route path="/stakeholders" element={<Stakeholders />} />
            <Route path="/add-objective" element={<Navigate to="/catalysts/add-objective" replace />} />

            <Route path="/president" element={<Navigate to="/dashboard" replace />} />
            <Route path="/president/strategic-perspectives-overview" element={<StrategicPerspectivesOverview />} />
            <Route path="/president/plans-overview" element={<PlansOverview />} />
            <Route path="/president/budget" element={<BudgetAndFinancialResources />} />
            <Route path="/strategic-perspectives-overview" element={<Navigate to="/president/strategic-perspectives-overview" replace />} />
            <Route path="/plans-overview" element={<Navigate to="/president/plans-overview" replace />} />
            <Route path="/budget" element={<Navigate to="/president/budget" replace />} />

            <Route path="/:planSection/add-objective" element={<AddObjective />} />
            <Route path="/:planSection/add-action" element={<AddAction />} />
            <Route path="/:planSection/add-task" element={<AddTask />} />
            <Route path="/:planSection/action-plan" element={<ActionPlan />} />

            <Route path="/contributor" element={<Navigate to="/dashboard" replace />} />
            <Route path="/contributor/calendar" element={<Calendar />} />
            <Route path="/contributor/notifications" element={<Notifications />} />
            <Route path="/contributor/proposals-status" element={<SubmissionStatus />} />
            <Route
              path="/contributor/submission-status"
              element={<Navigate to="/contributor/proposals-status" replace />}
            />
            <Route path="/contributor/catalysts" element={<Catalysts />} />
            <Route path="/contributor/enablers" element={<Enablers />} />
            <Route path="/contributor/beneficiary" element={<Beneficiary />} />
            <Route path="/contributor/stakeholders" element={<Stakeholders />} />
            <Route path="/contributor/:planSection/add-objective" element={<AddObjective />} />
            <Route path="/contributor/:planSection/add-action" element={<AddAction />} />
            <Route path="/contributor/:planSection/add-task" element={<AddTask />} />
            <Route path="/contributor/:planSection/action-plan" element={<ActionPlan />} />
            <Route path="/contributor/proposal/review/action" element={<ReviewAction />} />
            <Route path="/contributor/proposal/review/task" element={<ReviewTask />} />
            <Route path="/contributor/proposal/review/objective" element={<ReviewObjective />} />
            <Route path="/contributor/proposal/view/action-edits" element={<ViewActionEdits />} />
            <Route path="/contributor/proposal/view/task-edits" element={<ViewTaskEdits />} />
            <Route path="/contributor/proposal/view/objective-edits" element={<ViewObjEdits />} />
            <Route path="/contributor/proposal/edit/action" element={<EditAction />} />
            <Route path="/contributor/proposal/edit/task" element={<EditTask />} />
            <Route path="/contributor/proposal/edit/objective" element={<EditObjective />} />

            <Route path="/president/calendar" element={<Calendar />} />
            <Route path="/president/notifications" element={<Notifications />} />
            <Route path="/president/catalysts" element={<Catalysts />} />
            <Route path="/president/enablers" element={<Enablers />} />
            <Route path="/president/beneficiary" element={<Beneficiary />} />
            <Route path="/president/stakeholders" element={<Stakeholders />} />
            <Route path="/president/:planSection/add-objective" element={<AddObjective />} />
            <Route path="/president/:planSection/add-action" element={<AddAction />} />
            <Route path="/president/:planSection/add-task" element={<AddTask />} />
            <Route path="/president/:planSection/action-plan" element={<ActionPlan />} />

            <Route element={<RequireAuth allowedRoles={["administrator"]} />}>
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/admin/users" element={<Navigate to="/users" replace />} />
              <Route path="/admin/add-user" element={<Navigate to="/add-user" replace />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
