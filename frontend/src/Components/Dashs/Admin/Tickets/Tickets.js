import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link, useNavigate } from 'react-router-dom';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import loaderr from "../../../../Assets/svgs/loader.svg"
import DropdownFilter from '../../../Jobs/JobPlaning/DropdownFilter';
import DropdownFilterWithDate from '../../../Jobs/JobPlaning/DropDownFilterWithDate';
import { Button, Form, Modal } from 'react-bootstrap';
import secureLocalStorage from 'react-secure-storage';
import TicketsContext from './TicketsContext';

var markMailAsRead = axiosURL.markMailAsRead;
var createNewTicket = axiosURL.createNewTicket;
var markMailAsDeleted = axiosURL.markMailAsDeleted;
var markMailAsCompleted = axiosURL.markMailAsCompleted;

export default function Tickets(props) {

  const roleName= props.roleName
  const quillRef = useRef(null);
  
  const contextValue = useContext(TicketsContext);

    const navigate = useNavigate();
  
      const [gridApi, setGridApi] = useState(null);
      const [newTicketFormData, setNewTicketFormData] = useState({
        clientId: '',
        subject: '',
        message: '',
        templateId: ''
      });
      const [clients, setClients] = useState();
      const [users, setUsers] = useState(contextValue.ticketsData.UsersList);
      const [templatesList, setTemplatesList] = useState([]);
      const [selectedClient, setSelectedClient] = useState("");
      const [trySubmit, setTrySubmit] = useState(false);
      const [mailIsSending, setMailIsSending] = useState(false);

  
      const [loader, setLoader] = useState(false)
      const [reRender, setReRender] = useState(true)
  
      const [mainRowData, setMainRowData] = useState([ ]);
      const [rowData, setRowData] = useState([ ]);
  
      const [jHolderFvalue, setJHolderFvalue] = useState('')
      const [statusFvalue, setStatusFvalue] = useState('')
      const [activeFilter, setActiveFilter] = useState('Active')
      const [startDateFvalueDate, setStartDateFvalueDate] = useState('');
      const [startDateFvalue, setStartDateFvalue] = useState('');
  
      const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  
      const gridRef = useRef();
  
      const handleFilters = async ()=>{
        // const roo = mainrowData; 
        var filteredArray = mainRowData

        console.log(filteredArray)
        
        if(filteredArray !== undefined && activeFilter !== null && activeFilter !== ""){
          if(activeFilter === 'Active'){
            filteredArray = filteredArray.filter(obj => obj.ticketInfo.isOpen);
          }
          else if(activeFilter === 'Inactive'){
            filteredArray = filteredArray.filter(obj => !(obj.ticketInfo.isOpen));
          }
        }
        
        if(filteredArray !== undefined && jHolderFvalue !== null && jHolderFvalue !== ""){
          filteredArray = filteredArray.filter(obj => obj.ticketInfo.user_id && obj.ticketInfo.user_id.name === jHolderFvalue);
        }

        
        if(filteredArray !== undefined && statusFvalue !== null && statusFvalue !== ""){
          filteredArray = filteredArray.filter(obj => obj.readStatus && obj.readStatus === statusFvalue);
        }

        
        //Date
        if(startDateFvalue){

          //Job Date Expired Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "Expired"){
            filteredArray = await filteredArray.filter(obj => {
              // obj.manager_id && obj.manager_id.name === cManagerFvalue
              const today = new Date()
              const deadline = new Date(obj.formattedDate)
              if(obj.formattedDate && obj.formattedDate !== 'Invalid Date'){
                if(!(deadline.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0))){
                  return obj;
                }
              }
            });
          }

          //Job Date Today Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "Today"){
            filteredArray = await filteredArray.filter(obj => {
              // obj.manager_id && obj.manager_id.name === cManagerFvalue
              const today = new Date()
              const deadline = new Date(obj.formattedDate)
              if(obj.formattedDate && obj.formattedDate !== 'Invalid Date'){
                if((deadline.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))){
                  return obj;
                }
              }
            });
          }

          //Job Date Tomorrow Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "Tomorrow"){
            filteredArray = await filteredArray.filter(obj => {
              // obj.manager_id && obj.manager_id.name === cManagerFvalue
              const today = new Date()
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const deadline = new Date(obj.formattedDate)
              if(obj.formattedDate && obj.formattedDate !== 'Invalid Date'){
                if((deadline.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0))){
                  return obj;
                }
              }
            });
          }


          //Job Date 7 days Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "In 7 days"){
            filteredArray = await filteredArray.filter(obj => {
              // obj.manager_id && obj.manager_id.name === cManagerFvalue
              const today = new Date()
              const deadline = new Date(obj.formattedDate)
              const deadlineNextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000))
              if(obj.formattedDate && obj.formattedDate !== 'Invalid Date'){
                if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
                  return obj;
                }
              }
            });
          }

          //Job Date 15 days Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "In 15 days"){
            filteredArray = await filteredArray.filter(obj => {
              // obj.manager_id && obj.manager_id.name === cManagerFvalue
              const today = new Date()
              const deadline = new Date(obj.formattedDate)
              const deadlineNextSevenDays = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000))
              if(obj.formattedDate && obj.formattedDate !== 'Invalid Date'){
                if((deadline >= today.setHours(0, 0, 0, 0)) && (deadline <= deadlineNextSevenDays.setHours(0, 0, 0, 0))){
                  return obj;
                }
              }
            });
          }

          //Job Date Month Wise Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "Month Wise"){
            filteredArray = await filteredArray.filter(obj => {
              // obj.manager_id && obj.manager_id.name === cManagerFvalue
              // const today = new Date()
              var today = new Date(startDateFvalueDate)
              const deadline = new Date(obj.formattedDate)
              if (obj.formattedDate && obj.formattedDate !== 'Invalid Date') {
                const todayMonth = today.getMonth();
                const todayYear = today.getFullYear();
                const deadlineMonth = deadline.getMonth();
                const deadlineYear = deadline.getFullYear();
              
                if ((deadlineYear === todayYear && deadlineMonth === todayMonth)) {
                  return obj;
                }
              }
            });
          }
          
          //Job Date Custom Filter
          if(filteredArray != undefined && startDateFvalue != null && startDateFvalue !== "" && startDateFvalue === "Custom"){
            filteredArray = await filteredArray.filter(obj => {
              var cellDate = obj.formattedDate !== "" && new Date(obj.formattedDate);
              var filterDate = new Date(startDateFvalueDate)
              if(cellDate && cellDate !== 'Invalid Date' && filterDate !== 'Invalid Date'){
                // compare dates
                if (cellDate.setHours(0, 0, 0, 0) <= filterDate.setHours(0, 0, 0, 0)) {
                  return 1; //exclude
                } else if (cellDate.setHours(0, 0, 0, 0) > filterDate.setHours(0, 0, 0, 0)) {
                  return 0; //include 
                } else {
                  return 1; //-1 include as exact match
                }
              }
            });
          }
        }

        
        
        setRowData(filteredArray)
  
      }

      const handleActionButtons = (e, action, Id)=>{
        e.preventDefault();
        var data = mainRowData;
        if(action === "Complete"){

          const confirmed = window.confirm('Are you sure you want to mark this item as Completed?');
          if (confirmed) {

          axios.get(`${markMailAsCompleted}/${Id}`, {
            headers:{ 'Content-Type': 'application/json' }
          })

          data = data.map(obj => {
            if (obj.ticketInfo._id === Id) {
              obj.ticketInfo.isOpen = false;
            }
            return obj;
          });
        }

        } else if(action === "Delete"){
          const confirmed = window.confirm('Are you sure you want to delete this item?');
          if (confirmed) {
            axios.get(`${markMailAsDeleted}/${Id}`, {
              headers:{ 'Content-Type': 'application/json' }
            })
            data = data.filter(obj => obj.ticketInfo._id !== Id);
          }
        }
        setMainRowData(data)
        contextValue.setReFetchTickets(prev => !prev);
      }
  
      
      useEffect(()=>{
        setRowData(mainRowData)
        handleFilters()
      },[mainRowData, statusFvalue, jHolderFvalue, activeFilter, startDateFvalueDate, startDateFvalue])

      
      
  
      
      useEffect(() => {
        const interval = setInterval(() => {
          // Perform your action here
        }, 5000);

        return () => {
          clearInterval(interval);
        };
      }, []);

      useEffect(() => {


          if(contextValue.ticketsData === 'Loading'){
            // Do Nothing
          }else if(contextValue.ticketsData === "Error"){
            // Do Nothing
          }else{
            setLoader(false)
            setMainRowData(contextValue.ticketsData.Emails ? contextValue.ticketsData.Emails.detailedThreads : []);
            setClients(contextValue.ticketsData.Clients);
            setUsers(contextValue.ticketsData.UsersList);
            setTemplatesList(contextValue.ticketsData.templatesList);
          }
          
      }, [reRender, contextValue.ticketsData]);

        const toDetailedMail=(dataToSend, id)=>{

          axios.get(`${markMailAsRead}/${id}`, {
            headers:{ 'Content-Type': 'application/json' }
          })
          contextValue.setReFetchTickets(prev => !prev);
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
              field: "a",
              flex: 1.5,
              editable: false,
              valueGetter: (params) => params.data.ticketInfo.client_id.company_name ,
          },
          {
              headerName: "Client Name",
              field: "b",
              flex: 1,
              editable: false,
              valueGetter: (params) => params.data.ticketInfo.client_id.client_name,
          },
          {
              headerName: "Job Holder",
              field: "c",
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
            },
            floatingFilterComponent: 'selectFloatingFilterWthDate', 
            floatingFilterComponentParams: { 
              options: ["Expired", "Today", "Tomorrow", "In 7 days", "In 15 days", "Month Wise", "Custom"],
              onValueChange:(value) => setStartDateFvalue(value),
              value: startDateFvalue,
              onDateValueChange:(value) => setStartDateFvalueDate(value),
              dateValue: startDateFvalueDate,
              suppressFilterButton: true, 
              suppressInput: true 
            },
          },
          {
              headerName: 'Action', 
              field: 'price',
              floatingFilter: false,
              flex:2,
              cellRendererFramework: (params)=>
              <>
                  <div>
                    {params.data.ticketInfo.isOpen && 
                      <Link 
                        onClick={(e)=>{handleActionButtons(e, 'Complete', params.data.ticketInfo._id)}}
                        className='mx-1' > 
                          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                              <title/><g id="Complete"><g id="tick"><polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g>
                            </svg>
                      </Link>
                    }
                    <Link onClick={(e)=>{handleActionButtons(e, 'Delete', params.data.ticketInfo._id)}} className='mx-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                        <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </Link>    
                      
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
  
         
  const frameworkComponents = {
    selectFloatingFilter: DropdownFilter,
    selectFloatingFilterWthDate: DropdownFilterWithDate,
  };
  
  async function onGridReady(params) {
    setGridApi(params);
  }

  
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Get the container element of the Quill editor
      const editorContainer = quill.container.parentNode;

      // Add a custom CSS class to the editor container
      editorContainer.classList.add('custom-editor-container');

      // Extend the existing formats with custom styles
      const CustomPFormat = {
        tag: 'p',
        inline: true,
        styles: {
          margin: '0',
          padding: '0',
          /* Add any other desired inline styles */
        },
      };
      quill.format['custom-p'] = CustomPFormat;
    }
  }, []);

    
  
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
      // value = e.replace(/<p>/g, `<p style=" margin: 0px; padding: 0px;">`);
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

  const handleTemplateSelect = (e) => {
    e.preventDefault();

    const {name, value} = e.target;

    if(value === ""){
      setNewTicketFormData(prevState => ({
        ...prevState,
        message: "",
        [name]: ""
      }));
    } else {
          const templateData = templatesList.find(template => template._id === value);
          const htmlString = templateData.template.replace(/\n/g, '<br>');
          setNewTicketFormData(prevState => ({
            ...prevState,
            message: htmlString,
            [name]: value
          }));

    }

  }

  const handleNewTicketSubmitForm = async (e)=>{
    e.preventDefault();
    
    if(!newTicketFormData.message || newTicketFormData.message === "<p><br></p>" || !newTicketFormData.subject || !newTicketFormData.clientId || (newTicketFormData.clientId && !selectedClient) )
    {
      setTrySubmit(true);
    }else{

      try {
        setMailIsSending(true)


        var value = newTicketFormData.message.replace(/<p>/g, `<p style=" margin: 0px; padding: 0px;">`);
        const formData = {
          clientId: newTicketFormData.clientId,
          subject: newTicketFormData.subject,
          message: value,
        }

        const token = secureLocalStorage.getItem('token') 
        await axios.post(`${createNewTicket}`, 
        {
          formData: formData
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
        contextValue.setReFetchTickets(prev => !prev);

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
  

              <div>
                  <select name='mon_week' onChange={(e)=>{setActiveFilter(e.target.value)}} defaultValue={activeFilter} style={{width: '110px'}} className='form-control mx-2'>
                      <option value = "Active">
                          Progress
                      </option>
                      <option value = "Inactive">
                          Completed
                      </option>
                  </select>
              </div>
  
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

            {roleName === "Admin" && 
            
              <Form.Group className='mt-2'>
                    
                <Form.Select 
                name='templateId'
                onChange={handleTemplateSelect}
                value = {newTicketFormData.templateId}
                >
                    <option value="">Select Template</option>
                    {templatesList && templatesList.map((template, index)=>
                        <option key={index} value={template._id}>{template.name} - {template.description}</option>
                    )}
                </Form.Select>

              </Form.Group>
            }
            

              <div>
                <Form.Group className=' mt-2'>
                  <ReactQuill 
                    ref={quillRef}
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
          <Button onClick={handleNewTicketSubmitForm} disabled={mailIsSending} className='btn btn-success' >{mailIsSending? "Sending..." : "Send"}</Button>
        </Modal.Footer>
      </Modal>
  
  
          </>
      );
  }
  