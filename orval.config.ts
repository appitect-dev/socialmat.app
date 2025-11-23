export default {
  socialmat: {
    input: "./openapi.json",
    output: {
      target: "./src/lib/api.ts",
      client: "fetch",
      override: {
        mutator: {
          path: "./src/lib/fetcher.ts",
          name: "apiFetch",
        },
      },
      clean: false,
    },
  },
};
