import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import { Store } from 'react-notifications-component';

var getDashboardDataUrl = axiosURL.getDashboardDataUrl;

export default function Dashboard() {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [dashboardData, setDashboardData] = useState();
  const [chartsData, setChartsData] = useState({
    data1: [],
    options1: {},
    data2: [],
    options2: {},
    data3: [],
    options3: {},
    data4: [],
    options4: {},
    data5: [],
    options5: {},
    pieData1: [],
    pieOptions1: {},
    pieData2: [],
    pieOtions2: {}
  });

  
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Clients Counter Graph',
    },
  },
  barThickness: 10
};


const data = {
  labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: ` ${dashboardData && dashboardData.clientsCount.selectedYear}`,
      data: [
        dashboardData ? dashboardData.clientsCount.jan: 0, dashboardData ? dashboardData.clientsCount.feb: 0, dashboardData ? dashboardData.clientsCount.march: 0, dashboardData ? dashboardData.clientsCount.apr: 0, dashboardData ? dashboardData.clientsCount.may: 0, dashboardData ? dashboardData.clientsCount.june: 0, dashboardData ? dashboardData.clientsCount.july: 0, dashboardData ? dashboardData.clientsCount.aug: 0, dashboardData ? dashboardData.clientsCount.sept: 0, dashboardData ? dashboardData.clientsCount.oct: 0, dashboardData ? dashboardData.clientsCount.nov: 0, dashboardData ? dashboardData.clientsCount.dec: 0
      ],
      backgroundColor: '#b5b5b9',
    },
    {
      label: ` ${dashboardData && dashboardData.clientsCount.PreviousYear}`,
      data: [
        dashboardData ? dashboardData.clientsCount.janP: 0, dashboardData ? dashboardData.clientsCount.febP: 0, dashboardData ? dashboardData.clientsCount.marchP: 0, dashboardData ? dashboardData.clientsCount.aprP: 0, dashboardData ? dashboardData.clientsCount.mayP: 0, dashboardData ? dashboardData.clientsCount.juneP: 0, dashboardData ? dashboardData.clientsCount.julyP: 0, dashboardData ? dashboardData.clientsCount.augP: 0, dashboardData ? dashboardData.clientsCount.septP: 0, dashboardData ? dashboardData.clientsCount.octP: 0, dashboardData ? dashboardData.clientsCount.novP: 0, dashboardData ? dashboardData.clientsCount.decP: 0
      ],
      backgroundColor: '#67c160',
    },
    
  ],
};


  
const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Departments Counter Graph',
    },
  },
  barThickness: 10
};


const data2 = {
  labels: ['Accounts', 'Address', 'Billing', 'Bookkeeping', 'Company Sec', 'Payroll', 'Personal Tax', 'Vat Return'],
  datasets: [
    {
      label: `Count`,
      data: [
        dashboardData ? dashboardData.DepartmentFee.accounts: 0, dashboardData ? dashboardData.DepartmentFee.address: 0, dashboardData ? dashboardData.DepartmentFee.billing: 0, dashboardData ? dashboardData.DepartmentFee.bookKeeping: 0, dashboardData ? dashboardData.DepartmentFee.companySec: 0, dashboardData ? dashboardData.DepartmentFee.payRoll: 0, dashboardData ? dashboardData.DepartmentFee.personalTax: 0, dashboardData ? dashboardData.DepartmentFee.vatReturn: 0
      ],
      backgroundColor: '#1ab394',
    },
    
  ],
};


  
const options3 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Clients Counter Graph',
    },
  },
  barThickness: 10
};


const data3 = {
  labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: ` Count`,
      data: [
        dashboardData ? dashboardData.ClientFee.jan: 0, dashboardData ? dashboardData.ClientFee.feb: 0, dashboardData ? dashboardData.ClientFee.march: 0, dashboardData ? dashboardData.ClientFee.apr: 0, dashboardData ? dashboardData.ClientFee.may: 0, dashboardData ? dashboardData.ClientFee.june: 0, dashboardData ? dashboardData.ClientFee.july: 0, dashboardData ? dashboardData.ClientFee.aug: 0, dashboardData ? dashboardData.ClientFee.sept: 0, dashboardData ? dashboardData.ClientFee.oct: 0, dashboardData ? dashboardData.ClientFee.nov: 0, dashboardData ? dashboardData.ClientFee.dec: 0
      ],
      backgroundColor: '#b5b5b9',
    },
    {
      label: ` ${dashboardData && dashboardData.clientsCount.PreviousYear}`,
      data: [
        dashboardData ? dashboardData.ClientFee.janP: 0, dashboardData ? dashboardData.ClientFee.febP: 0, dashboardData ? dashboardData.ClientFee.marchP: 0, dashboardData ? dashboardData.ClientFee.aprP: 0, dashboardData ? dashboardData.ClientFee.mayP: 0, dashboardData ? dashboardData.ClientFee.juneP: 0, dashboardData ? dashboardData.ClientFee.julyP: 0, dashboardData ? dashboardData.ClientFee.augP: 0, dashboardData ? dashboardData.ClientFee.septP: 0, dashboardData ? dashboardData.ClientFee.octP: 0, dashboardData ? dashboardData.ClientFee.novP: 0, dashboardData ? dashboardData.ClientFee.decP: 0
      ],
      backgroundColor: '#5873d8',
    },
    
  ],
};

const options4 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Departments OverDue Jobs',
    },
  },
  barThickness: 20, // Adjust the width of the bars
  categorySpacing: 100, // Adjust the space between bars (default is 1)
};


