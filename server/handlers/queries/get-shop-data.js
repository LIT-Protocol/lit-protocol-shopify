import { gql } from "apollo-boost";

export const GET_SHOP_DATA = gql`
  {
    shop {
      name
      myshopifyDomain
      id
    }
  }
`;
