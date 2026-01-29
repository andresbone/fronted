import logo from './logo.svg';
import React from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/login';
import DatosJugador from './components/Jugadores/DatosJugador';
import { render } from '@testing-library/react';
import Dashboard from './components/dashboard.jsx';



class App extends React.Component {
   notificacion = (mensaje) => {
    const parrafo = document.createElement("P"); 
    parrafo.textContent = mensaje; 
    parrafo.style.backgroundColor = '#abc8e5';
    parrafo.style.border = '1px solid #088bfb';
    parrafo.style.padding = '10px';
    parrafo.style.borderRadius = '8px';
    parrafo.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    parrafo.classList.add("alert"); 
    parrafo.classList.add("alert-primary"); 
    document.querySelector(".notificacion").appendChild(parrafo);
    setTimeout(() =>{
      parrafo.remove();
    },3000);
    };
render(){
    return (
    <React.Fragment>
      <div className='notificacion'></div>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/datosjugador' element={<DatosJugador notificacion={this.notificacion}/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </Router>
    </React.Fragment>
  );
}
}

export default App;
