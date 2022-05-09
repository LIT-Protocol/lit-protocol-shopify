import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/saveDraftOrder`,
    {
      ...draftOrder,
    }
  );

  return resp;
};

export const checkIfProductHasBeenUsed = async (gid) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/checkIfProductHasBeenUsed`,
    {
      gid,
    }
  );
};

export const getAllUserDraftOrders = async (shopId) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllDraftOrders`,
    {
      shopId,
    }
  );
};

export const deleteDraftOrder = async (id, shopId) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteDraftOrder`,
    {
      id,
      shopId,
    }
  );

  return resp;
};
