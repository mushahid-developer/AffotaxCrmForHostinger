import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import Clients from "../Dashs/Admin/Clients/clients";
import EditClient from "../Dashs/Admin/Clients/EditClient";
import Dashboard from "../Dashs/Admin/DashBoard/DashBoard";
import AddEmployee from "../Dashs/Admin/Hr/AddEmployee";
import Employees from "../Dashs/Admin/Hr/Employees";
import Leads from "../Dashs/Admin/Leads/Leads";
import SideBar from "../Dashs/Admin/SideBar/SideBar";
import Timesheet from "../Dashs/Admin/Timesheet/Timesheet";
import TopBar from "../Dashs/Admin/Topbar/TopBar";
import AddClients from "../Jobs/AddClients/AddClients";
import JobPlanning from "../Jobs/JobPlaning/JobPlanning";

export default function AdminRoutes() {
  return (
    <>
    <Router>
          <div>
            <div className="layout_topbar">
              <TopBar />
            </div>
            <div className="Layout_bottom_screen">
              <div className="layout_sidebar">
                <SideBar />
              </div>
              <div className="layout_main_screen">
                <div className="layout_main_screen_content">
                <Routes>
                  <Route path="/" element = {<Dashboard />}></Route>
                  <Route path="/clients/add" element = {<AddClients />}></Route>
                  <Route path="/clients/job-planning" element = {<JobPlanning />}></Route>
                  <Route path="/hr/employees" element = {<Employees />}></Route>
                  <Route path="/hr/employees/add" element = {<AddEmployee />}></Route>
                  <Route path="/clients" element = {<Clients />}></Route>
                  <Route path="/client/:id" element = {<EditClient />}></Route>
                  <Route path="/timesheet" element = {<Timesheet />}></Route>
                  <Route path="/leads" element = {<Leads />}></Route>
                </Routes>
                </div>
              </div>
            </div>
          </div>
    </Router>
    </>
  );
}







