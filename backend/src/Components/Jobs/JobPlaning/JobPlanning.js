import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';

import { Store } from 'react-notifications-component';
import Loader from '../../Common/Loader/Loader';

import axios from '../../../Api/Axios';
import * as axiosURL from '../../../Api/AxiosUrls';
import MyFloatingFilter from './MyFloatingFilter';
import DropdownFilter from './DropdownFilter';
import ClearFilterButton from './ClearFilterButton';
import { GridApi } from 'ag-grid-community';

var preDataUrl = axiosURL.addJobPreData;

var jobPlanningUrl = axiosURL.jobPlanning;
var JobPlaning_Update_One_Url = axiosURL.JobPlaning_Update_One_Url;







export default function JobPlanning() {

  
  const [preData, setPreData] = useState([])
  const [fPreData, setFPreData] = useState([])
  const [loader, setLoader] = useState(false)
  const [gridApi, setGridApi] = useState(null);
  const [rerender, setRerender] = useState(false);
  
   // Each Column Definition results in one Column.
   const [columnDefs, setColumnDefs] = useState();

   useEffect(()=>{
    const tempArr = preData
    
        const newObj = { value: null, label: 'Select' };

        tempArr.unshift(newObj);

        setPreData(tempArr)

   }, [preData])

  const getPreData = async () => {
    setLoader(true)
    try {
        const response = await axios.get(preDataUrl,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
            );
      if(response.status === 200)
      {  
        setPreData(response.data.map(names => {
          return { value: names._id, label: names.name };
        }));

        setFPreData(response.data.map(names => {
          return { value: names._id, label: names.name };
        }));

        
        setRerender(!rerender);
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

    
 const gridRef = useRef(); // Optional - for accessing Grid's API

 

 const [colVisibility, setColVisibility] = useState({
  comName:false,
  cliName:false,
  jHolder:false,
  job_name:false,
  hours:false,
  year_end:false,
  job_deadline:false,
  work_deadline:false,
  stat:false,
  notes:false,
  job_status:false,
  cManager:false,
  //////////////
  fee:true,
  subscription:true,
  vat_login:true,
  payee_login:true,
  ct_login:true,
  tr_login:true,
  utr:true,
  auth_code:true,
  email:true,
  phone:true,
  country:true,
 });

 const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 const [mainrowData, setMainRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 const [mainReRender, setMainReRender] = useState(0);

 const [jStatusFvalue, setJStatusFvalue] = useState(null);
 const [cManagerFvalue, setCManagerFvalue] = useState(null);
 const [statusFvalue, setStatusFvalue] = useState(null);
 const [departmentFvalue, setDepartmentFvalue] = useState(null);
 const [jHolderFvalue, setJHolderFvalue] = useState(null);
 const [subscriptionFvalue, setSubscriptionFvalue] = useState(null);

 const filter = async ()=>{

  // const roo = mainrowData; 
  var filteredArray = mainrowData

  // JobStatus Filter
  if(filteredArray != undefined && jStatusFvalue != null && jStatusFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.job_status && obj.job_status === jStatusFvalue);
  }

  // C Manger Filter
  if(filteredArray != undefined && cManagerFvalue != null && cManagerFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.manager_id && obj.manager_id.name === cManagerFvalue);
  }

  //status Filter
  if(filteredArray != undefined && statusFvalue != null && statusFvalue !== ""){

    filteredArray = await filteredArray.filter(obj =>{ 
      if(obj.job_deadline && obj.year_end){

        const deadline = new Date(obj.job_deadline)
        const yearEnd = new Date(obj.year_end)
        var today = new Date();
        
        if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)))) {
          if(statusFvalue === "Overdue")
          return obj;
        }
        else if (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))  {
          if(statusFvalue === "Overdue")
          return obj;
        }
        else if(((yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) && !(deadline.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0))))
        {
          if(statusFvalue === "Due")
          return obj;
        }
        else if(( (deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))))
        {
          if(statusFvalue === "Due")
          return obj;
        }
      }
    });

    
  }

  // Department Filter
  if(filteredArray != undefined && departmentFvalue != null && departmentFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.job_name && obj.job_name === departmentFvalue);
  }

  // Job Holder Filter
  if(filteredArray != undefined && jHolderFvalue != null && jHolderFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.job_holder_id && obj.job_holder_id.name === jHolderFvalue);
  }

  // Subscription Filter
  if(filteredArray != undefined && subscriptionFvalue != null && subscriptionFvalue !== ""){
    filteredArray = await filteredArray.filter(obj => obj.subscription && obj.subscription === subscriptionFvalue);
  }

  setRowData(filteredArray)

   
  console.log("filter")

 }


 useEffect(()=>{
  setRowData(mainrowData)
  console.log(rowData)
  filter()
  console.log('Called')
 },[statusFvalue, subscriptionFvalue, jStatusFvalue, cManagerFvalue, departmentFvalue, jHolderFvalue, mainrowData])

 

 // DefaultColDef sets props common to all Columns
 const defaultColDef = useMemo( ()=> ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    editable: true,
    resizable: true
   }));

 // Example of consuming Grid Event
 const cellClickedListener = useCallback( event => {
 }, []);

 function handleMenuClick(e) {
  // Prevent the default behavior of the click event
  e.preventDefault();

  // Stop the click event from propagating to the dropdown menu
  e.stopPropagation();
}

 // Example load data from sever
 useEffect(() => {
   fetch(jobPlanningUrl)
   .then(result => result.json())
   .then(rowData => setMainRowData(rowData))
   getPreData();
   handleColHideOnStart();
   
 }, [mainReRender]);

 useEffect(()=>{
  if(gridApi){
    handleColHideOnStart();
  }
 }, [gridApi])

 const handleFunClear = (value)=>{
  if(gridApi){
    console.log(value)
    setJHolderFvalue(null)
    setDepartmentFvalue(null)
    setStatusFvalue(null)
    setCManagerFvalue(null)
    setJStatusFvalue(null)
    gridApi.api.setFilterModel({});
    gridApi.api.refreshHeader();
  }
 }





 const [sumOfMarks, setSumOfMarks] = useState(0);
 const [filterKey, setFilterKey] = useState(0);

 const calculateSumOfMarks = () => {
  const filteredRows = [];
  gridApi.api.forEachNodeAfterFilter((node) => {
    if (node.data.hours != null) {
      filteredRows.push(node);
    }
  });
  const sum = filteredRows.reduce((total, row) => {
    return total + +row.data.hours;
  }, 0);
  setSumOfMarks(sum);
  
  setFilterKey(filterKey + 1);
};

