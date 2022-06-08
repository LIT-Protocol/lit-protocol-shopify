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
  Modal,
} from "@shopify/polaris";
import CreateDraftOrderModal from "../createDraftOrderModal/CreateDraftOrderModal";
import DraftOrderTable from "../draftOrderTable/DraftOrderTable";
import {
  saveDraftOrder,
  getAllUserDraftOrders,
  deleteDraftOrder,
} from "../../helpers/apiCalls.js";
import ShareModal from "lit-share-modal-v3";
import Instructions from "./Instructions";
import "./Main.css";
import UpdateList from "../updateList/UpdateList";

const storedAuthSigs = {
  evmBasic: {
    sig: "0x606ea0d43047b7b7cf0a5d1dc41bdb8b9d026a2c1145919a9d094f150a8f4d615384915c7e2d78386a52eb9293ffa39e36a7a7377b63bf02d18596c2f6f6811b1c",
    derivedVia: "web3.eth.personal.sign",
    signedMessage:
      "I am creating an account to use Lit Protocol at 2022-01-06T18:47:54.804Z",
    address: "0x8669fe212e2358712fdd09b8854f689f6de65b63",
  },
  solRpc: {
    sig: "3fc8c55fda011f30935b9e9442e0f1a24292ab669cdbdc9abd5fbe1831e2ee16e8773f6d1df78450eb9e0f4b6ef20de27ba7c90fd9880518489e9dfe1a243f05",
    derivedVia: "solana.signMessage",
    signedMessage:
      "I am creating an account to use Lit Protocol at 2022-05-31T21:43:50.451Z",
    address: "EYLmDpHvFabvtLpPk5axo1vL1LBXCygYC2pb9be1tJTB",
  },
};

const Main = (props) => {
  const [draftOrders, setDraftOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectedToLit, setConnectedToLit] = useState(false);

  const [openCreateDraftOrderModal, setOpenCreateDraftOrderModal] =
    useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [unifiedAccessControlConditions, setUnifiedAccessControlConditions] =
    useState(null);
  const [permanent, setPermanent] = useState(true);
  const [hideInstructions, setHideInstructions] = useState(true);

  const [
    humanizedAccessControlConditions,
    setHumanizedAccessControlConditions,
  ] = useState(null);

  // console.log('document', document)

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

  const humanizeAccessControlConditions = async (
    unifiedAccessControlConditions
  ) => {
    console.log(
      "check in humanizedAccessControlConditions",
      unifiedAccessControlConditions
    );
    return LitJsSdk.humanizeAccessControlConditions({
      unifiedAccessControlConditions: unifiedAccessControlConditions,
    });
  };

  const addAccessControlConditions = async (acc) => {
    console.log("check acc before humanizedAcc", acc);
    const humanizedAcc = await humanizeAccessControlConditions(acc);
    console.log("humanizedAcc", humanizedAcc);
    setUnifiedAccessControlConditions(acc);
    setHumanizedAccessControlConditions(humanizedAcc);
  };

  const sendDraftOrderToDb = async (draftOrderObj) => {
    console.log("draftOrderObj", draftOrderObj);

    const chainArray = draftOrderObj.extra_data.split(",");
    let authSigs = {};
    chainArray.forEach((c) => {
      if (c === "evmBasic") {
        authSigs["ethereum"] = storedAuthSigs["evmBasic"];
      } else if (c === "solRpc") {
        authSigs["solana"] = storedAuthSigs["solRpc"];
      }
    });

    try {
      setOpenShareModal(false);
      setOpenCreateDraftOrderModal(false);

      const resp = await saveDraftOrder(draftOrderObj);
      const resourceId = {
        baseUrl: `${process.env.LIT_PROTOCOL_OAUTH_API_HOST}`,
        path: "/shopify/l/" + resp.data,
        orgId: "",
        role: "customer",
        extraData: "",
      };

      const signedTokenObj = {
        unifiedAccessControlConditions: unifiedAccessControlConditions,
        authSig: authSigs,
        resourceId,
      };

      console.log("check signedTokenObj", signedTokenObj);

      litNodeClient.saveSigningCondition({
        ...signedTokenObj,
      });

      setUnifiedAccessControlConditions(null);
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
    console.log("start of toggleGetAllDraftOrders");
    setLoading(true);
    try {
      const allDraftOrders = await getAllUserDraftOrders(props.shopInfo.shopId);
      setDraftOrders(allDraftOrders.data);
      console.log("allDraftOrders", allDraftOrders);
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
          <Layout.Section>
            <UpdateList />
          </Layout.Section>
        </Layout>
      )}
      <div>
        <CreateDraftOrderModal
          shopId={props.shopInfo.shopId}
          open={openCreateDraftOrderModal}
          setOpenCreateDraftOrderModal={setOpenCreateDraftOrderModal}
          handleCreateAccessControl={handleCreateAccessControl}
          unifiedAccessControlConditions={unifiedAccessControlConditions}
          setUnifiedAccessControlConditions={setUnifiedAccessControlConditions}
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
          <div className={"lit-share-modal-overlay"}>
            <div className={"lit-share-modal"}>
              <ShareModal
                className={"share-modal"}
                onClose={() => {
                  setOpenShareModal(false);
                  setPermanent(true);
                  setOpenCreateDraftOrderModal(true);
                }}
                onUnifiedAccessControlConditionsSelected={async (
                  restriction
                ) => {
                  await addAccessControlConditions(
                    restriction.unifiedAccessControlConditions
                  );
                  await setPermanent(restriction.permanent);
                  setOpenShareModal(false);
                  setOpenCreateDraftOrderModal(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
