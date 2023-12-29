<script>
  import { onMount } from "svelte";
  import Header from "./lib/Header.svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  import Footer from "./lib/Footer.svelte";
  import { jwtToken, toggleRefreshStored } from "./stores";

  onMount(() => {
    if ($jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };

      fetch(
        `${import.meta.env.VITE_GALLERY_API_URL}/v1/refresh`,
        requestOptions,
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.tokens.access_token) {
            jwtToken.set(data.tokens.access_token);
            $toggleRefreshStored(true);
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  });
</script>

<Header />

<div class="container-fluid">
  <div class="row">
    <Sidebar />

    <slot />
  </div>
</div>
<Footer />
