import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";
import { useDataContext } from "../Context/dataContext";
import { banksByCountry } from "../Utils/Variables";
import { toast } from "react-toastify";

function SendMoney() {
  useAxiosInterceptors();
  const { infoTkn, url } = useDataContext();
  const [step, setStep] = useState(1); // Controla los pasos del formulario
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [transactionError, setTransactionError] = useState(false); // Controla si hubo un problema
  const [transactionDone, setTransactionDone] = useState(false); // Controla si la transacción ya fue intentada

  const [amount, setAmount] = useState("");
  const [amountToReceive, setAmountToReceive] = useState("");

  // Datos de Envio de remesas
  const [payment, setPayment] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("");
  const [porcents, setPorcents] = useState([]);
  const [porcent, setPorcent] = useState([]);
  const [isCashMethodSelected, setIsCashMethodSelected] = useState(false);

  // Datos Usuario
  const [user, setUser] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  //Loading
  const [loading, setLoading] = useState(false);

  //Alertas
  const [showAlert, setShowAlert] = useState(false);

  //DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState("");
  const [accbsUser_owner, setAccbsUser_owner] = useState("");
  const [accbsUser_number, setAccbsUser_number] = useState("");
  const [accbsUser_dni, setAccbsUser_dni] = useState("");
  const [accbsUser_phone, setAccbsUser_phone] = useState("");
  const [accbsUser_type, setAccbsUser_type] = useState("");
  const [accbsUser_country, setAccbsUser_country] = useState("");

  // Prefijos para teléfono
  const [telefonoPrefix, setTelefonoPrefix] = useState("");

  // Estado para validaciones
  const [errors, setErrors] = useState({});

  const getPercentage = () => {
    if (payment === "USD") return porcent.por_porcentUsd;
    if (payment === "EUR") return porcent.por_porcentEur;
    return 0;
  };

    // Fetch de datos del usuario (Incluye movimientos y directorio)
    const fetchDataUser = useCallback(async () => {
      try {
        const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        });
        setUser(response.data);
  
        const responseDirectory = await axios.get(
          `${url}/AccBsUser/user/${response.data.use_id}`,
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
        setUserDirectory(responseDirectory.data);
        console.log(responseDirectory.data);
      } catch (error) {
        console.log(error);
      }
    }, [setUser, infoTkn, url]);
  
    // Fetch de datos de la tasa de cambio
    const fetchCurrencyData = useCallback(async () => {
      try {
        const response = await axios.get(`${url}/currencyPrice`);
        setCurrencyPrice(response.data);
      } catch (error) {
        console.log(error);
      }
    }, [setCurrencyPrice, url]);
  
    // Fetch de datos de porcentaje ID
    const fetchDataPorcentId = async (id) => {
      try {
        const response = await axios.get(`${url}/PorcentPrice/${id}`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        });
        setPorcent(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    // Fetch de datos de porcentaje
    const fetchDataPorcent = useCallback(async () => {
      try {
        const response = await axios.get(`${url}/PorcentPrice`, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        });
        setPorcents(response.data);
      } catch (error) {
        console.log(error);
      }
    }, [url, infoTkn]);
  
    const handleBack = () => {
      setStep(step - 1);
    };
  
    // Validación de formulario
    const validateForm = () => {
      const newErrors = {};
  
      if (!accbsUser_country) {
        newErrors.accbsUser_country = "El país es requerido.";
      }
  
      if (!accbsUser_owner) {
        newErrors.accbsUser_owner = "El nombre es requerido.";
      }
  
      if (accbsUser_type === "Pago Movil") {
        if (!accbsUser_phone) {
          newErrors.accbsUser_phone = "El número telefónico es requerido.";
        } else if (!/^\d+$/.test(accbsUser_phone)) {
          newErrors.accbsUser_phone =
            "El número telefónico solo puede contener dígitos.";
        } else if (accbsUser_phone.length === 0) {
          newErrors.accbsUser_phone =
            "El número telefónico no puede estar vacío.";
        }
      } else if (accbsUser_type === "Cuenta Bancaria") {
        if (!accbsUser_number) {
          newErrors.accbsUser_number = "El número de cuenta es requerido.";
        } else if (!/^\d+$/.test(accbsUser_number)) {
          newErrors.accbsUser_number =
            "El número de cuenta solo puede contener dígitos.";
        } else if (accbsUser_number.length === 0) {
          newErrors.accbsUser_number =
            "El número de cuenta no puede estar vacío.";
        }
      }
  
      if (!accbsUser_bank) {
        newErrors.accbsUser_bank = "El banco es requerido.";
      }
  
      if (!accbsUser_type) {
        newErrors.accbsUser_type = "Seleccione un tipo de transacción.";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    // Agregar Beneficiario
    const handleAddAccountSubmit = async (event) => {
      event.preventDefault();
  
      if (!validateForm()) {
        return;
      }
  
      // Concatenar prefijo y teléfono solo si es Pago Movil
      const finalPhone =
        accbsUser_type === "Pago Movil"
          ? telefonoPrefix + accbsUser_phone
          : accbsUser_phone;
  
      // Si accbsUser_dni es nulo o vacío, asignar "NA"
      const finalDni = accbsUser_dni ? accbsUser_dni : "NA";
  
      try {
        await axios.post(
          `${url}/AccBsUser/create`,
          {
            accbsUser_bank,
            accbsUser_owner,
            accbsUser_number,
            accbsUser_dni: finalDni, // Usamos el DNI con "NA" si está vacío
            accbsUser_phone: finalPhone, // Aquí usamos el número concatenado
            accbsUser_type,
            accbsUser_status: "Activo",
            accbsUser_userId: user.use_id,
            accbsUser_country,
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
  
        window.location.reload();
  
        toast.success("Cuenta agregada con éxito!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.log("Error al agregar la cuenta:", error.response || error);
        toast.error("Error al agregar la cuenta", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      console.log(setShowAlert);
    };
  
    const handleCurrencyChange = (e) => {
      setPayment(e.target.value);
      setWithdrawalMethod(""); // Reiniciar método de retiro al cambiar moneda
      setIsCashMethodSelected(false); // Ocultar inputs cuando se cambia la moneda
      setSelectedCurrency(""); // Reiniciar moneda seleccionada
    };
  
    const handleWithdrawalMethodChange = (e) => {
      const method = e.target.value;
      setWithdrawalMethod(method);
  
      if (method === "efectivo") {
        setIsCashMethodSelected(true);
        setSelectedCurrency(""); // Limpiar moneda si cambia a efectivo
        setAmount(""); // Reiniciar monto si cambia a efectivo
      } else {
        setIsCashMethodSelected(false);
      }
    };
  
    const calculateValue = (amount, payment, porcent) => {
      const amountFloat = parseFloat(amount);
      const deliveryPrice = parseFloat(porcent.por_deliveryPrice);
  
      if (payment === "EUR") {
        if (porcent.por_status === "Obligatorio") {
          return (
            amountFloat +
            amountFloat * (porcent.por_porcentEur / 100) +
            deliveryPrice
          );
        } else {
          return amountFloat + amountFloat * (porcent.por_porcentEur / 100);
        }
      } else if (payment === "USD") {
        if (porcent.por_status === "Obligatorio") {
          return (
            amountFloat +
            amountFloat * (porcent.por_porcentEur / 100) +
            deliveryPrice
          );
        } else {
          return amountFloat + amountFloat * (porcent.por_porcentUsd / 100);
        }
      }
      return null;
    };
  
    const handleamountChange = (e) => {
      const inputAmount = e.target.value;
      setAmount(inputAmount);
  
      let errorMessage = "";
  
      // Validación para el método de retiro efectivo
      if (withdrawalMethod === "efectivo") {
        if (inputAmount < 100) {
          errorMessage = "El monto a enviar debe ser mayor o igual a 100.";
        } else if (inputAmount % 20 !== 0) {
          errorMessage = "El monto a enviar debe ser múltiplo de 20.";
        }
      } else {
        // Transfrenecia
        if (inputAmount < 20) {
          errorMessage = "El monto a enviar debe ser mayor a 20.";
        }
        if (selectedCurrency !== "BS" && inputAmount < 100) {
          errorMessage = "El monto a enviar debe ser mayor a 100.";
        }
      }
  
      const availableBalance =
        payment === "EUR"
          ? user.use_amountEur
          : payment === "USD"
          ? user.use_amountUsd
          : null;
  
      if (inputAmount > availableBalance) {
        errorMessage =
          "El monto a enviar no puede ser mayor que el saldo disponible.";
      }
      // Actualizar errores en el estado
  
      currencyPrice.forEach((coin) => {
        if (payment === "EUR") {
          if (selectedCurrency === "BS") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToBs);
          } else if (selectedCurrency === "USD") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToUsd);
          } else if (selectedCurrency === "COP") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToCol_Pes);
          } else if (selectedCurrency === "CLP") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToPes_Ch);
          } else if (selectedCurrency === "PEN") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToSol_Pe);
          } else if (selectedCurrency === "USD-EC") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToUsd_Ecu);
          } else if (selectedCurrency === "USD-PA") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_EurToUsd_Pa);
          }
        } else if (payment === "USD") {
          if (selectedCurrency === "BS") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToBs);
          } else if (selectedCurrency === "USD") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToUsd);
          } else if (selectedCurrency === "COP") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToCol_Pes);
          } else if (selectedCurrency === "CLP") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToPes_Ch);
          } else if (selectedCurrency === "PEN") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToSol_Pe);
          } else if (selectedCurrency === "USD-EC") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToUsd_Ecu);
          } else if (selectedCurrency === "USD-PA") {
            setAmountToReceive(parseFloat(inputAmount) * coin.cur_UsdToUsd_Pa);
          }
        }
        setErrors((prevErrors) => ({
          ...prevErrors,
          amount: errorMessage,
        }));
      });
    };
  
    const handleBeneficiarySelect = (beneficiary) => {
      setSelectedBeneficiary(beneficiary);
      setStep(3); // Pasar al paso de confirmación
    };
  
    //Enviar a espera un retiro
    const handleSubmitSend = async () => {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("mov_currency", payment);
      formData.append("mov_amount", amount);
      formData.append("mov_type", "Retiro");
      formData.append("mov_status", "E");
      formData.append("mov_code", "");
      formData.append("mov_phone", "");
      formData.append(
        "mov_oldAmount",
        withdrawalMethod === "efectivo"
          ? calculateValue(amount, payment, porcent)
          : amount
      );
  
      formData.append(
        "mov_comment",
        //   withdrawalMethod === "efectivo" ?
        //  ( `<strong>Retiro de divisa en efectivo \n  Ciudad: </strong>` +
        //   porcent.por_stateLocation +
        //   `\n <strong>Persona que recibe: </strong>` +
        //   receiverName +
        //   `\n <strong>DNI de quien recibe: </strong>` +
        //   receiverDni +
        //   `\n <strong>Teléfono: </strong>` +
        //   phone +
        //   `\n <strong>Dirección: </strong>` +
        //   deliveryAddress +
        //   `\n <strong>Monto: </strong>` +
        //   amount) :
        "Retiro de divisa por transferencia"
      );
      formData.append("mov_img", "Retiro de Divisa");
      formData.append("mov_typeOutflow", withdrawalMethod);
      formData.append("mov_accEurId", payment === "EUR" ? 99 : 0);
      formData.append("mov_accUsdId", payment === "USD" ? 99 : 0);
      formData.append("mov_userId", user.use_id);
      formData.append(
        "mov_accBsUserId",
        selectedBeneficiary ? selectedBeneficiary.accbsUser_id : 0
      );
  
      const getCurrencyPrice = (payment, country, coin) => {
        if (payment === "EUR") {
          switch (country) {
            case "Venezuela":
              return coin.cur_EurToBs;
            case "Estados Unidos":
              return coin.cur_EurToUsd;
            case "Colombia":
              return coin.cur_EurToCol_Pes;
            case "Chile":
              return coin.cur_EurToPes_Ch;
            case "Peru":
              return coin.cur_EurToSol_Pe;
            case "Ecuador":
              return coin.cur_EurToUsd_Ecu;
            case "Panama":
              return coin.cur_EurToUsd_Pa;
            default:
              return null;
          }
        } else if (payment === "USD") {
          switch (country) {
            case "Venezuela":
              return coin.cur_UsdToBs;
            case "Colombia":
              return coin.cur_UsdToCol_Pes;
            case "Chile":
              return coin.cur_UsdToPes_Ch;
            case "Mexico":
              return coin.cur_UsdToPes_Mex;
            case "Peru":
              return coin.cur_UsdToSol_Pe;
            case "Ecuador":
              return coin.cur_UsdToUsd_Ecu;
            case "Panama":
              return coin.cur_UsdToUsd_Pa;
            default:
              return null;
          }
        }
        return null;
      };
  
      const currencyPriceValue = currencyPrice
        .map((coin) =>
          getCurrencyPrice(
            payment,
            selectedBeneficiary ? selectedBeneficiary.accbsUser_country : null,
            coin
          )
        )
        .filter((price) => price !== null)[0];
  
      formData.append("mov_currencyPrice", currencyPriceValue);
      formData.append("mov_oldCurrency", payment);
  
      const formDataUser = new FormData();
      formDataUser.append(
        "use_amountUsd",
        payment === "USD" && withdrawalMethod === "efectivo"
          ? user.use_amountUsd - calculateValue(amount, payment, porcent)
          : payment === "USD" && withdrawalMethod !== "efectivo"
          ? user.use_amountUsd - amount
          : user.use_amountUsd
      );
      formDataUser.append(
        "use_amountEur",
        payment === "EUR" && withdrawalMethod === "efectivo"
          ? user.use_amountEur - calculateValue(amount, payment, porcent)
          : payment === "EUR" && withdrawalMethod !== "efectivo"
          ? user.use_amountEur - amount
          : user.use_amountEur
      );
  
      try {
        // Crear el movimiento
        const response = await axios.post(`${url}/Movements/create`, formData, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        const movementId = response.data.mov_id; // Extraemos el ID del movimiento
        console.log("Movement ID:", movementId); // Asegúrate de que 'movementId' sea correcto
  
        // Actualizar saldo del usuario
        await axios.put(`${url}/Users/${user.use_id}`, formDataUser, {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        // Enviar correo según el método de retiro
        if (withdrawalMethod === "efectivo") {
          // Enviar correo a "Egresosnuevo@hotmail.com" si es retiro en efectivo
          await axios.post(
            `${url}/Mailer/pendantCashWithdraw/joseportillo2002.jdpf@gmail.com/${movementId}`
          );
        } else {
          // Enviar correo a "Egresosnuevo@hotmail.com" si es una transferencia
          await axios.post(
            `${url}/Mailer/pendantWithdraw/joseportillo2002.jdpf@gmail.com/${movementId}`
          );
        }
  
        toast.success(
          "Cambio realizado con éxito! En un momento tu egreso será procesado",
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
        setTransactionError(false); // asegurarse de que el error esté en false
      } catch (error) {
        console.error("Error:", error);
        setTransactionError(true);
        console.log(transactionDone);
        setTransactionDone(false);
      } finally {
        setLoading(false);
      }
    };
  
    const resetSendMoney = () => {
      setStep(1);
    };
  
    const openModal = () => {
      setIsModalOpen(true);
      alert("Abriendo modal para agregar un nuevo beneficiario...");
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setAccbsUser_bank("");
      setAccbsUser_owner("");
      setAccbsUser_number("");
      setAccbsUser_dni("");
      setAccbsUser_phone("");
    };
  
    useEffect(() => {
      fetchCurrencyData();
      fetchDataUser();
      fetchDataPorcent();
    }, [fetchCurrencyData, fetchDataUser, fetchDataPorcent]);

  return (
    <div>SendMoney</div>
  )
}

export {SendMoney}