useEffect(() => {
  if (gridApi) {
    calculateSumOfMarks();
    gridApi.api.addEventListener("filterChanged", calculateSumOfMarks);
    return () => gridApi.api.removeEventListener("filterChanged", calculateSumOfMarks);
  }
}, [gridApi]);


var filterParams = {
  comparator: function(filterLocalDateAtMidnight, cellValue) {
    // convert cell value to Date object
    var cellDate = new Date(cellValue);

    // compare dates
    if (cellDate.setHours(0, 0, 0, 0) <= filterLocalDateAtMidnight.setHours(0, 0, 0, 0)) {
      return 0; //include
    } else if (cellDate.setHours(0, 0, 0, 0) > filterLocalDateAtMidnight.setHours(0, 0, 0, 0)) {
      return 1; //exclude
    } else {
      return 1; //-1 include as exact match
    }
  }
};

 useEffect(()=>{
  setColumnDefs([
    {
      headerName: "Sr",
      filter: false,
      flex: 0.8,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      editable: false,
      cellRenderer: (params) => params.node.rowIndex + 1,
      // floatingFilterComponent: 'clearFloatingFilter', 
      // floatingFilterComponentParams: { 
      //   handleClickk: (value) =>  handleFunClear(value) ,
      //   gridVal: gridApi,
      //   suppressFilterButton: true, 
      //   suppressInput: true 
      // }
    },
    {
      headerName: "Company Name",
      field:"comName",
      flex: 2.5,
      editable: false,
      valueGetter: p => {
        return p.data.client_id.company_name //to get value from obj inside obj
      }
    },
    {
      headerName: "Client Name",
      field:"cliName",
      flex: 2,
      editable: false,
      valueGetter: p => {
        return p.data.client_id.client_name //to get value from obj inside obj
      }
      // valueFormatter: p => {
      //   return "$ " + p.value
      // }
    },
    {
      headerName: "J.Holder",
      field:"jHolder",
      flex: 1.5,
      valueGetter: p => {
        return p.data.job_holder_id !== null ? p.data.job_holder_id.name : "" //to get value from obj inside obj
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: preData.map(option => option.label),
      },  
      onCellValueChanged: function(event) {
      },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: fPreData.map(option => option.label),
        onValueChange:(value) => setJHolderFvalue(value),
        value: jHolderFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      }
    },
    {
      headerName: "Department",
      field: 'job_name',
      flex: 1.5,
      editable: false,
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ["Bookkeeping", "Payroll", "Vat Return", "Accounts", "Personal Tax", "Company Sec", "Address", "Billing"],
        onValueChange:(value) => setDepartmentFvalue(value),
        value: departmentFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
  
    },
    {
      headerName: "Hours",
      field: 'hours',
      flex: 1,
      floatingFilter:true,
      floatingFilterComponent: "myFloatingFilter",
      floatingFilterComponentParams: {value: sumOfMarks},
  },
    {
      headerName: "Year End",
      field: 'year_end',
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
      flex: 1.5,
      cellEditorFramework: 'agCellEditorDatePicker',
      valueGetter: p => {
        if(p.data.year_end && p.data.year_end !== "Invalid Date")
        {
          const deadline = new Date(p.data.year_end)
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
    {
      headerName: "Deadline",
      field: 'job_deadline',
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
      flex: 1.5,
      cellEditorFramework: 'agCellEditorDatePicker',
      valueGetter: p => {
        if(p.data.job_deadline && p.data.job_deadline !== "Invalid Date")
        {
          const deadline = new Date(p.data.job_deadline)
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
    {
      headerName: "Job Date",
      field: 'work_deadline',
      filterParams: filterParams,
      flex: 1.5,
      filter: 'agDateColumnFilter',
      editable: true,
      valueGetter: p => {
        if(p.data.work_deadline  && p.data.work_deadline !== "Invalid Date")
        {
          const deadline = new Date(p.data.work_deadline)
          let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
          return(`${da}-${mo}-${ye}`);
        }
        else{
          return ""
        }
      }
      // cellEditorFramework: AgDatePicker,
    },
    {
      headerName: "Status",
      field:"stat",
      flex: 1.5,
      editable: false,
      valueGetter: p => {
        const deadline = new Date(p.data.job_deadline)
        const yearEnd = new Date(p.data.year_end)
        var today = new Date();
        
        if ((deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) && (yearEnd.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)))) {
          return "Overdue";
        }
        else if (deadline.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))  {
          return "Overdue";
        }
        else if(((yearEnd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) && !(deadline.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0))))
        {
          return "Due"
        }
        else if(( (deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))))
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
    {
      headerName: "Note",
      field: 'notes',
      flex: 6,
    },
    {
      headerName: "J.Status",
      field: 'job_status',
      flex: 1.3,
      valueGetter: p => {
        return p.data.job_status === "Select" ? "" : p.data.job_status
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ["Select", 'Data', 'Progress', 'Queries', 'Approval', 'Submission'] },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ['Data', 'Progress', 'Queries', 'Approval', 'Submission'],
        onValueChange:(value) => setJStatusFvalue(value),
        value: jStatusFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
      },
    {
      headerName: "C.Manager",
      field:"cManager",
      flex: 1.5 ,
      valueGetter: p => {
        return p.data.manager_id !== null ? p.data.manager_id.name : "" //to get value from obj inside obj
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: preData.map(option => option.label),
      },  
      onCellValueChanged: function(event) {

      },
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: fPreData.map(option => option.label),
        onValueChange:(value) => setCManagerFvalue(value),
        value: cManagerFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
    },
    ///////////
    {
      headerName: "Fee",
      field:"fee",
      flex: 2,
      editable: false,
    },
    {
      headerName: "Subscription",
      field:"subscription",
      flex: 2,
      editable: false,
      floatingFilterComponent: 'selectFloatingFilter', 
      floatingFilterComponentParams: { 
        options: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'],
        onValueChange:(value) => setSubscriptionFvalue(value),
        value: subscriptionFvalue,
        suppressFilterButton: true, 
        suppressInput: true 
      } 
    },
    {
      headerName: "Vat Login",
      field:"vat_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Vat Return"){
          return p.data.client_id.vat_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "PAYE Login",
      field:"payee_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Payroll"){
          return p.data.client_id.paye_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "CT Login",
      field:"ct_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Accounts"){
          return p.data.client_id.ct_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "TR Login",
      field:"tr_login",
      flex: 2,
      editable: false,
      valueGetter: p => {
        if(p.data.job_name === "Personal Tax"){
          return p.data.client_id.tr_login //to get value from obj inside obj
        }
        else{
          return ""
        }
      },
    },
    {
      headerName: "UTR",
      field:"utr",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.utr //to get value from obj inside obj
      },
    },
    {
      headerName: "Auth Code",
      field:"auth_code",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.auth_code //to get value from obj inside obj
      },
    },
    {
      headerName: "Email",
      field:"email",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.email //to get value from obj inside obj
      },
    },
    {
      headerName: "Phone",
      field:"phone",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.phone //to get value from obj inside obj
      },
    },
    {
      headerName: "Country",
      field:"country",
      flex: 2,
      valueGetter: p => {
        return p.data.client_id.country //to get value from obj inside obj
      },
      editable: false,
    },
  //   {
  //     field: 'actions',
  //     flex: 1,
  //     editable: false,
  //     filter: false,
  //     cellRendererFramework: ()=><div>
  //       <button className='btn btn-danger h1'> delete</button>
  //     </div>
  //   }
   ])

 }, [rerender])


 //Row Id
 const getRowId = useCallback(params => {
  return params.data._id
 })

