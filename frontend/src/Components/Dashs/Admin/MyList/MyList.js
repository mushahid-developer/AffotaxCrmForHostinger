import React from 'react';
import JobPlanning from '../../../Jobs/JobPlaning/JobPlanning';
import Tasks from '../Tasks/Tasks';
import Construction from '../Construction/Construction';
import Leads from "../Leads/Leads";
import Accordion from 'react-bootstrap/Accordion';
import Proposals from '../Proposals/Proposals';
import UserRecurringTasks from '../UserRecurringTasks/UserRecurringTasks';
import Templates from '../Templates/Templates';
import Goals from '../Goals/Goals';
import secureLocalStorage from 'react-secure-storage';

const MyTable = () => {

  const items = secureLocalStorage.getItem("MyList");
  var showItems = false;

  if(items && items.length > 0){
    showItems = items.find(item => item.visible)
  }
  


  if(!showItems){
    return(
      <>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2>
            No page selected, Please go to settings and choose page you want to see here.
          </h2>
        </div>
      </>
    )
  }
  else{
    return (
      <>
        <div className='myListDiv'>
          <Accordion className=''>
  
            {items && items.map(item => {
              if(item.page === "Job Planning" && item.visible){
                return(
                  <Accordion.Item key={item.id}>
                    <Accordion.Header>Job Planning</Accordion.Header>
                    <Accordion.Body>
                      
                      <div>
                        <JobPlanning fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Tasks" && item.visible){
                return(
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Tasks</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Tasks fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Leads" && item.visible){
                return(
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Leads</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Leads fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Proposals" && item.visible){
                return(
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Proposals</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Proposals fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Construction" && item.visible){
                return(
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>Construction</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Construction fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Recurring Task" && item.visible){
                return(
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>Recurring Task</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <UserRecurringTasks fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Templates" && item.visible){
                return(
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>Templates</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Templates fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
  
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
  
            {items && items.map(item => {
              if(item.page === "Goals" && item.visible){
                return(
                  <Accordion.Item eventKey="7">
                    <Accordion.Header>Goals</Accordion.Header>
                    <Accordion.Body>
                    
                      <div>
                        <Goals fromPage="MyList" userNameFilter="Rashid"/>
                      </div>
            
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            })}
          </Accordion>
        </div>
      </>
    );
  }
};

export default MyTable;
