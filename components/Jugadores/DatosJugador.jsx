import React from "react";
import axios from "axios";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import { overlay } from "react-bootstrap";
import FormularioJugador from "./FormularioJugador";
import {confirm} from"../Confirmation";
import  Header from'../header';

class DatosJugador extends React.Component {
    state = {
        registros: [],
        pagina_actual: 1,
        busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        mostrarModal: false,
        jugadorseleccionado: null
    }

    componentDidMount = () => {
        this.cargarDatos();
    }

    mostrarModalNuevo = () => {
        this.setState({
            mostrarModal: true,
            jugadorseleccionado: null
        });
    }

    mostrarModalEditar = (jug_id) => {
        this.setState({
            mostrarModal: true,
            jugadorseleccionado: jug_id
        });
    }

    cerrarModal = () => {
        this.setState({
            mostrarModal: false
        });
    }

    alGuardar = () => {
        this.cargarDatos();//Recargar datos 
        this.cerrarModal();//Cerrar ventana
    }

    cargarDatos = () => {
        //http://localhost:5000/api/jugador?page=1&cadena=valor
        let url = urlApi + "jugador?page=" + this.state.pagina_actual + "&cadena=" + this.state.busqueda;
        axios
            .get(url, {headers: {'Authorization': `Bearer ${this.state.token}`}})
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPages
                })
            })
            .catch(error => {
               // const { notificacion } = this.props;
               // notificacion(error);
            console.log("error de conexion");
            })
    }

PaginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                { pagina_actual: this.state.pagina_actual + 1 },
                () => { this.cargarDatos(); }
            )
        }
    }

    PaginaAnterior = () => {
        if (this.state.pagina_actual > 1) {
            this.setState(
                { pagina_actual: this.state.pagina_actual - 1 },
                () => { this.cargarDatos(); }
            )
        }
    }

    buscarTexto = async e => {
        if (e.charCode === 13) {
            this.setState({
                pagina_actual: 1,
                busqueda: e.target.value
            }, () => {this.cargarDatos(); }); 
        }
    } 

    eliminar = async (jug_id, nombre) => {
        const {notificacion} = this.props;
        if (await confirm('¿Desea eliminar al jugador ' + nombre +'?')){
            const url = urlApi + "jugador/" + jug_id;
            axios
                .delete(url, {headers: {'Authorization': `Bearer ${this.state.token}`}})
                .then(Response => {
                    this.cargarDatos();
                })
                .catch(error => {
                    notificacion(error. response.data.error || 'Error al eliminar ' + error)
                })
        }
    }

    render() {
        return (
            <div>
                <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
                    <Header/>
                    <h1>Datos de los Jugadores</h1>
                    <button className="btn btn-success" onClick={this.mostrarModalNuevo}>Nuevo registro</button>
                    <input type="text" placeholder="Busqueda por Nombre, Posicion, Nacionalidad" onKeyPress={this.buscarTexto} style={{marginLeft: "20px", width: "360px"}} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre del Jugador</th> 
                                <th scope="col">Posición</th>
                                <th scope="col">Nacionalidad</th>
                                <th scope="col">Edad</th>
                                <th scope="col">Equipo ID</th>
                                <th scope="col">Usuario ID</th>
                                <th scope="col">Cedula</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {//Recorrer los registros
                                return (
                                    <tr key={index}>
                                        <th scope="row">{value.jug_id}</th>
                                        <td>{value.jug_nombre}</td>
                                        <td>{value.jug_posicion}</td>
                                        <td>{value.jug_nacionalidad}</td>
                                        <td>{value.jug_edad}</td>
                                        <td>{value.equ_id}</td>
                                        <td>{value.usu_id}</td>
                                        <td>{value.Cedula}</td>

                                        <td>
                                            <svg
                                                onClick={() => this.mostrarModalEditar(value)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#d11414ff"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>

                                            <svg
                                                onClick={() => this.eliminar(value.jug_id, value.jug_nombre)}
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
                                )
                            })}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaAnterior}>Anterior</button>
                    <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas} style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }} />
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaSiguiente} >Siguiente</button>
                </div>
                {this.state.mostrarModal && (
                    <div className="modal-overlay" style = {modalStyles.overlay}>
                        <div className="modal-content" style={modalStyles.content}>
                        <FormularioJugador
                        jugadorAEditar={this.state.jugadorseleccionado}
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

//Estilo para ventana modal
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor:'rgba(0, 0, 0, 0.09)',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000
    },
    content:{
        backgroundColor:'#c01212ff',
        padding: '20px',
        borderRadius:'19px',
        maxWidth:'500px',
        width: '100%',
        maxHeight:' 90vh',
        overflowY:'auto'
    }
}

function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <DatosJugador {...props} navigate={navigate} />
}
export default ContenedorNavegacion;