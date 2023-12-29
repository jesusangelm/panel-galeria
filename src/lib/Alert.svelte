<script>
  import { fade } from "svelte/transition";
  export let className = "d-none";
  export let alertMessage = "";
</script>

<div
  transition:fade
  class="alert {className} alert-dismissible fade show"
  role="alert"
>
  {alertMessage}
</div>