// const deleteHandler = ()=> {
//   const selectedNodes = gridRef.current.api.getSelectedNodes();
//   const selectedIds = selectedNodes.map(node => node.data.id);
//   //Delete api here
//   //set table data without reloading
// }

const onCellValueChanged = useCallback((event) => {
  if(event.colDef.field === "jHolder"){
    const selectedOption = preData.find(option => option.label === event.data.jHolder);
    event.data.jHolder = selectedOption ? selectedOption.value : '';
  }
  if(event.colDef.field === 'cManager')
  {
    const selectedOption = preData.find(option => option.label === event.data.cManager);
    event.data.cManager = selectedOption ? selectedOption.value : '';
  }
}, [gridApi]);

var i = 1;

const onRowValueChanged = useCallback(async (event) => {
  var data = event.data;
  console.log('changed')
  
  
  const resp = await axios.post(JobPlaning_Update_One_Url, 
    {
      _id: data._id,
      job_holder_id: data.jHolder,
      hours: data.hours,
      year_end: data.year_end,
      job_deadline: data.job_deadline,
      work_deadline: data.work_deadline,
      notes: data.notes,
      job_status: data.job_status,
      manager_id: data.cManager,

      client_id: data.client_id._id,
      vat_login: data.vat_login,
      paye_login: data.paye_login,
      ct_login: data.ct_login,
      tr_login: data.tr_login,
      utr: data.utr,
      auth_code: data.auth_code,
      email: data.email,
      phone: data.phone,
    },
    {
      headers:{ 'Content-Type': 'application/json' }
    }
  );

  console.log('changed', i)
  
  setMainReRender(i)

  i += 1;

}, []);

