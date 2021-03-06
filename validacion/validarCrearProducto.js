export default function validarCrearCuenta(valores) {
  let errores = {};

  // Validar el nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  // Validar empresa
  if (!valores.empresa) {
    errores.empresa = "El nombre de empresa es obligatorio";
  }

  // Validar url
  if (!valores.url) {
    errores.url = "La url del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "Url no válida";
  }

  // Validar descripción
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripción de tu producto";
  }

  return errores;
}
