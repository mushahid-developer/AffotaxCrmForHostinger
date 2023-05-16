import React, {useState} from 'react'
import secureLocalStorage from 'react-secure-storage';
import './App.css';

import AdminRoutes from './Components/Routes/AdminRoutes';
import AuthRoutes from './Components/Routes/AuthRoutes';


function App() {

  const [token, setToken] = useState(secureLocalStorage.getItem('token'));


  if(!token){
    return (
      <AuthRoutes />
    );
  }
  else{
    return (
      // <Router>
      //       <Routes>
      //         <Route path="/" element = {<Em_routes />}></Route>
      //       </Routes>
      // </Router>
      <AdminRoutes />
    );
  }


}

export default App;
