import React from "react";
import { Card, TextContainer, Button, TextStyle, List } from "@shopify/polaris";
// import styles from "./instructions.module.scss";

const Instructions = (props) => {
  return (
    <Card title="Hello!" sectioned>
      <TextContainer style={{paddingTop: "0 !important"}}>
        <p>
          To get started creating a discount or exclusive access, click the{" "}
          <span>
            {" "}
            <Button onClick={() => props.setOpenCreateDraftOrderModal(true)}>
              Create Token Access
            </Button>
          </span>{" "}
          button at the top of the page.
        </p>
        <h3>
          <strong>
            Lit Token Access is in continuous development, and new features
            will be added in the coming weeks and months. For now there are a
            few things to be aware of:
          </strong>
        </h3>
        <List type="bullet">
          <List.Item>
            Exclusives and discounts are processed as draft orders. Records can
            be found in the store's <strong>Orders</strong> page, accessible in
            the left nav bar.
          </List.Item>
          <List.Item>
            Draft orders can be searched by type in the Shopify Orders screen. All draft orders created by Lit Token
            Access will be given
            a <strong>lit-offer</strong> tag. Additional searchable tags
            are <strong>lit-exclusive</strong> for exclusive offers, <strong>lit-discount</strong> for discount
            offers, <strong>lit-wallet-address</strong> for offers redeem limited by wallet address,
            and <strong>lit-nft-id</strong> for offers redeem limited by NFT ID.
          </List.Item>
          <List.Item>
            If an offer is redeem limited by wallet address or NFT ID, the list of previously redeemed users can be
            edited by clicking the edit icon in the offer table entry.
          </List.Item>
          <List.Item>
            <strong>
              We highly recommend cloning a product template for use with
              products designated for Exclusive Access.
            </strong>{" "}
            Directions can be found in our docs under
            <a
              href={
                "https://lit-services-docs.netlify.app/docs/shopify-docs/creating-a-new-product-template"
              }
              target="_blank"
            >
              <strong style={{color: "#5E36B7"}}>
                {" "}
                Creating a new product template.
              </strong>
            </a>
          </List.Item>
        </List>
      </TextContainer>
    </Card>
  );
};

export default Instructions;
