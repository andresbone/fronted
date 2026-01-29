import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <center>
                <Link to="/datosequipos">
                    <Button style={{ marginRight: "10px" }}>Equipos</Button>
                </Link>
            </center>
        </div>
    )
}
export default Header