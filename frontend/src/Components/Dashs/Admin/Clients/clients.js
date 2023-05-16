import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import Switch from 'react-js-switch';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';

var getClientsUrl = axiosURL.getClientsUrl;
var deleteClientUrl = axiosURL.deleteClientUrl;
var ActiveInactiveUrl = axiosURL.ActiveInactiveUrl;



const Clients = () => {

  const True = true
  const False = false

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);

    const [activeFilter, setActiveFilter] = useState("Active")

    const gridRef = useRef();

    const handleFilters = ()=>{
      // const roo = mainrowData; 
      var filteredArray = mainRowData
      console.log(mainRowData)

      console.log(activeFilter)
      console.log(mainRowData)

      // JobStatus Filter
      if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Active"){
        filteredArray = filteredArray.filter(obj => obj.isActive === true);
      }

      if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Inactive"){
        filteredArray = filteredArray.filter(obj => obj.isActive === false);
      }

      setRowData(filteredArray)

    }


    useEffect(()=>{
      setRowData(mainRowData)
      handleFilters()
    },[mainRowData, activeFilter])


    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(getClientsUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                console.log(response.data)
                setMainRowData(response.data)
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
        
    }, [reRender]);
    
    
    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.6,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            cellRenderer: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Book Start Date', field: 'book_start_date', flex:1 },
        { headerName: 'Company Name', field: 'company_name', flex:3 },
        { headerName: 'Client Name', field: 'client_name', flex:4 },
        { headerName: 'Hours', field: 'total_hours', flex:1 },
        { headerName: 'Fee', field: 'total_fee', flex:1 },
        // { headerName: 'Status', field: 'isActive', flex:1 },
        { headerName: 'Status', 
        field: 'isActive', 
        flex:1,
        cellRendererFramework: (params)=>
            <>
            <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'Center',}}>
                <Switch color="#eef1f9" backgroundColor={{ on: 'rgba(4, 217, 4, 0.52)', off: 'rgba(255, 0, 0, 0.49)' }} borderColor={{ on: 'rgba(4, 217, 4, 0.52)', off: 'rgba(255, 0, 0, 0.49)' }}  value={params.data.isActive} onChange={()=>{ const data = {id: params.data._id, status: params.data.isActive}; handleActionButtons('ActiveInactive', data)}} />
            </div>
            </>
      },
        {
            headerName: 'Action', 
            field: 'price',
            floatingFilter: false,
            flex:2,
            cellRendererFramework: (params)=>
            <>
                <div>
                    <Link to={'/client/' + params.data._id} className='btn btn-xs  btn-primary mx-1 '> Edit</Link>    
                    <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} className='btn btn-xs  btn-danger mx-1'> delete</Link>
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

      const handleActionButtons = async (type, id)=>{
        
        if(type === "Delete"){

          const confirmed = window.confirm('Are you sure you want to delete this item?');

          if (confirmed) {
            const response = await axios.get(`${deleteClientUrl}/${id}`,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          } else {
            // user clicked Cancel, do nothing
          }
        }

        if(type === "ActiveInactive"){

          const stt = !id.status
  
          const response = await axios.post(`${ActiveInactiveUrl}/${id.id}`,
            {
              status: stt
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          console.log(response)
        }
  
        setReRender(!reRender)
  
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
        className="mt-3 card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>

          <div style={{alignItems: 'center',}} className='d-flex'>

            <div >
              <h4 style={{padding: '20px 16px',}}>
                  Clients
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


            <div>
                <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "Active">
                        Active
                    </option>
                    <option value = "Inactive">
                        Inactive
                    </option>
                </select>
            </div>

          </div>

          {/* <div className='mx-4'>
            <Link to="/hr/employees/add" className='btn btn-primary'>
              Add Employee
            </Link>
          </div> */}
          

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

export default Clients;
