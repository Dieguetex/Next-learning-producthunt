import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [valores, guardarValores] = useState(stateInicial);
  const [errores, guardarErrores] = useState({});
  const [submitForm, guardarSubimitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      guardarSubimitForm(false);

      const noErrores = Object.keys(errores).length === 0;

      if (noErrores) {
        fn(); // fn === Función que se ejecuta en el componente
      }
    }
  }, [errores]);

  // Función que se ejecuta conforme el usuario escribe algo
  const handleChange = (e) => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };

  // Función que se ejecuta cuando el usuario hace submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
    guardarSubimitForm(true);
  };

  // Cuando se realiza el evento de blur
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
  };

  return {
    valores,
    errores,
    handleChange,
    handleSubmit,
    handleBlur,
  };
};

export default useValidacion;
