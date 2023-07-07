import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { useNavigate } from 'react-router-dom';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import loaderr from "../../../../Assets/svgs/loader.svg"
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import { Button, Form, Modal } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage';

var markMailAsRead = axiosURL.markMailAsRead;
var createNewTicket = axiosURL.createNewTicket;

export default function Tickets(props) {
  
    const navigate = useNavigate();
    
    const ticketsData = useMemo(() => props.ticketsData, [props.ticketsData]);
    const setReFetchTickets = useMemo(() => props.setReFetchTickets, [props.setReFetchTickets]);
  
      const [gridApi, setGridApi] = useState(null);
      const [newTicketFormData, setNewTicketFormData] = useState({
        clientId: '',
        subject: '',
        message: '',
      });
      const [clients, setClients] = useState();
      const [users, setUsers] = useState([]);
      const [selectedClient, setSelectedClient] = useState("");
      const [trySubmit, setTrySubmit] = useState(false);
      const [mailIsSending, setMailIsSending] = useState(false);

  
      const [loader, setLoader] = useState(false)
      const [reRender, setReRender] = useState(true)
  
      const [mainRowData, setMainRowData] = useState([ ]);
      const [rowData, setRowData] = useState([ ]);
  
      const [jHolderFvalue, setJHolderFvalue] = useState('')
      const [statusFvalue, setStatusFvalue] = useState('')
  
      const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  
      const gridRef = useRef();
  
      const handleFilters = async ()=>{
        // const roo = mainrowData; 
        var filteredArray = mainRowData
        
        // if(filteredArray !== undefined && jHolderFvalue !== null && jHolderFvalue !== ""){
        //   filteredArray = filteredArray.filter(obj => obj.ticketInfo.user_id && obj.ticketInfo.user_id.name === jHolderFvalue);
        // }

        
        if(filteredArray !== undefined && statusFvalue !== null && statusFvalue !== ""){
          filteredArray = filteredArray.filter(obj => obj.readStatus && obj.readStatus === statusFvalue);
        }
        
        setRowData(filteredArray)
  
      }
  
      
      useEffect(()=>{
        setRowData(mainRowData)
        handleFilters()
      },[mainRowData, statusFvalue])

  
  
      useEffect(() => {

          if(ticketsData === 'Loading'){
            setLoader(true)
          }else if(ticketsData === "Error"){
            // Do Nothing
          }else{
            setLoader(false)
            setMainRowData(ticketsData.Emails ? ticketsData.Emails.detailedThreads : []);
            setClients(ticketsData.Clients);
            setUsers(ticketsData.UsersList);
          }
          
      }, [ticketsData, reRender]);

        const toDetailedMail=(dataToSend, id)=>{

          axios.get(`${markMailAsRead}/${id}`, {
            headers:{ 'Content-Type': 'application/json' }
          })

          navigate('/tickets/mail', { state: dataToSend });
        }
      
        const columnDefs = [
          {
              headerName: "Sr #",
              filter: false,
              flex: 0.4,
              checkboxSelection: true,
              headerCheckboxSelection: true,
              editable: false,
              valueGetter: (params) => params.node.rowIndex + 1,
          },
          {
              headerName: "Company Name",
              flex: 1,
              editable: false,
              valueGetter: (params) => params.data.ticketInfo.client_id.company_name ,
          },
          {
              headerName: "Client Name",
              flex: 1,
              editable: false,
              valueGetter: (params) => params.data.ticketInfo.client_id.client_name,
          },
          {
              headerName: "Job Holder",
              flex: 1,
              editable: false,
              valueGetter: (params) => params.data.ticketInfo.user_id.name,

              floatingFilterComponent: 'selectFloatingFilter', 
              floatingFilterComponentParams: { 
                options: users && users.map(option => option.name),
                onValueChange:(value) => setJHolderFvalue(value),
                value: jHolderFvalue,
                suppressFilterButton: true, 
                suppressInput: true 
              }
          },
          
          { 
            headerName: 'Subject', 
            field: 'subject', 
            flex:3,
            cellRendererFramework: (params)=>
                  <a style={{
                    color: 'blue',
                    cursor: 'pointer',
                  }}
                  onClick={()=>{toDetailedMail( params.data, params.data.threadData.messages[params.data.threadData.messages.length - 1].id )}}
                  // to={{pathname: '/tickets/mail',  state: {data: params.data.threadData} }} 
                  >
                    {params.data.subject}
                  </a>
          },
          { headerName: 'Recipients', field: 'recipients', flex:2 },
          { 
            headerName: 'Status', 
            field: 'readStatus', 
            flex:0.6,

            floatingFilterComponent: 'selectFloatingFilter', 
              floatingFilterComponentParams: { 
                options: ['Unread', 'Read', 'Sent'],
                onValueChange:(value) => setStatusFvalue(value),
                value: statusFvalue,
                suppressFilterButton: true, 
                suppressInput: true 
              }
          },
          { 
            headerName: 'Date', 
            field: 'formattedDate', 
            flex:1,
            valueGetter: (params)=>{
              if(params.data.formattedDate && params.data.formattedDate !== "Invalid Date")
            {
              const deadline = new Date(params.data.formattedDate)
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
              return(`${da}-${mo}-${ye} ${params.data.formattedTime}`);
              }
              else{
                return ""
            }
            } ,
          },
          // {
          //     headerName: 'Action', 
          //     field: 'price',
          //     floatingFilter: false,
          //     flex:2,
          //     cellRendererFramework: (params)=>
          //     <>
          //         <div>
          //             <Link to={'/client/' + params.data._id} className='btn btn-xs  btn-primary mx-1 '> Edit</Link>    
          //             <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} className='btn btn-xs  btn-danger mx-1'> delete</Link>
          //         </div> 
          //     </>
          // }
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
  
         
  const frameworkComponents = {
    selectFloatingFilter: DropdownFilter,
  };
  
  async function onGridReady(params) {
    setGridApi(params);
  }

  
  const modules = {
    
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const editorStyle = {
    backgroundColor: 'white',
    borderRadius: '5px',
  };

  const setSelectedClientFunct = (value)=>{
    if(value !== ""){
      var client = clients.filter((cli) => cli._id === value )
      var email =  client[0] ? client[0].email : "";
      setSelectedClient(email)
    }
  }

  const handleNewTicketDataChange = (e, field)=>{

    setTrySubmit(false);

    var name = "";
    var value = "";

    if(field ==="~~~~"){

      name = "message";
      value = e;

    } else {
      e.preventDefault();
       name = e.target.name;
       value = e.target.value;
       if(name === "clientId"){
        setSelectedClientFunct(value)
       }
    }

    setNewTicketFormData(prevState => ({
        ...prevState,
        [name]: value
    }));


  }

  const fixMailMessage = ()=>{
    const modifiedContent = newTicketFormData.message.replace(/<div><br><\/div>/g, '<br>');

        const name = "message";
        const value = modifiedContent;

        setNewTicketFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
  }

  const handleNewTicketSubmitForm = async (e)=>{
    e.preventDefault();
    
    if(!newTicketFormData.message || newTicketFormData.message === "<p><br></p>" || !newTicketFormData.subject || !newTicketFormData.clientId || (newTicketFormData.clientId && !selectedClient) )
    {
      setTrySubmit(true);
    }else{

      try {
        setMailIsSending(true)

        fixMailMessage();

        const token = secureLocalStorage.getItem('token') 
        await axios.post(`${createNewTicket}`, 
        {
          formData: newTicketFormData
        },
        {
          headers:{ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        
        setNewTicketFormData({
          clientId: '',
          subject: '',
          message: '',
        });
        setSelectedClient("");
        setMailIsSending(false);
        setShowNewTicketModal(false);
        setReFetchTickets(prev => !prev);

      } catch (error) {
        // do nothing
      }

      
    }
  }

  
  
  
        
  
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
                    Tickets
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
  

              {/* <div>
                  <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                      <option value = "Active">
                          Active
                      </option>
                      <option value = "Inactive">
                          Inactive
                      </option>
                  </select>
              </div> */}
  
            </div>
  
            <div className="d-flex">

            {loader && <img style={{height: '40px', paddingLeft: '15px'}} src={loaderr} alt="" /> }
              <Button className='mx-4' onClick={()=>{setShowNewTicketModal(!showNewTicketModal)}}>
                New Ticket
              </Button>
  
            </div>
  
            
  
          </div>
  
  
  
          <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>
  
          <div>
            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine" style={{ height: '81vh'}}>
  
              {/* <button onClick={deleteHandler}>delete</button> */}
  
              <AgGridReact
                  columnDefs={columnDefs}
                  onGridReady={onGridReady}
                  rowData={rowData}
                  defaultColDef={defaultColDef}
                  ref={gridRef}
                  animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                  rowSelection='multiple' // Options - allows click selection of rows
                  pagination = {true}
                  paginationPageSize = {25}
                  suppressDragLeaveHidesColumns={true}
                  frameworkComponents={frameworkComponents}
              />
  
              
            </div>
          </div>
      </div>
  
  
             

      
      <Modal size="lg" show={showNewTicketModal} centered onHide={()=>{setShowNewTicketModal(!showNewTicketModal)}}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className='task_modalbody_bg_color'>

          <div>
          <Form 
            onSubmit={handleNewTicketSubmitForm}
          >
              <Form.Group className='mt-2'>
      
                <Form.Select 
                name='clientId'
                onChange={handleNewTicketDataChange}
                value = {newTicketFormData.clientId}
                >
                    <option value="">Select Client</option>
                    {clients && clients.map((client, index)=>
                        <option key={index} value={client._id}>{client.company_name} - {client.client_name}</option>
                    )}
                </Form.Select>

              </Form.Group>

              { trySubmit && !newTicketFormData.clientId ? 
              
                <div className='mt-2'>
                  <p style = {{
                    color: 'red',
                  }}>
                  Client Is Required
                  </p>
                </div>

                : trySubmit && newTicketFormData.clientId && !selectedClient &&
              
                <div className='mt-2'>
                  <p style = {{
                    color: 'red',
                  }}>
                    This client Does Not have Email in system
                  </p>
                </div>

              }


              <Form.Group className='mt-2'>
                <Form.Control
                    name='subject'
                    type="text"
                    placeholder="Subject"
                    onChange={handleNewTicketDataChange}
                    value = {newTicketFormData.subject}
                />
              </Form.Group>

              { trySubmit && !newTicketFormData.subject && 
              
              <div className='mt-2'>
                <p style = {{
                  color: 'red',
                }}>
                  Subject is Required
                </p>
              </div>

            }

              <div>
                <Form.Group className=' mt-2'>
                  <ReactQuill 
                    name="message"
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    style={editorStyle} 
                    onChange={(e) => {handleNewTicketDataChange(e, "~~~~")}}
                    value = {newTicketFormData.message}
                  />
                </Form.Group>
              </div>

              { trySubmit && (!newTicketFormData.message || newTicketFormData.message === "<p><br></p>") && 
              
              <div className='mt-2'>
                <p style = {{
                  color: 'red',
                }}>
                  Subject is Required
                </p>
              </div>

            }


            </Form>
          </div>


        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{setShowNewTicketModal(!showNewTicketModal)}}>Close</Button>
          <Button onClick={handleNewTicketSubmitForm} disabled={mailIsSending} className='btn btn-success' >{mailIsSending? "Sending..." : "Save"}</Button>
        </Modal.Footer>
      </Modal>
  
  
          </>
      );
  }
  