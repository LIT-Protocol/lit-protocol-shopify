import React, { useEffect, useState } from "react";
import { Heading, Page } from "@shopify/polaris";
import Main from "./components/main/Main";
import { useQuery } from "react-apollo";
import { GET_SHOP_DATA } from "../server/handlers/queries/get-shop-data";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import axios from "axios";

export default function Index() {
  const [shopInfo, setShopInfo] = useState({});
  const { error, loading, data } = useQuery(GET_SHOP_DATA);

  const app = useAppBridge();

  axios.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });

  useEffect(() => {
    if (data) {
      const shopIdArray = data.shop.id.split("/");
      const shopIdNumber = shopIdArray[shopIdArray.length - 1];
      const formattedShopData = {
        name: data.shop.myshopifyDomain,
        shopId: shopIdNumber,
      };
      console.log("---> formattedShopData", formattedShopData);
      setShopInfo(formattedShopData);
    }
  }, [data]);

  return (
    <Page fullWidth>
      <Heading></Heading>
      <Main shopInfo={shopInfo} />
    </Page>
  );
}
