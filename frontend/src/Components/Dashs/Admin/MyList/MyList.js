import React from 'react';
import JobPlanning from '../../../Jobs/JobPlaning/JobPlanning';
import Tasks from '../Tasks/Tasks';
import Construction from '../Construction/Construction';
import Accordion from 'react-bootstrap/Accordion';

const MyTable = () => {
 

  return (
    <>

      <Accordion className='' defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Job Planning</Accordion.Header>
        <Accordion.Body>
          
          <div>
            <JobPlanning fromPage="MyList" userNameFilter="Rashid"/>
          </div>

        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="1">
        <Accordion.Header>Tasks</Accordion.Header>
        <Accordion.Body>
         
          <div>
            <Tasks fromPage="MyList" userNameFilter="Rashid"/>
          </div>

        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="2">
        <Accordion.Header>Construction</Accordion.Header>
        <Accordion.Body>
         
          <div>
            <Construction fromPage="MyList" userNameFilter="Rashid"/>
          </div>

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>


    </>
  );
};

export default MyTable;
