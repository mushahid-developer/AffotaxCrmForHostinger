import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import Clients from "../Dashs/Admin/Clients/clients";
import EditClient from "../Dashs/Admin/Clients/EditClient";
import Dashboard from "../Dashs/Admin/DashBoard/DashBoard";
import AddEmployee from "../Dashs/Admin/Hr/Employee/AddEmployee";
import EditEmployee from "../Dashs/Admin/Hr/Employee/EditEmployee";
import Employees from "../Dashs/Admin/Hr/Employee/Employees";
import Leads from "../Dashs/Admin/Leads/Leads";
import Roles from "../Dashs/Admin/Settings/Roles/Roles";
import UserRoles from "../Dashs/Admin/Settings/UserRoles/UserRoles";
import SideBar from "../Dashs/Admin/SideBar/SideBar";
import Tasks from "../Dashs/Admin/Tasks/Tasks";
import Timesheet from "../Dashs/Admin/Timesheet/Timesheet";
import TopBar from "../Dashs/Admin/Topbar/TopBar";
import AddClients from "../Jobs/AddClients/AddClients";
import JobPlanning from "../Jobs/JobPlaning/JobPlanning";
import Sales from "../Dashs/Admin/Sales/Sales";
import InvoiceViewer from "../Dashs/Admin/Sales/InvoiceViewer";
import ChartsOfAccounts from "../Dashs/Admin/Finance/ChartsOfAccounts/ChartsOfAccounts";
import Attendance from "../Dashs/Admin/Hr/Attendance/Attendance";
import PublicDash from "../Dashs/Admin/DashBoard/PublicDash";
import Construction from "../Dashs/Admin/Construction/Construction";
import Templates from "../Dashs/Admin/Templates/Templates";
import Subscription from "../Dashs/Admin/Subscription/Subscription";

export default function AdminRoutes(props) {

  const pagesAccess = props.pagesAccess
  const miniNoteIsOpen = props.miniNoteIsOpen
  const setMiniNoteIsOpen = props.setMiniNoteIsOpen
  const recurringNoteIsOpen = props.recurringNoteIsOpen
  const setRecurringNoteIsOpen = props.setRecurringNoteIsOpen
  const roleName = props.roleName
  const setToken = props.setToken
  return (
    <>
    <Router>
          <div>
            <div className="layout_topbar">
              <TopBar 
                setMiniNoteIsOpen={setMiniNoteIsOpen}
                miniNoteIsOpen={miniNoteIsOpen} 
                setRecurringNoteIsOpen={setRecurringNoteIsOpen} 
                recurringNoteIsOpen={recurringNoteIsOpen} 
              />
            </div>
            <div className="Layout_bottom_screen">
              <div className="layout_sidebar">
                <SideBar setToken={setToken} pagesAccess={pagesAccess} />
              </div>
              <div className="layout_main_screen">
                <div className="layout_main_screen_content">
                <Routes>
                  <Route path="/" element = {<PublicDash />}></Route>
                  <Route path="/admin/dashboard" element = {<Dashboard />}></Route>
                  <Route path="/clients/add" element = {<AddClients />}></Route>
                  <Route path="/clients/job-planning" element = {<JobPlanning />}></Route>
                  <Route path="/subscription" element = {<Subscription />}></Route>
                  <Route path="/hr/employees" element = {<Employees />}></Route>
                  <Route path="/hr/employees/add" element = {<AddEmployee />}></Route>
                  <Route path="/hr/employees/edit/:id" element = {<EditEmployee />}></Route>
                  <Route path="/clients" element = {<Clients />}></Route>
                  <Route path="/client/:id" element = {<EditClient />}></Route>
                  <Route path="/timesheet" element = {<Timesheet roleName={roleName} />}></Route>
                  <Route path="/leads" element = {<Leads />}></Route>
                  <Route path="/roles" element = {<Roles />}></Route>
                  <Route path="/roles/user" element = {<UserRoles />}></Route>
                  <Route path="/tasks" element = {<Tasks />}></Route>
                  <Route path="/sales" element = {<Sales />}></Route>
                  <Route path="/view/invoice" element = {<InvoiceViewer />}></Route>
                  <Route path="/finance/charts_of_accounts" element = {<ChartsOfAccounts />}></Route>
                  <Route path="/hr/attendance" element = {<Attendance />}></Route>
                  <Route path="/construction" element = {<Construction />}></Route>
                  <Route path="/templates" element = {<Templates />}></Route>
                </Routes>
                </div>
              </div>
            </div>
          </div>
    </Router>
    </>
  );
}







