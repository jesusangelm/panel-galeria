<script>
  import Alert from "../lib/Alert.svelte";
  import { onMount } from "svelte";
  import { push, link } from "svelte-spa-router";
  import Layout from "../Layout.svelte";
  import { jwtToken } from "../stores";

  export let params = {};
  let item = {
    id: 0,
    name: "",
    description: "",
    category_id: "",
    item_file: "",
  };
  let categoriesOptions = [];
  let alertClass = "d-none";
  let alertMessage = "";

  onMount(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + $jwtToken);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    // get the list of categories for the select
    fetch(
      `${import.meta.env.VITE_GALLERY_API_URL}/v1/categories`,
      requestOptions,
    )
      .then((response) => {
        if (response.status !== 200) {
          console.log("Invalid response code: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        //set state
        let options = data.categories.map((cat) => {
          return { id: cat.id, value: cat.name };
        });
        categoriesOptions = options;
      })
      .catch((err) => {
        console.log("[GET CAT LIST] CATCH ERROR:", err);
      });

    if (params.id === undefined) {
      // add a item
      item = {
        id: 0,
        name: "",
        description: "",
        category_id: "",
        item_file: "",
      };
    } else {
      // edit a item
      fetch(
        `${import.meta.env.VITE_GALLERY_API_URL}/v1/items/${params.id}`,
        requestOptions,
      )
        .then((response) => {
          if (response.status !== 200) {
            console.log(
              "[FETCH ITEM] Invalid response code: " + response.status,
            );
          }
          return response.json();
        })
        .then((data) => {
          //set state
          item = {
            ...data.item,
          };
        })
        .catch((err) => {
          console.log("[FETCH ITEM] CATCH ERROR", err);
        });
    }
  });

  const handleSubmit = () => {
    let errors = [];
    let required = [
      { field: item.name, name: "name" },
      { field: item.description, name: "description" },
      { field: item.category_id, name: "category_id" },
      { field: item.item_file, name: "item_file" },
    ];

    required.forEach(function (obj) {
      if (obj.field === "") {
        errors.push(obj.name);
      }
    });

    if (errors.length > 0) {
      return false;
    }

    // passed validation, so save changes
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + $jwtToken);

    // assume we are adding a new item

    let method = "";
    let url = "";
    const formData = new FormData();
    if (item.id > 0) {
      headers.append("Content-Type", "application/json");

      method = "PATCH";
      url = `${import.meta.env.VITE_GALLERY_API_URL}/v1/items/${item.id}`;
    } else {
      method = "POST";
      url = `${import.meta.env.VITE_GALLERY_API_URL}/v1/items_multipart`;
      formData.append("name", item.name);
      formData.append("description", item.description);
      formData.append("category_id", item.category_id);
      formData.append("item_file", item.item_file);

      // item.category_id = parseInt(item.category_id);
    }

    let requestOptions = {
      body: item.id > 0 ? JSON.stringify(item) : formData,
      method: method,
      headers: headers,
      credentials: "include",
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alertClass = "alert-danger";
          const errorMessage = setErrorMessage(data);
          alertMessage = errorMessage;
        } else {
          alertClass = "d-none";
          alertMessage = "";
          push("/dashboard/items");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = () => (event) => {
    let value = event.target.value;
    let name = event.target.name;
    if (name === "item_file") {
      item = {
        ...item,
        [name]: event.target.files[0],
      };
    } else {
      item = {
        ...item,
        [name]: value,
      };
    }
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
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">
        {params.id === undefined ? "Agregar" : "Editar"} Item
      </h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <a use:link class="btn btn-secondary" href="/dashboard/items">Atras</a
          >
        </div>
      </div>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
      <input type="hidden" name="id" value={item.id} id="id" />

      <div class="mb-3">
        <label for="name" class="form-label">Nombre</label>
        <input
          type="text"
          class="form-control"
          id="name"
          name="name"
          bind:value={item.name}
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label"> Descripcion </label>
        <textarea
          class="form-control"
          id="description"
          name="description"
          bind:value={item.description}
          rows="3"
          required
        />
      </div>

      <div class="mb-3">
        <label for="category_id" class="form-label"> Categoria </label>
        <select
          class="form-select"
          id="category_id"
          name="category_id"
          bind:value={item.category_id}
        >
          <option value="">Seleccione una categoria...</option>
          {#each categoriesOptions as option}
            <option value={option.id}>{option.value}</option>
          {/each}
        </select>
      </div>

      {#if !item.id > 0}
        <div class="mb-3">
          <label for="item_file" class="form-label sr-only"> Imagen </label>
          <input
            id="item_file"
            type="file"
            name="item_file"
            class="form-control"
            on:change={handleChange("item_file")}
          />
        </div>
      {/if}

      <hr />
      <button class="btn btn-primary"> Guardar </button>
    </form>
  </main>
</Layout>
