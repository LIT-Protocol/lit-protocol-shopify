import React, { useEffect, useState } from "react";
import LitJsSdk from "lit-js-sdk";
import { Spinner, Button, Stack, Card } from "@shopify/polaris";
import CreateDraftOrderModal from "../createDraftOrderModal/CreateDraftOrderModal";
import styles from "./main.module.scss";
import DraftOrderTable from "../draftOrderTable/DraftOrderTable";
import {
  saveDraftOrder,
  getAllUserDraftOrders,
  deleteDraftOrder,
} from "../../../server/apiCalls";
import { ShareModal } from "../../../shareModal";

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

  const [
    humanizedAccessControlConditions,
    setHumanizedAccessControlConditions,
  ] = useState(null);

  document.addEventListener(
    "lit-ready",
    function (e) {
      console.log("Lit client ready");
    },
    false
  );

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

  const addAccessControlConditions = async (accessControlCondition) => {
    const humanizedAcc = await humanizeAccessControlConditions(
      accessControlCondition
    );
    setAccessControlConditions(accessControlCondition);
    setHumanizedAccessControlConditions(humanizedAcc);
  };

  const sendDraftOrderToDb = async (draftOrderObj) => {
    try {
      setOpenShareModal(false);
      setOpenCreateDraftOrderModal(false);

      const resp = await saveDraftOrder(draftOrderObj);
      const resourceId = {
        // baseUrl: "https://oauth-app-dev.litgateway.com",
        baseUrl: "https://oauth-app.litgateway.com",
        path: "/shopify/l/" + resp.data,
        orgId: "",
        role: "customer",
        extraData: "",
      };

      const chain = accessControlConditions[0].chain;

      litNodeClient.saveSigningCondition({
        accessControlConditions: accessControlConditions,
        chain,
        authSig: spoofAuthSig,
        resourceId,
      });

      setAccessControlConditions(null);
      setHumanizedAccessControlConditions(null);
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
    console.log("Draft orders kick off", props.shopInfo);
    setLoading(true);
    try {
      const allDraftOrders = await getAllUserDraftOrders(props.shopInfo.shopId);
      setDraftOrders(allDraftOrders.data);
      console.log('CHECK DRAFT ORDERS', allDraftOrders.data)
      setLoading(false);
    } catch (err) {
      console.error("Error getting draft orders:", err);
      setLoading(false);
    }
  };

  return (
    <div>
      Test render
      {!!loading || draftOrders === null ? (
        <span className={styles.centerSpinner}>
          Loading...
          <Spinner size="large" />
        </span>
      ) : (
        <div>
          {!!draftOrders.length && (
            <span>
              <DraftOrderTable
                draftOrders={draftOrders}
                handleDeleteDraftOrder={handleDeleteDraftOrder}
              />
            </span>
          )}
          {draftOrders.length < 5 || !draftOrders && (
            <div className={styles.createDraftOrderContainer}>
              <Button
                className={styles.createDraftOrderButton}
                onClick={() => setOpenCreateDraftOrderModal(true)}
              >
                Create Token Access
              </Button>
            </div>
          )}
        </div>
      )}
      <div>
        <CreateDraftOrderModal
          shopId={props.shopInfo.shopId}
          open={openCreateDraftOrderModal}
          setOpenCreateDraftOrderModal={setOpenCreateDraftOrderModal}
          handleCreateAccessControl={handleCreateAccessControl}
          accessControlConditions={accessControlConditions}
          setAccessControlConditions={setAccessControlConditions}
          humanizedAccessControlConditions={humanizedAccessControlConditions}
          setHumanizedAccessControlConditions={
            setHumanizedAccessControlConditions
          }
          sendDraftOrderToDb={sendDraftOrderToDb}
          shopInfo={props.shopInfo}
        />
        {openShareModal && (
          <ShareModal
            showStep="ableToAccess"
            className={"share-modal"}
            show={false}
            onClose={() => {
              setOpenShareModal(false);
              setOpenCreateDraftOrderModal(true);
            }}
            sharingItems={[]}
            onAccessControlConditionsSelected={async (restriction) => {
              await addAccessControlConditions(restriction);
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
