<script>
  import Router from "svelte-spa-router";
  import { replace } from "svelte-spa-router";
  import routes from "./routes.js";
  import "./app.css";

  function conditionsFailed(event) {
    console.log("conditionsFailed event", event);

    replace("/login");
  }
</script>

<Router {routes} on:conditionsFailed={conditionsFailed} />
