import React from 'react';
import './main.css';
import { useNavigate } from 'react-router-dom';


function Main(){
    const navigate = useNavigate();

    return(
        <div className="main-baner">
            <div className="main-baner-box" >     
            </div>
            <div onClick={()=>navigate("/dnf")} className="main-baner-item">     
                
            </div>
            <div className="main-baner-box">     
            </div>
            <div  className="main-baner-item">     
            </div>
            <div className="main-baner-box">     
            </div>
        </div>
    )
}

export default Main;