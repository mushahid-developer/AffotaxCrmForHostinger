import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Button, Modal, Form } from 'react-bootstrap';

var preDataUrl = axiosURL.addJobPreData;
var LeadsGetAllUrl = axiosURL.LeadsGetAllUrl;
var leadEditUrl = axiosURL.leadEditUrl;
var leadDeleteUrl = axiosURL.leadDeleteUrl;
var wonLostUrl = axiosURL.wonLostUrl;


const Leads = () => {

  const [leadsSummary, setLeadsSummary] = useState({
    invitation: 0,
    proposal: 0,
    website: 0
  });

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [buttonTypeValue, setButtonTypeValue] = useState({
      type: "",
      id: ""
    });
    const [reviewValue, setReviewValue] = useState('');

    const [loader, setLoader] = useState(false)
    const [leadsSummaryToggle, setLeadsSummaryToggle] = useState(false)
    const [activeFilter, setActiveFilter] = useState("In-Progress")

    const [reRender, setReRender] = useState(true)

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([]);

    const [preData, setPreData] = useState([])

    const [gridApi, setGridApi] = useState(null);
    const gridRef = useRef();

    const [colVisibility, setColVisibility] = useState({
      companyName:false,
      clientName:false,
      department:false,
      source:false,
      brand:false,
      partner:false,
      createDate:false,
      followUpDate:false,
      proposalTemplate:false,
      email:false,
      note:false,
      stage:false,
      reason:false,
    })

    const handleReviewChange = (e)=>{
      e.preventDefault()
      setReviewValue(e.target.value);
    }

    const handleShowReviewModal = (type, id) => {
      setButtonTypeValue(prevState => ({
        ...prevState,
        type: type,
        id: id
    }));
      setShowReviewModal(true);
    };
  
    const handleCloseReviewModal = () => {
      setShowReviewModal(false);
    };

    async function onGridReady(params) {
      setGridApi(params);
    }

    const handleFilters = ()=>{
      // const roo = mainrowData; 
      
      var filteredArray = mainRowData

      if(gridApi){
        if(activeFilter === "Won" || activeFilter === "Lost"){
          const name = "reason"
          gridApi.columnApi.setColumnVisible(name, true)
          setColVisibility({ ...colVisibility, [name]: true })
        }else{
          const name = "reason"
          gridApi.columnApi.setColumnVisible(name, false)
          setColVisibility({ ...colVisibility, [name]: false })
        }
      }



      // Status Filter
      if(filteredArray != undefined && activeFilter != null && activeFilter !== ""){
        filteredArray = filteredArray.filter(obj => obj.status && obj.status === activeFilter);
      }

      


      setRowData(filteredArray)

    }

    useEffect(()=>{
      //Leads Summary
      const invitationArray  = rowData.filter(obj => obj.status && obj.source === "Invitation");
      const proposalArray  = rowData.filter(obj => obj.status && obj.source === "Proposal");
      const websiteArray  = rowData.filter(obj => obj.status && obj.source === "Website");

      console.log("invitationArray", invitationArray.length)
      console.log("proposalArray", proposalArray.length)
      console.log("websiteArray", websiteArray.length)

      setLeadsSummary(prevState => ({
        ...prevState,
        invitation: invitationArray.length,
        proposal: proposalArray.length,
        website: websiteArray.length,
    }));
    }, [rowData])


    useEffect(()=>{
      setRowData(mainRowData)
      handleFilters()
    },[mainRowData, activeFilter, gridApi])


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
  
          
        }

        try {
          const response = await axios.get(LeadsGetAllUrl,
              {
                  headers:{ 'Content-Type': 'application/json' }
              }
          );
          if(response.status === 200){
              console.log(response.data)
              setMainRowData(response.data.leads)
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


    const getData = async ()=>{
        
        try {
            const response = await axios.get(LeadsGetAllUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                console.log(response.data)
                setMainRowData(response.data.leads)
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

    useEffect(() => {
        setLoader(true)

        getPreData();

        setLoader(false)
    }, []);

    useEffect(()=>{
      const tempArr = preData
          const newObj = { value: null, label: 'Select' };
  
          tempArr.unshift(newObj);
          console.log(preData)
  
          setPreData(tempArr)
  
     }, [preData])


     const handleActionButtons = async (type, id)=>{
      console.log("type", type)
      console.log("id", id)

      if(type === "Delete"){
        const response = await axios.get(`${leadDeleteUrl}/${id}`,
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      
      if(type === "Won"){
        const response = await axios.post(`${wonLostUrl}/${id}`,
        {
          status: "Won",
          review: reviewValue
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      if(type === "Lost"){
        const response = await axios.post(`${wonLostUrl}/${id}`,
        {
          status: "Lost",
          review: reviewValue
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      if(type === "In-Progress"){
        const response = await axios.post(`${wonLostUrl}/${id}`,
        {
          status: "In-Progress",
          review: reviewValue
        },
        {
          headers:{ 'Content-Type': 'application/json' }
        }
        );
      }
      
      setShowReviewModal(false);
      setReRender(!reRender)

     }
    
    

    const handleAddRow = () => {
      const newRowData = { _id: 'New', company_name: null, client_name: null, department: null, source: null, brand: null, partner: null, createDate: null, followUpDate: null, manager_id: null, proposalTemplate: null, email: null, note: null, stage: null };
      setRowData([newRowData, ...rowData]);
    };
    
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
        { headerName: 'Co Name', field: 'companyName', flex:1.3 },
        { headerName: 'Client Name', field: 'clientName', flex:1.3 },
        { headerName: 'Department', field: 'department', flex:1.3 },
        { 
          headerName: 'Source', 
          field: 'source', 
          flex:1.3,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: ["Select", 'Invitation', 'Proposal', 'Website'] },
        },
        { headerName: 'Brand', field: 'brand', flex:1.3 },
        { headerName: 'Partner', field: 'partner', flex:1.3 },
        { headerName: 'Created Date', field: 'createDate', flex:1.3, editable:false,
        valueGetter: p => {
          if(p.data.createDate  && p.data.createDate !== "Invalid Date")
          {
            const deadline = new Date(p.data.createDate)
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
        { headerName: 'Followup Date', field: 'followUpDate', flex:1.3,
        valueGetter: p => {
          if(p.data.followUpDate  && p.data.followUpDate !== "Invalid Date")
          {
            const deadline = new Date(p.data.followUpDate)
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
        // { headerName: 'Manager', field: 'manager_id', flex:1.3,
        // valueGetter: p => {
        //   return p.data.manager_id !== null ? p.data.manager_id.name : "" //to get value from obj inside obj
        // },
        // cellEditor: 'agSelectCellEditor',
        // cellEditorParams: {
        //   values: preData.map(option => option.label),
        // },
        // onCellValueChanged: function(event) {
        // }
        // },
        { headerName: 'Prop.Template', field: 'proposalTemplate', flex:1.3 },
        { headerName: 'Email', field: 'email', flex:1.3 },
        { headerName: 'Note', field: 'note', flex:3 },
        { headerName: 'Stages', field: 'stage', flex:1 },
        { headerName: 'Review', field: 'reason', flex:1, editable: false },
        {
            headerName: 'Action', 
            field: 'status',
            floatingFilter: false,
            // flex:2,
            editable:false,
            width: 220,
            cellRendererFramework: (params)=>
            <>
                <div>
                  {/* {params.data.status != "Won" && <Link onClick={()=>{handleActionButtons("Won", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485',}} className='btn mx-1 '> Won</Link>  } */}

                  {/* {params.data.status != "Lost" && <Link onClick={()=>{handleActionButtons("Lost", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#ff00007d', color: 'white',}} className='btn mx-1 '> Lost</Link> }
                       
                  {params.data.status != "In-Progress" && <Link onClick={()=>{handleActionButtons("In-Progress", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485', color: 'black',}} className='btn mx-1 '> InProgress</Link>}
                              */}

                  {params.data.status != "Won" && <Link onClick={() => handleShowReviewModal('Won', params.data._id)} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485',}} className='btn mx-1 '> Won</Link>  }

                  {params.data.status != "Lost" && <Link onClick={()=>{handleShowReviewModal("Lost", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#ff00007d', color: 'white',}} className='btn mx-1 '> Lost</Link> }
                       
                  {params.data.status != "In-Progress" && <Link onClick={()=>{handleActionButtons("In-Progress", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#04d90485', color: 'black',}} className='btn mx-1 '> Progress</Link>}

                  <Link onClick={()=>{handleActionButtons("Delete", params.data._id)}} style={{height: '25px', padding: '0px 5px', width: 'fit-content', backgroundColor: '#ff00007d', color: 'white',}} className='btn mx-1 '> Delete</Link>    
                    
                  {/* <Link style={{border: '1px solid grey', height: '25px', width:"fit-content", padding: '0px 5px'}} className='btn mx-1 '>Make Customer</Link> */}
                    
                </div> 
            </>
        }
      ];

      const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        floatingFilter: true,
        editable: true,
        resizable: true
       }));

      //  const onCellValueChanged = useCallback((event) => {
      //   if(event.colDef.field === "manager_id"){
      //     const selectedOption = preData.find(option => option.label === event.data.manager_id);
      //     console.log(selectedOption)
      //     event.data.managerId = selectedOption ? selectedOption.value : '';
      //   }
      // }, [gridApi]);

       const onRowValueChanged = useCallback(async (event) => {
        var data = event.data;
        // console.log("data",data)
      
        await axios.post(leadEditUrl, 
          {
            data
          },
          {
            headers:{ 'Content-Type': 'application/json' }
          }
        );

        setReRender(!reRender)
      
      }, []);

       const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
      }, []);

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
                  Leads
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

            <div  className='table-col-numbers mx-2'>
              <button onClick={(e)=>{e.preventDefault(); setLeadsSummaryToggle(!leadsSummaryToggle)}} className='form-control'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 10.5V17.5M11.5 5.5V17.5M16 10.5V17.5M20.5 5.5V17.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div className='table-show-hide mx-2'>
              <div className="dropdown">
                <button className="btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <svg style={{height: '16px', width: '16px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-eye-off icon-16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
                <div style={{width: 'max-content', padding: '10px'}} className="dropdown-menu">
                      <ul style={{all: 'unset'}}>
                        <li><button onClick={(e)=>{toggleColHandler(e, "companyName")}} className={`dropdown-item ${!colVisibility.companyName? "" : "active"}`}  >Co Name</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "clientName")}} className={`dropdown-item ${!colVisibility.clientName? "" : "active"}`} >Client Name</button></li> 
                        <li><button onClick={(e)=>{toggleColHandler(e, "department")}} className={`dropdown-item ${!colVisibility.department? "" : "active"}`} >Department</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "source")}} className={`dropdown-item ${!colVisibility.source? "" : "active"}`} >Source</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "brand")}} className={`dropdown-item ${!colVisibility.brand? "" : "active"}`} >Brand</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "partner")}} className={`dropdown-item ${!colVisibility.partner? "" : "active"}`} >Partner</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "createDate")}} className={`dropdown-item ${!colVisibility.createDate? "" : "active"}`} >Created Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "followUpDate")}} className={`dropdown-item ${!colVisibility.followUpDate? "" : "active"}`} >Followup Date</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "proposalTemplate")}} className={`dropdown-item ${!colVisibility.proposalTemplate? "" : "active"}`} >Prop.Template</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "email")}} className={`dropdown-item ${!colVisibility.email? "" : "active"}`} >Email</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "note")}} className={`dropdown-item ${!colVisibility.note? "" : "active"}`} >Note</button></li>
                        <li><button onClick={(e)=>{toggleColHandler(e, "stage")}} className={`dropdown-item ${!colVisibility.Stages? "" : "active"}`} >stage</button></li>
                      </ul>
                </div>
              </div>
            </div>


            <div>
                <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                    <option value = "In-Progress">
                      Progress
                    </option>
                    <option value = "Won">
                        Won
                    </option>
                    <option value = "Lost">
                        Lost
                    </option>
                </select>
            </div>

          </div>

          <div className='mx-4'>
            <button onClick={handleAddRow} className='btn btn-primary'>
              Add Lead
            </button>
          </div>
          

        </div>

        <div className={`leadsSummary ${leadsSummaryToggle ? 'open' : 'closed'}`}>
          <hr style={{marginBottom: '0.1rem', color: 'rgb(131, 131, 131)',}}/>

          <div  className='p-2 m-2'>
            <div >
              <p className='mb-3'>
                Leads Summary
              </p>
              <div className='row'>

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{leadsSummary.invitation}</span> Invitation
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{leadsSummary.proposal}</span> Proposal
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>{leadsSummary.website}</span> Website
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>11.05%</span> Conv.Invitation
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>7%</span> Conv.Proposal
                  </p>
                </div>
                

                <div className='col-2'>
                  <p>
                    <span style={{fontWeight: "700"}}>9%</span> Conv.Website
                  </p>
                </div>
                
              </div>

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
                editType={'fullRow'}
                // onCellValueChanged={onCellValueChanged}
                onRowValueChanged={onRowValueChanged}
            />
            
          </div>
        </div>
    </div>

    <Modal show={showReviewModal} centered onHide={handleCloseReviewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form 
          // onSubmit={handleSubmit}
          >
            <Form.Group style={{marginTop: "10px"}} controlId="formName">
              <Form.Label>Review</Form.Label>
              <Form.Select 
              value={reviewValue} onChange={handleReviewChange}
              >
                <option value="">Select an Review</option>
                <option value="Pricing">Pricing</option>
                <option value="Proposal">Proposal</option>
                <option value="1st Reach">1st Reach</option>
                <option value="Invitation">Invitation</option>
              </Form.Select>
            </Form.Group>
            

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseReviewModal}>Close</Button>
          <Button onClick={()=>{handleActionButtons(buttonTypeValue.type, buttonTypeValue.id)}} className='btn btn-success' >Save</Button>
        </Modal.Footer>
      </Modal>

        </>
    );
}
}

export default Leads;
