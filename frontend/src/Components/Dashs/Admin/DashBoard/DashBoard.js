import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';


import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import { Store } from 'react-notifications-component';

var getDashboardDataUrl = axiosURL.getDashboardDataUrl;

export default function Dashboard() {

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


  useEffect(()=>{
    if(dashboardData) {
      setChartsData({
         data1 : [
          ["Month",` ${dashboardData && dashboardData.clientsCount.selectedYear}` , `${dashboardData && dashboardData.clientsCount.PreviousYear}`],
          ["Jan", dashboardData ? dashboardData.clientsCount.jan: 0 , dashboardData ? dashboardData.clientsCount.janP: 0],
          ["Feb", dashboardData ? dashboardData.clientsCount.feb: 0 , dashboardData ? dashboardData.clientsCount.febP: 0],
          ["March", dashboardData ? dashboardData.clientsCount.march: 0 , dashboardData ? dashboardData.clientsCount.marchP: 0],
          ["April", dashboardData ? dashboardData.clientsCount.apr: 0 , dashboardData ? dashboardData.clientsCount.aprP: 0],
          ["May", dashboardData ? dashboardData.clientsCount.may: 0 , dashboardData ? dashboardData.clientsCount.mayP: 0],
          ["June", dashboardData ? dashboardData.clientsCount.june: 0 , dashboardData ? dashboardData.clientsCount.juneP: 0],
          ["July", dashboardData ? dashboardData.clientsCount.july: 0 , dashboardData ? dashboardData.clientsCount.julyP: 0],
          ["Aug", dashboardData ? dashboardData.clientsCount.aug: 0 , dashboardData ? dashboardData.clientsCount.augP: 0],
          ["Sept", dashboardData ? dashboardData.clientsCount.sept: 0 , dashboardData ? dashboardData.clientsCount.septP: 0],
          ["Oct", dashboardData ? dashboardData.clientsCount.oct: 0 , dashboardData ? dashboardData.clientsCount.octP: 0],
          ["Nov", dashboardData ? dashboardData.clientsCount.nov: 0 , dashboardData ? dashboardData.clientsCount.novP: 0],
          ["Dec", dashboardData ? dashboardData.clientsCount.dec: 0 , dashboardData ? dashboardData.clientsCount.decP: 0],
        ],
        
        options1: {
          chart: {
            legend: 'none',
            title: "Clients Counter Graph",
            subtitle: `${dashboardData.clientsCount.selectedYear} - ${dashboardData.clientsCount.PreviousYear}`,
            bars: 'vertical',
          },
          series: {
            0: { color: '#b5b5b9' }, // Custom color for the first series (bars)
            1: { color: '#67c160' }, // Custom color for the first series (bars)
          },
        },
      
      data2: [
          ["Departments Name", "Department"],
          ["Accounts", dashboardData ? dashboardData.DepartmentFee.accounts: 0],
          ["Address", dashboardData ? dashboardData.DepartmentFee.address: 0],
          ["Billing", dashboardData ? dashboardData.DepartmentFee.billing: 0],
          ["Bookkeeping", dashboardData ? dashboardData.DepartmentFee.bookKeeping: 0],
          ["Company Sec", dashboardData ? dashboardData.DepartmentFee.companySec: 0],
          ["Payroll", dashboardData ? dashboardData.DepartmentFee.payRoll: 0],
          ["Personal Tax", dashboardData ? dashboardData.DepartmentFee.personalTax: 0],
          ["Vat Return", dashboardData ? dashboardData.DepartmentFee.vatReturn: 0],
        ],
        
        options2: {
          chart: {
            legend: 'none',
            title: "Clients Counter Graph",
            subtitle: `${dashboardData.DepartmentFee.selectedYear} - ${dashboardData.DepartmentFee.PreviousYear}`,
            bars: 'vertical',
          },
          series: {
            0: { color: '#1ab394' }, // Custom color for the first series (bars)
          },
        },
      
      data3: [
          ["Month", `${dashboardData && dashboardData.clientsCount.selectedYear}` , `${dashboardData && dashboardData.clientsCount.PreviousYear}`],
          ["Jan", dashboardData ? dashboardData.ClientFee.jan: 0, dashboardData ? dashboardData.ClientFee.janP: 0],
          ["Feb", dashboardData ? dashboardData.ClientFee.feb: 0, dashboardData ? dashboardData.ClientFee.febP: 0],
          ["March", dashboardData ? dashboardData.ClientFee.march: 0, dashboardData ? dashboardData.ClientFee.marchP: 0],
          ["April", dashboardData ? dashboardData.ClientFee.apr: 0, dashboardData ? dashboardData.ClientFee.aprP: 0],
          ["May", dashboardData ? dashboardData.ClientFee.may: 0, dashboardData ? dashboardData.ClientFee.mayP: 0],
          ["June", dashboardData ? dashboardData.ClientFee.june: 0, dashboardData ? dashboardData.ClientFee.juneP: 0],
          ["July", dashboardData ? dashboardData.ClientFee.july: 0, dashboardData ? dashboardData.ClientFee.julyP: 0],
          ["Aug", dashboardData ? dashboardData.ClientFee.aug: 0, dashboardData ? dashboardData.ClientFee.augP: 0],
          ["Sept", dashboardData ? dashboardData.ClientFee.sept: 0, dashboardData ? dashboardData.ClientFee.septP: 0],
          ["Oct", dashboardData ? dashboardData.ClientFee.oct: 0, dashboardData ? dashboardData.ClientFee.octP: 0],
          ["Nov", dashboardData ? dashboardData.ClientFee.nov: 0, dashboardData ? dashboardData.ClientFee.novP: 0],
          ["Dec", dashboardData ? dashboardData.ClientFee.dec: 0, dashboardData ? dashboardData.ClientFee.decP: 0],
        ],
        
        options3: {
          chart: {
            title: "Client Fee",
            subtitle: "2023",
            legend: 'none',
          },
          series: {
            0: { color: '#b5b5b9' }, // Custom color for the first series (bars)
            1: { color: '#5873d8' }, // Custom color for the first series (bars)
          },
        },
      
      data4: [
          ["Departments Name", "Department"],
          ["Accounts", dashboardData ? dashboardData.JobsOverdue.accounts.length: 0],
          ["Address", dashboardData ? dashboardData.JobsOverdue.address.length: 0],
          ["Billing", dashboardData ? dashboardData.JobsOverdue.billing.length: 0],
          ["Bookkeeping", dashboardData ? dashboardData.JobsOverdue.bookKeeping.length: 0],
          ["Company Sec", dashboardData ? dashboardData.JobsOverdue.companySec.length: 0],
          ["Payroll", dashboardData ? dashboardData.JobsOverdue.payRoll.length: 0],
          ["Personal Tax", dashboardData ? dashboardData.JobsOverdue.personalTax.length: 0],
          ["Vat Return", dashboardData ? dashboardData.JobsOverdue.vatReturn.length: 0],
        ],
        
        options4: {
          chart: {
            title: "Department Overdue Jobs",
            subtitle: "Total Overdue: 000",
           legend: 'none',
          },
          series: {
            0: { color: '#be7462' }, // Custom color for the first series (bars)
          },
        },
      
        data5: [
          ["Departments Name", "Department"],
          ["Accounts", dashboardData ? dashboardData.Jobsdue.accounts.length: 0],
          ["Address", dashboardData ? dashboardData.Jobsdue.address.length: 0],
          ["Billing", dashboardData ? dashboardData.Jobsdue.billing.length: 0],
          ["Bookkeeping", dashboardData ? dashboardData.Jobsdue.bookKeeping.length: 0],
          ["Company Sec", dashboardData ? dashboardData.Jobsdue.companySec.length: 0],
          ["Payroll", dashboardData ? dashboardData.Jobsdue.payRoll.length: 0],
          ["Personal Tax", dashboardData ? dashboardData.Jobsdue.personalTax.length: 0],
          ["Vat Return", dashboardData ? dashboardData.Jobsdue.vatReturn.length: 0],
        ],
        
        options5: {
          chart: {
            title: "Department Due Jobs",
            subtitle: "Total Due: 000",
            legend: {
              display: false
            }
          },
          series: {
            0: { color: '#516aeb' }, // Custom color for the first series (bars)
          },
        },
      
      
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
                    <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={chartsData.data1}
                    options={chartsData.options1}
                    />
                </div>
            </div>
            
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                    <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={chartsData.data2}
                    options={chartsData.options2}
                   
                    />
                </div>
            </div>
            
            <div className='col-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                    <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={chartsData.data3}
                    options={chartsData.options3}
                    
                    />
                </div>
            </div>
            
            <div className='col-6 mt-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                    <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={chartsData.data4}
                    options={chartsData.options4}
                    
                    />
                </div>
            </div>
            
            <div className='col-6 mt-4'>
                <div style={{overflow: 'hidden', padding: '10px', backgroundColor: 'white'}}>
                    <Chart
                    chartType="Bar"
                    width="100%"
                    height="400px"
                    data={chartsData.data5}
                    options={chartsData.options5}
                   
                    />
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
