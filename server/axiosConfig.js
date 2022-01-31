// import axios from "axios";
// import { getSessionToken } from "@shopify/app-bridge-utils";
// import { useAppBridge } from "@shopify/app-bridge-react";
// const instance = axios.create();
// // Intercept all requests on this Axios instance
//
// const app = useAppBridge();
// instance.interceptors.request.use(function (config) {
//   return getSessionToken(app) // requires a Shopify App Bridge instance
//     .then((token) => {
//       // Append your request headers with an authenticated token
//       config.headers["Authorization"] = `Bearer ${token}`;
//       return config;
//     });
// });
// // Export your Axios instance to use within your app
// export default instance;
