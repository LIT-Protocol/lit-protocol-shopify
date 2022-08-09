import axios from "axios";

export const saveDraftOrder = async (draftOrder) => {
  const resp = await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/saveDevDraftOrder`,
    {
      ...draftOrder,
    }
  );

  return resp;
};

export const getAllUserDraftOrders = async (shopId) => {
  return await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/getAllDevDraftOrders`,
    {
      shopId,
    }
  );
};

export const deleteDraftOrder = async (id, shopId) => {
  const resp = await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/deleteDevDraftOrder`,
    {
      id,
      shopId,
    }
  );

  return resp;
};

export const updateRedeemedList = async (redeemedList, typeOfRedeem, id) => {
  const resp = await axios.post(
    `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}/api/shopify/updateDevRedeemedList`,
    {
      id,
      typeOfRedeem,
      redeemedList
    }
  );

  return resp;
};
