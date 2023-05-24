import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./Homepage/styles/App.css"
function Logout() {


    const navigate = useNavigate();
    const logoutFun= async () => {

    const token = localStorage.getItem('token');
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
        axios
        .get("/auth/logout",config)
        .then(() => {
            localStorage.removeItem('token');   
            console.log(localStorage.getItem('token'));  
             navigate("/login");

        })
        .catch((error) => {
          console.log(error);
        });
      };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100 background-image">
  <div className="custom-dialog p-5 rounded-lg shadow-lg w-50">
    <h2 className="mb-4">Confirm Logout</h2>
    <p className="mb-4">Are you sure you want to logout?</p>
    <div className="d-flex justify-content-end">
    <Link
            to="/"
          >
       <button className="btn btn-secondary me-2" >Cancel</button>
        </Link>
      
      <button className="btn btn-danger" onClick={logoutFun} >Logout</button>
    </div>
  </div>
</div>
    );

  
}

export default Logout;
