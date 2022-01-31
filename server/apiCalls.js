import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  console.log("SAVE DISCOUNT", draftOrder);
  const resp = await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/saveDraftOrder`,
    `https://oauth-app-dev.litgateway.com/api/shopify/saveDraftOrder`,
    {
      ...draftOrder,
    }
  );

  return resp;
};

export const getAllDraftOrders = async (shop_id) => {
  return await axios.get(
    // `https://lit-shop.loca.lt/api/shopify/getAllStoreDraftOrders`,
    `https://oauth-app-dev.litgateway.com/api/shopify/getAllStoreDraftOrders`,
    {
      shop_id,
    }
  );
};

export const checkIfProductHasBeenUsed = async (gid) => {
  return await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/getAllStoreDraftOrders`,
    `https://oauth-app-dev.litgateway.com/api/shopify/checkIfProductHasBeenUsed`,
    {
      gid,
    }
  );
};

export const getAllUserDraftOrders = async (shopId) => {
  console.log("Get all draft orders call");
  return await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/getAllUserDraftOrders`,
    `https://oauth-app-dev.litgateway.com/api/shopify/getAllUserDraftOrders`,
    {
      shopId,
    }
  );
};

export const deleteDraftOrder = async (id) => {
  const resp = await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/deleteDraftOrder`,
    `https://oauth-app-dev.litgateway.com/api/shopify/deleteDraftOrder`,
    {
      id,
    }
  );

  return resp;
};

export const deleteAllDraftOrders = async (product) => {
  const resp = await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/deleteAllDiscounts`,
    `https://oauth-app-dev.litgateway.com/api/shopify/deleteAllDiscounts`,
    {}
  );

  return resp;
};

export const testEndpoint = async () => {
  const resp = await axios.post(
    // `https://lit-shop.loca.lt/api/shopify/testEndpoint`,
    `https://oauth-app-dev.litgateway.com/api/shopify/testEndpoint`,
    {
      test: "testData",
    }
  );

  return resp;
};
