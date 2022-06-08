import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  const resp = await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/saveAuthPlaygroundDraftOrder`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/saveAuthPlaygroundDraftOrder`,
    // `https://oauth-app.litgateway.com/api/shopify/saveAuthPlaygroundDraftOrder`,
    {
      ...draftOrder,
    }
  );

  return resp;
};

export const checkIfProductHasBeenUsed = async (gid) => {
  return await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/checkIfAuthPlaygroundProductHasBeenUsed`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/checkIfAuthPlaygroundProductHasBeenUsed`,
    // `https://oauth-app.litgateway.com/api/shopify/checkIfAuthPlaygroundProductHasBeenUsed`,
    {
      gid,
    }
  );
};

export const getAllUserDraftOrders = async (shopId) => {
  return await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllAuthPlaygroundDraftOrders`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/getAllAuthPlaygroundDraftOrders`,
    // `https://oauth-app.litgateway.com/api/shopify/getAllAuthPlaygroundDraftOrders`,
    {
      shopId,
    }
  );
};

export const deleteDraftOrder = async (id, shopId) => {
  const resp = await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteAuthPlaygroundDraftOrder`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/deleteAuthPlaygroundDraftOrder`,
    // `https://oauth-app.litgateway.com/api/shopify/deleteAuthPlaygroundDraftOrder`,
    {
      id,
      shopId,
    }
  );

  return resp;
};
