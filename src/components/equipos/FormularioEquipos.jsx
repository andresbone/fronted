import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from '../../services/apirest';
import { SoloLetras, LetrasYNumeros, noVacio } from '../../utils/validaciones';


const FormularioEquipos = ({ equipoEditar, onClose, onGuardar, notificacion }) => {


  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    equ_nombre: '',
    equ_ciudad: '',
    equ_estadio: '',
    equ_fundacion: '',
    usu_id: 1,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (equipoEditar) {

      // Si recibimos un equipo, rellenamos el formulario
      setForm({
        ...equipoEditar,
      });
    } else {

      // Si no hay equipo, limpiamos el formulario (Modo CREAR)
      setForm({
        equ_nombre: '', equ_ciudad: '', equ_estadio: '', equ_fundacion: '', usu_id: 1
      });
    }
  }, [equipoEditar]);

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

    if (!LetrasYNumeros(form.equ_nombre)) {
      notificacion('Nombre no válido');
      setLoading(false); return;
    }
    if (!LetrasYNumeros(form.equ_ciudad)) {
      notificacion('Ciudad no válida');
      setLoading(false); return;
    }
    if (!LetrasYNumeros(form.equ_estadio)) {
      notificacion('Estadio no válido');
      setLoading(false); return;
    }

    if (!form.equ_fundacion) {
      notificacion('Fundación requerida');
      setLoading(false); return;
    }

    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = equipoEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL.
    const url = equipoEditar
      ? urlApi + `equipos/${equipoEditar.equ_id}`
      : urlApi + 'equipos';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(equipoEditar ? 'Equipo actualizado' : 'Equipo registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{equipoEditar ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Equipo:</label>
          <input
            type="text" name="equ_nombre" value={form.equ_nombre} onChange={handleChange}
            className="form-control" required
          />
        </div>

        <div className="form-group">
          <label>Ciudad:</label>
          <input
            type="text" name="equ_ciudad" value={form.equ_ciudad} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Estadio:</label>
          <input
            type="text" name="equ_estadio" value={form.equ_estadio} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fundación (Año):</label>
          <input
            type="number" name="equ_fundacion" value={form.equ_fundacion} onChange={handleChange}
            className="form-control" required
          />
        </div>

        <div className="form-group">
          <label>Usuario ID (Admin):</label>
          <input
            type="number" name="usu_id" value={form.usu_id} onChange={handleChange}
            className="form-control" required
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

export default FormularioEquipos;