import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import shopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import {
  storeCallback,
  loadCallback,
  deleteCallback,
  saveAccessToken,
  checkForAccessToken,
} from "./installationHelpers";
import axios from "axios";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  // HOST_NAME: "lit-protocol-shop-promotional.myshopify.com",
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
  // SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
  //   storeCallback,
  //   loadCallback,
  //   deleteCallback
  // ),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
let ACTIVE_SHOPIFY_SHOPS = {};

console.log("CHECK CHECK CHECK");

// const saveToken = async (query) => {
//   console.log("START OF SAVE TOKEN");
//   try {
//     const saveRes = await saveAccessToken(ctx.state.shopify);
//     console.log("Saved", saveRes);
//   } catch (err) {
//     console.log("Error saving res", err);
//   }
// };

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  console.log("NEW CHECK IN ON PREP");
  // const res = await loadCallback('lit-protocol');
  // console.log('===== RES', res.data)
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    shopifyAuth({
      myShopifyDomain: "herokuapp.com",
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = true;

        // Your app should handle the APP_UNINSTALLED webhook to make sure merchants go through OAuth if they reinstall it
        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        const email =
          ctx.state.shopify?.onlineAccessInfo?.associated_user?.email;

        // const axiosResponse = await axios.post(`https://lit-shop.loca.lt/api/shopify/saveAccessToken`, { accessToken, shop, email })
        const axiosResponse = await axios.post(
          `https://oauth-app-dev.litgateway.com/api/shopify/saveAccessToken`,
          // `https://lit-shop.loca.lt/api/shopify/saveAccessToken`,
          { accessToken, shop, email }
        );

        console.log("---> Check axios response,", axiosResponse.data);

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`https://${shop}/admin/apps/lit-shop-promotional`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;

    // If this shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      // Load app skeleton. Don't include sensitive information here!
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
