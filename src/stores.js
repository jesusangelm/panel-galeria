import { writable } from "svelte/store";

let tickInterval;
const toggleRefresh = (status) => {
  if (status) {
    let i = setInterval(() => {
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
          }
        })
        .catch((error) => {
          console.log("admin user is not logged in", error);
        });
      // }, 5000);
    }, 600000);
    tickInterval = i;
  } else {
    clearInterval(tickInterval);
    tickInterval = undefined;
  }
};

export const jwtToken = writable("");
export const toggleRefreshStored = writable(toggleRefresh);
