import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify"; 

function RecoverUpdate() {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState({});
  const [use_password, setUse_Password] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useDataContext();
  const { id, email } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (use_password.length < 8) {
      toast.error("La contraseña debe contener al menos 8 caracteres.");
      return;
    }
    if (confirmPassword !== use_password) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    if (email !== userEmail.use_email || parseInt(id) !== userEmail.use_id) {
      toast.error("Los datos no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${url}/Users/PasswordRecovery/${id}`, {
        use_password,
      });
      toast.success("Contraseña recuperada con éxito. Redirigiendo al login...");
      setTimeout(() => {
        history.push("/Login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error al recuperar la contraseña. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users/email/${email}`);
      setUserEmail(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [email, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return (
    <div>RecoverUpdate</div>
  )
}

export {RecoverUpdate}