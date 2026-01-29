import React from "react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import axios from "axios";
import FormularioUsuario from "./FormularioUsuario";
import { confirm } from "../Confirmation";
class DatosUsuario extends React.Component {
  state = {
    registros: [],
    pagina_actual: 1,
    cadena_busqueda: "",
    token: localStorage.getItem("token"),
    total_paginas: 0,
    MostrarModal: false,
    UsuarioSeleccionado: null,
  };
  componentDidMount = () => {
    this.cargarDatos();
  };
  MostrarModalNuevo = () => {
    this.setState({
      MostrarModal: true,
      UsuarioSeleccionado: null,
    });
  };

  mostrarModalEditar = (usu_id) => {
    this.setState({
      MostrarModal: true,
      UsuarioSeleccionado: usu_id,
    });
  };
  CerrarModal = () => {
    this.setState({ MostrarModal: false });
  };
  alGuardar = () => {
    this.cargarDatos(); //recargar la tabla
    this.CerrarModal(); // cerrar modal
  };

  cargarDatos = () => {
    // http://localhost:5000/api/usuario?page=1&cadena=
    let url =
      urlApi +
      "usuario?page=" +
      this.state.pagina_actual +
      "&cadena=" +
      this.state.cadena_busqueda;
    axios
      .get(url, { headers: { Authorization: `Bearer ${this.state.token}` } })
      .then((response) => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPage,
        });
      })
      .catch((error) => {
        //const { notificacion } = this.props;
        //notificacion(error);
        console.log("Error de conexion");
      });
  };
  PaginaSiguiente = () => {
    if (this.state.pagina_actual < this.state.total_paginas) {
      this.setState({ pagina_actual: this.state.pagina_actual + 1 }, () => {
        this.cargarDatos();
      });
    }
  };
  PaginaAnterior = () => {
    if (this.state.pagina_actual > 1) {
      this.setState({ pagina_actual: this.state.pagina_actual - 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  buscarTexto = async (e) => {
    if (e.charCode === 13) {
      this.setState(
        {
          pagina_actual: 1,
          cadena_busqueda: e.target.value,
        },
        () => {
          this.cargarDatos();
        },
      );
    }
  };

   eliminar = async (id, nombre) => {
        const {notificacion} = this.props;
        if (await confirm('¿Desea Eliminar este usuario, '+'"'+ nombre  +'"'+' ?')) {
            const url = urlApi+"usuario/"+ id;
            axios
                .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
                .then(Response => {
                    this.cargarDatos();
                })
                .catch(error => {
                    notificacion('Error al guardar ' + error);
                })
        }
    }
  render() {
    return (
      <div>
        <div>
          <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
            <h1>Datos de usuario</h1>
            <button
              className="btn btn-success"
              onClick={this.MostrarModalNuevo}
            >
              Nuevo registro
            </button>
            <input
              type="text"
              placeholder="Busqueda por Nombre, Email y rol"
              onKeyPress={this.buscarTexto}
              style={{ marginLeft: "10 px", width: "330" }}
            />
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Email</th>
                  <th scope="col">Password</th>
                  <th scope="col">Rol</th>
                </tr>
              </thead>
              <tbody>
                {this.state.registros.map((value, index) => {
                  //Recorrer los registros
                  return (
                    <tr key={index}>
                      <th scope="row">{value.usu_id}</th>
                      <td>{value.usu_nombre}</td>
                      <td>{value.usu_email}</td>
                      <td>{value.usu_password}</td>
                      <td>{value.usu_rol}</td>
                      <td>
                        <svg
                          onClick={() => this.mostrarModalEditar(value)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#007aff"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                          <path d="M16 5l3 3" />
                        </svg>

                        <svg
                          onClick={() => this.eliminar(value.usu_id, value.usu_nombre)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ff2d55"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 7l16 0" />
                          <path d="M10 11l0 6" />
                          <path d="M14 11l0 6" />
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.PaginaAnterior}
            >
              Anterior
            </button>
            <input
              type="text"
              readOnly
              value={
                this.state.pagina_actual + " de " + this.state.total_paginas
              }
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                textAlign: "center",
                width: "120px",
              }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.PaginaSiguiente}
            >
              Siguiente
            </button>
          </div>
        </div>

        {this.state.MostrarModal && (
          <div className="modal-overlay" style={modalStyles.overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <FormularioUsuario
                usuarioAEditar={this.state.UsuarioSeleccionado} // EDITAR
                onClose={this.CerrarModal}
                onGuardar={this.alGuardar}
                notificacion={this.props.notificacion}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
// ESTILOS PARA VENTANA MODAL
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',           
        zIndex: 1000
    },
    content: {
        backgroundColor: '#249180ff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
}
function ContenedorNav(props) {
  let navigate = useNavigate();
  return <DatosUsuario {...props} navigate={navigate} />;
}

export default ContenedorNav;
