import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validarNombre, validarEmail, validarPassword, validarRol } from '../../utils/validaciones';
import { urlApi } from "../../services/apirest";

const FormularioUsuario = ({ usuarioAEditar, onClose, onGuardar, notificacion }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    usu_nombre: '',
    usu_email: '',
    usu_password: '',
    usu_rol: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (usuarioAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...usuarioAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
       usu_nombre: '', usu_email: '',  usu_password: '', usu_rol: ''
      });
    }
  }, [usuarioAEditar]);

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

  // --- 1. VALIDACIONES (Antes del Loading) ---
  if (!validarNombre(form.usu_nombre)) {
    return notificacion("Nombre no válido: solo se permiten letras y espacios.");
  }

  if (!validarEmail(form.usu_email)) {
    return notificacion("El formato del correo electrónico es incorrecto.");
  }

  if (!usuarioAEditar || (form.usu_password && form.usu_password.length > 0)) {
    if (!validarPassword(form.usu_password)) {
      return notificacion("Password débil: mínimo 8 caracteres, una letra y un número.");
    }
  }

  if (!validarRol(form.usu_rol)) {
    return notificacion("El rol seleccionado no es válido.");
  }

  // --- 2. SI PASA TODO, RECIÉN ACTIVAMOS EL LOADING ---
  setLoading(true); 

  const token = localStorage.getItem('token');
  const method = usuarioAEditar ? 'put' : 'post';
  const url = usuarioAEditar ? `${urlApi}usuario/${usuarioAEditar.usu_id}` : `${urlApi}usuario`;

  try {
    await axios({
      method: method,
      url: url,
      data: form,
      headers: { Authorization: `Bearer ${token}` }
    });

    notificacion(usuarioAEditar ? 'Usuario actualizado con éxito' : 'Usuario registrado con éxito', "success");
    onGuardar();
    onClose();
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al guardar';
    notificacion(msg);
    setError(msg);
  } finally {
    setLoading(false); // Esto asegura que el botón vuelva a "Guardar" si hay error de servidor
  }
};

  return (
    <div className="formulario-container">
      <h3>{usuarioAEditar ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
      

        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text" name="usu_nombre" value={form.usu_nombre} onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="text" name="usu_email" value={form.usu_email} onChange={handleChange}
            required
            className="form-control"
          />
        </div>
         <div className="form-group">
          <label>Password:</label>
          <input
            type="password" name="usu_password" value={form.usu_password} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

       <div className="form-group">
  <label>Rol:</label>
  <select
    name="usu_rol" 
    value={form.usu_rol} 
    onChange={handleChange}
    className="form-control"
    required // Esto obliga al usuario a elegir uno
  >
    <option value="" disabled>Seleccione un rol...</option>
    <option value="admin">admin</option>
    <option value="editor">editor</option>
    <option value="viewer">viewer</option>
  </select>
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

export default FormularioUsuario;