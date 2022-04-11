import React, { useEffect, useState } from "react";
import {
  Card,
  IndexTable,
  TextStyle,
  Button,
  Modal,
  TextContainer,
} from "@shopify/polaris";
// import styles from "./draft-order-table.module.scss";

const DraftOrderTable = (props) => {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [currentEditedDraftOrder, setCurrentEditedDraftOrder] = useState(false);
  const [draftOrders, setDraftOrders] = useState([]);

  useEffect(() => {
    if (!!props.draftOrders) {
      const mappedDraftOrders = props.draftOrders.map((d) => {
        const mappedDraftOrder = d;
        mappedDraftOrder["draftOrderDetailsObj"] = JSON.parse(
          d.draftOrderDetails
        );
        return mappedDraftOrder;
      });
      setDraftOrders(mappedDraftOrders);
    }
  }, [props.draftOrders]);

  const resourceName = {
    singular: "draft order",
    plural: "draft orders",
  };

  return (
    <div>
      <Card className={"draftOrders-table-container"}>
        <IndexTable
          selectable={false}
          resourceName={resourceName}
          itemCount={!props.draftOrders ? 0 : props.draftOrders.length}
          headings={[
            { title: "Title" },
            { title: "Summary" },
            { title: "Access Control Conditions" },
            { title: "Chain" },
            { title: "Actions" },
          ]}
        >
          {draftOrders &&
            draftOrders.map((draftOrder, index) => (
              <IndexTable.Row id={index} key={index} position={index}>
                <IndexTable.Cell>
                  <TextStyle variation="strong">{draftOrder.title}</TextStyle>
                </IndexTable.Cell>
                {/*<IndexTable.Cell><strong>{draftOrder.summary[0]}%</strong>off of<strong>${draftOrder.summary[1]}</strong></IndexTable.Cell>*/}
                <IndexTable.Cell>{draftOrder.summary}</IndexTable.Cell>
                <IndexTable.Cell>
                  <span>
                    <strong>
                      {!!draftOrder.accessControlConditions ? (
                        <p>{draftOrder.humanizedAccessControlConditions}</p>
                      ) : (
                        <p>No access control conditions</p>
                      )}
                    </strong>
                  </span>
                </IndexTable.Cell>
                <IndexTable.Cell>{draftOrder.extraData}</IndexTable.Cell>
                <IndexTable.Cell>
                  <Button
                    outline
                    onClick={() => {
                      setCurrentEditedDraftOrder(draftOrder);
                      setOpenDeleteConfirmation(true);
                    }}
                  >
                    Delete Token Access
                  </Button>
                </IndexTable.Cell>
              </IndexTable.Row>
            ))}
        </IndexTable>
      </Card>
      {openDeleteConfirmation && (
        // <div style={{ height: "500px" }}>
        // <div>
        <Modal
          open={openDeleteConfirmation}
          title="Are you sure you want to delete this draft order?"
          onClose={() => setOpenDeleteConfirmation(false)}
          primaryAction={{
            content: "Yes, delete",
            onAction: () => {
              props.handleDeleteDraftOrder(currentEditedDraftOrder);
              setOpenDeleteConfirmation(false);
            },
          }}
          secondaryActions={[
            {
              content: "No, do not delete",
              onAction: () => setOpenDeleteConfirmation(false),
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                You are about to delete the promotion{" "}
                <strong>{currentEditedDraftOrder.title}.</strong>
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
        // </div>
      )}
    </div>
  );
};

export default DraftOrderTable;
