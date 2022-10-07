import React, { Fragment, useEffect, useState } from "react";
import {
  Modal, Stack, TextStyle, Layout, Button
} from "@shopify/polaris";
import { checkOnPrepopulateStatus } from "../../../helpers/apiCalls.js";
import './prepopulateStatus.css';
import { DateTime } from "luxon";

const PrepopulateStatus = ({
                             openPrepopulateStatus,
                             setOpenPrepopulateStatus,
                             currentEditedDraftOrder
                           }) => {

  const [ refreshTime, setRefreshTime ] = useState(null);
  const [ prepopulateStatus, setPrepopulateStatus ] = useState(null);
  const [ overallStatus, setOverallStatus ] = useState('loading');

  useEffect(() => {
    getPrepopulateStatus()
  }, [])

  const getPrepopulateStatus = async () => {
    setPrepopulateStatus(null);
    const currentTime = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS);
    setRefreshTime(currentTime);

    try {
      const prepopulateStatusHolder = await checkOnPrepopulateStatus(currentEditedDraftOrder.id);
      setOverallStatus(prepopulateStatusHolder.data.status);
      setPrepopulateStatus(prepopulateStatusHolder.data);
    } catch (err) {
      console.log('Error getting prepopulate data:', err);
    }
  }

  const getVariation = (status) => {
    if (status === 'complete') {
      return 'positive';
    } else if (status === 'error') {
      return 'negative';
    } else {
      return 'warning';
    }
  }

  return (
    <Modal
      large
      loading={!prepopulateStatus}
      open={openPrepopulateStatus}
      title={`Prepopulated Status: ${overallStatus}`}
      onClose={() => {
        setOpenPrepopulateStatus(false)
      }}
      primaryAction={{
        content: "Refresh",
        onAction: async () => {
          await getPrepopulateStatus();
        },
      }}
    >
      <Modal.Section>
        {prepopulateStatus && (
          <div>
            <span className={'prepopulate-status-title'}>List of Variants. Last checked at: {refreshTime}</span>
            {prepopulateStatus.individualStatus.map((s, i) => {
              return (
                <span key={i} className={'prepopulate-status-row'}>
                  <span style={{minWidth: '35%'}}>
                    <TextStyle variation={'strong'}>{s.displayName}</TextStyle>
                  </span>
                  <span style={{width: '15%'}}>
                    <TextStyle
                      variation={getVariation(s.variantStatus)}>Status: {s.variantStatus}</TextStyle>
                  </span>
                  <span style={{width: '25%'}}>
                    <TextStyle>Number of draft
                      orders made: {s.currentLength} of {s.length}</TextStyle>
                  </span>
                  <span style={{width: '25%'}}>
                    <TextStyle>Number of draft orders
                    redeemed: {s.used} ({(s.used / s.length) * 100}%)</TextStyle>
                  </span>
                </span>
              )
            })}
            {prepopulateStatus.status === 'incomplete' && prepopulateStatus.errors && prepopulateStatus.errors.length && (
              <div>
                {prepopulateStatus.errors.map((e, i) => {
                  return (
                    <TextStyle key={`error-${i}`} variation={'negative'}>{i} - {e}</TextStyle>
                  )
                })}
                <Button>Clear errors and try again.</Button>
              </div>
            )}
          </div>
        )}
      </Modal.Section>
    </Modal>
  )
}

export default PrepopulateStatus;
