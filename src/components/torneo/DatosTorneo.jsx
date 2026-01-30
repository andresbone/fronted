import React from "react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import axios from "axios";
import FormularioTorneo from "./FormularioTorneo";
import { confirm } from '../Confirmation';

class DatosTorneo extends React.Component {
  state = {
    torneos: [],
    paginaActual: 1,
    //limite: 10,
    busqueda: "",
    token: localStorage.getItem("token"),
    total_paginas: 0,
    mostrarModal: false,
    TorneoSelect: null
  }


  componentDidMount() {
    this.cargarDatos();
  }


 // Funciones para mostrar y ocultar el modal tanto para Nuevo, Editar y Eliminar
 // Esto crea una ventana emergente sobre la pantalla actual
 // Y le permite al usuario interactuar con ella Creando y editando el Formulario Torneo

  mostrarModalNuevo = () => {
    this.setState({ 
      mostrarModal: true,
      TorneoSelect: null
    });
  }
  mostrarModalEditar = (tor_id) => {
    this.setState({ 
      mostrarModal: true,
      TorneoSelect: tor_id
    });
  }
  mostrarModalEliminar = (tor_id) => {
    this.setState({ 
      mostrarModal: true,
      TorneoSelect: tor_id
    });
  }

  cerrarModal = () => {
    this.setState({ 
      mostrarModal: false,
      TorneoSelect: null
    });
  }

  // Funciones para Guardar, Editar y Eliminar
  alGuardar = () => {
    this.cargarDatos();
    this.cerrarModal();
  }






  cargarDatos = () => {
    //let url = urlApi + "torneo?page=" + this.state.paginaActual + "&limite=" + this.state.limite  + "&cadena=" + this.state.busqueda;
    let url = urlApi + "torneo?page=" + this.state.paginaActual + "&cadena=" + this.state.busqueda;
    axios
      .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
      .then(response => {
        this.setState({
          torneos: response.data.data,
          total_paginas: response.data.totalPages
        })
      }).catch(error => {
        console.log(error);
      })
  }
  


  registros = () => {
    return this.state.torneos.map((torneo, index) => {
      return (
        <tr key={index}>
          <th scope="row">{torneo.tor_id}</th>
          <td>{torneo.tor_nombre}</td>
          <td>{torneo.tor_temporada}</td>
          <td>{torneo.tor_pais}</td>
          <td>{torneo.usu_id}</td>

          <td>
            {/* Aquí van los botones de acción Editar y Eliminar asi mismo tener en cuenta las fk*/}
            <button className="btn btn-outline-primary btn-sm me-2" onClick={() => this.mostrarModalEditar(torneo)} title="Editar"><i className="bi bi-pencil-fill"></i></button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => this.eliminar(torneo.tor_id, torneo.tor_nombre)} title="Eliminar"><i className="bi bi-trash-fill"></i></button>
          </td>
        </tr>
      )
    })
  }
  PaginaSiguiente = () => {
    if (this.state.paginaActual < this.state.total_paginas) {
      this.setState(
        { paginaActual: this.state.paginaActual + 1 },
        () => { this.cargarDatos(); }
      )
    }

  }

   buscarTexto = async e => {
    if (e.charCode === 13) {
      this.setState({
        paginaActual: 1,
        busqueda: e.target.value,
      }, () => {
        this.cargarDatos();
      })
    }
  }

  PaginaAnterior = () => {
    if (this.state.paginaActual > 1) {
      this.setState(
        { paginaActual: this.state.paginaActual - 1 },
        () => { this.cargarDatos(); }
      )
    }

  }

  eliminar = async (id, nombre) => {
    const {notificacion} = this.props
    if (await confirm(`¿Desea eliminar el torneo ${nombre}?`)) {
      const url = urlApi +"torneo/" + id;
      axios
        .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
        .then(() => {
          //this.props.notificacion("Bus eliminado correctamente", "success");
          this.cargarDatos();
        })
        .catch((error) => {
          notificacion(error.response.data.error || "Error al eliminar el bus " + error);
          //this.props.notificacion("No se pudo eliminar el bus", "danger");
        });
    }
  };

  modalStyle={ // esto sera parte de los estilos del modal, cuando abramos el formulario se sobrepondra una ventana 
   Overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    Content: {
      
      background: '#fff',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '900px',
      maxWidth: '90%'
    }
  
  }
 


  render() {
    return (
      <div className="container mt-4">
        <h1 className="mb-4">Lista de Torneos</h1>
        <div className="table-responsive shadow-lg p-3 mb-5 bg-body rounded">

          
          <center style={{ marginBottom: "15px" }}>
          <input type="text"  style={{marginRight:"20px", width:"1000px"}} placeholder="Buscar por nombre, temporada y pais" onKeyPress={this.buscarTexto} />
          </center>


          {/*Este es el modal Nuevo */}
          <button className="btn btn-success mb-2" onClick={this.mostrarModalNuevo}><i className="bi bi-plus-lg"></i> Nuevo Torneo</button>
          {/*Datos a tener en cuenta se deben crear validadciones 
             Tienes claves FK foraneas de Usu_id y tor_id
             Aegurate de llamar un dato que ya exista en Usu_id y tor_id para poder registrar un torneo
             Si no lo haces te marcara un error por que los datos no existen*/}
          
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Temporada</th>
                <th scope="col">Pais</th>
                <th scope="col">ID Usuario</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center">

              {this.registros()}

            </tbody>
          </table>

          <center>

            <button className="btn btn-dark" onClick={this.PaginaAnterior}>Anterior</button>

            <input type="text" readOnly value={this.state.paginaActual + " de " + this.state.total_paginas} style={{ marginRight: "20px", marginLeft: "20px", textAlign: "center" }} />
            
            <button className="btn btn-dark" onClick={this.PaginaSiguiente}>Siguiente</button>

          </center>
        </div>

        {/*Ubicacion del modal*/}
        {this.state.mostrarModal && (
          <div className="modal-overlay" style={this.modalStyle.Overlay}>
            <div className="modal-content" style={this.modalStyle.Content}>
              <h2>Formulario de Torneo</h2>

              <FormularioTorneo //esto llama al formulario de torneo y ejecuta el formulario nuevo y editar
                torneoAEditar={this.state.TorneoSelect}
                onClose={this.cerrarModal}
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

function Contenedor(props) {
  let navigate = useNavigate();
  return <DatosTorneo {...props} navigate={navigate} />;
}

export default Contenedor;