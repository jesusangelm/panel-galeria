<script>
  import Alert from "../lib/Alert.svelte";
  import { push } from "svelte-spa-router";
  import "../login.css";
  import { jwtToken, toggleRefreshStored } from "../stores";

  const today = new Date();
  let email = "";
  let password = "";
  let alertMessage = "";
  let alertClass = "d-none";

  const handleSubmit = async () => {
    // build the request payload
    let payload = {
      email: email,
      password: password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    // authenticate with the form data on the api
    let response;
    try {
      response = await fetch(
        `${import.meta.env.VITE_GALLERY_API_URL}/v1/authenticate`,
        requestOptions,
      );
    } catch (error) {
      console.log("[LOGIN] System Failure");
      return;
    }

    // response to json convertion
    const jsonResponse = await response.json();

    if (jsonResponse.error) {
      const errorMessage = setErrorMessage(jsonResponse);
      alertMessage = errorMessage;
      alertClass = "alert-danger";
      return;
    }

    jwtToken.set(jsonResponse.tokens.access_token);
    $toggleRefreshStored(true);
    push("/dashboard");
  };

  const setErrorMessage = (dataError) => {
    if (typeof dataError.error === "object") {
      return Object.entries(dataError.error).map(([k, v]) => `${k} ${v}`)[0];
    } else {
      return dataError.error;
    }
  };
</script>

<main class="form-signin w-100 m-auto">
  {#if alertMessage != ""}
    <Alert className={alertClass} {alertMessage} />
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <h1 class="h3 mb-3 fw-normal">Inicio de Sesion</h1>

    <div class="form-floating">
      <input
        type="email"
        class="form-control"
        id="floatingInput"
        name="email"
        bind:value={email}
        placeholder="email@dominio.tld"
        required
      />
      <label for="floatingInput">Correo</label>
    </div>
    <div class="form-floating">
      <input
        type="password"
        class="form-control"
        id="floatingPassword"
        name="password"
        bind:value={password}
        placeholder="Password"
        required
      />
      <label for="floatingPassword">Clave</label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit"> Entrar </button>
  </form>
  <p class="mt-5 mb-3 text-body-secondary">
    ArtesaniaSory • &copy; {today.getFullYear()} • Isla de Margarita
  </p>
  <p class="mt-5 mb-3 text-body-secondary">
    Desarrollado con ❤️ por{" "}
    <a class="link-underline-light" href="https://jesusmarin.dev">
      JesusMarin.Dev
    </a>
  </p>
</main>
