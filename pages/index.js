import React, { useEffect, useState } from "react";
import { Heading, Page } from "@shopify/polaris";
import dynamic from "next/dynamic";
import { GET_SHOP_DATA } from "../server/handlers/queries/get-shop-data";
import { useQuery } from "react-apollo";
import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";
import { useAppBridge } from "@shopify/app-bridge-react";

const NoSSRMain = dynamic(() => import("./components/main/Main"), {
  ssr: false,
});
const Index = () => {
  const [shopInfo, setShopInfo] = useState({});
  const { error, loading, data } = useQuery(GET_SHOP_DATA);
  const [sessionToken, setSessionToken] = useState("");

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
      <NoSSRMain shopInfo={shopInfo} />
    </Page>
  );
};

export default Index;
