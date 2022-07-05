import React, { useEffect, useState } from "react";
import { Page } from "@shopify/polaris";
import Main from "./components/main/Main";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "./App";

export function HomePage() {
  const [shopInfo, setShopInfo] = useState({});

  const app = useAppBridge();
  const authFetch = userLoggedInFetch(app);

  async function logStore() {
    const res = await authFetch("/log-store");
    const jsonRes = await res.json();
    console.log("jsonRes", jsonRes);
    setShopInfo({
      name: jsonRes.name,
      shopId: jsonRes.shopId,
    });
  }

  useEffect(() => {
    logStore();
  }, []);

  axios.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });

  return (
    <Page fullWidth>
      <Main shopInfo={shopInfo} />
    </Page>
  );
}
