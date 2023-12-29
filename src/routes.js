import Home from "./routes/Home.svelte";
import Login from "./routes/Login.svelte";
import Dashboard from "./routes/Dashboard.svelte";
import Categories from "./routes/Categories.svelte";
import Category from "./routes/Category.svelte";
import EditCategory from "./routes/EditCategory.svelte";
import Items from "./routes/Items.svelte";
import Item from "./routes/Item.svelte";
import EditItem from "./routes/EditItem.svelte";
import NotFound from "./routes/NotFound.svelte";
import wrap from "svelte-spa-router/wrap";
import { jwtToken } from "./stores";

let token_value = "";

jwtToken.subscribe((value) => {
  token_value = value;
});

const unsubscribe = jwtToken.subscribe((value) => {
  token_value = value;
});

const checkTokenStorage = (detail) => {
  return token_value === "" ? false : true;
};

export default {
  "/": Home,

  "/login": wrap({
    component: Login,
  }),
  "/dashboard": wrap({
    component: Dashboard,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/categories": wrap({
    component: Categories,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/categories/new": wrap({
    component: EditCategory,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/categories/:id": wrap({
    component: Category,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/categories/:id/edit": wrap({
    component: EditCategory,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/items": wrap({
    component: Items,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/items/new": wrap({
    component: EditItem,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/items/:id": wrap({
    component: Item,
    conditions: [checkTokenStorage],
  }),
  "/dashboard/items/:id/edit": wrap({
    component: EditItem,
    conditions: [checkTokenStorage],
  }),

  // Using ed parameters, with last being optional
  // "/author/:first/:last?": Author,

  // Wildcard parameter
  // "/book/*": Book,

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};

unsubscribe();
