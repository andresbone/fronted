import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SoloLetras } from '../../utils/validaciones';

const FormularioTorneo = ({ torneoAEditar, onClose, onGuardar, notificacion }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    tor_id: '',
    tor_nombre: '',
    tor_temporada: '',
    tor_pais: '',
    usu_id: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (torneoAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...torneoAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_nacimiento: torneoAEditar.fecha_nacimiento
          //? torneoAEditar.fecha_nacimiento.split('T')[0]
          //: ''
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        tor_id: '', tor_nombre: '', tor_temporada: '', tor_pais: '',
        usu_id: ''
      });
    }
  }, [torneoAEditar]);

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

    // Validaciones básicas
    if (SoloLetras(form.tor_nombre) === false) {
      notificacion('El nombre solo debe contener letras y espacios.');
       
      return;
    }








    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = torneoAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = torneoAEditar
      ? `http://localhost:5000/api/torneo/${torneoAEditar.tor_id}`
      : 'http://localhost:5000/api/torneo';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      alert(torneoAEditar ? 'Torneo actualizado' : 'Torneo registrado');
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
      <h3>{torneoAEditar ? 'Editar Torneo' : 'Nuevo  Torneo'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text" name="tor_nombre" value={form.tor_nombre} onChange={handleChange}
            required maxLength="100"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Temporada:</label>
          <input
            type="text" name="tor_temporada" value={form.tor_temporada} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Pais:</label>
          <input
            type="text" name="tor_pais" value={form.tor_pais} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text" name="usu_id" value={form.usu_id} onChange={handleChange}
            className="form-control"
          />
        </div>

  

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioTorneo;