import { useState } from 'react';
import Timer from './Timer';
import logo from "../../../../Assets/Images/logo.svg"
import Note from "../../../../Assets/Images/note.svg"
import { Link } from 'react-router-dom';

export default function TopBar(props) {

  const miniNoteIsOpen = props.miniNoteIsOpen;
  const setMiniNoteIsOpen = props.setMiniNoteIsOpen;
  const recurringNoteIsOpen = props.recurringNoteIsOpen;
  const setRecurringNoteIsOpen = props.setRecurringNoteIsOpen;
  

  const [user, setUser] = useState("")

  return (
    <>
      <div className='topbar_logo'>
        <img style={{width: "50px"}} src={logo} alt="" />
        <h1
          style={
            {
                fontSize: '27px',
                fontWeight: '600',
                width: '105px',
                marginLeft: "10px"
            }
          }
        >Affotax</h1>
      </div>
      <div className='topbar_body'>
        <div style={{width: '100%',}} className="row">
          <div style={{ zIndex: '1',}} className="col-8">
              <Timer setUser={setUser}/>
          </div>
          <div style={{alignItems: 'center', justifyContent: 'right',}} className="col-4 d-flex">

              
            <Link onClick={()=>{setMiniNoteIsOpen(!miniNoteIsOpen)}}>
              <img style={{width: "27px", marginRight: "10px"}} src={Note} alt="" />
            </Link>
            <Link onClick={()=>{setRecurringNoteIsOpen(!recurringNoteIsOpen)}}>
            <svg style={{marginRight: "10px"}} xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" viewBox="0 0 24 24"><path d="M4.922 16.71l-.651.758a6.832 6.832 0 0 1-2.07-4.983A6.372 6.372 0 0 1 8.585 6h7.454L14.4 4.36l.706-.708L17.954 6.5l-2.848 2.848-.707-.707L16.04 7H8.586A5.386 5.386 0 0 0 3.2 12.5a5.92 5.92 0 0 0 1.722 4.21zm14.8-9.178l-.652.758a5.944 5.944 0 0 1 1.73 4.21 5.39 5.39 0 0 1-5.395 5.5H7.96l1.64-1.64-.706-.708L6.046 18.5l2.848 2.848.707-.707L7.96 19h7.445a6.376 6.376 0 0 0 6.395-6.486 6.857 6.857 0 0 0-2.079-4.982z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
            </Link>
            <p>{user}</p>
          </div>
        </div>
      </div>
    </>
  );
}
