import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDataContext } from "../Context/dataContext";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { toast, ToastContainer } from "react-toastify";
import {
  FaExclamationCircle, FaInfoCircle, FaWhatsapp
} from "react-icons/fa";

const apiKey = "12345678";
const formId = "12345678";

function Changes() {
  const { logged, infoTkn, url } = useDataContext();

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
    <div>Changes</div>
  )
}

export {Changes};