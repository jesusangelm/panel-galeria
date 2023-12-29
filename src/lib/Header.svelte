<script>
  import { link } from "svelte-spa-router";
</script>

<header class="navbar sticky-top flex-md-nowrap p-0 shadow-sm">
  <a
    use:link
    class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white h1"
    href="/dashboard"
  >
    <i class="bi bi-flower3"></i>ArtesaniaSory</a
  >

  <ul class="navbar-nav flex-row d-md-none">
    <li class="nav-item text-nowrap">
      <button
        class="nav-link px-3 text-white"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="bi bi-list"></i>
      </button>
    </li>
  </ul>
</header>

<style>
  header {
    background-color: #ffbbc7;
  }
</style>
