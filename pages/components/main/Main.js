import React, { useEffect, useState } from "react";
import LitJsSdk from "lit-js-sdk";
import {
  Spinner,
  Button,
  SettingToggle,
  TextContainer,
  Heading,
  Card,
  Layout,
} from "@shopify/polaris";
import CreateDraftOrderModal from "../createDraftOrderModal/CreateDraftOrderModal";
import DraftOrderTable from "../draftOrderTable/DraftOrderTable";
import {
  saveDraftOrder,
  getAllUserDraftOrders,
  deleteDraftOrder,
} from "../../../helpers/apiCalls.js";
import ShareModal from "lit-share-modal";
import Instructions from "./Instructions";
// import dotenv from "dotenv";
//
// dotenv.config();

const spoofAuthSig = {
  sig:
    "0x606ea0d43047b7b7cf0a5d1dc41bdb8b9d026a2c1145919a9d094f150a8f4d615384915c7e2d78386a52eb9293ffa39e36a7a7377b63bf02d18596c2f6f6811b1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "I am creating an account to use Lit Protocol at 2022-01-06T18:47:54.804Z",
  address: "0x8669fe212e2358712fdd09b8854f689f6de65b63",
};

const Main = (props) => {
  const [draftOrders, setDraftOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectedToLit, setConnectedToLit] = useState(false);

  const [openCreateDraftOrderModal, setOpenCreateDraftOrderModal] = useState(
    false
  );
  const [openShareModal, setOpenShareModal] = useState(false);
  const [accessControlConditions, setAccessControlConditions] = useState(null);
  const [permanent, setPermanent] = useState(true);
  const [hideInstructions, setHideInstructions] = useState(true);

  const [
    humanizedAccessControlConditions,
    setHumanizedAccessControlConditions,
  ] = useState(null);

  // document.addEventListener(
  //   "lit-ready",
  //   function (e) {
  //     console.log("Lit client ready");
  //   },
  //   false
  // );

  useEffect(() => {
    if (!!props.shopInfo.shopId) {
      toggleGetAllDraftOrders();
    }
  }, [props.shopInfo]);

  useEffect(() => {
    if (!connectedToLit) {
      connectToNode();
    }
  }, [connectedToLit]);

  const connectToNode = async () => {
    const litNodeClient = new LitJsSdk.LitNodeClient();
    litNodeClient.connect();
    window.litNodeClient = litNodeClient;
    setConnectedToLit(true);
  };

  const handleCreateAccessControl = async () => {
    setOpenCreateDraftOrderModal(false);
    setOpenShareModal(true);
  };

  const humanizeAccessControlConditions = async (accessControlConditions) => {
    return await LitJsSdk.humanizeAccessControlConditions({
      accessControlConditions,
    });
  };

  const addAccessControlConditions = async (acc) => {
    const humanizedAcc = await humanizeAccessControlConditions(acc);
    setAccessControlConditions(acc);
    setHumanizedAccessControlConditions(humanizedAcc);
  };

  const sendDraftOrderToDb = async (draftOrderObj) => {
    let chain;

    try {
      setOpenShareModal(false);
      setOpenCreateDraftOrderModal(false);

      const resp = await saveDraftOrder(draftOrderObj);
      const resourceId = {
        // baseUrl: "http://localhost:4000",
        baseUrl: "https://oauth-app.litgateway.com",
        path: "/shopify/l/" + resp.data,
        orgId: "",
        role: "customer",
        extraData: "",
      };

      if (!!accessControlConditions && accessControlConditions[0]["chain"]) {
        chain = accessControlConditions[0].chain;
      } else if (!!accessControlConditions[0][0]["chain"]) {
        chain = accessControlConditions[0][0].chain;
      }
      const signedTokenObj = {
        accessControlConditions: accessControlConditions,
        chain,
        authSig: spoofAuthSig,
        resourceId,
      };

      console.log("check signedTokenObj", signedTokenObj);

      litNodeClient.saveSigningCondition({
        ...signedTokenObj,
      });

      setAccessControlConditions(null);
      setHumanizedAccessControlConditions(null);
      setPermanent(true);
      await toggleGetAllDraftOrders();
    } catch (err) {
      console.error("Failed to save draft order:", err);
    }
  };

  const handleDeleteDraftOrder = async (draftOrderObj) => {
    try {
      const res = await deleteDraftOrder(
        draftOrderObj.id,
        props.shopInfo.shopId
      );
      await toggleGetAllDraftOrders();
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  const toggleGetAllDraftOrders = async () => {
    setLoading(true);
    try {
      const allDraftOrders = await getAllUserDraftOrders(props.shopInfo.shopId);
      console.log("allDraftOrders:", allDraftOrders);
      setDraftOrders(allDraftOrders.data);
      setLoading(false);
    } catch (err) {
      console.error("Error getting draft orders:", err);
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {loading || !connectedToLit || draftOrders === null ? (
        <Layout>
          <Layout.Section>
            <TextContainer>
              <Heading>Loading...</Heading>
              <Spinner size="large" />
            </TextContainer>
          </Layout.Section>
        </Layout>
      ) : (
        <Layout>
          <Layout.Section>
            <Card>
              <DraftOrderTable
                draftOrders={draftOrders}
                handleDeleteDraftOrder={handleDeleteDraftOrder}
                setOpenCreateDraftOrderModal={setOpenCreateDraftOrderModal}
              />
            </Card>
          </Layout.Section>
          {/*<Layout.Section>*/}
          {/*  <Button onClick={() => setOpenCreateDraftOrderModal(true)}>*/}
          {/*    Create Token Access*/}
          {/*  </Button>*/}
          {/*</Layout.Section>*/}
          <Layout.Section>
            <Card>
              <SettingToggle
                action={{
                  content: hideInstructions
                    ? "Show Instructions"
                    : "Hide Instructions",
                  onAction: () => setHideInstructions(!hideInstructions),
                }}
                enabled={!hideInstructions}
              >
                <TextContainer>
                  <Heading>Thank you for using Lit Token Access!</Heading>
                  <p>
                    Click the button on the right to show or hide additional
                    instructions. Instructions are currently{" "}
                    <strong>{!hideInstructions ? "shown" : "hidden"}</strong>.
                  </p>
                  <p>
                    <a
                      style={{ color: "#5E36B7" }}
                      href={
                        "https://lit-services-docs.netlify.app/docs/shopify-docs/intro"
                      }
                      target={"_blank"}
                    >
                      <strong>
                        Additional documentation can be found here
                      </strong>
                      .
                    </a>
                  </p>
                  <p>
                    <strong>
                      For first time users - In order to function properly, the
                      Lit Token Access app block must be added to your Shopify
                      store's product template.{" "}
                    </strong>
                    <a
                      href={
                        "https://lit-services-docs.netlify.app/docs/shopify-docs/add-lit-block-to-store"
                      }
                      target="_blank"
                    >
                      <strong style={{ color: "#5E36B7" }}>
                        Instructions can be found here.
                      </strong>
                    </a>
                  </p>
                </TextContainer>
              </SettingToggle>
            </Card>
          </Layout.Section>
          <Layout.Section>
            {!hideInstructions && (
              <Instructions
                setOpenCreateDraftOrderModal={setOpenCreateDraftOrderModal}
              />
            )}
          </Layout.Section>
        </Layout>
      )}
      <div>
        <CreateDraftOrderModal
          shopId={props.shopInfo.shopId}
          open={openCreateDraftOrderModal}
          setOpenCreateDraftOrderModal={setOpenCreateDraftOrderModal}
          handleCreateAccessControl={handleCreateAccessControl}
          accessControlConditions={accessControlConditions}
          setAccessControlConditions={setAccessControlConditions}
          setPermanent={setPermanent}
          humanizedAccessControlConditions={humanizedAccessControlConditions}
          setHumanizedAccessControlConditions={
            setHumanizedAccessControlConditions
          }
          sendDraftOrderToDb={sendDraftOrderToDb}
          shopInfo={props.shopInfo}
          hideInstructions={hideInstructions}
        />
        {openShareModal && (
          <ShareModal
            className={"share-modal"}
            showModal={openShareModal}
            injectCSS={false}
            onClose={() => {
              setOpenShareModal(false);
              setPermanent(true);
              setOpenCreateDraftOrderModal(true);
            }}
            onAccessControlConditionsSelected={async (restriction) => {
              await addAccessControlConditions(
                restriction.accessControlConditions
              );
              await setPermanent(restriction.permanent);
              setOpenShareModal(false);
              setOpenCreateDraftOrderModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
