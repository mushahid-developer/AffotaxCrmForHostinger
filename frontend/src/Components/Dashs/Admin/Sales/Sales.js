import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import { v4 as uuidv4 } from 'uuid';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import Loader from '../../../Common/Loader/Loader';
import { Button, Modal } from 'react-bootstrap';
import CustomAgSelectCellEditor from './CustomAgSelect';

var SalesgetAllUrl = axiosURL.SalesgetAllUrl;
var SalesAddOneUrl = axiosURL.SalesAddOneUrl;
var SalesDeleteOneUrl = axiosURL.SalesDeleteOneUrl;
var SalesEditOneUrl = axiosURL.SalesEditOneUrl;



const Sales = () => {

    const [gridApi, setGridApi] = useState(null);
  

    const [loader, setLoader] = useState(false)
    const [reRender, setReRender] = useState(true)
    const [itemGridApi, setItemGridApi] = useState(null);

    const [mainRowData, setMainRowData] = useState([ ]);
    const [rowData, setRowData] = useState([ ]);
    const [ClientsPreData, setClientsPreData] = useState('');
    const [coaPreData, setCoaPreData] = useState('');
    const [modelType, setModelType] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    const [ saleData, setSaleData ] = useState({
      to: "",
      date: "", 
      dueDate: "",
      invoiceNo: '1',
      currency: "GBP",
      status: "Un paid"

    })

    const [itemsRowData, setItemsRowData] = useState([
      {
        unique_id: uuidv4(),
        description: '',
        qty: '',
        unit_price: '',
        discount_percentage: '',
        account: '',
        tax_rate: '',
        amount: '',
      }
    ]);

    const [itemsTotalSec, setItemsTotalSec] = useState({
        subTotal: 0,
        tax: 0,
        total: 0,
        disc: 0,
      }
    );

    const [activeFilter, setActiveFilter] = useState("Active")

    const [addSaleIsOpen, setAddSaleIsOpen] = useState(false)

    const gridRef = useRef();

    async function onItemGridReady(params) {
      setItemGridApi(params);
    }

    const handleFilters = ()=>{

      var filteredArray = mainRowData

      // // JobStatus Filter
      // if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Active"){
      //   filteredArray = filteredArray.filter(obj => obj.isActive === true);
      // }

      // if(filteredArray != undefined && activeFilter != null && activeFilter !== "" && activeFilter === "Inactive"){
      //   filteredArray = filteredArray.filter(obj => obj.isActive === false);
      // }

      setRowData(filteredArray)

    }


    useEffect(()=>{
      setRowData(mainRowData)
      handleFilters()
    },[mainRowData, activeFilter])


    const getData = async ()=>{
        setLoader(true)
        try {
            const response = await axios.get(SalesgetAllUrl,
                {
                    headers:{ 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200){
                setMainRowData(response.data.sales)
                setClientsPreData(response.data.clients)
                setCoaPreData(response.data.COA)
                setSaleData(prevState => ({
                  ...prevState,
                  invoiceNo: response.data.invoice_no
                }));
                setInvoiceNumber(response.data.invoice_no)
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

    const beforeAddModelHandler = ()=>{
      setSaleData({
        to: "",
        date: "", 
        dueDate: "",
        invoiceNo: invoiceNumber,
        currency: "GBP",
        status: "Un paid"
  
      })
      setItemsRowData([
        {
          unique_id: uuidv4(),
          description: '',
          qty: '',
          unit_price: '',
          discount_percentage: '',
          account: '',
          tax_rate: '',
          amount: '',
        }
      ]);
      setItemsTotalSec({
        subTotal: 0,
        tax: 0,
        total: 0,
        disc: 0,
      });
      setModelType("New");
      setAddSaleIsOpen(!addSaleIsOpen)
    }

    const handleFormSubmit = (e)=>{
      e.preventDefault();
     if(modelType === "New"){
       handleAddSale();
    }else{
       handleActionButtons('Edit', saleData._id);
     }
    }

    
    const beforeEditModelHandler =(data)=>{

      setSaleData({
        to: data.client_id._id,
        date: data.date, 
        dueDate: data.due_date,
        invoiceNo: data.invoice_no,
        currency: data.currency,
        status: data.status,
        _id: data._id
  
      })
  
      data.saleitem_id && setItemsRowData(data.saleitem_id);
  
      setItemsTotalSec({
          subTotal: +data.subtotal,
          tax: +data.tax,
          total: +data.total,
          disc: +data.discount,
        }
      );

      
      setAddSaleIsOpen(!addSaleIsOpen)
    }
    
      const columnDefs = [
        {
            headerName: "Sr #",
            filter: false,
            flex: 0.6,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            editable: false,
            valueGetter: (params) => params.node.rowIndex + 1,
        },
        { headerName: 'Invoice No', field: 'invoice_no', flex:1 },
        { headerName: 'Client Name', field: 'book_start_date', flex:1,
          valueGetter: p => {
              return p.data.client_id.client_name //to get value from obj inside obj
          },  
        },
        { headerName: 'Company Name', field: 'company_name', flex:1,
          valueGetter: p => {
              return p.data.client_id.company_name //to get value from obj inside obj
          },  
        },
        { headerName: 'Date', field: 'date', flex:3,
        valueGetter: p => {
          if(p.data.date  && p.data.date !== "Invalid Date")
          {
            const deadline = new Date(p.data.date)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(deadline);
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(deadline);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(deadline);
            return(`${da}-${mo}-${ye}`);
          }
          else{
            return ""
          }
        } },
        { headerName: 'Due Date', field: 'due_date', flex:4, 
        valueGetter: p => {
          if(p.data.due_date  && p.data.due_date !== "Invalid Date")
          {
            const deadline = new Date(p.data.due_date)
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
        { headerName: 'Currency', field: 'currency', flex:1 },
        { headerName: 'Status', field: 'status', flex:1 },
        {
            headerName: 'Action', 
            field: 'price',
            floatingFilter: false,
            flex:2,
            cellRendererFramework: (params)=>
            // <>
            //     <div>
            //         <Link to={'/client/' + params.data._id} className='btn btn-xs  btn-primary mx-1 '> Edit</Link>    
            //         <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} className='btn btn-xs  btn-danger mx-1'> delete</Link>
            //     </div> 
            // </>
            <>

              <Link onClick={()=>{setModelType("View"); beforeEditModelHandler(params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 52 52" enable-background="new 0 0 52 52">
                  <g>
                    <path d="M51.8,25.1C47.1,15.6,37.3,9,26,9S4.9,15.6,0.2,25.1c-0.3,0.6-0.3,1.3,0,1.8C4.9,36.4,14.7,43,26,43   s21.1-6.6,25.8-16.1C52.1,26.3,52.1,25.7,51.8,25.1z M26,37c-6.1,0-11-4.9-11-11s4.9-11,11-11s11,4.9,11,11S32.1,37,26,37z"/>
                    <path d="M26,19c-3.9,0-7,3.1-7,7s3.1,7,7,7s7-3.1,7-7S29.9,19,26,19z"/>
                  </g>
                </svg>
              </Link>

              <Link to="/view/invoice" state = {{ data: params.data }} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important', marginLeft: '5px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V11C20.6569 11 22 12.3431 22 14V18C22 19.6569 20.6569 21 19 21H5C3.34314 21 2 19.6569 2 18V14C2 12.3431 3.34315 11 5 11V5ZM5 13C4.44772 13 4 13.4477 4 14V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V14C20 13.4477 19.5523 13 19 13V15C19 15.5523 18.5523 16 18 16H6C5.44772 16 5 15.5523 5 15V13ZM7 6V12V14H17V12V6H7ZM9 9C9 8.44772 9.44772 8 10 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H10C9.44772 10 9 9.55228 9 9ZM9 12C9 11.4477 9.44772 11 10 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H10C9.44772 13 9 12.5523 9 12Z" fill="#000000"/>
                </svg>
              </Link>


              <Link onClick={()=>{setModelType("Edit"); beforeEditModelHandler(params.data)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important', marginLeft: '5px', marginRight: '5px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"> <title/> <g id="Complete">
                  <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g>
                  </g> </g>
                </svg>  
              </Link>


              <Link onClick={()=>{handleActionButtons('Delete', params.data._id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                  <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Link>
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

       const ItemsColSet = [
        { headerName: 'Description', field: 'description', flex:4 },
        { headerName: 'Qty', field: 'qty', flex:1 },
        { headerName: 'Unit Price', field: 'unit_price', flex:1,
          valueGetter: p => {
            return p.data.unit_price && p.data.unit_price //to get value from obj inside obj
          },
        },
        { headerName: 'Disc', field: 'discount_percentage', flex:1 },
        { 
          headerName: 'Account', 
          field: 'account',
          flex:3,
          cellEditor: 'customAgSelectCellEditor',
          valueGetter: p => {
            return p.data.account && p.data.account.label //to get value from obj inside obj
          }, 
          cellEditorParams: (params) => ({
            values: coaPreData,
            params,
            selectedAccountId: selectedAccountId,
            setSelectedAccountId: (unique_id, selectedValuee) => {
              setSelectedAccountId(selectedValuee)
            },
          })
        },
        { headerName: 'Tax Rate %', field: 'tax_rate', flex:2 },
        { headerName: 'Amount', field: 'amount', flex:2, editable: false, },
        { headerName: '', field: 'actt', flex:1, editable: false,
        cellRendererFramework: (params)=>
        <>
          <Link onClick={()=>{onItemsRowDelete(params.data.unique_id)}} style={{all: 'unset', cursor: 'pointer', textAlign: 'center !important'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
              <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </Link>
        </>
      },
      ]
      
      const defaultItemsColSet = useMemo( ()=> ({
        sortable: false,
        filter: false,
        floatingFilter: false,
        editable: true,
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
            const response = await axios.get(`${SalesDeleteOneUrl}/${id}`,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if(response.status === 200){
            setReRender(!reRender)
          }
          } else {
            // user clicked Cancel, do nothing
          }
        }

        if(type === "Edit"){
  
          const response = await axios.post(`${SalesEditOneUrl}/${id}`,
            {
              saleData: saleData,
              totalData: itemsTotalSec,
              saleItems: itemsRowData
            },
            {
                headers:{ 'Content-Type': 'application/json' }
            }
          );
          if(response.status === 200){
            setSaleData({
              to: "",
              date: "", 
              dueDate: "",
              invoiceNo: '1',
              currency: "GBP",
              status: "Un paid"
        
            })
            setItemsRowData([
              {
                unique_id: uuidv4(),
                description: '',
                qty: '',
                unit_price: '',
                discount_percentage: '',
                account: '',
                tax_rate: '',
                amount: '',
              }
            ]);
            setItemsTotalSec({
              subTotal: 0,
              tax: 0,
              total: 0,
              disc: 0,
            }
          );
          setAddSaleIsOpen(false)
            setReRender(!reRender)
          }
        }
  
       }


       const handleAddNewLine = ()=>{
        const newItem = {
          unique_id: uuidv4(),
          description: '',
          qty: '',
          unit_price: '',
          discount_percentage: '',
          account: '',
          tax_rate: '',
          amount: '',
        };

        setItemsRowData(prevItems => [...prevItems, newItem]);
       }

       const updateItem = (itemId, updatedItem) => {
        setItemsRowData(prevItems =>
          prevItems.map(item =>
            item.unique_id === itemId ? { ...item, ...updatedItem } : item
          )
        );
      };

      const deleteItem = itemIdToDelete => {
        setItemsRowData(prevItems =>
          prevItems.filter(item => item.unique_id !== itemIdToDelete)
        );
      };

      const onItemsRowDelete = (unique_idd)=>{
        const itemIdToDelete = unique_idd;
        deleteItem(itemIdToDelete);
      }

      // const onCellValueChanged = (params) => {
      //   const rowIndex = params.rowIndex;
      //   const colId = params.column.getId();
      //   const newValue = params.newValue;
    
      //   // Update the value in the data variable
      //   const updatedData = [...itemsRowData];
      //   updatedData[rowIndex][colId] = newValue;
      //   setItemsData(updatedData);
      // };


      const onItemsRowValueChanged = useCallback(async (event) => {
        var data = event.data;

        var unitPrice = data.unit_price;
        var quantity = data.qty;
        var discount = data.discount_percentage;
        var taxPerc = data.tax_rate;
        var taxAmt = 0;
        var totalAmt = 0;

        // 20% of 100 = 100 * .2

        if(unitPrice && quantity){
          // taxAmt = (taxPerc * unitPrice) / 100;
          totalAmt = (+unitPrice * +quantity) - +discount;
        }
        setSelectedAccountId(prev => prev)
        var ac_id = selectedAccountId.value;
        var ac_name = selectedAccountId.label;

      
        const itemIdToUpdate = data.unique_id;
        const updatedItem = {
          description: data.description,
          qty: data.qty,
          unit_price: data.unit_price,
          discount_percentage: data.discount_percentage,
          account: ac_name,
          account_id: ac_id,
          tax_rate: data.tax_rate,
          amount: totalAmt,
        };
        setSelectedAccountId(null)
          updateItem(itemIdToUpdate, updatedItem);

      
      }, [selectedAccountId]);



      useEffect(()=>{

        var subtotalPr = 0;
        var taxAmt = 0;
        var discAmt = 0;
        var totalAmt = 0;

        for (const itemm of itemsRowData){
          if( itemm.unit_price && itemm.unit_price !== "" && itemm.qty && itemm.qty !== ""){
            taxAmt = ((itemm.tax_rate * itemm.unit_price) / 100) + taxAmt;
            subtotalPr = +subtotalPr + +itemm.amount;
            discAmt = +discAmt + +itemm.discount_percentage
          }
        }

        totalAmt = +subtotalPr + +taxAmt

        setItemsTotalSec(prevState => ({
                ...prevState,
                subTotal: subtotalPr,
                total: totalAmt,
                tax: taxAmt,
                disc: discAmt
            }));
      }, [itemsRowData])


      const handleFormChange = (e)=>{
        e.preventDefault();
        const { name, value } = e.target;
        setSaleData(prevState => ({
          ...prevState,
          [name]: value
      }));
      }

      const handleAddSale = async ()=>{
        // SalesAddOneUrl
        setLoader(true)
        try {
            const response = await axios.post(SalesAddOneUrl,
              {
                saleData: saleData,
                totalData: itemsTotalSec,
                saleItems: itemsRowData
              },
              {
                headers:{ 'Content-Type': 'application/json' }
              }
            );
            if(response.status === 200){
              setSaleData({
                to: "",
                date: "", 
                dueDate: "",
                invoiceNo: '1',
                currency: "GBP",
                status: "Un paid"
          
              })
              setItemsRowData([
                {
                  unique_id: uuidv4(),
                  description: '',
                  qty: '',
                  unit_price: '',
                  discount_percentage: '',
                  account: '',
                  tax_rate: '',
                  amount: '',
                }
              ]);
              setItemsTotalSec({
                subTotal: 0,
                tax: 0,
                total: 0,
                disc: 0,
              }
            );
            setAddSaleIsOpen(false)
              setReRender(!reRender)
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


      
  // Export grid data to Excel
  const exportToExcel = (e) => {
    e.preventDefault()
    try {
    const params = {
      sheetName: 'Grid Data',
      fileName: `Sales - ${new Date().toISOString().slice(0, 10)}`,
      allColumns: true
    };

    const exportData = gridApi.api.exportDataAsCsv(params);
    const workbook = XLSX.read(exportData, { type: 'binary' });
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'csv',
      type: 'array',
      bookSST: false
    });
    saveAs(
      new Blob([excelBuffer], { type: 'application/octet-stream' }),
      `${params.fileName}.csv`
    );
    } catch (error) {
    const a = error;
  }
  };
      

  async function onGridReady(params) {
    setGridApi(params);
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
                  Sales
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

          <div className=''>
          <Link onClick={exportToExcel} style={{
          backgroundColor: 'transparent',
          color: 'black',
          borderColor: 'lightgray',
          alignSelf: 'center',
        }} className='btn btn-primary'>
            Excel
            </Link>
            <Link onClick={beforeAddModelHandler} className='btn btn-primary mx-4'>
              Add Sale
            </Link>
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
            />
            
          </div>
        </div>
    </div>

    <Modal 
    // size="xl"
    dialogClassName="modal-90w" 
    show={addSaleIsOpen} 
    centered 
    onHide={()=>{setAddSaleIsOpen(!addSaleIsOpen)}}>
      <Modal.Header closeButton>
        <Modal.Title> { modelType === "View" ? "View" : modelType === "New" ? "Add New" : "Edit"} Sale</Modal.Title>
      </Modal.Header>
      <form onSubmit={ handleFormSubmit }>
      <Modal.Body className='task_modalbody_bg_color'>

        

        <div  style={{height: '78vh', overflow: 'scroll',}}>

            <div className='row'>

              <div className='col-8'>
                <div className='row'>

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlSelect1">To</label>
                      <select disabled = {modelType === "View" ? true : false} required value={saleData.to} onChange={handleFormChange} name='to' style={{fontSize: '12px'}} class="form-control" id="exampleFormControlSelect1">
                        <option value={null} selected disabled>select Client</option>
                        {ClientsPreData && ClientsPreData.map((client, index)=>{
                          return(
                            <option key={index} value={client._id}>{client.company_name}</option>
                          )
                        })}
                      </select>
                    </div>
                  </div>

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Date</label>
                      <input disabled = {modelType === "View" ? true : false} value={saleData.date} style={{fontSize: '12px'}} onChange={handleFormChange} name='date' type="date" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>
                  

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Due Date</label>
                      <input disabled = {modelType === "View" ? true : false} value={saleData.dueDate} style={{fontSize: '12px'}} onChange={handleFormChange} name='dueDate' type="date" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>

                  <div className='col-3'>
                    <div class="form-group">
                      <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Invoice #</label>
                      <input disabled style={{fontSize: '12px'}} onChange={handleFormChange} name='invoiceNo' value={saleData.invoiceNo} type="text" class="form-control" id="exampleFormControlInput1"/>
                    </div>
                  </div>

                </div>
              </div>

              <div className='col-4'>
                <div className='col-6'>
                  <div class="form-group">
                    <label style={{fontSize: '12px'}} for="exampleFormControlInput1">Status</label>
                    <select style={{fontSize: '12px'}} className='form-control' name='status' value={saleData.status} onChange={handleFormChange}>
                      <option value="Un paid"> Un paid </option>
                      <option value="Paid"> Paid </option>
                    </select>
                    {/* <input disabled style={{fontSize: '12px'}} onChange={handleFormChange} name='invoiceNo' value={saleData.invoiceNo} type="text" class="form-control" id="exampleFormControlInput1"/> */}
                  </div>
                </div>    
              </div>
            </div>

            <hr/>

            <div className='row'>
              <div className='col-2'>
                <div class="form-group">
                  <select disabled = {modelType === "View" ? true : false} defaultValue={saleData.currency} style={{fontSize: '12px'}} onChange={handleFormChange} name='currency' class="form-control" id="exampleFormControlSelect1">
                    <option value="AFN">Afghan Afghani - ؋</option>
                    <option value="ALL">Albanian Lek - Lek</option>
                    <option value="DZD">Algerian Dinar - دج</option>
                    <option value="AOA">Angolan Kwanza - Kz</option>
                    <option value="ARS">Argentine Peso - $</option>
                    <option value="AMD">Armenian Dram - ֏</option>
                    <option value="AWG">Aruban Florin - ƒ</option>
                    <option value="AUD">Australian Dollar - $</option>
                    <option value="AZN">Azerbaijani Manat - m</option>
                    <option value="BSD">Bahamian Dollar - B$</option>
                    <option value="BHD">Bahraini Dinar - .د.ب</option>
                    <option value="BDT">Bangladeshi Taka - ৳</option>
                    <option value="BBD">Barbadian Dollar - Bds$</option>
                    <option value="BYR">Belarusian Ruble - Br</option>
                    <option value="BEF">Belgian Franc - fr</option>
                    <option value="BZD">Belize Dollar - $</option>
                    <option value="BMD">Bermudan Dollar - $</option>
                    <option value="BTN">Bhutanese Ngultrum - Nu.</option>
                    <option value="BTC">Bitcoin - ฿</option>
                    <option value="BOB">Bolivian Boliviano - Bs.</option>
                    <option value="BAM">Bosnia-Herzegovina Convertible Mark - KM</option>
                    <option value="BWP">Botswanan Pula - P</option>
                    <option value="BRL">Brazilian Real - R$</option>
                    <option value="GBP">British Pound Sterling - £</option>
                    <option value="BND">Brunei Dollar - B$</option>
                    <option value="BGN">Bulgarian Lev - Лв.</option>
                    <option value="BIF">Burundian Franc - FBu</option>
                    <option value="KHR">Cambodian Riel - KHR</option>
                    <option value="CAD">Canadian Dollar - $</option>
                    <option value="CVE">Cape Verdean Escudo - $</option>
                    <option value="KYD">Cayman Islands Dollar - $</option>
                    <option value="XOF">CFA Franc BCEAO - CFA</option>
                    <option value="XAF">CFA Franc BEAC - FCFA</option>
                    <option value="XPF">CFP Franc - ₣</option>
                    <option value="CLP">Chilean Peso - $</option>
                    <option value="CNY">Chinese Yuan - ¥</option>
                    <option value="COP">Colombian Peso - $</option>
                    <option value="KMF">Comorian Franc - CF</option>
                    <option value="CDF">Congolese Franc - FC</option>
                    <option value="CRC">Costa Rican ColÃ³n - ₡</option>
                    <option value="HRK">Croatian Kuna - kn</option>
                    <option value="CUC">Cuban Convertible Peso - $, CUC</option>
                    <option value="CZK">Czech Republic Koruna - Kč</option>
                    <option value="DKK">Danish Krone - Kr.</option>
                    <option value="DJF">Djiboutian Franc - Fdj</option>
                    <option value="DOP">Dominican Peso - $</option>
                    <option value="XCD">East Caribbean Dollar - $</option>
                    <option value="EGP">Egyptian Pound - ج.م</option>
                    <option value="ERN">Eritrean Nakfa - Nfk</option>
                    <option value="EEK">Estonian Kroon - kr</option>
                    <option value="ETB">Ethiopian Birr - Nkf</option>
                    <option value="EUR">Euro - €</option>
                    <option value="FKP">Falkland Islands Pound - £</option>
                    <option value="FJD">Fijian Dollar - FJ$</option>
                    <option value="GMD">Gambian Dalasi - D</option>
                    <option value="GEL">Georgian Lari - ლ</option>
                    <option value="DEM">German Mark - DM</option>
                    <option value="GHS">Ghanaian Cedi - GH₵</option>
                    <option value="GIP">Gibraltar Pound - £</option>
                    <option value="GRD">Greek Drachma - ₯, Δρχ, Δρ</option>
                    <option value="GTQ">Guatemalan Quetzal - Q</option>
                    <option value="GNF">Guinean Franc - FG</option>
                    <option value="GYD">Guyanaese Dollar - $</option>
                    <option value="HTG">Haitian Gourde - G</option>
                    <option value="HNL">Honduran Lempira - L</option>
                    <option value="HKD">Hong Kong Dollar - $</option>
                    <option value="HUF">Hungarian Forint - Ft</option>
                    <option value="ISK">Icelandic KrÃ³na - kr</option>
                    <option value="INR">Indian Rupee - ₹</option>
                    <option value="IDR">Indonesian Rupiah - Rp</option>
                    <option value="IRR">Iranian Rial - ﷼</option>
                    <option value="IQD">Iraqi Dinar - د.ع</option>
                    <option value="ILS">Israeli New Sheqel - ₪</option>
                    <option value="ITL">Italian Lira - L,£</option>
                    <option value="JMD">Jamaican Dollar - J$</option>
                    <option value="JPY">Japanese Yen - ¥</option>
                    <option value="JOD">Jordanian Dinar - ا.د</option>
                    <option value="KZT">Kazakhstani Tenge - лв</option>
                    <option value="KES">Kenyan Shilling - KSh</option>
                    <option value="KWD">Kuwaiti Dinar - ك.د</option>
                    <option value="KGS">Kyrgystani Som - лв</option>
                    <option value="LAK">Laotian Kip - ₭</option>
                    <option value="LVL">Latvian Lats - Ls</option>
                    <option value="LBP">Lebanese Pound - £</option>
                    <option value="LSL">Lesotho Loti - L</option>
                    <option value="LRD">Liberian Dollar - $</option>
                    <option value="LYD">Libyan Dinar - د.ل</option>
                    <option value="LTL">Lithuanian Litas - Lt</option>
                    <option value="MOP">Macanese Pataca - $</option>
                    <option value="MKD">Macedonian Denar - ден</option>
                    <option value="MGA">Malagasy Ariary - Ar</option>
                    <option value="MWK">Malawian Kwacha - MK</option>
                    <option value="MYR">Malaysian Ringgit - RM</option>
                    <option value="MVR">Maldivian Rufiyaa - Rf</option>
                    <option value="MRO">Mauritanian Ouguiya - MRU</option>
                    <option value="MUR">Mauritian Rupee - ₨</option>
                    <option value="MXN">Mexican Peso - $</option>
                    <option value="MDL">Moldovan Leu - L</option>
                    <option value="MNT">Mongolian Tugrik - ₮</option>
                    <option value="MAD">Moroccan Dirham - MAD</option>
                    <option value="MZM">Mozambican Metical - MT</option>
                    <option value="MMK">Myanmar Kyat - K</option>
                    <option value="NAD">Namibian Dollar - $</option>
                    <option value="NPR">Nepalese Rupee - ₨</option>
                    <option value="ANG">Netherlands Antillean Guilder - ƒ</option>
                    <option value="TWD">New Taiwan Dollar - $</option>
                    <option value="NZD">New Zealand Dollar - $</option>
                    <option value="NIO">Nicaraguan CÃ³rdoba - C$</option>
                    <option value="NGN">Nigerian Naira - ₦</option>
                    <option value="KPW">North Korean Won - ₩</option>
                    <option value="NOK">Norwegian Krone - kr</option>
                    <option value="OMR">Omani Rial - .ع.ر</option>
                    <option value="PKR">Pakistani Rupee - ₨</option>
                    <option value="PAB">Panamanian Balboa - B/.</option>
                    <option value="PGK">Papua New Guinean Kina - K</option>
                    <option value="PYG">Paraguayan Guarani - ₲</option>
                    <option value="PEN">Peruvian Nuevo Sol - S/.</option>
                    <option value="PHP">Philippine Peso - ₱</option>
                    <option value="PLN">Polish Zloty - zł</option>
                    <option value="QAR">Qatari Rial - ق.ر</option>
                    <option value="RON">Romanian Leu - lei</option>
                    <option value="RUB">Russian Ruble - ₽</option>
                    <option value="RWF">Rwandan Franc - FRw</option>
                    <option value="SVC">Salvadoran ColÃ³n - ₡</option>
                    <option value="WST">Samoan Tala - SAT</option>
                    <option value="SAR">Saudi Riyal - ﷼</option>
                    <option value="RSD">Serbian Dinar - din</option>
                    <option value="SCR">Seychellois Rupee - SRe</option>
                    <option value="SLL">Sierra Leonean Leone - Le</option>
                    <option value="SGD">Singapore Dollar - $</option>
                    <option value="SKK">Slovak Koruna - Sk</option>
                    <option value="SBD">Solomon Islands Dollar - Si$</option>
                    <option value="SOS">Somali Shilling - Sh.so.</option>
                    <option value="ZAR">South African Rand - R</option>
                    <option value="KRW">South Korean Won - ₩</option>
                    <option value="XDR">Special Drawing Rights - SDR</option>
                    <option value="LKR">Sri Lankan Rupee - Rs</option>
                    <option value="SHP">St. Helena Pound - £</option>
                    <option value="SDG">Sudanese Pound - .س.ج</option>
                    <option value="SRD">Surinamese Dollar - $</option>
                    <option value="SZL">Swazi Lilangeni - E</option>
                    <option value="SEK">Swedish Krona - kr</option>
                    <option value="CHF">Swiss Franc - CHf</option>
                    <option value="SYP">Syrian Pound - LS</option>
                    <option value="STD">São Tomé and Príncipe Dobra - Db</option>
                    <option value="TJS">Tajikistani Somoni - SM</option>
                    <option value="TZS">Tanzanian Shilling - TSh</option>
                    <option value="THB">Thai Baht - ฿</option>
                    <option value="TOP">Tongan pa'anga - $</option>
                    <option value="TTD">Trinidad & Tobago Dollar - $</option>
                    <option value="TND">Tunisian Dinar - ت.د</option>
                    <option value="TRY">Turkish Lira - ₺</option>
                    <option value="TMT">Turkmenistani Manat - T</option>
                    <option value="UGX">Ugandan Shilling - USh</option>
                    <option value="UAH">Ukrainian Hryvnia - ₴</option>
                    <option value="AED">United Arab Emirates Dirham - إ.د</option>
                    <option value="UYU">Uruguayan Peso - $</option>
                    <option value="USD">US Dollar - $</option>
                    <option value="UZS">Uzbekistan Som - лв</option>
                    <option value="VUV">Vanuatu Vatu - VT</option>
                    <option value="VEF">Venezuelan BolÃ­var - Bs</option>
                    <option value="VND">Vietnamese Dong - ₫</option>
                    <option value="YER">Yemeni Rial - ﷼</option>
                    <option value="ZMK">Zambian Kwacha - ZK</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='my-3 salesTable'>
              <div className="ag-theme-alpine" style={{height: '40vh'}}>
                <AgGridReact
                onGridReady={onItemGridReady}
                  columnDefs={ItemsColSet}
                  rowData={itemsRowData}
                  defaultColDef={defaultItemsColSet}
                  editType={'fullRow'}
                  // animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                  // rowSelection='multiple' // Options - allows click selection of rows
                  // pagination = {true}
                  // paginationPageSize = {25}
                  // onCellValueChanged={onCellValueChanged}
                  onRowValueChanged={onItemsRowValueChanged}
                  suppressDragLeaveHidesColumns={true}
                  frameworkComponents={{
                    customAgSelectCellEditor: CustomAgSelectCellEditor,
                  }}
                />
              </div>

              <div className='mt-3'>
                <div className='row'>
                  <div className='col-6'>
                    <button type='button' onClick={handleAddNewLine} style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      border: 'none',
                      backgroundColor: 'white',
                      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                      }}> Add a new line</button>
                  </div>

                  <div className='col-6'>
                    <div className='px-3' style={{
                      textAlign: '-webkit-right',
                      }}>
                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p>
                                  SubTotal
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p>
                                  {itemsTotalSec.subTotal}
                                </p>
                              </div>
                          </div>
                        </div>

                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p>
                                  Tax
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p>
                                  {itemsTotalSec.tax}
                                </p>
                              </div>
                          </div>
                        </div>

                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p>
                                  Discount
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p>
                                  {itemsTotalSec.disc}
                                </p>
                              </div>
                          </div>
                        </div>

                        <hr style={{
                          width: '60%',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                          height: '2px',
                          border: 'none',
                          color: '#333',
                          backgroundColor: '#333',}} />

                        <div style={{width: '30vw'}} className='row'>
                          <div className='col-8'>
                              <div>
                                <p style={{
                                  fontSize: '25px',
                                  fontWeight: '600',
                                }} >
                                  Total
                                </p>
                              </div>
                          </div>

                          <div className='col-4'>
                            <div>
                                <p style={{
                                  fontSize: '25px',
                                  fontWeight: '600',
                                }}>
                                  {itemsTotalSec.total}
                                </p>
                              </div>
                          </div>
                        </div>

                        <hr style={{    
                          width: '60%',
                          marginTop: '0.5rem',
                          marginBottom: '0.5rem',
                          height: '3px',
                          border: 'none',
                          color: '#333',
                          backgroundColor: '#333',
                          }} />


                    </div>
                  </div>
                </div>
              </div>

            </div>


        </div>


      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>{setAddSaleIsOpen(!addSaleIsOpen)}}>Close</Button>
        {modelType === "View" ? <></> :
        modelType === "New" ?
         <Button type='submit' className='btn btn-success' >Save</Button> 
         : modelType === "Edit" && <Button type='submit' className='btn btn-success' >Update</Button> 
         }
        
      </Modal.Footer>
      </form>
    </Modal>



        </>
    );
}
}

export default Sales;
