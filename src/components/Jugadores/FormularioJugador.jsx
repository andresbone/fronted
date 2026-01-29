import React, { useState, useEffect } from 'react';
import { urlApi } from "../../services/apirest";
import { soloLetras, soloNumeros} from '../../utils/validaciones';
import axios from 'axios';

const FormularioJugador = ({ jugadorAEditar, onClose, onGuardar, notificacion }) => {
  
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    jug_nombre: '',
    jug_posicion: '',
    jug_nacionalidad: '',
    jug_edad: '',
    equ_id: '',
    usu_id: '',
    Cedula: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (jugadorAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...jugadorAEditar,
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        jug_nombre: '', jug_posicion: '', jug_nacionalidad: '', 
        jug_edad: '', equ_id: '', usu_id: '', Cedula: ''
      });
    }
  }, [jugadorAEditar]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (soloLetras(form.jug_nombre)=== false){
      notificacion("El nombre no es valido")
      setLoading(false);
      return;
    }
    if (soloLetras(form.jug_posicion)=== false){
      notificacion("La posicion no es valida")
      setLoading(false);
      return;
    }
    if (soloLetras(form.jug_nacionalidad)=== false){
      notificacion("La nacionalidad no es valida")
      setLoading(false);
      return;
    }
    if (soloNumeros(form.jug_edad)=== false){
      notificacion("La edad no es valida")
      setLoading(false);
      return;
    }
    if (soloNumeros(form.equ_id)=== false){
      notificacion("El equipo no es valido")
      setLoading(false);
      return;
    }
    if (soloNumeros(form.usu_id)=== false){
      notificacion("El usuario no es valido")
      setLoading(false);
      return;
    }
    if (soloNumeros(form.Cedula)=== false){
      notificacion("La cedula no es valida")
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = jugadorAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = jugadorAEditar 
        ? urlApi + `jugador/${jugadorAEditar.jug_id}`//metodo put
        : urlApi+ 'jugador';//metodo post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(jugadorAEditar ? 'Jugador actualizado' : 'Jugador registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{jugadorAEditar ? 'Editar Jugador' : 'Nuevo Jugador'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombres:</label>
          <input 
            type="text" name="jug_nombre" value={form.jug_nombre} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Posicion:</label>
          <input 
            type="text" name="jug_posicion" value={form.jug_posicion} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Nacionalidad:</label>
          <input 
            type="text" name="jug_nacionalidad" value={form.jug_nacionalidad} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Edad:</label>
          <input 
            type="text" name="jug_edad" value={form.jug_edad} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Equipo ID:</label>
          <input 
            type="number" name="equ_id" value={form.equ_id} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Usuario ID:</label>
          <input 
            type="number" name="usu_id" value={form.usu_id} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Cédula:</label>
          <input 
            type="text" name="Cedula" value={form.Cedula} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioJugador;