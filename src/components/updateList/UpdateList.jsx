import React, { useState } from "react";
import { Button, Card, List, TextContainer } from "@shopify/polaris";

const UpdateList = (props) => {
  const [ showUpdateList, setShowUpdateList ] = useState(false);

  return (
    <Card
      title="Last Update on 10-10-2022"
      sectioned>
      <TextContainer style={{paddingTop: "0 !important"}}>
        <h3>Click here to see updates and new features.</h3>
        <Button onClick={() => setShowUpdateList(!showUpdateList)}>
          {showUpdateList ? "Hide updates list" : "Show updates list"}
        </Button>
        {showUpdateList && (
          <List type="bullet">
            <List.Item>
              <p>
                <strong>10-10-2022</strong>
              </p>
              <ul>
                <li>
                  <strong>
                    Lit Token Access is now open source
                  </strong>{" "} All code is now publicly available on Github. The repo will be maintained and accepting
                  PRs if there is community interest in further development. We will still provide support to interested
                  parties and fix any bugs that we created, though we will not be actively working on new features.
                </li>
                <li>
                  <strong>
                    Code for the app itself:
                  </strong>{" "}<a target="_blank" href={"https://github.com/LIT-Protocol/lit-protocol-shopify"}>Lit
                  Token Access GitHub Repo</a>
                </li>
                <li>
                  <strong>
                    Code for the product select portal (frontend):
                  </strong>{" "}<a target="_blank"
                                   href={"https://github.com/LIT-Protocol/lit-oauth/tree/main/src/pages/shopify"}>
                  Product Select GitHub Repo</a>
                </li>
                <li>
                  <strong>
                    Code for the Lit Token Access backend:
                  </strong>{" "}<a target="_blank"
                                   href={"https://github.com/LIT-Protocol/lit-oauth/tree/main/server/oauth"}>
                  Lit Token Access backend code</a>
                </li>
              </ul>
            </List.Item>
            <List.Item>
              <p>
                <strong>8-25-2022</strong>
              </p>
              <ul>
                <li>
                  <strong>
                    Products variants selected in shop now prepopulate in checkout:
                  </strong>{" "} When a customer selects a variant (small, medium, or large on a shirt for example) that
                  selection will carry over and prepopulate in the Lit Token Access screen
                </li>
                <li>
                  <strong>
                    Fixed authsig redirect to prevent double login.
                  </strong>{" "}
                </li>
                <li>
                  <strong>
                    Out of stock items will no longer appear as options in redeem offer screen.
                  </strong>{" "}
                </li>
                <li>
                  <strong>
                    Removed edit customers permission.
                  </strong>{" "}
                </li>
              </ul>
            </List.Item>
            <List.Item>
              <p>
                <strong>8-9-2022</strong>
              </p>
              <ul>
                <li style={{listStyleType: 'none'}}>
                  <strong>
                    Update for app theme extension and redemption limits using NFT IDs:{" "}
                  </strong>{" "}
                </li>
                <ul>
                  <li>Discounts can now have multiple products</li>
                  <li>Products can now be associated with multiple discounts</li>
                  <li>Customer information (wallet address, NFT ID, discount type, etc...) is included in the notes for
                    a given draft order
                  </li>
                  <li>Single condition gates for Ethereum and Polygon can now be redemption limited by NFT ID</li>
                  <li>The list of previously redeemed wallets can now be edited</li>
                  <li>The list of previously redeemed NFT IDs can be edited</li>
                  <li>App block shows available discounts in-store</li>
                  <li>App block shows users discounts they qualify for, as well as those they do not, and
                    have already redeemed.
                  </li>
                </ul>
              </ul>
            </List.Item>
            <List.Item>
              <p>
                <strong>6-13-2022</strong>
              </p>
              <ul>
                <li>
                  <strong>
                    Fixed issue with sudden lack of working after 24 hours:{" "}
                  </strong>{" "}
                  A bug was brought to our attention related to session tokens
                  that would expire after 24 hours. This has been fixed and now
                  things should work into the 25th hour and beyond.
                </li>
              </ul>
            </List.Item>
            <List.Item>
              <p>
                <strong>6-8-2022</strong>
              </p>
              <ul>
                <li>
                  <strong>IMPORTANT!: </strong> if something breaks regarding
                  this update please send a message with details regarding the
                  steps taken, chain, token type, and anything else relevant to{" "}
                  <a href="mailto: LitTokenAccessSupport@litprotocol.com">
                    <strong>LitTokenAccessSupport@litprotocol.com</strong>
                  </a>
                  . We've tested this thing to ensure it's backwards compatible
                  and won't mess anything up, but we're exploring new feature
                  territory and doing a significant update behind the scenes at
                  the same time and odds are something could be funky. Let us
                  know if that happens and we'll get on fixing it.
                </li>
                <li>
                  <strong>Solana support is now a thing:</strong> We are happy
                  to announce that Solana support is live in the Lit Token
                  Gating app! The modal used to create the conditions has
                  changed as well, and now offers significantly more
                  capabilities than the previous version. A partial playground
                  is available{" "}
                  <a
                    href={"https://lit-share-modal-v3-playground.netlify.app/"}
                    target={"_blank"}
                  >
                    here
                  </a>{" "}
                  where you can experiment with the new features. Currently,
                  there isn't a good way to permanently alter settings like
                  default chain, but that will be coming soon.
                </li>
                <li>
                  <strong>Update to Vite:</strong> behind the scenes, we've
                  updated the app from NextJS to Vite. What does this mean for
                  your store? Hopefully nothing, but it makes our lives easier
                  and took a bit of time so we thought we'd say something about
                  it.
                </li>
              </ul>
            </List.Item>
            <List.Item>
              <p>
                <strong>5-24-2022</strong>
              </p>
              <ul>
                <li>
                  <strong>Update regarding updates:</strong> we have been hard
                  at work building the next version of Lit Protocol, which will
                  allow for the creation of access control conditions using
                  Solana. Solana integration should be ready in the first weeks
                  of June, and once that's complete we will be rolling out new
                  features that will improve and smooth out both the merchant
                  and customer experiences. Thank you for being patient!
                </li>
              </ul>
            </List.Item>
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
