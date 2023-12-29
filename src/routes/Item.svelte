<script>
  import { onMount } from "svelte";
  import { link, push } from "svelte-spa-router";
  import Layout from "../Layout.svelte";
  import { jwtToken } from "../stores";
  import Swal from "sweetalert2";

  export let params = {};
  let item = {};

  onMount(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + $jwtToken);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(
      `${import.meta.env.VITE_GALLERY_API_URL}/v1/items/${params.id}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        item = data.item;
      })
      .catch((err) => {
        console.log("[ITEM] error:", err);
      });
  });

  const confirmDelete = () => {
    Swal.fire({
      title: `Eliminar Item: ${item.name}?`,
      text: "No podras deshacer esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + $jwtToken);

        const requestOptions = {
          method: "DELETE",
          headers: headers,
        };

        fetch(
          `${import.meta.env.VITE_GALLERY_API_URL}/v1/items/${item.id}`,
          requestOptions,
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error);
            } else {
              push("/dashboard/items");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
</script>

<Layout>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Item</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <a use:link class="btn btn-secondary" href="/dashboard/items">Atras</a
          >
          <a
            use:link
            class="btn btn-warning"
            href={`/dashboard/items/${item.id}/edit`}
          >
            Editar
          </a>
          <a class="btn btn-danger" on:click|preventDefault={confirmDelete}>
            Eliminar
          </a>
        </div>
      </div>
    </div>

    <p>
      <b>Nombre:</b>
      {item.name}
    </p>
    <p>
      <b>Descripcion:</b>
      {item.description}
    </p>
    <p>
      <b>Creado:</b>
      {item.created_at}
    </p>
    <p>
      <b>Version:</b>
      {item.version}
    </p>
    <p>
      <b>En categoria:</b>
      {item.category_name}
    </p>
    <p>
      <b>Imagen:</b>
      <img src={item.image_url} width="500" alt={item.description} />
    </p>
  </main>
</Layout>
