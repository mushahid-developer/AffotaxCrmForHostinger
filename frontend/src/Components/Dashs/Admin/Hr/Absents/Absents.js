import { useEffect, useMemo, useState, useCallback } from 'react';
import axios from '../../../../../Api/Axios';
import * as axiosURL from '../../../../../Api/AxiosUrls';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../../../Common/Loader/Loader';

const GetAllAttendance = axiosURL.GetAllAttendance;

function Absents() {
  const [loader, setLoader] = useState(true);
  const [mainData, setMainData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [finalColDef, setFinalColDef] = useState(null);
  const [month, setCurMonth] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(GetAllAttendance, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 || response.status === 304) {
        setMainData(response.data);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (mainData.length > 0) {
      const uniqueUsers = [...new Set(mainData.map(item => item.user_id && item.user_id !== null && item.user_id.name).filter(Boolean))];
      setUsersList(uniqueUsers);
    }
  }, [mainData]);

  useEffect(() => {

    if (mainData.length > 0) {
      
      const currentMonthData = mainData.filter(obj => {
        const yearr = new Date(obj.startTime).getFullYear();
        return (yearr === month.year);
      });
      
      //get Start Date and End Date of each user
        const startEndDate = usersList.map(obj => {
          const userAvaData = currentMonthData.filter(item => item.user_id && item.user_id !== null && item.user_id.name === obj)
          const startDate = new Date( userAvaData.length > 0 && userAvaData[0].startTime)
          const endDate = new Date( userAvaData.length > 0 && userAvaData[ userAvaData.length - 1 ].startTime)
        });


      const dateeee = new Date(selectedDate);
      const yearrrr = dateeee.getFullYear();

      const finalAttendanceArray = usersList.map(userName => {
        const userAvaData = currentMonthData.filter(item => item.user_id && item.user_id !== null && item.user_id.name === userName)
        const startDate = new Date( userAvaData.length > 0 && userAvaData[0].startTime)
        const endDate = new Date( userAvaData.length > 0 && userAvaData[ userAvaData.length - 1 ].startTime)
        const months = [];

        for (let q = 1; q <= 12; q++) {
          const numberOfDaysInCurrentMonth = new Date(yearrrr, q, 0).getDate();
          let monthAbsentCount = 0;

          const currentMonthCheck = new Date(yearrrr, q, 0).getMonth();

          const CheckMonthData = currentMonthData.find(item => {
            const checkDate = new Date(item.startTime).getMonth();
            if( checkDate === currentMonthCheck ){
              return true
            }
          })

          if(CheckMonthData){
            for (let i = 1; i <= numberOfDaysInCurrentMonth; i++) {
              const dateToSearch = new Date(yearrrr, q - 1, i);
  
              if( dateToSearch.setHours(0, 0, 0) >= startDate.setHours(0, 0, 0) &&  dateToSearch.setHours(0, 0, 0) <= endDate.setHours(0, 0, 0) ){
                const isWeekend = dateToSearch.getDay() === 6 || dateToSearch.getDay() === 0;
                if (!isWeekend) {
                  const result = currentMonthData.find((item) => {
                    const startTimee = new Date(item.startTime);
    
                    if (!item.user_id) {
                      return false;
                    }
    
                    return (
                      startTimee.setHours(0, 0, 0, 0) === dateToSearch.setHours(0, 0, 0, 0) &&
                      item.user_id.name === userName
                    );
                  });
    
                  if (!result) {
                    monthAbsentCount++;
                  }
                }
              } else {
                monthAbsentCount = "-"
              }
  
  
            }
          } else {
            monthAbsentCount = "-"
          }

          months.push(monthAbsentCount);
        }

        return {
          name: userName,
          ...months
        };
      });

      setTableData(finalAttendanceArray);
    }
  },  [usersList, month, selectedDate, mainData]);

  useEffect(() => {
    if (tableData.length > 0) {
      const curDate = new Date();
      const curYear = curDate.getFullYear();
      const curMonth = curDate.getMonth();
      const selYear = selectedDate.getFullYear();
      const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

      let columnDefs = [
        { headerName: 'Employee Name', field: 'name', flex: 4 },
      ];

      for (let w = 0; w <= 11; w++) {
          columnDefs.push({ headerName: months[w], field: `${w}`, flex: 2 });
      }

      columnDefs.push({
        headerName: 'Total',
        field: 'total',
        flex: 2,
        valueGetter: (params) => {
          var total = 0;
          for (let month = 0; month <= 11; month++) {
            if (params.data[month] !== "-") {
              total += +params.data[month];
            }
          }
          return total;
        }
      });

      setFinalColDef(columnDefs);
    }
  }, [tableData, selectedDate]);

  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    floatingFilter: false,
    editable: false,
    resizable: true
  }), []);

  if (loader) {
    return <Loader />;
  } else {
    return (
      <div style={{
        border: 'none'
      }}
        className="mt-3 card" >

        <div style={{ alignItems: 'center', justifyContent: 'space-between' }} className='d-flex'>

          <div style={{ alignItems: 'center' }} className='d-flex'>

            <div >
              <h4 style={{ padding: '20px 16px' }}>
                Absents
              </h4>
            </div>

          </div>

          <div style={{ marginRight: '15px' }}>
            <DatePicker
              style={{ textAlign: 'center' }}
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

        <hr style={{ marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)' }} />

        <div>
          <div className="ag-theme-alpine" style={{ height: '81vh' }}>
            {finalColDef && <AgGridReact
              columnDefs={finalColDef}
              rowData={tableData}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection='multiple'
              pagination={true}
              paginationPageSize={25}
              suppressDragLeaveHidesColumns={true}
            />}
          </div>
        </div>
      </div>
    );
  }
}

export default Absents;
