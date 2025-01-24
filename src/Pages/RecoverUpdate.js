import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";


function RecoverUpdate() {
  const history = useHistory();
  const { url } = useDataContext();
  const { id, email } = useParams();
  const [userEmail, setUserEmail] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("La contraseña debe contener al menos 8 caracteres.");
      return;
    }
    if (confirmPassword !== password) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    if (email !== userEmail.use_email || parseInt(id) !== userEmail.use_id) {
      toast.error("Los datos no coinciden.");
      return;
    }

    try {
      // Aquí debes pasar el token de recuperación y la nueva contraseña al backend
      await axios.put(`${url}/Users/PasswordRecovery/${id}`, {
        use_password: password,
      });
      toast.success("¡Contraseña actualizada con éxito!");
      setTimeout(() => history.push("/Login"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error. Por favor, intenta de nuevo.");
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
    <div className="recover-container">
      <div className="recover-card">
        <div className="back-link">
          <Link to="/Login">
            <FaArrowLeft /> Volver
          </Link>
        </div>
        <h2>Actualizar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, password: true }))
                }
                className={
                  touched.password && password.length < 8 ? "input-error" : ""
                }
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.password && password.length < 8 && (
              <span className="error-text">
                La contraseña debe tener al menos 8 caracteres
              </span>
            )}
          </div>
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                className={
                  touched.confirmPassword && confirmPassword !== password
                    ? "input-error"
                    : ""
                }
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.confirmPassword && confirmPassword !== password && (
              <span className="error-text">Las contraseñas no coinciden</span>
            )}
          </div>
          <button type="submit" className="recover-button">
            Actualizar Contraseña
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export { RecoverUpdate };