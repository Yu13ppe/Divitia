import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";
import Logo from "../Assets/Images/Logo.png";


function Recover() {
  const history = useHistory();
  const { url } = useDataContext();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, introduce un correo electrónico válido.");
      return;
    }
    try {
      await axios.post(`${url}/Auth/recover`, { email });
      toast.success("¡Correo de recuperación enviado! Revisa tu bandeja de entrada.");
      setTimeout(() => history.push("/Login"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="recover-container">
      <div className="recover-card">
        
        <div className="back-link">
          <Link to="/Login">
            <FaArrowLeft /> Volver
          </Link>
        </div>

        <img src={Logo} alt="Logo" className="logo" />

        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className={touched && !email ? "input-error" : ""}
              />
            </div>
            {touched && !email && <span className="error-text">El correo es obligatorio</span>}
          </div>
          <button type="submit" className="recover-button">
            Recuperar Contraseña
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export { Recover };