const onPageSizeChanged = useCallback(() => {
  var value = document.getElementById('page-size').value;
  gridRef.current.api.paginationSetPageSize(Number(value));
}, []);



  async function onGridReady(params) {
  setGridApi(params);
  calculateSumOfMarks();
}

const handleColHideOnStart= ()=>{
  if(gridApi){
    gridApi.columnApi.setColumnVisible("fee", false)
    gridApi.columnApi.setColumnVisible("subscription", false)
    gridApi.columnApi.setColumnVisible("vat_login", false)
    gridApi.columnApi.setColumnVisible("payee_login", false)
    gridApi.columnApi.setColumnVisible("ct_login", false)
    gridApi.columnApi.setColumnVisible("tr_login", false)
    gridApi.columnApi.setColumnVisible("utr", false)
    gridApi.columnApi.setColumnVisible("auth_code", false)
    gridApi.columnApi.setColumnVisible("email", false)
    gridApi.columnApi.setColumnVisible("phone", false)
    gridApi.columnApi.setColumnVisible("country", false)
  }
  
}

const toggleColHandler = (e, name) => {
  handleMenuClick(e);
  gridApi.columnApi.setColumnVisible(name, colVisibility[name])
  setColVisibility({ ...colVisibility, [name]: !colVisibility[name] })
}

