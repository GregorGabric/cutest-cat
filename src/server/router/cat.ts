import { createRouter } from "./context";

export const catRouter = createRouter()
  .query("getTwoCats", {
    async resolve() {
      return await fetch('https://api.thecatapi.com/v1/images/search?limit=2').then(res => res.json())
    },
  });
