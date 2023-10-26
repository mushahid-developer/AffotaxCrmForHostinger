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

      const dateeee = new Date(selectedDate);
      const yearrrr = dateeee.getFullYear();

      const finalAttendanceArray = usersList.map(userName => {
        const userAvaData = currentMonthData.filter(item => item.user_id && item.user_id !== null && item.user_id.name === userName)
        const startDate = new Date( userAvaData.length > 0 && userAvaData[0].startTime)
        const endDate = new Date()
        const months = [];

        for (let q = 1; q <= 12; q++) {
          const currentMonthDataFiltered = currentMonthData.filter(item => {
            const itemDate = new Date(item.startTime);
            const checkDate = itemDate.getMonth();
            return item.user_id && item.user_id.name === userName && checkDate === q - 1;
          });
        
          const numberOfAbsentDays = getNumberOfAbsentDays(currentMonthDataFiltered, startDate, endDate);
          months.push(numberOfAbsentDays);
        }
        
        function getNumberOfAbsentDays(data, startDate, endDate) {
          return data.reduce((absentCount, item) => {
            const itemDate = new Date(item.startTime);
            if (isWeekday(itemDate) && isWithinDateRange(itemDate, startDate, endDate)) {
              absentCount++;
            }
            return absentCount;
          }, 0);
        }
        
        function isWeekday(date) {
          const day = date.getDay();
          return day !== 0 && day !== 6;
        }
        
        function isWithinDateRange(date, startDate, endDate) {
          const dateToSearch = new Date(date);
          dateToSearch.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          return dateToSearch >= startDate && dateToSearch <= endDate;
        }

        return {
          name: userName,
          ...months
        };
      });

      setTableData(finalAttendanceArray);
      setLoader(false);
    }
  },  [usersList, month, selectedDate, mainData]);

  useEffect(() => {
    if (tableData.length > 0) {
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
