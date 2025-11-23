export default {
  socialmat: {
    input: "./openapi.json",
    output: {
      target: "./src/lib/api.ts",
      client: "fetch",
      httpClient: "fetch",
      clean: true,
    },
  },
};
