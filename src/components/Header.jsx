import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <center>
                <Link to="/datosequipos">
                    <Button style={{ marginRight: "10px" }}>Equipos</Button>
                </Link>
                <Link to="/datosusuario">
                    <Button style={{ marginRight: "10px" }}>Usuarios</Button>
                </Link>
                <Link to="/datosjugador">
                    <Button style={{ marginRight: "10px" }}>Jugadores</Button>
                </Link>
            </center>
        </div>
    )
}
export default Header