const data4 = {
  labels: ['Accounts', 'Address', 'Billing', 'Bookkeeping', 'Company Sec', 'Payroll', 'Personal Tax', 'Vat Return'],
  datasets: [
    {
      label: `Count`,
      data: [
        dashboardData ? dashboardData.JobsOverdue.accounts.length: 0, dashboardData ? dashboardData.JobsOverdue.address.length: 0, dashboardData ? dashboardData.JobsOverdue.billing.length: 0, dashboardData ? dashboardData.JobsOverdue.bookKeeping.length: 0, dashboardData ? dashboardData.JobsOverdue.companySec.length: 0, dashboardData ? dashboardData.JobsOverdue.payRoll.length: 0, dashboardData ? dashboardData.JobsOverdue.personalTax.length: 0, dashboardData ? dashboardData.JobsOverdue.vatReturn.length: 0
      ],
      backgroundColor: '#be7462',
    },
    
  ],
};

const options5 = {
  responsive: true,
  barThickness: 15, 
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Departments OverDue Jobs',
    },
  },
  barThickness: 20, // Adjust the width of the bars
  categorySpacing: 100, // Adjust the space between bars (default is 1)
};


const data5 = {
  labels: ['Accounts', 'Address', 'Billing', 'Bookkeeping', 'Company Sec', 'Payroll', 'Personal Tax', 'Vat Return'],
  datasets: [
    {
      label: `Count`,
      data: [
        dashboardData ? dashboardData.Jobsdue.accounts.length: 0, dashboardData ? dashboardData.Jobsdue.address.length: 0, dashboardData ? dashboardData.Jobsdue.billing.length: 0, dashboardData ? dashboardData.Jobsdue.bookKeeping.length: 0, dashboardData ? dashboardData.Jobsdue.companySec.length: 0, dashboardData ? dashboardData.Jobsdue.payRoll.length: 0, dashboardData ? dashboardData.Jobsdue.personalTax.length: 0, dashboardData ? dashboardData.Jobsdue.vatReturn.length: 0
      ],
      backgroundColor: '#516aeb',
    },
    
  ],
};


  useEffect(()=>{
    if(dashboardData) {
      setChartsData({
     
        pieData1: [
          ["Partner", "Contributed"],
          ["Affotax", dashboardData && dashboardData.PartnersGraph.Affotax],
          ["OTL", dashboardData && dashboardData.PartnersGraph.OTL],
          ["Outsource", dashboardData && dashboardData.PartnersGraph.Outsource]
        ],
        
        pieOptions1: {
          title: "Partners Grpah",
          legend: { 
            position: 'bottom', 
            alignment: 'center' ,
            orientation: 'vertical',
          }
        },
      
        pieData2: [
          ["Sources", "Contributed"],
          ["FIV", dashboardData && dashboardData.SourcesGraph.FIV],
          ["PPH", dashboardData && dashboardData.SourcesGraph.PPH],
          ["Partner", dashboardData && dashboardData.SourcesGraph.Partner],
          ["Referal", dashboardData && dashboardData.SourcesGraph.Referal],
          ["UPW", dashboardData && dashboardData.SourcesGraph.UPW],
          ["Website", dashboardData && dashboardData.SourcesGraph.Website],
        ],
        
        pieOptions2: {
          title: "Sources Grpah",
          legend: { 
            position: 'bottom', 
            alignment: 'center' ,
            orientation: 'vertical',
          }
        },
      })
    }
  }, [dashboardData])

  const getData = async ()=>{
    try {
        const response = await axios.post(getDashboardDataUrl,
            {
                headers:{ 'Content-Type': 'application/json' }
            }
        );
        if(response.status === 200){
          console.log(response.data)
          setDashboardData(response.data)
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


if(dashboardData)
{

  return (
    <>
        <div style={{
        border: 'none'
        }}
        className="card" >
        
        <div style={{alignItems: 'center', justifyContent: 'space-between',}} className='d-flex'>
  
          <div style={{alignItems: 'center',}} className='d-flex'>
  
            <div >
              <h4 style={{padding: '2px 16px',}}>
                  Dashboard
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
  
          </div>
  
          <div className='mx-4'>
            {/*  */}
          </div>
          
  
        </div>
  
  
  
        <hr style={{marginBottom: "0px", marginTop: "0px", color: 'rgb(131 131 131)'}}/>
  
    </div>
  
  
    <div style={{overflow: 'hidden',}} >
        <div className='row mt-4'>
  
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                  <Bar options={options} data={data} />
                </div>
            </div>
            
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                  <Bar options={options2} data={data2} />
                </div>
            </div>
            
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                  <Bar options={options3} data={data3} />
                </div>
            </div>
            
            <div className='col-6 mt-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                  <Bar options={options4} data={data4} />
                </div>
            </div>
            
            <div className='col-6 mt-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white' }}>
                  <Bar options={options5} data={data5} />
                </div>
            </div>
            
            <div className='col-6 mt-4'>
                <div style={{padding: '10px', backgroundColor: 'white'}}>
                    <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={chartsData.pieData1}
                    options={chartsData.pieOptions1}
                    />
                </div>
            </div>
            
            <div className='col-6 mt-4'>
                <div style={{padding: '10px', backgroundColor: 'white'}}>
                    <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={chartsData.pieData2}
                    options={chartsData.pieOptions2}
                    />
                </div>
            </div> 
  
  
  
        </div>
    </div>
  
    </>
  );
} else {
  return(
    <>
    Loading
    </>
  )
}

}