const frameworkComponents = {
  myFloatingFilter: MyFloatingFilter,
  selectFloatingFilter: DropdownFilter,
  clearFloatingFilter: ClearFilterButton
};

if(loader){
  return(
      <Loader />
  )
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
                  Job Planning
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
                        <li><button onClick={(e)=>{toggleColHandler(e, "comName")}} className={`dropdown-item ${!colVisibility.comName? "" : "active"}`}  >Company Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "cliName")}} className={`dropdown-item ${!colVisibility.cliName? "" : "active"}`} >Client Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "jHolder")}} className={`dropdown-item ${!colVisibility.jHolder? "" : "active"}`} >J.Holder</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "job_name")}} className={`dropdown-item ${!colVisibility.job_name? "" : "active"}`} >Department</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "hours")}} className={`dropdown-item ${!colVisibility.hours? "" : "active"}`} >Hours</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "year_end")}} className={`dropdown-item ${!colVisibility.year_end? "" : "active"}`} >Year End</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "job_deadline")}} className={`dropdown-item ${!colVisibility.job_deadline? "" : "active"}`} >Deadline</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "work_deadline")}} className={`dropdown-item ${!colVisibility.work_deadline? "" : "active"}`} >Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "stat")}} className={`dropdown-item ${!colVisibility.stat? "" : "active"}`} >Status</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "notes")}} className={`dropdown-item ${!colVisibility.notes? "" : "active"}`} >Note</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "job_status")}} className={`dropdown-item ${!colVisibility.job_status? "" : "active"}`} >J.Status</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "cManager")}} className={`dropdown-item ${!colVisibility.cManager? "" : "active"}`} >Manager</button></li>
                      </ul>
                    </div>
                    <div className="col-6">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{toggleColHandler(e, "fee")}} className={`dropdown-item ${!colVisibility.fee? "" : "active"}`}  >Fee</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "subscription")}} className={`dropdown-item ${!colVisibility.subscription? "" : "active"}`}>Subscription</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "vat_login")}} className={`dropdown-item ${!colVisibility.vat_login? "" : "active"}`} >Vat Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "payee_login")}} className={`dropdown-item ${!colVisibility.payee_login? "" : "active"}`} >PAYEE Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "ct_login")}} className={`dropdown-item ${!colVisibility.ct_login? "" : "active"}`} >CT Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "tr_login")}} className={`dropdown-item ${!colVisibility.tr_login? "" : "active"}`} >TR Login</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "utr")}} className={`dropdown-item ${!colVisibility.utr? "" : "active"}`} >UTR</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "auth_code")}} className={`dropdown-item ${!colVisibility.auth_code? "" : "active"}`} >Auth Code</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "email")}} className={`dropdown-item ${!colVisibility.email? "" : "active"}`} >Email</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "phone")}} className={`dropdown-item ${!colVisibility.phone? "" : "active"}`} >Phone</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "country")}} className={`dropdown-item ${!colVisibility.country? "" : "active"}`} >Country</button></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div  className='table-show-hide mx-2'>
            <ClearFilterButton handleClickk={handleFunClear}/>
            </div>


          </div>

          <div className='mx-4'>
            <Link to="/clients/add" className='btn btn-primary'>
              Add Client
            </Link>
          </div>
          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
                getRowId={getRowId}

                onGridReady={onGridReady}

                ref={gridRef} // Ref for accessing Grid's API

                rowData={rowData} // Row Data for Rows

                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties

                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                // rowMultiSelectWithClick = {true} //Optional - allow to select rows without hloding ctrl

                pagination = {true}
                paginationPageSize = {25}

                //  enableCellChangeFlash = {true}

                onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                editType={'fullRow'}
                onCellValueChanged={onCellValueChanged}
                onRowValueChanged={onRowValueChanged}

                suppressDragLeaveHidesColumns={true} // disable move above header to hide column
                frameworkComponents={frameworkComponents}
                />
                {/* <MyFloatingFilter value={sumOfMarks} /> */}
          </div>
        </div>
    </div>

    

    </>
  )
}
}


