import React, { useEffect, useState } from "react";
import { Page } from "@shopify/polaris";

import { useQuery } from "@apollo/client";
import { GET_SHOP_DATA } from "./helpers/get-shop-data";
import Main from "./components/main/Main";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "./App";

export function HomePage() {

  const [shopInfo, setShopInfo] = useState({});
  const { error, shopLoading, data } = useQuery(GET_SHOP_DATA);

  console.log('check home page')
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  async function logStore() {
    const res = await fetch("/log-store").then((res) => res.json());
    console.log('check log store', res)
  }

  useEffect(() => {
    logStore();
  }, [])

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
      setShopInfo(formattedShopData);
    }
  }, [data]);

  return (
    <Page fullWidth>
      <Main shopInfo={shopInfo} />
    </Page>
    // <Page fullWidth>
    //   <Layout>
    //     <Layout.Section>
    //       <Card sectioned>
    //         <Stack
    //           wrap={false}
    //           spacing="extraTight"
    //           distribution="trailing"
    //           alignment="center"
    //         >
    //           <Stack.Item fill>
    //             <TextContainer spacing="loose">
    //               <Heading>Nice work on building a Shopify app 🎉</Heading>
    //               <p>
    //                 Your app is ready to explore! It contains everything you
    //                 need to get started including the{" "}
    //                 <Link url="https://polaris.shopify.com/" external>
    //                   Polaris design system
    //                 </Link>
    //                 ,{" "}
    //                 <Link url="https://shopify.dev/api/admin-graphql" external>
    //                   Shopify Admin API
    //                 </Link>
    //                 , and{" "}
    //                 <Link
    //                   url="https://shopify.dev/apps/tools/app-bridge"
    //                   external
    //                 >
    //                   App Bridge
    //                 </Link>{" "}
    //                 UI library and components.
    //               </p>
    //               <p>
    //                 Ready to go? Start populating your app with some sample
    //                 products to view and test in your store.{" "}
    //               </p>
    //               <p>
    //                 Learn more about building out your app in{" "}
    //                 <Link
    //                   url="https://shopify.dev/apps/getting-started/add-functionality"
    //                   external
    //                 >
    //                   this Shopify tutorial
    //                 </Link>{" "}
    //                 📚{" "}
    //               </p>
    //             </TextContainer>
    //           </Stack.Item>
    //           <Stack.Item>
    //             <div style={{ padding: "0 20px" }}>
    //               <Image
    //                 source={trophyImgUrl}
    //                 alt="Nice work on building a Shopify app"
    //                 width={120}
    //               />
    //             </div>
    //           </Stack.Item>
    //         </Stack>
    //       </Card>
    //     </Layout.Section>
    //     <Layout.Section secondary>
    //       <ProductsCard />
    //     </Layout.Section>
    //   </Layout>
    // </Page>
  );
}
