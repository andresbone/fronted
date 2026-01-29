import React from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DatosEquipos from './components/equipos/DatosEquipos';
import Login from './components/Login';
import New from './components/New';
import Edit from './components/Edit';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/datosequipos' element={<DatosEquipos/>}/>
          <Route path='/editar' element={<Edit/>}/>
          <Route path='/nuevo' element={<New/>}/>
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
