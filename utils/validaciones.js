export const soloLetras = (texto) => {
    let NomApeRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
    if (NomApeRegex.test(texto)) {
      return true;
    } else {
      return false;
    }
  };
export const soloNumeros = (numero) => {
  const regex = /^[1-9]\d*$/; 
  if (regex.test(numero)){
    return true;
  }else{
    return false;
  }
};
