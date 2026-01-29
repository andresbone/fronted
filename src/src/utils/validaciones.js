
export const SoloLetras = (texto) =>{
    return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(texto);
};
export const LetrasYNumeros = (texto) => 
    { return /^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s]+$/.test(texto)
    };

export const noVacio = (valor) => valor.trim() !== "";
//export const validarLargo = (valor, min, max) => valor.trim().length >= min && valor.trim().length <= max;

