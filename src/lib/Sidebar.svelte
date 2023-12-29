<script>
  import { link, push } from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import { jwtToken, toggleRefreshStored } from "../stores";

  const logout = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${import.meta.env.VITE_GALLERY_API_URL}/v1/logout`, requestOptions)
      .catch((error) => {
        console.log("error login out", error);
      })
      .finally(() => {
        jwtToken.set("");
        $toggleRefreshStored(false);
      });

    push("/login");
  };
</script>

<div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
  <div
    class="offcanvas-md offcanvas-end bg-body-tertiary"
    tabIndex="-1"
    id="sidebarMenu"
    aria-labelledby="sidebarMenuLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="sidebarMenuLabel">ArtesaniaSory</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-label="Close"
      >
      </button>
    </div>
    <div
      class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto"
    >
      <ul class="nav flex-column">
        <li class="nav-item">
          <a
            class="nav-link d-flex align-items-center gap-2"
            aria-current="page"
            href="/dashboard"
            use:link
            use:active
          >
            <i class="bi bi-house-fill"></i>
            Panel
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link d-flex align-items-center gap-2"
            href="/dashboard/categories"
            use:link
            use:active
          >
            <i class="bi bi-file-earmark"></i>
            Categorias
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link d-flex align-items-center gap-2"
            href="/dashboard/items"
            use:link
            use:active
          >
            <i class="bi bi-cart"></i>
            Items
          </a>
        </li>
      </ul>

      <hr class="my-3" />

      <ul class="nav flex-column mb-auto">
        <li class="nav-item">
          <a
            on:click|preventDefault={logout}
            class="nav-link d-flex align-items-center gap-2"
            href="#!"
          >
            <i class="bi bi-door-closed"></i>
            Salir
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

<style>
  i {
    font-size: 0.9rem;
  }

  .nav-link {
    color: #ff7775;
  }
</style>
