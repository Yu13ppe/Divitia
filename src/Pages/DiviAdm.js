import React, { useState } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from '../Context/dataContext';
import { useHistory } from "react-router-dom";

function DiviAdm() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tkn, setTkn] = useState('');
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(`${url}/Auth/loginAdmin/${email}/${password}`);
      setInfoTkn(response.data.data.access_token);
      const response2 = await axios.get(`${url}/Auth/findByTokenAdmin/${response.data.data.access_token}`);
      setTkn(response2.data);
      setLogged(true);
      history.push({
        pathname: "/Dashboard",
        state: {
          user: tkn,
        }
      });
      return true; 
    } catch (error) {
      toast.error("Ocurrió un error durante el inicio de sesión. Por favor, verifica los datos e intenta nuevamente.");
      return false; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await fetchData(user, password);
      if (!success) {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (attemps <= 1) {
        setError("Has superado el número de intentos. Intenta más tarde.");
        setAlertVisible(true);
        setAttemps(0); // Actualiza los intentos a 0 para evitar más acciones
      } else {
        setAttemps(attemps - 1);
        const errorMessage = `Correo o contraseña incorrectos. Inténtalo de nuevo. Intentos restantes: ${attemps - 1}`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div>DiviAdm</div>
  )
}

export {DiviAdm}