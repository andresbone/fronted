import React from "react";
import '../css/Login.css';
import { urlApi } from "../services/apiRest";
import { useNavigate } from "react-router-dom";
import axios from "axios";

class Login extends React.Component {
    state = {
        form: {
            "usu_nombre": "", 
            "usu_password": ""
        },
        error: "",
        errorMsg: ""
    }

    manejadorOnChange = async e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form);
    }

    manejadorLogin = () => {
        let url = urlApi + "auth/login";
        axios.post(url, this.state.form)
            .then(response => {
                if (response.data.message == "Logueo exitoso") {
                    localStorage.setItem("token", response.data.token) //almacenar en un item el token
                    this.props.navigate('/dashboard');
                } else {
                    this.setState({
                        error: true,
                        errorMsg: response.data.message
                    })
                }
            })
            .catch(error => {
                if (error.response) {
                    this.setState({
                        error: true,
                        errorMsg: error.response.data.message
                    })
                } else if (error.request) {
                    this.setState({
                        error: true,
                        errorMsg: "No se pudo conectar"
                    })
                }

            })
    }

    render() {
        return (
            <React.Fragment>
                <section className="vh-100">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6 text-black">
                                <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                                    <form style={{ width: '23rem' }}>
                                        <h3 className="fw-normal mb-3 pb-3">Login Sistema Fútbol</h3>

                                        <div className="form-outline mb-4">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg" 
                                                name="usu_nombre" 
                                                onChange={this.manejadorOnchange} 
                                            />
                                            <label className="form-label">Nombre de usuario</label>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input 
                                                type="password" 
                                                className="form-control form-control-lg" 
                                                name="usu_password" 
                                                onChange={this.manejadorOnchange} 
                                            />
                                            <label className="form-label">Contraseña</label>
                                        </div>

                                        <div className="pt-1 mb-4">
                                            <button 
                                                className="btn btn-info btn-lg btn-block" 
                                                type="button" 
                                                onClick={this.manejadorLogin}
                                            >
                                                Entrar
                                            </button>
                                        </div>

                                        {this.state.error && (
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.errorMsg}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                            <div className="col-sm-6 px-0 d-none d-sm-block">
                                <img src="https://images.unsplash.com/photo-1578997864329-d747473f7359?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Login image" className="w-100 vh-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate} />
}

export default ContenedorNavegacion;
