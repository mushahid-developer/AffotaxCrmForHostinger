import React, { useState, useEffect } from 'react';
import { Store } from 'react-notifications-component';
import secureLocalStorage from 'react-secure-storage';

import axios from '../../../../Api/Axios';
import * as axiosURL from '../../../../Api/AxiosUrls';
import loaderImg from "../../../../Assets/svgs/loader.svg"

import "./Timer.css"

var GetAllClientsWthBaseUrl = axiosURL.GetAllClientsWthBaseUrl;
var jobPlanningUrl = axiosURL.jobPlanning;
var timerStateUrl = axiosURL.timerStateUrl;
var timerStartStopUrl = axiosURL.timerStartStopUrl;

function Timer(props) {
  const { setUser } = props
  const token = secureLocalStorage.getItem('token')

  const [loader, setLoader] = useState(false)
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  const [timerState, setTimerState] = useState();

  const [clients, setClients] = useState();
  const [departments, setDepartments] = useState();

  const [data, setData] = useState({
    clientName: "",
    departmentName: "",
    notes: ''
  });

  const hadleTimeSetValues = () => {
    const startTime = new Date(timerState.startTime)
    const curTime = new Date()

    // Calculate the difference in milliseconds
    const differenceInMs = Math.abs(curTime - startTime);
    // difference in Seconds
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    setTime(differenceInSeconds);

    setData(prevState => ({
      ...prevState,
      clientName: timerState.client,
      departmentName: timerState.department,
      notes: timerState.note,
  }));


    setTimerOn(true);

  }


  const getData = async () => {
    setLoader(true)
    const clients = await axios.get(GetAllClientsWthBaseUrl,
      {
         headers:{ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
         }
      }
    );
    setClients(clients.data)
  
    const jobs = await axios.get(jobPlanningUrl,
      {
        headers:{ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
         }
      }
    );
    setDepartments(jobs.data)
  
    const state = await axios.get(timerStateUrl,
      {
        headers:{ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
         }
      }
    );
    setTimerState(state.data)
    setUser(state.data.user)

    setLoader(false)
  }

  useEffect( ()=>{
    getData()
  }, [])

  useEffect(()=>{
    if(timerState){
      if(timerState.message === 'running')
      {
       hadleTimeSetValues();
      }
      else if( timerState.message === "not_running"){
        //do nothing
      }
    }
  }, [timerState])


  useEffect(() => {
    let interval;
    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  const handleChange = (e)=>{
    e.preventDefault();

    const { name, value } = e.target;
    setData(prevState => ({
      ...prevState,
      [name]: value
  }));
  }

  const handleStart = async (e) => {
    e.preventDefault()
    const curTime = new Date();
    if(!timerOn) //Off to on
    {
      const formData = {
        message: timerState.message,
        startTime: curTime,
        notes: data.notes,
        client_id: data.clientName,
        job_id: data.departmentName,
      }

      try{
        setLoader(true)
        const response = await axios.post(timerStartStopUrl,
          {
            data: formData
          },
          {
             headers:{ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
           }
          }
        );

        if(response.status === 200 )
      {
        setTimerOn(true);
      }
      setLoader(false)

      }
      catch(err){
        Store.addNotification({
          title: 'Failed',
          message: "Could Not Start Timer, Please Try Again",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
        setLoader(false)
      }

      
    }else if(timerOn){ //on to off

      const formData = {
        _id: timerState.time_id,
        message: timerState.message,
        endTime: curTime,
        notes: data.notes
      }

      try{
        setLoader(true)
        const response = await axios.post(timerStartStopUrl,
          {
            data: formData
          },
          {
             headers:{ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
           }
          }
        );
        if(response.status === 200 )
        {
          setTimerOn(false);
          setData({
            clientName: "",
            departmentName: "",
            notes: ''
          })
          setTime(0);
        }
        setLoader(false)
      }
      catch(err){
        Store.addNotification({
          title: 'Failed',
          message: "Could Not Stop Timer, Please Try Again",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
        setLoader(false)
      }

    }
    getData()

  }

  

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if(timerOn)
  {
    document.title = formatTime(time) + " | " + data.notes;
  }
  else{
    document.title = 'Affotax'
  }


  return (
    <>

        <div style={{alignItems: 'center', justifyContent: 'center',}} className='d-flex'>
          <form onSubmit={handleStart}>
          <div className="row">
                <div className="col-9">
                    <div style={{alignItems: 'center', justifyContent: 'center',}} className='d-flex'>
                        <select required onChange={handleChange} value={data.clientName} style={{width:'25%'}} className='form-control' name="clientName" placeholder='Client' >
                          <option value=''>Company</option>
                            {clients && clients.map((cli, ind)=>{
                              return(
                                <option key={ind} value={cli._id}>{cli.company_name}</option>
                              )
                            })}
                        </select>
                        <select required onChange={handleChange} value={data.departmentName} style={{marginLeft: "10px", width:'25%'}} className='form-control' name="departmentName" placeholder='Department' >
                          <option value=''>Department</option>
                            {departments && departments.map((dep, ind)=>{
                              if(data.clientName && (data.clientName === dep.client_id._id)){
                                return(
                                  <option key={ind} value={dep._id}>{dep.job_name}</option>
                                ) 
                              }
                            }
                            )}
                        </select>
                        <input required style={{marginLeft: "10px", width:'50%'}}  onChange={handleChange} value={data.notes} className='form-control' type="text" name="notes" placeholder='Note' title={data.notes}  />
                          
                    </div>
                </div>
                <div className="col-3">
                    <div style={{alignItems: 'center'}} className='d-flex'>
                        <p
                            style={
                                {
                                    fontSize: '27px',
                                    fontWeight: '600',
                                    width: '105px',
                                }
                            }
                        >{formatTime(time)}</p>
                        <div className="button-container">
                            {timerOn ? 
                            <button type='submit' disabled={loader} className={`stop-button ${timerOn ? 'on' : 'off'}`} > {loader ?  <img style={{height: '25px'}} src={loaderImg} alt="" /> : "Stop"}</button>
                            :
                            <button type='submit' disabled={loader} className={`start-button ${timerOn ? 'on' : 'off'}`} >{loader ?  <img style={{height: '25px'}} src={loaderImg} alt="" /> : "Start"}</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
          </form>
        </div>
    </>
  );
}

export default Timer;