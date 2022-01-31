import { gql } from "apollo-boost";

export const GET_PRODUCT_DATA = gql`
  query Product {
    product(id: "gid://shopify/Product/7347665764503") {
      title
      description
      onlineStoreUrl
      priceRangeV2 {
        maxVariantPrice {
          amount
        }
      }
    }
  }
`;
