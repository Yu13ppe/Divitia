import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";
import { useDataContext } from "../Context/dataContext";

function Recharge() {
  useAxiosInterceptors();
  const { infoTkn, url } = useDataContext();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [bankOptionPay, setBankOptionPay] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [cashPhone, setCashPhone] = useState("");
  const [cash, setCash] = useState("");
  const [mov_img, setMov_img] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [transactionError, setTransactionError] = useState(false); // Controla si hubo un problema
  const [transactionDone, setTransactionDone] = useState(false); // Controla si la transacción ya fue intentada

  // Datos de los bancos
  const [banksEUR, setBanksEUR] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);

  // Datos Usuario
  const [user, setUser] = useState([]);

    // Fetch de datos del usuario (Incluye movimientos y directorio)
    const fetchDataUser = useCallback(async () => {
      try {
        const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        });
        setUser(response.data);
  
        // setShowAlert(true);
      } catch (error) {
        console.log(error);
      }
    }, [setUser, infoTkn, url]);
  
    // Fetch de datos de los bancos en EUR
    const fetchDataAccEur = useCallback(async () => {
      try {
        const response = await axios.get(`${url}/Acceur`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        });
        setBanksEUR(response.data);
      } catch (error) {
        console.log(error);
      }
    }, [url, infoTkn]);
  
    // Fetch de datos de los bancos en USD
    const fetchDataAccUsd = useCallback(async () => {
      try {
        const response = await axios.get(`${url}/AccUsd`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        });
        setBanksUSD(response.data);
      } catch (error) {
        console.log(error);
      }
    }, [url, infoTkn]);
  
    //Enviar a espera una recarga
    const handleSubmitLoad = async (event) => {
      event.preventDefault();
  
      const findBankName = () => {
        if (payment === "USD") {
          const bank = banksUSD.find(
            (bank) => bank.accusd_id === parseInt(bankOptionPay)
          );
          if (bank) {
            return bank.accusd_Bank;
          }
        }
        if (payment === "EUR") {
          const bank = banksEUR.find(
            (bank) => bank.acceur_id === parseInt(bankOptionPay)
          );
          if (bank) {
            return bank.acceur_Bank;
          }
        }
      };
  
      const formData = new FormData();
      formData.append("mov_currency", payment);
      formData.append("mov_amount", sendAmount);
      formData.append("mov_oldAmount", 0);
      formData.append("mov_type", "Deposito");
      formData.append("mov_status", "E");
      formData.append("mov_comment", findBankName());
      formData.append("mov_code", cash);
      formData.append("mov_phone", cashPhone);
      formData.append("mov_img", mov_img);
      formData.append(
        "mov_accEurId",
        payment === "EUR" && selectedMethod === "efectivoBBVA"
          ? 1
          : payment === "EUR" && selectedMethod === "efectivoSantander"
          ? 2
          : payment === "EUR"
          ? parseInt(bankOptionPay)
          : 0
      );
      formData.append(
        "mov_accUsdId",
        payment === "USD" ? parseInt(bankOptionPay) : 0
      );
      formData.append("mov_userId", user.use_id);
  
      try {
        // Crear el movimiento
        const response = await axios.post(`${url}/Movements/create`, formData, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        const movementId = response.data.mov_id; // Obtén el ID del movimiento recién creado
        
        fetchDataUser();
        handleNextStep();
        toast.success(
          "Cambio realizado con éxito!, En un momento se verá reflejado tu ingreso en la plataforma",
          {
            position: "bottom-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setTransactionDone(true);
        setTransactionError(false);
        console.log("Request sent successfully");
        handleNextStep();
        // Enviar correo después de la creación del movimiento
        axios.post(
          `${url}/Mailer/pendantIncome/joseportillo2002.jdpf@gmail.com/${movementId}`,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } catch (error) {
        setTransactionDone(false);
        console.log(transactionDone);
        setTransactionError(true);
        console.log(error);
        toast.error("Error al procesar la recarga", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
  
    const handleCurrencyChange = (currency) => {
      setPayment(currency);
      setStep(2);
    };
  
    const handleMethodChange = (e) => {
      setSelectedMethod(e.target.value);
    };
  
    const handleBankChange = (e) => {
      setBankOptionPay(e.target.value);
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setMov_img(file);
      setImageUrl(URL.createObjectURL(file));
    };
  
    const validateStep = () => {
      if (step === 2) {
        if (!payment) {
          setErrorMessage("Por favor, selecciona una moneda.");
          return false;
        }
        if (!selectedMethod) {
          setErrorMessage("Por favor, selecciona un método de recarga.");
          return false;
        }
        if (selectedMethod === "transferencia" && !bankOptionPay) {
          setErrorMessage("Por favor, selecciona un banco.");
          return false;
        }
        if (
          (selectedMethod === "efectivoBBVA" ||
            selectedMethod === "efectivoSantander") &&
          (!cashPhone || !cash)
        ) {
          setErrorMessage(
            "Por favor, completa todos los campos de Efectivo Móvil."
          );
          return false;
        }
        if (!sendAmount || sendAmount < 20) {
          setErrorMessage("El monto debe ser superior a 20.");
          return false;
        }
      }
  
      if (step === 3 && !mov_img) {
        setErrorMessage("Por favor, adjunta el comprobante de pago.");
        return false;
      }
  
      setErrorMessage(""); // Limpiar el mensaje de error si pasa todas las validaciones
      return true;
    };
    
  
    const handleNextStep = () => {
      if (validateStep()) {
        if (step < 4) {
          setStep(step + 1);
        }
      }
    };
  
    const handlePreviousStep = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };
  
    const resetRecharge = () => {
      setStep(1);
      setPayment("");
      setSelectedMethod("");
      setBankOptionPay("");
      setSendAmount("");
      setCash("");
      setCashPhone("");
      setMov_img(null);
      setErrorMessage("");
    };
  
    useEffect(() => {
      fetchDataAccEur();
      fetchDataAccUsd();
      fetchDataUser();
    }, [fetchDataAccEur, fetchDataAccUsd, fetchDataUser]);

  return (
    <div>Recharge</div>
  )
}

export {Recharge}