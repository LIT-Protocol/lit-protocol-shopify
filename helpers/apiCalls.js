import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  const resp = await axios.post(
    // `http://localhost:4000/api/shopify/saveDraftOrder`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/saveDraftOrder`,
    `https://oauth-app.litgateway.com/api/shopify/saveDraftOrder`,
    {
      ...draftOrder,
    }
  );

  return resp;
};

export const checkIfProductHasBeenUsed = async (gid) => {
  return await axios.post(
    // `http://localhost:4000/api/shopify/checkIfProductHasBeenUsed`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/checkIfProductHasBeenUsed`,
    `https://oauth-app.litgateway.com/api/shopify/checkIfProductHasBeenUsed`,
    {
      gid,
    }
  );
};

export const getAllUserDraftOrders = async (shopId) => {
  return await axios.post(
    // `http://localhost:4000/api/shopify/getAllDraftOrders`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/getAllDraftOrders`,
    `https://oauth-app.litgateway.com/api/shopify/getAllDraftOrders`,
    {
      shopId,
    }
  );
};

export const deleteDraftOrder = async (id, shopId) => {
  const resp = await axios.post(
    // `http://localhost:4000/api/shopify/deleteDraftOrder`,
    // `https://oauth-app-dev.litgateway.com/api/shopify/deleteDraftOrder`,
    `https://oauth-app.litgateway.com/api/shopify/deleteDraftOrder`,
    {
      id,
      shopId,
    }
  );

  return resp;
};
