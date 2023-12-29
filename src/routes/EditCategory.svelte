<script>
  import Alert from "../lib/Alert.svelte";
  import { onMount } from "svelte";
  import { push, link } from "svelte-spa-router";
  import Layout from "../Layout.svelte";
  import { jwtToken } from "../stores";
  export let params = {};

  let category = {
    id: 0,
    name: "",
    description: "",
  };

  let errorList;
  let alertClass = "d-none";
  let alertMessage = "";

  onMount(() => {
    if (params.id === undefined) {
      // add a category
      category = {
        id: 0,
        name: "",
        description: "",
      };
    } else {
      // edit a category
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", "Bearer " + $jwtToken);

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      fetch(
        `${import.meta.env.VITE_GALLERY_API_URL}/v1/categories/${params.id}`,
        requestOptions,
      )
        .then((response) => {
          if (response.status !== 200) {
            console.log(
              "[NEW/EDIT CAT RESPONSE] Invalid response code: " +
                response.status,
            );
          }
          return response.json();
        })
        .then((data) => {
          //set state
          category = {
            ...data.category,
          };
        })
        .catch((err) => {
          console.log("[NEW/EDIT CAT ERROR]", err);
        });
    }
  });

  const handleSubmit = () => {
    let errors = [];
    let required = [
      { field: category.name, name: "name" },
      { field: category.description, name: "description" },
    ];

    required.forEach(function (obj) {
      if (obj.field === "") {
        errors.push(obj.name);
      }
    });

    errorList = errors;

    if (errors.length > 0) {
      return false;
    }

    // passed validation, so save changes
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + $jwtToken);

    // assume we are adding a new category
    let method = "POST";
    let url = `${import.meta.env.VITE_GALLERY_API_URL}/v1/categories`;
    if (category.id > 0) {
      method = "PATCH";
      url = `${import.meta.env.VITE_GALLERY_API_URL}/v1/categories/${
        category.id
      }`;
    }

    let requestOptions = {
      body: JSON.stringify(category),
      method: method,
      headers: headers,
      credentials: "include",
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          const errorMessage = setErrorMessage(data);
          alertMessage = errorMessage;
          alertClass = "alert-danger";
        } else {
          push("/dashboard/categories");
        }
      })
      .catch((err) => {
        console.log("[NEW/EDIT] CAT CATCH ERROR ", err);
      });
  };

  const setErrorMessage = (dataError) => {
    if (typeof dataError.error === "object") {
      return Object.entries(dataError.error).map(([k, v]) => `${k} ${v}`)[0];
    } else {
      return dataError.error;
    }
  };
</script>

<Layout>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    {#if alertMessage != ""}
      <Alert className={alertClass} {alertMessage} />
    {/if}
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Agregar Categoria</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <a use:link class="btn btn-secondary" href="/dashboard/categories"
            >Atras</a
          >
        </div>
      </div>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
      <input type="hidden" name="id" value={category.id} id="id" />

      <div class="mb-3">
        <label for="name" class="form-label">Nombre</label>
        <input
          type="text"
          class="form-control"
          id="name"
          name="name"
          bind:value={category.name}
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label"> Descripcion </label>
        <textarea
          class="form-control"
          id="description"
          name="description"
          bind:value={category.description}
          rows="3"
          required
        />
      </div>

      <hr />
      <button class="btn btn-primary"> Guardar </button>
    </form>
  </main>
</Layout>
