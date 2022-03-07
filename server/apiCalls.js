import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  const resp = await axios.post(
    // `http://localhost:4000/api/shopify/saveDraftOrder`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/saveDraftOrder`,
    `https://oauth-app.litgateway.com/api/shopify/saveDraftOrder`,
    {
      ...draftOrder,
    }
  );

  return resp;
};

export const getAllDraftOrders = async (shop_id) => {
  return await axios.get(
    // `http://localhost:4000/api/shopify/getAllStoreDraftOrders`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllStoreDraftOrders`,
    `https://oauth-app.litgateway.com/api/shopify/getAllStoreDraftOrders`,
    {
      shop_id,
    }
  );
};

export const checkIfProductHasBeenUsed = async (gid) => {
  return await axios.post(
    // `http://localhost:4000/api/shopify/checkIfProductHasBeenUsed`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/checkIfProductHasBeenUsed`,
    `https://oauth-app.litgateway.com/api/shopify/checkIfProductHasBeenUsed`,
    {
      gid,
    }
  );
};

export const getAllUserDraftOrders = async (shopId) => {
  console.log("Get all draft orders call");
  return await axios.post(
    // `http://localhost:4000/api/shopify/getAllUserDraftOrders`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllUserDraftOrders`,
    `https://oauth-app.litgateway.com/api/shopify/getAllUserDraftOrders`,
    {
      shopId,
    }
  );
};

export const deleteDraftOrder = async (id, shopId) => {
  const resp = await axios.post(
    // `http://localhost:4000/api/shopify/deleteDraftOrder`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteDraftOrder`,
    `https://oauth-app.litgateway.com/api/shopify/deleteDraftOrder`,
    {
      id,
      shopId,
    }
  );

  return resp;
};

export const deleteAllDraftOrders = async (product) => {
  const resp = await axios.post(
    // `http://localhost:4000/api/shopify/deleteAllDiscounts`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteAllDiscounts`,
    `https://oauth-app.litgateway.com/api/shopify/deleteAllDiscounts`,
    {}
  );

  return resp;
};

export const testEndpoint = async () => {
  const resp = await axios.post(
    // `http://localhost:4000/api/shopify/testEndpoint`,
    // `${process.env.REACT_APP_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/testEndpoint`,
    `https://oauth-app.litgateway.com/api/shopify/testEndpoint`,
    {
      test: "testData",
    }
  );

  return resp;
};
