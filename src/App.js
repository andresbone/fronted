import logo from './logo.svg';
import React from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DatosEquipos from './components/equipos/DatosEquipos';
import Editar from './components/Editar';
import Login from './components/Login';
import Nuevo from './components/Nuevo';
import FormularioEquipos from './components/equipos/FormularioEquipos';
import Dashboard from './components/Dashboard';


class App extends React.Component {
  notificacion = (mensaje) => {
    const parrafo = document.createElement('P');
    parrafo.textContent = mensaje;
    parrafo.style.backgroundColor = '#abc8e5';
    parrafo.style.border = '1px solid #1862eb';
    parrafo.style.padding = '10px';
    parrafo.style.borderRadius = '8px';
    parrafo.style.boxShadow = '0 4px 6px rgba(59, 57, 57, 0.36)'
    parrafo.classList.add('alert', 'alert-primary');
    document.querySelector(".notificacion").appendChild(parrafo);
    setTimeout(() => {
      parrafo.remove();
    }, 2000);
  }




  render() {
    return (
      <div className='App'>
        <div className='notificacion'></div>
        <React.Fragment>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/datosequipos' element={<DatosEquipos notificacion={this.notificacion} />} />
              <Route path='/nuevo' element={<Nuevo />} />
              <Route path='/formequipo' element={<FormularioEquipos />} />
              <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
          </Router>

        </React.Fragment>
      </div>
    );
  }
}


export default App;
