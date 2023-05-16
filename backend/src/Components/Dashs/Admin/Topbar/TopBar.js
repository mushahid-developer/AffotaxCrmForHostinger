import { useState } from 'react';
import Timer from './Timer';
import logo from "../../../../Assets/Images/logo.svg"
import AddButton from "../../../../Assets/Images/addButton.png"
import Note from "../../../../Assets/Images/note.svg"

export default function TopBar() {

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
          <div className="col-8">
              <Timer setUser={setUser}/>
          </div>
          <div style={{alignItems: 'center', justifyContent: 'right',}} className="col-4 d-flex">
            <img style={{width: "24px", marginRight: "10px"}} src={AddButton} alt="" />
            <img style={{width: "27px", marginRight: "10px"}} src={Note} alt="" />
            <p>{user}</p>
          </div>
        </div>
      </div>
    </>
  );
}
