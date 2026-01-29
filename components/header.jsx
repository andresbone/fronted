import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return(
        <div>
            <center>
            <Link to="/DatosJugador">
            <Button style={{marginRignt: "10px"}}>Jugador</Button>
            </Link>
            </center>
        </div>
    );
}

export default Header;