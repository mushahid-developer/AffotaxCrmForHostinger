import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Store } from 'react-notifications-component';

import moment from 'moment';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Link } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

var timerReportUrl = axiosURL.timerReportUrl;


const Timesheet = () => {

    const token = secureLocalStorage.getItem('token')

    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    const [loader, setLoader] = useState(false);
    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);
    // const [rowDataRender, setRowDataRender] = useState(true);
    const [mon_week, setMon_week] = useState('Weekly');

    var weekdays = new Array(7);
        weekdays[0] = "Sunday";
        weekdays[1] = "Monday";
        weekdays[2] = "Tuesday";
        weekdays[3] = "Wednesday";
        weekdays[4] = "Thursday";
        weekdays[5] = "Friday";
        weekdays[6] = "Saturday";

    const gridRef = useRef();

    const [week, setWeek] = useState();

    const [firstDayOfWeek, setFirstDayOfWeek] = useState()
    const [lastDayOfWeek, setLastDayOfWeek] = useState()

    const [firstDayOfNextWeek, setFirstDayOfNextWeek] = useState()
    const [lastDayOfNextWeek, setLastDayOfNextWeek] = useState()

    const [firstDayOfPrevWeek, setFirstDayOfPrevWeek] = useState()
    const [lastDayOfPrevWeek, setLastDayOfPrevWeek] = useState()

    const [strfdow, setStrfdow] = useState()
    const [strldow, setStrldow] = useState()
    const [strfdonw, setStrfdonw] = useState()
    const [strldonw, setStrldonw] = useState()
    const [strfdopw, setStrfdopw] = useState()
    const [strldopw, setStrldopw] = useState()

    const [preDataa, setPreDataa] = useState()

    const [fData, setFData] = useState(true)
    const [monthOpen, setMonthOpen] = useState(true)

    const today = moment();
    const startDate = today.startOf('month').format('YYYY-MM-DD');
    const endDate = today.endOf('month').format('YYYY-MM-DD');

    const [month, setMonth] = useState({
        startDate: startDate,
        endDate: endDate
    })

    const [filter, setFilter] = useState({
        emp: null,
        company: null,
        job: null
    })

    const handleFilterChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setFilter(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDateChange = (e)=>{
        e.preventDefault()
        const { name, value } = e.target;
        setMonth(prevState => ({
            ...prevState,
            [name]: value
        }));
    }


    useEffect(() => {
        if(mon_week === "Weekly"){
            if (firstDayOfWeek && lastDayOfWeek) {
                // filter the array where 'date' is within the current week
                const filteredData = mainRowData.filter(obj => {
                  const date = new Date(obj.startTime);
                  return date >= firstDayOfWeek && date <= lastDayOfWeek;
                });
                setRowData(filteredData);
                setFData(!fData)
              }
        }
        else{
            const startDate = new Date(month.startDate);
            const endDate = new Date(month.endDate);

            const filteredArray = mainRowData.filter(obj => {
                const date = new Date(obj.startTime);
                return date >= startDate && date <= endDate;
            });
            setRowData(filteredArray);
            setFData(!fData)
        }
        
      }, [firstDayOfWeek, lastDayOfWeek, mainRowData, filter, mon_week, monthOpen]);

      useEffect(()=>{
        if(filter.emp != null && filter.emp != "Employee"){
            const filteredArray = rowData.filter(obj => obj.user_id && obj.user_id.name === filter.emp);
            setRowData(filteredArray)
        }
        if(filter.company != null && filter.company != 'Company'){
            const filteredArray = rowData.filter(obj => obj.client_id && obj.client_id.company_name === filter.company);
            setRowData(filteredArray)
        }
        if(filter.job != null && filter.job != 'Department'){
            const filteredArray = rowData.filter(obj => obj.job_id && obj.job_id.job_name === filter.job);
            setRowData(filteredArray)
        }

        

      },[fData])

      const[times, setTimes] = useState({
        monTotal: 0,
        tueTotal: 0,
        wedTotal: 0,
        thuTotal: 0,
        friTotal: 0,
        satTotal: 0,
        sunTotal: 0,
        weekTotal: 0
      })


      useEffect(()=>{
        var monTotal = 0
        var tueTotal = 0
        var wedTotal = 0
        var thuTotal = 0
        var friTotal = 0
        var satTotal = 0
        var sunTotal = 0

        for(var i = 0; i<rowData.length; i++){
            var a = new Date(rowData[i].startTime);
            if(a && a != 'Invalid Date')
            {
                
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Monday')
                {
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        monTotal += diffMs;
                    }
    
                }
                if(day === 'Tuesday')
                {
                    
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        tueTotal += diffMs;
                    }
    
                }
                if(day === 'Wednesday')
                {
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        wedTotal += diffMs;
                    }
    
                }
                if(day === 'Thursday')
                {
                    // set the start and end dates
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        thuTotal += diffMs;
                    }

                }
                if(day === 'Friday')
                {
                    // set the start and end dates
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        friTotal += diffMs;
                    }

                }
                if(day === 'Saturday')
                {
                    // set the start and end dates
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        satTotal += diffMs;
                    }
    
                }
                if(day === 'Sunday')
                {
                    // set the start and end dates
                    const startDate = new Date(rowData[i].startTime);
                    const endDate = new Date(rowData[i].endTime);
        
                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);
                    if(!isNaN(diffMs)){
                        sunTotal += diffMs;
                    }
    
                }
            }

            
        }
        
        setTimes(prevState => ({
            ...prevState,
            monTotal: monTotal,
            tueTotal: tueTotal,
            wedTotal: wedTotal,
            thuTotal: thuTotal,
            friTotal: friTotal,
            satTotal: satTotal,
            sunTotal: sunTotal,
        }));


      }, [rowData])
      
      useEffect(() => {
        if (week) {
          // calculate the first and last days of the current week
          const today = week;
          const fdow = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
          const ldow = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
          setFirstDayOfWeek(fdow);
          setLastDayOfWeek(ldow);

            var myDate = new Date(fdow);
            var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);

            setStrfdow(`${da}-${mo}-${ye}`);
            
            /////
            var myDate = new Date(ldow);
            var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);

            setStrldow(`${da}-${mo}-${ye}`);
      
          // calculate the first and last days of the next week
          const fdonw = new Date(week.getFullYear(), week.getMonth(), week.getDate() - week.getDay() + 8);
          const ldonw = new Date(week.getFullYear(), week.getMonth(), week.getDate() - week.getDay() + 14);
          setFirstDayOfNextWeek(fdonw);
          setLastDayOfNextWeek(ldonw);
      
          var myDate = new Date(fdonw);
          var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);

          setStrfdonw(`${da}-${mo}-${ye}`);
          
          /////
          var myDate = new Date(ldonw);
          var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);

          setStrldonw(`${da}-${mo}-${ye}`);

          // calculate the first and last days of the previous week
          const fdopw = new Date(week.getFullYear(), week.getMonth(), week.getDate() - week.getDay() - 6);
          const ldopw = new Date(week.getFullYear(), week.getMonth(), week.getDate() - week.getDay());
          setFirstDayOfPrevWeek(fdopw);
          setLastDayOfPrevWeek(ldopw);

          var myDate = new Date(fdopw);
          var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);

          setStrfdopw(`${da}-${mo}-${ye}`);
          
          /////
            var myDate = new Date(ldopw);
            var ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(myDate);
            var mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(myDate);
            var da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(myDate);

          setStrldopw(`${da}-${mo}-${ye}`);

        }
      }, [week]);

    

    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(timerReportUrl,
                {
                    headers:{ 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            if(response.status === 200){

                setMainRowData(response.data.timer)
                setPreDataa(response.data)
                setWeek(new Date())
                setFilter(prevState => ({
                    ...prevState,
                    emp: response.data.curUser
                }));
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

    useEffect(() => {
        getData();
    }, []);
    
    
    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.5,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            cellRenderer: (params) => params.node.rowIndex + 1,
        },
        { 
            headerName: 'Date',
            field: 'startTime', 
            flex:1,
            valueGetter: p => {
                if(p.data.startTime  && p.data.startTime !== "Invalid Date")
                {
                  const deadline = new Date(p.data.startTime)
                  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
                  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
                  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
                  return(`${da}-${mo}-${ye}`);
                }
                else{
                  return ""
                }
              }
        },
        { 
            headerName: 'Employee',
            field: 'employee_name', 
            flex:1,
            valueGetter: p => {
                return p.data.user_id ? p.data.user_id.name : "" //to get value from obj inside obj
              }, 
        },
        { 
            headerName: 'Client',
            field: 'client_name', 
            flex:1,
            valueGetter: p => {
                return p.data.client_id ? p.data.client_id.client_name : "" //to get value from obj inside obj
              }, 
        },
        { 
            headerName: 'Department', 
            field: 'department', 
            flex:1.5, 
            valueGetter: p => {
                return p.data.job_id ? p.data.job_id.job_name : "" //to get value from obj inside obj
              }, 
        },
        { headerName: 'Mon', 
        field: 'mon', 
        flex:0.5,
        valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
            {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Monday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Tue', 
            field: 'tue', 
            flex:0.5,
            valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
            {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Tuesday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Wed', 
            field: 'wed', 
            flex:0.5,
            valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
            {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Wednesday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Thu', 
            field: 'thu', 
            flex:0.5,
            valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
                {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Thursday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Fri', 
            field: 'fri', 
            flex:0.5,
            valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
            {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Friday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Sat', 
            field: 'sat', 
            flex:0.5,
            valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
            {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Saturday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Sun', 
            field: 'sun', 
            flex:0.5,
            valueGetter: p => {
            if(p.data.startTime  && (p.data.startTime !== "Invalid Date") && p.data.endTime  && (p.data.endTime !== "Invalid Date") )
            {
                var a = new Date(p.data.startTime);
                var r = a.getDay();
                var day = weekdays[r];
                if(day === 'Sunday')
                {
                    // set the start and end dates
                    const startDate = new Date(p.data.startTime);
                    const endDate = new Date(p.data.endTime);

                    // calculate the difference between the dates in milliseconds
                    const diffMs = Math.abs(endDate - startDate);

                    // calculate the hours and minutes from the difference in milliseconds
                    const hours = Math.floor(diffMs / 3600000); // 1 hour = 3600000 milliseconds
                    const minutes = Math.floor((diffMs % 3600000) / 60000); // 1 minute = 60000 milliseconds

                    // log the result
                    return(` ${hours}.${minutes}`);
                }else{
                    return ""
                }
            }
            else{
                return ""
            }
        }
    },
        { 
            headerName: 'Note', 
            field: 'notes', 
            flex:4 
    },
        { 
            headerName: 'Type', 
            field: 'type', 
            flex:1 
    },
        // { headerName: 'Total', field: 'isActive', flex:1 },
        
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: false,
        filter: false,
        floatingFilter: false,
        editable: false,
        resizable: true
       }));

       const handleWeeklyChange = (e)=>{
        e.preventDefault();
        setMon_week(e.target.value)
       }

       const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600000);
        const minutes = Math.floor((timeInSeconds % 3600000) / 60000);
        // const hours = Math.floor(timeInSeconds / 3600);
        // const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
        // const seconds = timeInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }


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
        className="my-3 card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

          <div style={{alignItems: 'center',}} className='d-flex'>

            <div >
              <h4 style={{padding: '20px 16px',}}>
                  Timesheet
              </h4>
            </div>

            {/* <div  className='table-col-numbers mx-2'>
              <select className='form-control' onChange={onPageSizeChanged} id="page-size">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div> */}

            <div>
                <select onChange={handleFilterChange} defaultValue={filter.emp} name='emp' style={{width: '110px'}} className='form-control'>
                    <option value={null}>
                        Employee
                    </option>
                    {preDataa && preDataa.users.map((data, ind)=>{
                        return(
                            <option key={ind}>{data.name}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <select onChange={handleFilterChange} defaultValue={filter.company} name='company' style={{width: '110px'}} className='form-control mx-2'>
                    <option  value={null}>
                        Company
                    </option>
                    {preDataa && preDataa.clients.map((data, ind)=>{
                        return(
                            <option key={ind}>{data.company_name}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <select onChange={handleFilterChange} defaultValue={filter.job} name='job' style={{width: '110px'}} className='form-control'>
                    <option value={null}>
                        Department
                    </option>
                    <option value="Bookkeeping">
                    Bookkeeping
                    </option>
                    <option value="Payroll">
                    Payroll
                    </option>
                    <option value="Accounts">
                    Accounts
                    </option>
                    <option value="Personal Tax">
                    Personal Tax
                    </option>
                    <option value="Company Sec">
                    Company Sec
                    </option>
                    <option value="Vat Return">
                    Vat Return
                    </option>
                    <option value="Address">
                    Address
                    </option>
                    <option value="Billing">
                    Billing
                    </option>
                    
                </select>
            </div>
            <div>
                <select name='mon_week' onChange={handleWeeklyChange} defaultValue={mon_week} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "Weekly">
                        Weekly
                    </option>
                    <option value = "Monthly">
                        Monthly
                    </option>
                </select>
            </div>

          </div>

          {mon_week === "Weekly" ?
           <div className='mx-2' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            
                    <button title={`${strfdopw && strfdopw} to ${strldopw && strldopw}`} onClick={()=>{setWeek(new Date(firstDayOfPrevWeek))}} style={{border: 'none', backgroundColor: '#1ab394', height: '35px', width: '35px', borderRadius: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17px" height="17px" viewBox="0 0 1024 1024" fill="white" className="icon" version="1.1"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000"/></svg>
                    </button>

                <div className='mx-2'>
                    <p>
                        Entries From {strfdow && strfdow} to {strldow && strldow}
                    </p> 
                </div>

                    <button title={`${strfdonw && strfdonw} to ${strldonw && strldonw}`} onClick={()=>{setWeek(new Date(firstDayOfNextWeek))}} style={{border: 'none', backgroundColor: '#1ab394', height: '35px', width: '35px', borderRadius: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17px" height="17px" viewBox="0 0 1024 1024" className="icon" version="1.1"><path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#000000"/></svg> 
                    </button>
            </div> 
          : 
          <div className='mx-2' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
            
            <div className='mx-2 d-flex'>
                <input type='date' value={month.startDate} onChange={handleDateChange} name="startDate" className='form-control'/>
                <input type='date' value={month.endDate} onChange={handleDateChange} name="endDate" className='form-control mx-2'/>
                <button type='Submit' onClick={()=>{setMonthOpen(!monthOpen)}} className='form-control btn btn-success'>Open</button>
            </div>
            
          </div>
          }


          {/* <div className='mx-4'>
            <Link to="/hr/employees/add" className='btn btn-primary'>
              Add Employee
            </Link>
          </div> */}
          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '70vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                pagination = {false}
                suppressDragLeaveHidesColumns={true}
            />
            
          </div>
        </div>

        {mon_week === "Weekly" && 
        
        

        <div className='py-2 px-2'>
            <div className='row' style={{fontSize: '13px', fontWeight: '600',}}>
                <div className='col-md-6'>
                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Monday
                                </p>
                                <p style={{color: 'black'}}>
                                    {formatTime(times.monTotal)}
                                </p>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Tuesday
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.tueTotal)}
                                </p>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Wednesday
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.wedTotal)}
                                </p>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Thursday
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.thuTotal)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Friday
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.friTotal)}
                                </p>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Saturday
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.satTotal)}
                                </p>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#1ab394', color: '#fff'}}>
                                <p>
                                    Sunday
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.sunTotal)}
                                </p>
                            </div>
                        </div>
                        <div className='col-lg-3'>
                            <div className='text-center' style={{ borderRadius: '5px', padding: '15px 20px', marginBottom: '10px', marginTop: '10px', backgroundColor: '#f8ac59', color: '#fff'}}>
                                <p>
                                    W.Total
                                </p>
                                <p style={{color: 'black'}}>
                                {formatTime(times.monTotal + times.tueTotal + times.wedTotal + times.thuTotal + times.friTotal + times.satTotal +times.sunTotal)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
    </div>


        </>
    );
}
}

export default Timesheet;
