import React from "react";
import { Card, TextContainer, Button, TextStyle, List } from "@shopify/polaris";
import styles from "./instructions.module.scss";

const Instructions = (props) => {
  return (
    <Card
      title="Welcome to Lit Token Access!"
      sectioned
      className={styles.instructionsContainer}
    >
      <TextContainer style={{ paddingTop: "0 !important" }}>
        <p>
          To get started creating a discount or exclusive access, click the{" "}
          <span className={"styles.exampleButton"}>
            {" "}
            <Button
              className={styles.createDraftOrderButton}
              onClick={() => props.setOpenCreateDraftOrderModal(true)}
            >
              Create Token Access
            </Button>
          </span>{" "}
          button at the top of the page.
        </p>
        <p>There are a few things to be aware of:</p>
        <List type="bullet">
          <List.Item>
            Each set of access control conditions can only have one product
            associated with them. This will be expanded to allow multiple
            products to be bundled together in the future.
          </List.Item>
          <List.Item>
            After a product is token gated, a <strong>lit-exclusive</strong> or{" "}
            <strong>lit-discount</strong> tag will be appended to the product.
            This is how the app knows what content is gated and when to show the
            customer. Removing the tags will stop the app block from rendering.
            The tags will be automatically removed when the Token Access entry
            is deleted.
          </List.Item>
          <List.Item>
            <strong>
              We highly recommend cloning a product template for use with
              products marked 'exclusive'.
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
