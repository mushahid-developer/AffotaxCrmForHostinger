import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';

var getEmployeeUrl = axiosURL.getEmployeeUrl;


const Employees = () => {

    const [loader, setLoader] = useState(false)

    const gridRef = useRef();

    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(getEmployeeUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                console.log(response.data)
                setRowData(response.data)
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
    
    const [rowData, setRowData] = useState([ ]);
    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.2,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            cellRenderer: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Employee Name', field: 'name', flex:1 },
        { headerName: 'Clients', field: 'model', flex:1 },
        { headerName: 'Total Hrs', field: 'price', flex:1 },
        { headerName: 'Total Fee', field: 'price', flex:1 },
        {
            headerName: 'Action', 
            field: 'price', 
            flex:1,
            floatingFilter: false,
            cellRendererFramework: ()=>
            <>
                <div>
                    <button className='btn btn-xs  btn-primary mx-1 '> Edit</button>    
                    <button className='btn btn-xs  btn-danger mx-1'> delete</button>
                </div> 
            </>
        }
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        editable: false,
        resizable: true
       }));

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);


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
                  Employees
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

          </div>

          <div className='mx-4'>
            <Link to="/hr/employees/add" className='btn btn-primary'>
              Add Employee
            </Link>
          </div>
          

        </div>



        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>

        <div>
          {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
          <div className="ag-theme-alpine" style={{ height: '81vh'}}>

            {/* <button onClick={deleteHandler}>delete</button> */}

            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                ref={gridRef}
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
                pagination = {true}
                paginationPageSize = {25}
                suppressDragLeaveHidesColumns={true}
            />
            
          </div>
        </div>
    </div>


        </>
    );
}
}
export default Employees;
