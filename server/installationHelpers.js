import axios from "axios";

export const saveAccessToken = async (shopifyState) => {
  let shopAccessObject = {
    shop: shopifyState.shop,
    accessToken: shopifyState.accessToken,
  };
  if (
    shopifyState?.onlineAccessInfo?.associated_user["account_owner"] === true
  ) {
    shopAccessObject["email"] =
      shopifyState.onlineAccessInfo.associated_user.email;
  } else {
    shopAccessObject["email"] = "";
  }

  const resp = await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/saveAccessToken`,
    `https://oauth-app-dev.litgateway.com/api/shopify/storeCallback`,
    shopAccessObject
  );
  return resp;
};

export const checkForAccessToken = async (shop) => {
  console.log("CHECK FOR ACCESS CALL", shop);
  return await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/checkForAccessToken`,
    `https://oauth-app-dev.litgateway.com/api/shopify/storeCallback`,
    "cally call call",
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};
