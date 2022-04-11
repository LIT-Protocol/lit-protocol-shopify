import React from "react";
import { Card, TextContainer, Button, TextStyle, List } from "@shopify/polaris";
// import styles from "./instructions.module.scss";

const Instructions = (props) => {
  return (
    <Card title="Hello!" sectioned>
      <TextContainer style={{ paddingTop: "0 !important" }}>
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
          <strong>There are a few things to be aware of:</strong>
        </h3>
        <List type="bullet">
          <List.Item>
            Each set of access control conditions can only have one associated
            product. In the future, this will be expanded to allow merchants to
            bundle multiple products.
          </List.Item>
          <List.Item>
            When the access control conditions are saved, a{" "}
            <strong>lit-exclusive</strong> or <strong>lit-discount</strong> tag
            will be appended to the respective product. This is how the app
            knows what content is gated and when to show the customer. Removing
            the tags will stop the app block from rendering. The tags will be
            automatically removed when the Token Access entry is deleted.
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
              <strong style={{ color: "#5E36B7" }}>
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
