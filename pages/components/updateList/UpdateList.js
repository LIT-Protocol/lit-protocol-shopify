import React, { useState } from "react";
import { Button, Card, List, TextContainer } from "@shopify/polaris";

const UpdateList = (props) => {
  const [showUpdateList, setShowUpdateList] = useState(false);

  return (
    <Card title="Last Update on 5-9-2022" sectioned>
      <TextContainer style={{ paddingTop: "0 !important" }}>
        <h3>Click here to see updates and new features.</h3>
        <Button onClick={() => setShowUpdateList(!showUpdateList)}>
          {showUpdateList ? "Hide updates list" : "Show updates list"}
        </Button>
        {showUpdateList && (
          <List type="bullet">
            <List.Item>
              <p>
                <strong>5-9-2022</strong>
              </p>
              <ul>
                <li>
                  <strong>Limit on number of redemptions per wallet</strong>: in
                  the <strong>Create Token Access</strong>
                  modal there is now an additional input that lets you dictate
                  how many times a wallet can redeem a given offer. It is wallet
                  based right now, so there is still the issue of someone taking
                  an NFT, moving it to another wallet and checking out again. We
                  will be adding a redemption limiter based on NFT ID in the
                  future, but it's not quite ready yet.
                </li>
              </ul>
            </List.Item>
          </List>
        )}
      </TextContainer>
    </Card>
  );
};

export default UpdateList;