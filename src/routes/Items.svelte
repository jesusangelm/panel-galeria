<script>
  import { onMount } from "svelte";
  import Layout from "../Layout.svelte";
  import { jwtToken } from "../stores";
  import { link } from "svelte-spa-router";

  let items = [];
  let metadata = {};
  let name = "";
  let page = "1";
  let sort = "-created_at";
  let pageSize = "20";

  onMount(() => {
    getItems();
  });

  const getItems = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + $jwtToken);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(
      `${
        import.meta.env.VITE_GALLERY_API_URL
      }/v1/items?name=${name}&sort=${sort}&page_size=${pageSize}&page=${page}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        items = data.items;
        metadata = data.metadata;
      })
      .catch((err) => {
        console.log("[ITEMS] Error:", err);
      });
  };

  const debounce = (callback, wait = 750) => {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        page = "1";
        callback(...args);
      }, wait);
    };
  };

  const goToPage = (pageToGo) => {
    page = pageToGo;
    getItems();
  };

  const changePageSize = () => {
    page = "1";
    getItems();
  };
</script>

<Layout>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Items</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <a use:link class="btn btn-primary" href="/dashboard/items/new"
            >Agregar Item</a
          >
        </div>
      </div>
    </div>

    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h2>Listado de Items</h2>
      <div class="col-auto">
        <input
          class="form-control form-control-sm"
          type="text"
          placeholder="Buscar por nombre:"
          aria-label=".form-control-sm search_by_name"
          bind:value={name}
          on:keyup={debounce(getItems)}
        />
      </div>
      <div class="mb-3">
        <label for="rpp" class="form-label"> RPP </label>
        <select
          class="form-select form-select-sm"
          id="rpp"
          name="rpp"
          bind:value={pageSize}
          on:change={changePageSize}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
    <div class="table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Creacion</th>
            <th scope="col">Version</th>
            <th scope="col">Categoria</th>
            <th scope="col">Imagen</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#if items?.length > 0}
            {#each items as item}
              <tr>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.created_at}</td>
                <td>{item.version}</td>
                <td>{item.category_name}</td>
                <td>
                  <img src={item.image_url} width="50" alt="imagen miniatura" />
                </td>
                <td>
                  <div class="d-flex gap-4 justify-content-center">
                    <a
                      use:link
                      href={`/dashboard/items/${item.id}`}
                      title="Mostrar"
                    >
                      <i
                        class="bi bi-eyeglasses"
                        style={{
                          color: "black",
                          fontSize: "1.5rem",
                        }}
                      >
                      </i>
                    </a>
                    <a
                      use:link
                      title="Editar"
                      href={`/dashboard/items/${item.id}/edit`}
                    >
                      <i
                        class="bi bi-pencil-square"
                        style={{
                          color: "black",
                          fontSize: "1.5rem",
                        }}
                      >
                      </i>
                    </a>
                  </div>
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="8">No se encontraron registros</td>
            </tr>
          {/if}
        </tbody>
      </table>
      {#if !(Object.keys(metadata).length === 0)}
        <div>
          <button
            class="btn btn-secondary btn-sm"
            on:click|preventDefault={() => goToPage(metadata.current_page - 1)}
            disabled={metadata.current_page === 1}
          >
            Anterior
          </button>

          <span>Pagina {metadata.current_page} de {metadata.last_page}</span>

          <button
            class="btn btn-secondary btn-sm"
            on:click|preventDefault={() => goToPage(metadata.current_page + 1)}
            disabled={metadata.current_page === metadata.last_page}
          >
            Siguiente
          </button>
        </div>
      {/if}
    </div>
  </main>
</Layout>

<style>
  i {
    color: black;
    font-size: 1.5rem;
  }
</style>
