import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  // endpoints for development
  if (process.env.DEVELOPMENT) {
    const resp = await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/saveDevDraftOrder`,
      {
        ...draftOrder,
      }
    );

    return resp;
  } else {
    // endpoints for production
    const resp = await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/saveDraftOrder`,
      {
        ...draftOrder,
      }
    );

    return resp;
  }
};

export const checkIfProductHasBeenUsed = async (gid) => {
  // endpoints for development
  if (process.env.DEVELOPMENT) {
    return await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/checkIfDevProductHasBeenUsed`,
      {
        gid,
      }
    );
  } else {
    // endpoints for prod
    return await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/checkIfProductHasBeenUsed`,
      {
        gid,
      }
    );
  }
};

export const getAllUserDraftOrders = async (shopId) => {
  // endpoints for development
  if (process.env.DEVELOPMENT) {
    return await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllDevDraftOrders`,
      {
        shopId,
      }
    );
  } else {
    // endpoints for prod
    return await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllDraftOrders`,
      {
        shopId,
      }
    );
  }
};

export const deleteDraftOrder = async (id, shopId) => {
  // endpoints for development
  if (process.env.DEVELOPMENT) {
    const resp = await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteDevDraftOrder`,
      {
        id,
        shopId,
      }
    );

    return resp;
  } else {
    // endpoints for prod
    const resp = await axios.post(
      `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteDraftOrder`,
      {
        id,
        shopId,
      }
    );

    return resp;
  }
};
