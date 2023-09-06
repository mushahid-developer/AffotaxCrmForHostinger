import React from 'react';
import JobPlanning from '../../../Jobs/JobPlaning/JobPlanning';
import Tasks from '../Tasks/Tasks';
import Construction from '../Construction/Construction';
import Leads from "../Leads/Leads";
import Accordion from 'react-bootstrap/Accordion';
import Proposals from '../Proposals/Proposals';

const MyTable = () => {
 

  return (
    <>

    <div className='myListDiv'>
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
        <Accordion.Header>Leads</Accordion.Header>
        <Accordion.Body>
         
          <div>
            <Leads fromPage="MyList" userNameFilter="Rashid"/>
          </div>

        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="3">
        <Accordion.Header>Proposals</Accordion.Header>
        <Accordion.Body>
         
          <div>
            <Proposals fromPage="MyList" userNameFilter="Rashid"/>
          </div>

        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="4">
        <Accordion.Header>Construction</Accordion.Header>
        <Accordion.Body>
         
          <div>
            <Construction fromPage="MyList" userNameFilter="Rashid"/>
          </div>

        </Accordion.Body>
      </Accordion.Item>

    </Accordion>
    </div>



    </>
  );
};

export default MyTable;
