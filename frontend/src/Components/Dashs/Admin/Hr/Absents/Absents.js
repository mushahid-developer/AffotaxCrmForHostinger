import React, { useEffect, useMemo, useState } from 'react'

import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../../../Common/Loader/Loader';

var GetAllAttendance = axiosURL.GetAllAttendance;

export default function Absents() {

    const [loader, setLoader] = useState(false)
    const [mainData, setMainData] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [usersList, setUsersList] = useState();
    const [finalColDef, setFinalColDef] = useState(null);
    const [month, setCurMonth] = useState(
        {
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        });
    const [selectedDate, setSelectedDate] = useState(new Date())

    const getData = async ()=>{
        setLoader(true)
        const response = await axios.get(GetAllAttendance,         
            {
                headers:{ 'Content-Type': 'application/json' }
            }
        );

        if(response.status === 200 || response.status === 304){
            setMainData(response.data)
            setLoader(false)
        }
        
    }

    useEffect(()=>{
        if(mainData){
            //Seperating Users
            setUsersList([...new Set(mainData.map(item => item.user_id && item.user_id !== null && item.user_id.name).filter(Boolean))]);
        }
    },[mainData])

    useEffect(()=>{
        if(mainData){

            // Filter the array to only include objects with a startTime in the current month
            const currentMonthData = mainData.filter(obj => {
                const yearr = new Date(obj.startTime).getFullYear();
                return (yearr === month.year);
            });

            
            
            var finalAttendanceArray = [];
            const dateeee = new Date(selectedDate);
            const yearrrr = dateeee.getFullYear();
            for(const user in usersList){
                var months = [];
                for(var q = 1; q <= 12 ; q++){
                    var monthhhh = q;
                    const numberOfDaysInCurrentMonth = new Date(yearrrr, monthhhh, 0).getDate();

                    var dynamicVariable = {};
                    dynamicVariable[`month${q}Absents`] = 0;
                    var workingMonth = `month${q}Absents`;

                    for(var i = 1; i <= numberOfDaysInCurrentMonth; i++){
                        const dateToSearch = new Date(`${q}/${i}/${yearrrr}`);
                        const isWeekend = dateToSearch.getDay() === 6 || dateToSearch.getDay() === 0;

                        if(!isWeekend) {
                            const result = currentMonthData.length > 0 ? currentMonthData.find((item) => {
                                const startTimee = new Date(item.startTime)
                                if(!item.user_id){
                                    return false
                                }
                                
                                return(
                                    startTimee.setHours(0, 0, 0) === dateToSearch.setHours(0, 0, 0) && 
                                    item.user_id.name === usersList[user]
                                )
                            }) : false ;
                            
                            if (!result) {
                                dynamicVariable[workingMonth] = dynamicVariable[workingMonth] + 1;
                            };
                        };
                    }
                    
                    months.push(dynamicVariable[workingMonth]);
                }
                var employee = {
                    name: usersList[user],
                    ...months
                };
                finalAttendanceArray.push(employee)
            }

            setTableData(finalAttendanceArray)
        }
    },[ usersList, month])

    useEffect(()=>{
        getData();
    },[])
    

    useEffect(() => {
        if (tableData) {
          const curDate = new Date();
          const curYear = curDate.getFullYear();
          const curMonth = curDate.getMonth();
          const selYear = selectedDate.getFullYear();
          const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
      
          let columnDefs = [
            { headerName: 'Employee Name', field: 'name', flex: 4 },
          ];
      
          for (let w = 0; w <= 11; w++) {
            if (selYear < curYear || (selYear === curYear && w <= curMonth)) {
              columnDefs.push({ headerName: months[w], field: `${w}`, flex: 2 });
            } else {
              columnDefs.push({ headerName: months[w], field: `${w}`, flex: 2, valueGetter: () => "-" });
            }
          }
      
          columnDefs.push({
            headerName: 'Total',
            field: 'total',
            flex: 2,
            valueGetter: (params) => {
              if (selYear < curYear) {
                return [...Array(12).keys()].reduce((total, month) => total + +params.data[`${month}`], 0);
              } else if (selYear === curYear) {
                return [...Array(curMonth + 1).keys()].reduce((total, month) => total + +params.data[`${month}`], 0);
              }
              return "-";
            },
          });
      
          setFinalColDef(columnDefs);
        }
      }, [tableData, selectedDate]);

    

    const defaultColDef = useMemo( ()=> ({
        sortable: false,
        filter: false,
        floatingFilter: false,
        editable: false,
        resizable: true
       }));

       

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
                  Absents
              </h4>
            </div>


          </div>

          <div style={{marginRight: '15px'}}>
          <DatePicker
          style={{textAlign: 'center'}}
          className='form-control text-center'
            selected={selectedDate}
            onChange={(date) => {
                setSelectedDate(date);
                setCurMonth(
                    {
                        year: new Date(date).getFullYear()
                    });
            }}
            dateFormat="yyyy"
            showYearPicker  
            maxDate={new Date()} // Set maximum date
        />
          </div>

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>


            {finalColDef && <AgGridReact
            //   onGridReady={onGridReady}
                columnDefs={finalColDef}
                rowData={tableData}
                defaultColDef={defaultColDef}
                // ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                pagination = {true}
                paginationPageSize = {25}
                suppressDragLeaveHidesColumns={true}
            />}
            
          </div>
        </div>
    </div>


        </>
  )
}
}
