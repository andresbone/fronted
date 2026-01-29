import React from "react";
import '../css/login.css';
import { urlApi } from "../services/apirest";
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
                if (response.data.message === "Logueo exitoso") {
                    localStorage.setItem("token", response.data.token)
                    this.props.navigate('/dashboard');
                } else {
                    this.setState({
                        error: true,
                        errorMsg: response.data.message
                    });
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
                        errorMsg: "No se pudo conectar al servidor"
                    })
                }

            })
    }

    render() {
        return (
            <React.Fragment>
                <section className="vh-100 gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card bg-dark text-white" >
                                    <div className="card-body p-5 text-center">

                                        <div className="mb-md-5 mt-md-4 pb-5">

                                            <h2 className="fw-bold mb-2 text-uppercase">Iniciar Sesion</h2>
                                            <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                            <div data-mdb-input-init className="form-outline form-white mb-4">
                                                <input type="text" id="typeEmailX" className="form-control form-control-lg" name="usu_nombre" placeholder="Ingrese su usuario" onChange={this.manejadorOnChange} />
                                                <label className="form-label" htmlFor="typeEmailX">User</label>
                                            </div>

                                            <div data-mdb-input-init className="form-outline form-white mb-4">
                                                <input type="password" id="typePasswordX" className="form-control form-control-lg" name="usu_password" placeholder="Ingrese su contraseña" onChange={this.manejadorOnChange} />
                                                <label className="form-label" htmlFor="typePasswordX">Password</label>
                                            </div>

                                            <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="button" onClick={this.manejadorLogin} >Login</button>

                                            <div className="d-flex justify-content-center text-center mt-4 pt-1">
                                                <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                                                <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                                                <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                                            </div>

                                        </div>

                                        <div>
                                            <p className="mb-0">Don't have an account? <a href="#!" className="text-white-50 fw-bold">Sign Up</a>
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            {
                                this.state.error === true &&
                                <div className="alert alert-danger" role="alert" >
                                    {this.state.errorMsg}
                                </div>
                            }
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