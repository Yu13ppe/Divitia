import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { toast, ToastContainer } from "react-toastify";
import { FaSync, FaPaperPlane, FaListAlt, FaAddressBook, FaUserCircle, FaExclamationCircle } from "react-icons/fa";
import KYC from "../Assets/Images/KYC.png";
import { Link } from "react-router-dom";


const apiKey = "12345678";
const formId = "12345678";

function Changes() {
  const { logged, infoTkn, url } = useDataContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };


  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const handleVerificationModalToggle = () => {
    setIsVerificationModalOpen(!isVerificationModalOpen);
  };

  // States for the user
  const [user, setUser] = useState({});
  const [kycLink, setKycLink] = useState("");
  const [userMovemments, setUserMovemments] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);

  // States for the currency
  const [currencyPrice, setCurrencyPrice] = useState([]);

  // States for the alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // States for the modals
  const [modal, setModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [fifthModalOpen, setFifthModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);


  const toggle = () => setModal(!modal);

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleSecondModal = () => {
    setModalOpen(false);
    setSecondModalOpen(!secondModalOpen);
    document.body.style.paddingRight = "0";
  };

  const toggleFifthModal = useCallback(() => {
    setSecondModalOpen(false);
    setFifthModalOpen(!fifthModalOpen);
    document.body.style.paddingRight = "0";
  }, [fifthModalOpen]);

  const handleRedirect = () => {
    if (kycLink.startsWith("http")) {
      window.open(kycLink, "_blank"); // Abre el enlace en una nueva pestaña
    }
  };

  const fetchCurrencyData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setCurrencyPrice, url]);

  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 500);
  };

  const fetchKycLink = async () => {
    try {
      console.log("Solicitando KYC para el usuario ID:", user.use_id);

      // Actualizar el campo use_verif del usuario
      user.use_verif = "E";
      await axios.put(
        `${url}/users/${user.use_id}`,
        { use_verif: "E" },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "Campo use_verif actualizado a 'E' para el usuario:",
        user.use_id
      );

      // Verificar si ya existe un kyc_link
      const existingKycLinkResponse = await axios.get(
        `${url}/kyclink/user/${user.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
            "Content-Type": "application/json",
          },
        }
      );

      const existingKycLink = existingKycLinkResponse.data;

      // Asegúrate de que la propiedad kyc_link exista
      if (existingKycLink && existingKycLink.kyc_link) {
        console.log(
          "KYC link existente encontrado para el usuario:",
          user.use_id
        );
        window.open(existingKycLink.kyc_link, "_blank"); // Abre en una nueva pestaña
      } else {
        // Si no existe un link, obtener uno nuevo
        const response = await fetch(
          `https://kyc-api.amlbot.com/forms/${formId}/urls`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + apiKey,
            },
          }
        );

        const data = await response.json();
        console.log("Respuesta de la API:", data);

        if (data && data.form_url) {
          const kycData = {
            kyc_link_status: "Pending",
            kyc_link_date: new Date().toISOString(),
            kyc_User_id: user.use_id,
            form_id: data.form_id,
            form_url: data.form_url,
            verification_id: data.verification_id,
            form_token: data.form_token,
            verification_attempts_left: data.verification_attempts_left,
          };

          await axios.post(`${url}/kyclink/create`, kycData, {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
              "Content-Type": "application/json",
            },
          });

          console.log("Nuevo KYC link creado para el usuario:", user.use_id);
          toast.success("KYC link creado con éxito");
          // Redirigir inmediatamente al nuevo kycLink
          window.open(data.form_url, "_blank"); // Abre en una nueva pestaña
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setKycLink("Error al conectar con la API");
    }
  };

  const fetchDataUser = useCallback(async () => {
    try {
      // Obtener información del usuario
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      const userData = response.data;
      setUser(userData);

      const responseMovemments = await axios.get(
        `${url}/Movements/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserMovemments(responseMovemments.data);

      const responseDirectory = await axios.get(
        `${url}/AccBsUser/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserDirectory(responseDirectory.data);

      // Obtener el KYC link asociado al usuario
      const kycResponse = await axios.get(
        `${url}/kyclink/user/${userData.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      const kycData = kycResponse.data;

      // Si existe un KYC link, lo guardamos en el estado
      if (kycData && kycData.kyc_link) {
        setKycLink(kycData.kyc_link);
      } else {
        setKycLink(null);
      }

      // Manejar los mensajes de alerta según el estado de verificación del usuario
      if (userData.use_verif === "N") {
        setAlertMessage(
          <span style={{ cursor: "pointer" }} onClick={toggleModal}>
            Usuario no verificado
          </span>
        );
        setAlertType("error");
      } else if (userData.use_verif === "E") {
        setAlertMessage(
          <div
            className="alert-warning-animated"
            onClick={toggleFifthModal}
            style={{ cursor: "pointer" }}
          >
            <span className="warning-icon">
              <FaExclamationCircle />
            </span>
            Usuario en proceso de verificación haz clic aqui
          </div>
        );
        setAlertType("info");
      } else if (userData.use_verif === "S") {
        setAlertMessage("Usuario verificado");
        setAlertType("success");
      }

      setShowAlert(true);
    } catch (error) {
      console.log("Error al obtener datos del usuario o KYC link:", error);
    }
  }, [infoTkn, url, toggleModal, toggleFifthModal]);

  useEffect(() => {
    fetchCurrencyData();
    fetchDataUser();
  }, [fetchCurrencyData, fetchDataUser]);

  return (
    <div className="main-container">
      <div className="changes-container">

        {/* JOSE ACORDATE QUE ESTAS ALERTAS VA A DEPENDER DEL ESTADO SI ESTA EL USUARIO EN E O R LE SALDRA UNA ALERTA U OTRA*/}

        {/* Alerta de usuario no verificado */}
        <div className="alert-banner" onClick={handleModalToggle}>
          <div className="alert-content">
            <span className="alert-icon">
              <FaExclamationCircle />
            </span>
            <span>Usuario no verificado. Haz clic para verificarte.</span>
          </div>
        </div>

        {/* Alerta de usuario en espera */}
        <div
          className="alert-banner1 verification-alert"
          onClick={handleVerificationModalToggle}
        >
          <div className="alert-content">
            <FaExclamationCircle className="alert-icon" />
            <span>
              Estás en proceso de verificación. Haz clic aquí para completar tu KYC.
            </span>
          </div>
        </div>

        {/* Modal  Obtener Enlace*/}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleModalToggle}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={KYC} className="modal-image" />
              <h2>Verifica tu Identidad</h2>
              <p>
                Para utilizar la plataforma de DivitiaCambios, debes verificar tu
                identidad utilizando nuestro sistema KYC. Cumplimos con las
                normativas ISO 27001 y GDPR para proteger tus datos y garantizar
                su seguridad.
              </p>
              <div className="modal-buttons">
                <button className="btn verify" onClick={() => alert("Verificar")}>
                  Haz clic para verificarte
                </button>
                <button className="btn cancel" onClick={handleModalToggle}>
                  Regresar
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Modal de Proceso de Verificación */}
        {isVerificationModalOpen && (
          <div
            className="modal-overlay"
            onClick={handleVerificationModalToggle}
          >
            <div
              className="modal-content verification-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExclamationCircle className="modal-warning-icon" />

              <h2>Estás en Proceso de Verificación</h2>
              <p>
                Completa el proceso de verificación KYC para acceder a todas las
                funcionalidades de la plataforma. Este procedimiento asegura la
                protección de tus datos conforme a las normativas ISO 27001 y
                GDPR.
              </p>
              <div className="modal-buttons">
                <button
                  className="btn verify"
                  onClick={() => alert("Redirigiendo a KYC")}
                >
                  Completa tu KYC
                </button>
                <button
                  className="btn cancel"
                  onClick={handleVerificationModalToggle}
                >
                  Regresar
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Sección de bienvenida */}
        <section className="welcome-section">
          <div className="profile-icon">
            <FaUserCircle />
          </div>
          <div className="welcome-text">
            <h2>Bienvenido, Usuario</h2>
          </div>
        </section>

        {/* Saldo de la billetera */}
        <header className="wallet-header">
          <h2>Saldo de la Billetera</h2>
          <div className="balances">
            <div className="balance">
              <span className="currency">€</span>
              <span className="amount">120.50</span>
            </div>
            <div className="balance">
              <span className="currency">$</span>
              <span className="amount">135.75</span>
            </div>
          </div>
        </header>

        {/* Botones de acción */}
        <div className="action-buttons">
          <button className="action-btn">
            <FaSync /> Recargar
          </button>
          <button className="action-btn">
            <FaPaperPlane /> Enviar
          </button>
          <button className="action-btn">
           <FaListAlt /> Movimientos
          </button>
          <button className="action-btn">
            <FaAddressBook /> Directorio
          </button>
        </div>

        {/* Lista de transferencias */}
        <section className="transactions">
          <h3>Transferencias</h3>
          <ul>
            <li className="transaction">
              <div className="details">
                <span className="type">Recarga</span>
                <span className="status approved">Aprobada</span>
              </div>
              <div className="amount">+ €50.00</div>
            </li>
            <li className="transaction">
              <div className="details">
                <span className="type">Remesa</span>
                <span className="status pending">En espera</span>
              </div>
              <div className="amount">- $100.00</div>
            </li>
            <li className="transaction">
              <div className="details">
                <span className="type">Recarga</span>
                <span className="status rejected">Rechazada</span>
              </div>
              <div className="amount">+ €20.00</div>
            </li>
          </ul>
        </section>

        {/* Tasa de cambio */}
        <section className="exchange-rate">
          <h3>Tasa de Cambio</h3>
          <div className="rates">
            <div className="rate">
              <div className="rate-header">€ Euros</div>
              <div className="rate-value">
                <span className="symbol">1</span> → <span className="value">1.10</span>
              </div>
            </div>
            <div className="rate">
              <div className="rate-header">$ Dólares</div>
              <div className="rate-value">
                <span className="symbol">1</span> → <span className="value">1.05</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>


  )
}

export { Changes };