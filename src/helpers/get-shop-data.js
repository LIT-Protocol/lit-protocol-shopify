import { gql } from "@apollo/client";

export const GET_SHOP_DATA = gql`
  {
    shop {
      name
      myshopifyDomain
      id
    }
  }
`;
