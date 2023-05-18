import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

export default function SideBar(props) {

  const pagesAccess = props.pagesAccess
  const setToken = props.setToken

  const [jobsisOpen, setJobsIsOpen] = useState(false);
  const [settingsisOpen, setSettingsIsOpen] = useState(false);
  const [hrIsOpen, setHrIsOpen] = useState(false);

  return (
    <>
        <div className='sidebar_main'>

          
              <>
              {(pagesAccess[0] && pagesAccess[0].name === "Dashboard Page") && (pagesAccess[0] && pagesAccess[0].isChecked) ? 
                <Link to="/admin/dashboard" className="sidebar_link_active">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-monitor icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  <span style={{marginLeft: '10px'}}>Dashboard</span>
                </Link>
              : "" }
                  
                  {pagesAccess[1] && pagesAccess[1].name === "Clients Page" && pagesAccess[1] && pagesAccess[1].isChecked ?
                  <Link to='/clients' className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase icon"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  <span style={{marginLeft: '10px'}}>Clients</span>
                  </Link>
                  : "" }

                  {pagesAccess[2] && pagesAccess[2].name === "Leads Page" && pagesAccess[2] && pagesAccess[2].isChecked ?
                  <Link 
                  to='/leads' 
                  className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers icon"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  <span style={{marginLeft: '10px'}}>Leads</span>
                  </Link>
                  : "" }
                  
                  {pagesAccess[3] && pagesAccess[3].name === "Jobs Page" && pagesAccess[3] && pagesAccess[3].isChecked ?
                  <Link to="/clients/job-planning" className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span style={{marginLeft: '10px'}}>Jobs</span>
                  </Link>
                  : "" }

                  {pagesAccess[10] && pagesAccess[10].name === "Tasks Page" && pagesAccess[10] && pagesAccess[10].isChecked ?
                    <Link to='/tasks' className="sidebar_link">
                    <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span style={{marginLeft: '10px'}}>Tasks</span>
                    </Link>
                  : "" }

                  {pagesAccess[4] && pagesAccess[4].name === "Sales Page" && pagesAccess[4] && pagesAccess[4].isChecked ?
                  <Link to="/sales" className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span style={{marginLeft: '10px'}}>Sales</span>
                  </Link>
                  : "" }

                  {pagesAccess[5] && pagesAccess[5].name === "HR Page" && pagesAccess[5] && pagesAccess[5].isChecked ?
                    <>
                      <Link className="sidebar_link" onClick={()=>{setHrIsOpen(!hrIsOpen)}}>
                      <div style={{justifyContent: 'space-between',}} className='d-flex'>
                        <div>
                          <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-monitor icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                          <span style={{marginLeft: '10px'}}>HR</span>
                        </div>
                        <div>
                          <svg style={{heigh: '15px', width: '15px', stroke: '#7b8190',}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5" stroke="#7b8190" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      </div>
                      </Link>

                      <div className={`sidebar_subtasks_hr ${hrIsOpen ? 'open' : 'closed'}`}  >

                          <Link to='/hr/employees' className="sidebar_link">
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Employees</span>
                          </Link>

                          <Link to='/hr/attendance' className="sidebar_link">
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Attendance</span>
                          </Link>

                      </div>
                    </>
                  : "" }
                  {pagesAccess[6] && pagesAccess[6].name === "Reports Page" && pagesAccess[6] && pagesAccess[6].isChecked ?
                    <>
                      <Link className="sidebar_link" onClick={()=>{setJobsIsOpen(!jobsisOpen)}}>
                      <div style={{justifyContent: 'space-between',}} className='d-flex'>
                        <div>
                        <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart icon"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                          <span style={{marginLeft: '10px'}}>Reports</span>
                        </div>
                        <div>
                          <svg style={{heigh: '15px', width: '15px', stroke: '#7b8190',}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5" stroke="#7b8190" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      </div>
                      </Link>

                      <div className={`sidebar_subtasks ${jobsisOpen ? 'open' : 'closed'}`}  >

                          <Link to="/timesheet" className="sidebar_link">
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Timesheet</span>
                          </Link>
                          
                          {/* <Link to="/clients/job-planning" className="sidebar_link">
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Job Planing</span>
                          </Link>

                          <Link className="sidebar_link">
                          <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          <span style={{marginLeft: '10px'}}>Database</span>
                          </Link> */}

                      </div>
                    </>
                  : "" }
                  
                  {/* <Link className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart icon"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                  <span style={{marginLeft: '10px'}}>Reports</span>
                  </Link> */}
                  
                  {pagesAccess[7] && pagesAccess[7].name === "Tickets Page" && pagesAccess[7] && pagesAccess[7].isChecked ?
                  <Link className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-life-buoy icon"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
                  <span style={{marginLeft: '10px'}}>Tickets</span>
                  </Link>
                  : "" }

                  {pagesAccess[8] && pagesAccess[8].name === "Template Page" && pagesAccess[8] && pagesAccess[8].isChecked ?
                  <Link className="sidebar_link">
                  <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-monitor icon"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  <span style={{marginLeft: '10px'}}>Templates</span>
                  </Link>
                  : "" }


                  {pagesAccess[9] && pagesAccess[9].name === "Settings Page" && pagesAccess[9] && pagesAccess[9].isChecked ?
                  <>
                    <Link className="sidebar_link" onClick={()=>{setSettingsIsOpen(!settingsisOpen)}}>
                    <div style={{justifyContent: 'space-between',}} className='d-flex'>
                      <div>
                      <svg style={{heigh: '20px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        <span style={{marginLeft: '10px'}}>Settings</span>
                      </div>
                      <div>
                        <svg style={{heigh: '15px', width: '15px', stroke: '#7b8190',}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5" stroke="#7b8190" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                    </div>
                    </Link>

                    <div className={`sidebar_subtasks_settings ${settingsisOpen ? 'open' : 'closed'}`}  >

                        <Link to="/roles" className="sidebar_link">
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>Roles</span>
                        </Link>
                        
                        <Link to="/roles/user" className="sidebar_link">
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>User Roles</span>
                        </Link>

                        <Link to='/finance/charts_of_accounts' className="sidebar_link">
                        <svg style={{heigh: '12px', width: '15px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span style={{marginLeft: '10px'}}>Chart Of Accounts</span>
                        </Link>

                    </div>

                  <Link onClick={()=>{
                    secureLocalStorage.removeItem("token");
                    setToken(secureLocalStorage.getItem('token'))
                  }} className="sidebar_link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                      <path d="M17.4399 14.62L19.9999 12.06L17.4399 9.5" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9.76001 12.0601H19.93" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    <span style={{marginLeft: '10px'}}>Logout</span>
                  </Link>

                  </>
                  : "" }
              </>
            

          

        </div>
    </>
  );
}
