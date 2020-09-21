import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/layout/Layout";
import { FirebaseContext } from "../../firebase";
import Error404 from "../../components/layout/404";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  margin: 0;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  // State del componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarconsultarDB] = useState(true);

  // Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  // Context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    //Declaramos variable para trackear si esta o no el componente montado
    let isCancelled = false;

    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id);
        const producto = await productoQuery.get();

        if (!isCancelled) {
          if (producto.exists) {
            guardarProducto(producto.data());
          } else {
            guardarError(true);
          }
          guardarconsultarDB(false);
        }
      };
      obtenerProducto();
    }
    return () => {
      //Volvemos la variable true para evitar que se intente actualizar un state inexistente
      isCancelled = true;
    };
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  // Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }

    // Obtener y sumar nuevo voto
    const nuevoTotal = votos + 1;

    // Verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    // Guardar ID del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    // Actualizar BD
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });

    // Actualizar el state
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
      haVotado: nuevoHaVotado,
    });

    guardarconsultarDB(true); // Hay un voto, por lo tanto consultar a la BD
  };

  // Funciones para crear comentario
  const comentarioChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  // Identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    document.getElementById("form").reset();

    if (!usuario) {
      return router.push("/login");
    }

    // Información extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    // Hacer compia de comentarios y aañadirlos al array
    const nuevosComentarios = [...comentarios, comentario];

    // Actualizar BD
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });

    // Actualizar el state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    guardarconsultarDB(true); // Hay un voto, por lo tanto consultar a la BD
  };

  // Función que revisa que el creador del producto sea el mismo que está logeado
  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) return true;
  };

  // Elimina un producto de la BD

  const eliminarProducto = async () => {
    if (!usuario) return router.push("/login");
    if (creador.id !== usuario.uid) return router.push("/");

    try {
      await firebase.db.collection("productos").doc(id).delete();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>

            <ContenedorProducto>
              <div>
                {" "}
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlimagen} />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>

                    <form id="form" onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>

                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aún no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p
                          css={css`
                            color: #9a9a9a;
                          `}
                        >
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comentario.usuarioNombre}
                          </span>
                        </p>

                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                </div>

                {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
              </aside>
            </ContenedorProducto>

            {puedeBorrar() && (
              <Boton
                onClick={eliminarProducto}
                css={css`
                  margin-top: 2rem;
                `}
              >
                Eliminar Producto
              </Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
