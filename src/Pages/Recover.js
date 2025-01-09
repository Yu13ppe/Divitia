import React, { useState } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function Recover() {
  const history = useHistory();
  const { logged, url } = useDataContext();
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);  // Activar el estado de carga
      await axios.post(`${url}/Mailer/emailRecovery/${correo}`);
      setCorreo("");
      toast.success("¡Correo de recuperación enviado con éxito! Revisa tu bandeja de entrada.");
      setTimeout(() => {
        history.push("/Login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar el correo de recuperación. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);  // Desactivar el estado de carga
    }
  };
  
  return (
    <div>Recover</div>
  )
}

export {Recover}