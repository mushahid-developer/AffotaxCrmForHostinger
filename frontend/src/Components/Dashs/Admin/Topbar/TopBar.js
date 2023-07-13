import { useState } from 'react';
import Timer from './Timer';
import logo from "../../../../Assets/Images/logo.svg"
import AddButton from "../../../../Assets/Images/addButton.png"
import Note from "../../../../Assets/Images/note.svg"
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function TopBar(props) {

  const miniNoteIsOpen = props.miniNoteIsOpen;
  const setMiniNoteIsOpen = props.setMiniNoteIsOpen;
  const recurringNoteIsOpen = props.recurringNoteIsOpen;
  const setRecurringNoteIsOpen = props.setRecurringNoteIsOpen;
  const pagesAccess = props.pagesAccess;
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState("")

  return (
    <>
      <div className='topbar_logo'>
        <img style={{width: "50px"}} src={logo} alt="" />
        <h1
          style={
            {
                fontSize: '27px',
                fontWeight: '600',
                width: '105px',
                marginLeft: "10px"
            }
          }
        >Affotax</h1>
      </div>
      <div className='topbar_body'>
        <div style={{width: '100%',}} className="row">
          <div style={{ zIndex: '1',}} className="col-8">
              <Timer setUser={setUser}/>
          </div>
          <div style={{alignItems: 'center', justifyContent: 'right',}} className="col-4 d-flex">

          <div className=' mx-2'>
                <div className="dropdown">
                  <button className="btn p-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <img style={{width: "24px"}} src={AddButton} alt="" />
                  </button>
                  <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                    
                    <ul style={{all: 'unset'}}>
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Dashboard Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/admin/dashboard") }} className={`dropdown-item ${location.pathname === '/admin/dashboard'? "active" : ""}`} >Dashboard</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Clients Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/clients") }} className={`dropdown-item ${location.pathname === '/clients'? "active" : ""}`} >Clients</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Tasks Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/tasks") }} className={`dropdown-item ${location.pathname === '/tasks'? "active" : ""}`} >Tasks</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Jobs Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/clients/job-planning") }} className={`dropdown-item ${location.pathname === '/clients/job-planning'? "active" : ""}`} >Jobs</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Tickets Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/tickets") }} className={`dropdown-item ${location.pathname === '/tickets'? "active" : ""}`} >Tickets</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Subscription Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/subscription") }} className={`dropdown-item ${location.pathname === '/subscription'? "active" : ""}`} >Subscription</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Leads Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/leads") }} className={`dropdown-item ${location.pathname === '/leads'? "active" : ""}`} >Leads</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Sales Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/sales") }} className={`dropdown-item ${location.pathname === '/sales'? "active" : ""}`} >Sales</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "HR Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/hr/employees") }} className={`dropdown-item ${location.pathname === '/hr/employees'? "active" : ""}`} >Employees</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "HR Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/hr/attendance") }} className={`dropdown-item ${location.pathname === '/hr/attendance'? "active" : ""}`} >Attendance</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Reports Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/timesheet") }} className={`dropdown-item ${location.pathname === '/timesheet'? "active" : ""}`} >Timesheet</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Template Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/templates") }} className={`dropdown-item ${location.pathname === '/templates'? "active" : ""}`} >Templates</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Construction Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/construction") }} className={`dropdown-item ${location.pathname === '/construction'? "active" : ""}`} >Construction</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Goals Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/goals") }} className={`dropdown-item ${location.pathname === '/goals'? "active" : ""}`} >Goals</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Settings Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/roles") }} className={`dropdown-item ${location.pathname === '/roles'? "active" : ""}`} >Roles</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Settings Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/roles/user") }} className={`dropdown-item ${location.pathname === '/roles/user'? "active" : ""}`} >User Roles</button></li>
                        )}
                      })}
                      {pagesAccess && pagesAccess.map(page => {
                      if(page.name === "Settings Page" && page.isChecked){
                        return(
                          <li><button onClick={(e)=>{e.preventDefault(); navigate("/finance/charts_of_accounts") }} className={`dropdown-item ${location.pathname === '/finance/charts_of_accounts'? "active" : ""}`} >Chart Of Accounts</button></li>
                        )}
                      })}
                    </ul>
                      
                  </div>
                </div>
              </div>

            
            <Link onClick={()=>{setMiniNoteIsOpen(!miniNoteIsOpen)}}>
              <img style={{width: "27px", marginRight: "10px"}} src={Note} alt="" />
            </Link>
            <Link onClick={()=>{setRecurringNoteIsOpen(!recurringNoteIsOpen)}}>
            <svg style={{marginRight: "10px"}} xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24"><path d="M4.922 16.71l-.651.758a6.832 6.832 0 0 1-2.07-4.983A6.372 6.372 0 0 1 8.585 6h7.454L14.4 4.36l.706-.708L17.954 6.5l-2.848 2.848-.707-.707L16.04 7H8.586A5.386 5.386 0 0 0 3.2 12.5a5.92 5.92 0 0 0 1.722 4.21zm14.8-9.178l-.652.758a5.944 5.944 0 0 1 1.73 4.21 5.39 5.39 0 0 1-5.395 5.5H7.96l1.64-1.64-.706-.708L6.046 18.5l2.848 2.848.707-.707L7.96 19h7.445a6.376 6.376 0 0 0 6.395-6.486 6.857 6.857 0 0 0-2.079-4.982z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
            </Link>
            <p>{user}</p>
          </div>
        </div>
      </div>
    </>
  );
}
