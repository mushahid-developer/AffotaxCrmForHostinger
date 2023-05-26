import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Store } from 'react-notifications-component';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import SelectUnSelectFilter from '../../../Jobs/JobPlaning/SelectUnSelectFilter';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { useSpring, animated } from 'react-spring';

var addProjectName = axiosURL.ConstructionAddProjectHouseNo;
var deleteProjectName = axiosURL.ConstructionDeleteHouseNo;
var getAllTasksUrl = axiosURL.ConstructionGetAllTasksUrl;
var addOneTasksUrl = axiosURL.ConstructionAddOneTasksUrl;
var ProjDeleteUrl = axiosURL.ConstructionTaslDeleteUrl;
var Tasks_Update_One_Url = axiosURL.ConstructionTasks_Update_One_Url;
var ProjCopyUrl = axiosURL.ConstructionTaskCopyUrl;
var ProjCompletedUrl = axiosURL.ConstructionTaskSetCompletedUrl;



const Construction = () => {
    const [loader, setLoader] = useState(true)
    const [reRender, setReRender] = useState(true)
    const [reRender2, setReRender2] = useState(0)

    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [addProjectFormData, setAddProjectFormData] = useState();

    const [openProjectId, setOpenProjectId] = useState(null)
    const [openProjectTasks, setOpenProjectTasks] = useState(null)

    const [preData, setPreData] = useState(null);
    const [openProjectNames, setOpenProjectNames] = useState(null);
    const [closeProjectNames, setCloseProjectNames] = useState(null);
    const [projectFOpenNames, setProjectFOpenNames] = useState(null);
    const [projectFCloseNames, setProjectFCloseNames] = useState(null);
    const [fPreData, setFPreData] = useState(null);

    const [statusFvalue, setStatusFvalue] = useState(null);
    const [projectFvalue, setProjectFvalue] = useState('CRM-Affotax');
    const [supervisorFvalue, setSupervisorFvalue] = useState(null);
    const [jHolderFvalue, setJHolderFvalue] = useState(null);
    const [ManagerFvalue, setManagerFvalue] = useState(null);
    const [filterFvalue, setFilterFvalue] = useState('Open');

    const [usersForFilter, setUsersForFilter] = useState([]);

    const [addTaskFormData, setAddTaskFormData] = useState({
      houseNoList_id: '',
      Task: '',
      supervisor_id: '',
      Jobholder_id: '',
      startDate: null,
      completationDate: null,
      JobDate: null,
      Note: null,
      budgetPlan: null,
      budgetActual: null,
      status: 'Progress',
      Manager: null,
      comments: null,
    })

    const [colVisibility, setColVisibility] = useState({
      houseNoList_id:false,
      Task_No:false,
      Task:false,
      supervisor_id:false,
      Jobholder_id:false,
      startDate:false,
      completationDate:false,
      completationDateActual:true,
      JobDate:false,
      Jstatus:false,
      
      //////////////
      days:true,
      Note:false,
      daysActual:true,
      budgetPlan:true,
      budgetActual:true,
      status:false,
      Manager:false,
      Actions:false,
      comments:true,
    });


    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);
    const [isOpen, setIsOpen] = useState(false);

    const [gridApi, setGridApi] = useState(null);

    
    const gridRef = useRef();
    
    const handleToggle = () => {
      setIsOpen(!isOpen);
  };
    
    const dropdownAnimation = useSpring({
      maxHeight: isOpen ? 'fit-content' : 0,
      maxWidth: isOpen ? 'fit-content' : 0,
      minWidth: isOpen ? '176px' : 0,
      opacity: isOpen ? 1 : 0,
      position: 'absolute',
      backgroundColor: 'white',
      width: '13.5%',
      boxShadow: 'rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px',
      borderRadius: '0px 0px 9px 9px',
  });

    const handleCloseAddTaskModal = () => {
      setShowAddTaskModal(false);
    };

    const handleAddFormDataChange = (e)=>{
      const { name, value } = e.target;
      setAddTaskFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
    }

    const handleAddTaskForm = async ()=>{
      try {
        const response = await axios.post(addOneTasksUrl,
            {
              formData:addTaskFormData 
            },
            {
              headers:{ 'Content-Type': 'application/json' }
            }
        );
        
        if(response){
          setAddTaskFormData({
            name: '',
            description: '',
            startDate: '',
            deadline: '',
            Jobholder_id: null,
            status: 'Progress',
          })
          setShowAddTaskModal(false);
          setLoader(false);
          setReRender(!reRender)
          
        }
        
    
        } catch (err) {
          console.log(err)
          Store.addNotification({
              title: 'Error',
              message: "Please Try Again",
              type: "danger",
              insert: "top",
              container: "top-center",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true
              }
            });
      };

    }

    const handleAddProjectForm = async ()=>{
      try {
        const response = await axios.post(addProjectName,
            {
              name: addProjectFormData 
            },
            {
              headers:{ 'Content-Type': 'application/json' }
            }
        );
        
        if(response){
          setAddProjectFormData('')
          setShowAddProjectModal(false);
          setReRender(!reRender)
          
        }
        
    
        } catch (err) {
          console.log(err)
          Store.addNotification({
              title: 'Error',
              message: "Please Try Again",
              type: "danger",
              insert: "top",
              container: "top-center",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true
              }
            });
      };

    }

    const handleDeleteProjectName = async (projId)=>{
      setLoader(true)
      const confirmed = window.confirm('Are you sure you want to delete this item?');
      if (confirmed) {

        await axios.get(`${deleteProjectName}/${projId}`,
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );

        setReRender(!reRender);
      }
    }

    const filter = async ()=>{

      var filteredArray = mainRowData

      //Completed Filter
      if(filteredArray !== undefined && filterFvalue !== null && filterFvalue !== "" && filterFvalue === "Open"){
        filteredArray = filteredArray.filter(obj => obj.isActive );
      }
      if(filteredArray !== undefined && filterFvalue !== null && filterFvalue !== "" && filterFvalue === "Close"){
        filteredArray = filteredArray.filter(obj => !obj.isActive );
      }
      
    
      //Project Filter
      if(filteredArray !== undefined && projectFvalue !== null && projectFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.houseNoList_id && obj.houseNoList_id.name === projectFvalue);
      }

      //Status Filter
      if(filteredArray !== undefined && statusFvalue !== null && statusFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.status && obj.status === statusFvalue);
      }

      // Supervisor Filter
      if(filteredArray != undefined && supervisorFvalue != null && supervisorFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.supervisor_id && obj.supervisor_id.name === supervisorFvalue);
      }

      // Job Holder Filter
      if(filteredArray != undefined && jHolderFvalue != null && jHolderFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.Jobholder_id && obj.Jobholder_id.name === jHolderFvalue);
      }

      // Manager Filter
      if(filteredArray != undefined && ManagerFvalue != null && ManagerFvalue !== ""){
        filteredArray = filteredArray.filter(obj => obj.Manager && obj.Manager.name === ManagerFvalue);
      }
    
      setRowData(filteredArray)
    
     }

    useEffect(()=>{
      // setRowData(mainRowData)
      filter()
    }, [mainRowData, statusFvalue, projectFvalue, jHolderFvalue, supervisorFvalue, ManagerFvalue, filterFvalue])

    var ii = 1;

    useEffect(()=>{
      
      const tempArr = usersForFilter
      
          const newObj = { value: null, label: 'Select' };
  
          tempArr.unshift(newObj);
          setUsersForFilter(tempArr)
  
     }, [usersForFilter])



     useEffect(()=>{

      if(projectFOpenNames){
        const tempArr = projectFOpenNames
        
            const newObj = { value: null, label: 'Select' };
    
            tempArr.unshift(newObj);
    
            setProjectFOpenNames(tempArr)
      }


      if(projectFCloseNames){
        const tempArr = projectFCloseNames
        
            const newObj = { value: null, label: 'Select' };
    
            tempArr.unshift(newObj);
    
            setProjectFCloseNames(tempArr)
      }
     }, [fPreData])


    const getData = async ()=>{
        // setLoader(true)
        try {
            const response = await axios.get(getAllTasksUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                console.log(response.data)
                setMainRowData(response.data.Construction)
                setPreData(response.data.users)
                
                setOpenProjectNames(response.data.HouseNo.filter(names =>  names.isActive));
                setCloseProjectNames(response.data.HouseNo.filter(names =>  !names.isActive));
                const OpenProjsss = response.data.HouseNo.filter(names =>  names.isActive );
                const CloseProjsss = response.data.HouseNo.filter(names =>  !names.isActive );


                setProjectFOpenNames(OpenProjsss.map(names => {
                  if(names.isActive){
                    return { value: names._id, label: names.name };
                  }
                }));
                setProjectFCloseNames(CloseProjsss.map(names => {
                  if(!names.isActive){
                    return { value: names._id, label: names.name };
                  }
                  }));
                
                setUsersForFilter(response.data.users.map(names => {
                  return { value: names._id, label: names.name };
                }));
                setFPreData(response.data.users.map(names => {
                  return { value: names._id, label: names.name };
                }))
                setLoader(false)
            }
            
        
            } catch (err) {
            Store.addNotification({
                title: 'Error',
                message: "Please Try Again",
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
                });
        };
    }

    
    useEffect(()=>{
      if(openProjectId){
        if(rowData !== undefined){
          var filteredArray = rowData.filter(obj => obj && obj._id === openProjectId);
        }
        setOpenProjectTasks(filteredArray && filteredArray[0])
        console.log(filteredArray)
      }
    }, rowData)

    const handleDeleteProject = async (projId)=>{
      setLoader(true)
      const confirmed = window.confirm('Are you sure you want to delete this item?');
      if (confirmed) {

        await axios.get(`${ProjDeleteUrl}/${projId}`,
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );

        setReRender(!reRender);
      }
    }

    const handleCompleteProject = async (projId)=>{
      setLoader(true)
      const confirmed = window.confirm('Are you sure you want to mark it as Completed?');
      if (confirmed) {

        await axios.get(`${ProjCompletedUrl}/${projId}`,
            {
            headers:{ 'Content-Type': 'application/json' }
            }
        );

        setReRender(!reRender);
      }
    }

    const handleCopyProject = async (projId)=>{
      setLoader(true)
      await axios.get(`${ProjCopyUrl}/${projId}`,
          {
          headers:{ 'Content-Type': 'application/json' }
          }
      );

      setReRender(!reRender);
    }

    function calculateDaysBetweenDates(date1, date2) {
      // Convert the dates to UTC to avoid time zone issues
      const utcDate1 = new Date(date1.toUTCString());
      const utcDate2 = new Date(date2.toUTCString());
    
      // Calculate the time difference in milliseconds
      const timeDiff = Math.abs(utcDate2 - utcDate1);
    
      // Convert the time difference to days
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
      return days;
    }
    
    
    
      const columnDefs = [
        
        { headerName: 'House No', field: 'houseNoList_id', flex:2.5,
        valueGetter: (params)=>{return(params.data.houseNoList_id && params.data.houseNoList_id.name)} ,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams:  {
          values: filterFvalue === "Open" ? projectFOpenNames && projectFOpenNames.map(option => option.label) : projectFCloseNames && projectFOpenNames.map(option => option.label) ,
        },
        floatingFilterComponent: 'selectFloatingFilter', 
        floatingFilterComponentParams: { 
          options: filterFvalue === "Open" ? openProjectNames && openProjectNames.map(option => option.name) : closeProjectNames && closeProjectNames.map(option => option.name),
          onValueChange:(value) => setProjectFvalue(value),
          value: projectFvalue,
          suppressFilterButton: true, 
          suppressInput: true 
        } 
        },
        {
          headerName: "Task No",
          field: "Task_No",
          filter: false,
          flex: 1.5,
          editable: false,
          valueGetter: (params) => `Task# ${params.node.rowIndex + 1}`,
        },
        { 
          headerName: 'Task', 
          field: 'Task', 
          flex:4,
          cellStyle:(params)=>{
          
              return{color: "#0d6efd"}
          },
        },
        { headerName: 'Supervisor', field: 'supervisor_id', flex:2,
        valueGetter: p => {
          return p.data.supervisor_id !== null ? p.data.supervisor_id.name : ' ' //to get value from obj inside obj
        },
        cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: usersForFilter && usersForFilter.map(option => option.label),
          },
          onCellValueChanged: function(event) {
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: fPreData && fPreData.map(option => option.label),
            onValueChange:(value) => setSupervisorFvalue(value),
            value: supervisorFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        { headerName: 'Job Holder', field: 'Jobholder_id', flex:2,
        valueGetter: p => {
          return p.data.Jobholder_id !== null ? p.data.Jobholder_id.name : ' ' //to get value from obj inside obj
        },
        cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: usersForFilter && usersForFilter.map(option => option.label),
          },
          onCellValueChanged: function(event) {
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: fPreData && fPreData.map(option => option.label),
            onValueChange:(value) => setJHolderFvalue(value),
            value: jHolderFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        { 
          headerName: 'Start Date', 
          field: 'startDate', 
          flex:2.2, 
          valueGetter: p => {
            if(p.data.startDate && p.data.startDate !== "Invalid Date")
            {
              const deadline = new Date(p.data.startDate)
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
              return(`${da}-${mo}-${ye}`);
              }
              else{
                return ""
            }    
          },
        },
        { headerName: 'Deadline', field: 'completationDate', flex:2.2,
          valueGetter: p => {
            if(p.data.completationDate && p.data.completationDate !== "Invalid Date")
            {
              const deadline = new Date(p.data.completationDate)
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
              return(`${da}-${mo}-${ye}`);
              }
              else{
                return ""
            }    
          },
          cellStyle:(params)=>{
            const today = new Date()
            const deadline = new Date(params.value)
            if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
              return{color: "red"}
            }
            if((deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
              return{color: "black"}
            }
          },
        },
        { headerName: 'Deadline-Actual', field: 'completationDateActual', flex:2.2,
          valueGetter: p => {
            if(p.data.completationDateActual && p.data.completationDateActual !== "Invalid Date")
            {
              const deadline = new Date(p.data.completationDateActual)
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
              return(`${da}-${mo}-${ye}`);
              }
              else{
                return ""
            }    
          },
        },
        { headerName: 'Job Date', field: 'JobDate', flex:2.2,
          valueGetter: p => {
            if(p.data.JobDate && p.data.JobDate !== "Invalid Date")
            {
              const deadline = new Date(p.data.JobDate)
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
              return(`${da}-${mo}-${ye}`);
              }
              else{
                return ""
            }    
          },
        },
        { 
          headerName: 'Status', 
          field: 'Jstatus', 
          flex:2,
          editable: false,
          valueGetter: p => {
            const deadline = new Date(p.data.completationDate)
            const startDate = new Date(p.data.startDate)
            var today = new Date();
            
            if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) )) {
              return "Overdue";
            }
            else if(( (startDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0))))
            {
              return "Due"
            }
            else if(( (startDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))))
            {
              return "Due"
            }

          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: ['Overdue', 'Due'],
            onValueChange:(value) => setStatusFvalue(value),
            value: statusFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        { headerName: 'Days', field: 'days', flex:4, editable: false,
          valueGetter: p =>{
            if(p.data.completationDate && p.data.completationDate !== "Invalid Date" && p.data.startDate && p.data.startDate !== "Invalid Date"){
              const startDate = new Date(p.data.startDate);
              const endDate = new Date(p.data.completationDate);
              return calculateDaysBetweenDates(startDate, endDate);
            }
          }
        },
        { headerName: 'Note', field: 'Note', flex:6,},
        { headerName: 'Days-Actual', field: 'daysActual', flex:4, editable: false,
        valueGetter: p =>{
          if(p.data.completationDateActual && p.data.completationDateActual !== "Invalid Date" && p.data.startDate && p.data.startDate !== "Invalid Date"){
            const startDate = new Date(p.data.startDate);
            const endDate = new Date(p.data.completationDateActual);
            return calculateDaysBetweenDates(startDate, endDate);
          }
        }
        },
        { headerName: 'Budget-Plan', field: 'budgetPlan', flex:4,},
        { headerName: 'Budget-Actual', field: 'budgetActual', flex:4,},
        { 
          headerName: 'Status', 
          field: 'status', flex:2,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'To do', 'Progress', 'Review', 'Completed'] },
          floatingFilterComponent: 'SelectUnSelectFilter', 
          floatingFilterComponentParams: { 
            options: ['To do', 'Progress', 'Review', 'Completed'],
            onValueChange:(value) => setStatusFvalue(value),
            value: statusFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        { headerName: 'Manager', field: 'Manager', flex:2,
          valueGetter: p => {
            return p.data.Manager !== null ? p.data.Manager.name : ' ' //to get value from obj inside obj
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: usersForFilter && usersForFilter.map(option => option.label),
          },
          onCellValueChanged: function(event) {
          },
          floatingFilterComponent: 'selectFloatingFilter', 
          floatingFilterComponentParams: { 
            options: fPreData && fPreData.map(option => option.label),
            onValueChange:(value) => setManagerFvalue(value),
            value: ManagerFvalue,
            suppressFilterButton: true, 
            suppressInput: true 
          }
        },
        { 
          headerName: 'Action', 
          editable: false,
          field: 'Actions', 
          flex:1.8,
          cellRendererFramework: (params)=>
          <>
          {params.data.isActive && 
          <> 
            <Link onClick={()=>{handleCopyProject(params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
              <svg className="mx-1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 256 256">
                <path d="M48.186 92.137c0-8.392 6.49-14.89 16.264-14.89s29.827-.225 29.827-.225-.306-6.99-.306-15.88c0-8.888 7.954-14.96 17.49-14.96 9.538 0 56.786.401 61.422.401 4.636 0 8.397 1.719 13.594 5.67 5.196 3.953 13.052 10.56 16.942 14.962 3.89 4.402 5.532 6.972 5.532 10.604 0 3.633 0 76.856-.06 85.34-.059 8.485-7.877 14.757-17.134 14.881-9.257.124-29.135.124-29.135.124s.466 6.275.466 15.15-8.106 15.811-17.317 16.056c-9.21.245-71.944-.49-80.884-.245-8.94.245-16.975-6.794-16.975-15.422s.274-93.175.274-101.566zm16.734 3.946l-1.152 92.853a3.96 3.96 0 0 0 3.958 4.012l73.913.22a3.865 3.865 0 0 0 3.91-3.978l-.218-8.892a1.988 1.988 0 0 0-2.046-1.953s-21.866.64-31.767.293c-9.902-.348-16.672-6.807-16.675-15.516-.003-8.709.003-69.142.003-69.142a1.989 1.989 0 0 0-2.007-1.993l-23.871.082a4.077 4.077 0 0 0-4.048 4.014zm106.508-35.258c-1.666-1.45-3.016-.84-3.016 1.372v17.255c0 1.106.894 2.007 1.997 2.013l20.868.101c2.204.011 2.641-1.156.976-2.606l-20.825-18.135zm-57.606.847a2.002 2.002 0 0 0-2.02 1.988l-.626 96.291a2.968 2.968 0 0 0 2.978 2.997l75.2-.186a2.054 2.054 0 0 0 2.044-2.012l1.268-62.421a1.951 1.951 0 0 0-1.96-2.004s-26.172.042-30.783.042c-4.611 0-7.535-2.222-7.535-6.482S152.3 63.92 152.3 63.92a2.033 2.033 0 0 0-2.015-2.018l-36.464-.23z" stroke="#979797" fill-rule="evenodd"/>
              </svg>
            </Link>
          </>
          }
          <Link onClick={()=>{handleDeleteProject(params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </Link>
          </>
        },
        { headerName: 'Comment', field: 'comments', flex:4,}
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        editable: true,
        resizable: true
       }));

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);

      const frameworkComponents = {
        selectFloatingFilter: DropdownFilter,
        SelectUnSelectFilter: SelectUnSelectFilter
      };

      async function onGridReady(params) {
        setGridApi(params);
      }


      const onCellValueChanged = useCallback((event) => {
        if(event.colDef.field === "Manager"){
          const selectedOption = fPreData.find(option => option.label === event.data.Manager);
          event.data.Manager = selectedOption ? selectedOption.value : '';
        }
        
        if(event.colDef.field === "Jobholder_id"){
          const selectedOption = fPreData.find(option => option.label === event.data.Jobholder_id);
          event.data.Jobholder_id = selectedOption ? selectedOption.value : '';
        }
        
        if(event.colDef.field === "supervisor_id"){
          const selectedOption = fPreData.find(option => option.label === event.data.supervisor_id);
          event.data.supervisor_id = selectedOption ? selectedOption.value : '';
        }

        if(event.colDef.field === "houseNoList_id"){
          const selectedOption = projectFOpenNames && filterFvalue === "Open" ? projectFOpenNames ? projectFOpenNames.find(option => option.label === event.data.houseNoList_id) : " " : projectFCloseNames ?  projectFOpenNames.find(option => option.label === event.data.houseNoList_id) : "";
          event.data.houseNoList_id = selectedOption ? selectedOption.value : '';
        }
        console.log()
      }, [gridApi]);

      var i = 1

      
const onRowValueChanged = useCallback(async (event) => {
  var data = event.data;
  try{
    const resp = await axios.post(`${Tasks_Update_One_Url}/${data._id}`, 
      {
        formData: data
      },
      {
        headers:{ 'Content-Type': 'application/json' }
      }
    );
      console.log(resp)
      console.log(i)
      setLoader(true)
      setReRender2(i)
      i = i + 1

  }catch(err){
    console.log(err)
  }

}, []);

useEffect(() => {
  getData();
}, [reRender, reRender2]);


function handleMenuClick(e) {
  // Prevent the default behavior of the click event
  e.preventDefault();

  // Stop the click event from propagating to the dropdown menu
  e.stopPropagation();
}

const toggleColHandler = (e, name) => {
  handleMenuClick(e);
  gridApi.columnApi.setColumnVisible(name, colVisibility[name])
  setColVisibility({ ...colVisibility, [name]: !colVisibility[name] })
}

const handleColHideOnStart= ()=>{
  if(gridApi){
    gridApi.columnApi.setColumnVisible("completationDateActual", false)
    gridApi.columnApi.setColumnVisible("days", false)
    gridApi.columnApi.setColumnVisible("daysActual", false)
    gridApi.columnApi.setColumnVisible("budgetPlan", false)
    gridApi.columnApi.setColumnVisible("budgetActual", false)
    gridApi.columnApi.setColumnVisible("comments", false)
  }
  
}

useEffect(()=>{
  if(gridApi){
    handleColHideOnStart();
  }
}, [gridApi])
      


  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault()
    try {
    const params = {
      sheetName: 'Grid Data',
      fileName: `Construction - ${new Date().toISOString().slice(0, 10)}`,
      allColumns: true
    };

    const exportData = gridApi.api.exportDataAsCsv(params);
    const workbook = XLSX.read(exportData, { type: 'binary' });
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'csv',
      type: 'array',
      bookSST: false
    });
    saveAs(
      new Blob([excelBuffer], { type: 'application/octet-stream' }),
      `${params.fileName}.csv`
    );
    } catch (error) {
    const a = error;
  }
  };
      


    if(loader)
    {
      return(<Loader/>)
    }
    else{

      

    return (
        <>


            <div style={{
        border: 'none'
        }}
        className="mt-3 card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

          <div style={{alignItems: 'center',}} className='d-flex'>

            <div >
              <h4 style={{padding: '20px 16px',}}>
                  Construction
              </h4>
            </div>

            <div  className='table-col-numbers mx-2'>
              <select className='form-control' onChange={onPageSizeChanged} id="page-size">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>


            <div className='table-show-hide mx-2'>
                <div className="dropdown">
                  <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <svg style={{height: '16px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-eye-off icon-16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                  <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                    <div className="row">
                      <div className="col-6">
                        <ul style={{all: 'unset'}}>
                          <li><button onClick={(e)=>{toggleColHandler(e, "houseNoList_id")}} className={`dropdown-item ${!colVisibility.houseNoList_id? "" : "active"}`}  >House No</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Task_No")}} className={`dropdown-item ${!colVisibility.Task_No? "" : "active"}`}  >Task No</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Task")}} className={`dropdown-item ${!colVisibility.Task? "" : "active"}`} >Task</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "supervisor_id")}} className={`dropdown-item ${!colVisibility.supervisor_id? "" : "active"}`} >Supervisor</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Jobholder_id")}} className={`dropdown-item ${!colVisibility.Jobholder_id? "" : "active"}`} >J.Holder</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "startDate")}} className={`dropdown-item ${!colVisibility.startDate? "" : "active"}`} >Start Date</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "completationDate")}} className={`dropdown-item ${!colVisibility.completationDate? "" : "active"}`} >Completation Date</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "completationDateActual")}} className={`dropdown-item ${!colVisibility.completationDateActual? "" : "active"}`} >Completation Date Actual</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "JobDate")}} className={`dropdown-item ${!colVisibility.JobDate? "" : "active"}`} >J.Date</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Jstatus")}} className={`dropdown-item ${!colVisibility.Jstatus? "" : "active"}`} >J.Status</button></li>
                          </ul>
                      </div>
                      <div className="col-6">
                        <ul style={{all: 'unset'}}>
                          <li><button onClick={(e)=>{toggleColHandler(e, "days")}} className={`dropdown-item ${!colVisibility.days? "" : "active"}`} >Days</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Note")}} className={`dropdown-item ${!colVisibility.Note? "" : "active"}`}  >Note</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "daysActual")}} className={`dropdown-item ${!colVisibility.daysActual? "" : "active"}`}>Days Actual</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "budgetPlan")}} className={`dropdown-item ${!colVisibility.budgetPlan? "" : "active"}`} >Budget Plan</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "budgetActual")}} className={`dropdown-item ${!colVisibility.budgetActual? "" : "active"}`} >Budget Actual</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "status")}} className={`dropdown-item ${!colVisibility.status? "" : "active"}`} >Status</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Manager")}} className={`dropdown-item ${!colVisibility.Manager? "" : "active"}`} >Manager</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "Actions")}} className={`dropdown-item ${!colVisibility.Actions? "" : "active"}`} >Actions</button></li>
                          <li><button onClick={(e)=>{toggleColHandler(e, "comments")}} className={`dropdown-item ${!colVisibility.comments? "" : "active"}`} >Comments</button></li>
                          </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div>
                <select name='mon_week' onChange={(e)=>{setFilterFvalue(e.target.value)}} defaultValue={filterFvalue} style={{width: '110px'}} className='form-control mx-2'>
                    
                    <option value = "Open">
                      Open
                    </option>
                    <option value = "Close">
                        Close
                    </option>
                </select>
            </div>




          </div>

        <div className='d-flex'>
        <Link onClick={exportToExcel} style={{
          backgroundColor: 'transparent',
          color: 'black',
          borderColor: 'lightgray',
          alignSelf: 'center',
        }} className='btn btn-primary mx-2'>
            Excel
          </Link>
        <div style={{
              width: '11rem',
              overflow: 'visible',
              zIndex: '100',
              alignSelf: 'center',
              marginRight: '19px',
        }}>
                <div style={{
                    width: '100%',     
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: '1.5',
                    fontSize: '1rem', 
                    borderBottom: '1px solid #ced4da', 
                    padding: '8px', 
                    borderRadius: '0rem',
                    cursor: 'pointer',
                }} 
                onClick={handleToggle}
                >
                        <div  style={{width: '100%'}} className='row'>
                            <div className='col-10'>
                                Projects
                            </div>
                            <div style={{padding: '0px', textAlign: 'right',}} className='col-2'>
                                <svg style={{width: '20px', stroke: 'rgb(123, 129, 144)'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 10l5 5 5-5" stroke="#7b8190" stroke-width="2" fill="none"></path></svg>
                            </div>
                        </div>
                </div>
                <animated.div style={dropdownAnimation}>
                    {isOpen && (
                    <div >
                        <div style={{margin: 10}}>
                          {filterFvalue === "Open" ? 
                          openProjectNames && openProjectNames.map((task, ind)=>{
                            return(
                            <div style={{cursor: 'default'}} key={ind} className='row recurringTask_task'>
                                <div className='col-9'>
                                    <p> {task.name} </p>
                                </div>
                                
                                <div className='col-3 d-flex'>
                                <Link onClick={()=>{handleCompleteProject(task._id)}} style={{marginRight: '5px', all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><title/><g id="Complete"><g id="tick"><polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g></svg>          
                                </Link>
                                  <div onClick={()=>{handleDeleteProjectName(task._id)}} style={{cursor: "pointer"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  </div>
                                </div>
                            </div>
                            )}
                        ) 
                          : 

                          closeProjectNames && closeProjectNames.map((task, ind)=>{
                            return(
                            <div style={{cursor: 'default'}} key={ind} className='row recurringTask_task'>
                                <div className='col-9'>
                                    <p> {task.name} </p>
                                </div>
                                
                                <div className='col-3 d-flex'>
                                <Link onClick={()=>{handleCompleteProject(task._id)}} style={{marginRight: '5px', all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"><title/><g id="Complete"><g id="tick"><polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g></svg>          
                                </Link>
                                  <div onClick={()=>{handleDeleteProjectName(task._id)}} style={{cursor: "pointer"}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x icon-16"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  </div>
                                </div>
                            </div>
                            )}
                        )
                            }
                        
                           
                        </div>
                    </div>
                    )}
                </animated.div>
            </div>
          <div className=''>
            <Link onClick={()=>{setShowAddProjectModal(true);}} className='btn btn-primary'>
              Add Project
            </Link>
          </div>
          <div className='mx-4'>
            <Link onClick={()=>{setShowAddTaskModal(true);}} className='btn btn-primary'>
              Add Task
            </Link>
          </div>
        </div>
          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
              onGridReady={onGridReady}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
              ref={gridRef}
              animateRows={true} // Optional - set to 'true' to have rows animate when sorted
              rowSelection='multiple' // Options - allows click selection of rows
              pagination = {true}
              paginationPageSize = {25}
              suppressDragLeaveHidesColumns={true}
              frameworkComponents={frameworkComponents}

              editType={'fullRow'}
              onCellValueChanged={onCellValueChanged}
              onRowValueChanged={onRowValueChanged}
            />
            
          </div>
        </div>
    </div>


    <Modal show={showAddProjectModal} centered onHide={()=>{setShowAddProjectModal(!showAddProjectModal)}}>
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          onSubmit={handleAddProjectForm}
          >
            
            <Form.Group className='mt-2'>
              <Form.Control
                  name='projectName'
                  type="text"
                  placeholder="Project Name"
                  onChange={(e)=>{setAddProjectFormData(e.target.value)}}
                  value = {addProjectFormData}
              />
            </Form.Group>              

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowAddProjectModal(!showAddProjectModal)}}>Close</Button>
          <Button onClick={handleAddProjectForm} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>





    <Modal show={showAddTaskModal} centered onHide={handleCloseAddTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          onSubmit={handleAddTaskForm}
          >
            <Form.Group className='mt-2'>
             <Form.Label>Project</Form.Label>
            <Form.Select 
              name='houseNoList_id'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.houseNoList_id}
              >
                  <option>Project</option>
                  {openProjectNames && openProjectNames.map((proj, ind)=>{
                    return(
                      <option key={ind} value={proj._id}>{proj.name}</option>
                    )
                  })}
                 
              </Form.Select>
              
            </Form.Group>
            <Form.Group className='mt-2'>
               <Form.Label>Task</Form.Label>
              <Form.Control
                  name='Task'
                  type="text"
                  placeholder="Task"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.Task}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
    
               <Form.Label>Supervisor</Form.Label>
              <Form.Select 
              name='supervisor_id'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.supervisor_id}
              >
                  <option>Supervisor</option>
                  {preData && preData.map((manager, index)=>
                      <option key={index} value={manager._id}>{manager.name}</option>
                  )}
              </Form.Select>

            </Form.Group>

            <Form.Group className='mt-2'>
    
               <Form.Label>Job Holder</Form.Label>
              <Form.Select 
              name='Jobholder_id'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.Jobholder_id}
              >
                  <option>Job Holder</option>
                  {preData && preData.map((manager, index)=>
                      <option key={index} value={manager._id}>{manager.name}</option>
                  )}
              </Form.Select>

            </Form.Group>

            <Form.Group className='mt-2'>
               <Form.Label>Start Date</Form.Label>
              <Form.Control
                  name='startDate'
                  type="date"
                  placeholder="Start Date"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.startDate}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
               <Form.Label>Completation Date</Form.Label>
              <Form.Control
                  name='completationDate'
                  type="date"
                  placeholder="completation Date"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.completationDate}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
               <Form.Label>Job Date</Form.Label>
              <Form.Control
                  name='JobDate'
                  type="date"
                  placeholder="Job Date"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.JobDate}
              />
            </Form.Group>

            <Form.Group className='mt-2'>
               <Form.Label>Budget Plan</Form.Label>
              <Form.Control
                  name='budgetPlan'
                  type="text"
                  placeholder="Budget Plan"
                  onChange={handleAddFormDataChange}
                  value = {addTaskFormData.budgetPlan}
              />
            </Form.Group>

            
            <Form.Group className='mt-2'>
    
               <Form.Label>Manager</Form.Label>
              <Form.Select 
              name='Manager'
              onChange={handleAddFormDataChange}
              value = {addTaskFormData.Manager}
              >
                  <option>Manager</option>
                  {preData && preData.map((manager, index)=>
                      <option key={index} value={manager._id}>{manager.name}</option>
                  )}
              </Form.Select>

            </Form.Group>


          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseAddTaskModal}>Close</Button>
          <Button onClick={handleAddTaskForm} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>


        </>
    );
}
}

export default Construction;
