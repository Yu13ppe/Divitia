import React, { useState, useEffect, useCallback, use } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const history = useHistory();
  const { url } = useDataContext();

  const [use_name, setUse_name] = useState("");
  const [use_lastName, setUse_lastName] = useState("");
  const [use_email, setUse_email] = useState("");
  const [use_password, setUse_password] = useState("");
  const [use_confirm, setUse_confirm] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+39"); // Default prefix
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = useCallback(() => {
    if (
      !use_name ||
      !use_lastName ||
      !use_email ||
      !use_password ||
      !use_confirm ||
      !phoneNumber
    ) {
      return false;
    }
    if (use_password !== use_confirm) {
      return false;
    }
    if (!termsAccepted || !privacyAccepted) {
      return false;
    }
    return true;
  }, [
    use_name,
    use_lastName,
    use_email,
    use_password,
    use_confirm,
    phoneNumber,
    termsAccepted,
    privacyAccepted,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor completa todos los campos correctamente.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${url}/Auth/register`, {
        use_name,
        use_lastName,
        use_dni: "",
        use_email,
        use_password,
        use_verif: "N",
        use_img: "",
        use_phone: `${phonePrefix}${phoneNumber}`,
      });

      toast.success("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => history.push("/Login"), 2000);
    } catch (error) {
      toast.error("Ocurrió un error durante el registro. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Regístrate</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre Completo */}
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Nombre"
                value={use_name}
                onChange={(e) => setUse_name(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Apellido"
                value={use_lastName}
                onChange={(e) => setUse_lastName(e.target.value)}
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={use_email}
                onChange={(e) => setUse_email(e.target.value)}
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="form-group phone-group">
            <select
              className="country-select"
              value={phonePrefix}
              onChange={(e) => setPhonePrefix(e.target.value)}
            >
              <option value="+34">🇪🇸 +34</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+39">🇮🇹 +39</option>
              <option value="+351">🇵🇹 +351</option>
              <option value="+32">🇧🇪 +32</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+58">🇻🇪 +58</option>
            </select>
            <input
              type="text"
              className="phone-input"
              placeholder="Teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={use_password}
                onChange={(e) => setUse_password(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={use_confirm}
                onChange={(e) => setUse_confirm(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Políticas de Privacidad */}
          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms">Acepto los términos y condiciones</label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={() => setPrivacyAccepted(!privacyAccepted)}
              />
              <label htmlFor="privacy">
                Acepto las políticas de privacidad
              </label>
            </div>
          </div>

          {/* Botón de Registro */}
          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Registrarme"}
          </button>

          {/* Link a Iniciar Sesión */}
          <div className="extra-links">
            <Link to="/Login">¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export { Register };