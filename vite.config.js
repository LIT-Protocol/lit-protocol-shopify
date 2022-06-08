import react from "@vitejs/plugin-react";
import "dotenv/config";
import WebSocket from "ws";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.LIT_PROTOCOL_OAUTH_API_HOST": JSON.stringify(
      process.env.LIT_PROTOCOL_OAUTH_API_HOST
    ),
    WebSocket: WebSocket,
  },
  plugins: [react()],
};
