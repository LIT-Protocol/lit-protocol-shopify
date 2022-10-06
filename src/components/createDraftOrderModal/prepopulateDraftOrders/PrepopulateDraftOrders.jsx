import React, { Fragment, useEffect, useState } from "react";
import { Checkbox, Icon, Tooltip, TextContainer, Heading, TextStyle, TextField } from "@shopify/polaris";
import {
  CircleInformationMajor
} from '@shopify/polaris-icons';

const prepopulateText = `Selecting pre-populate allows the creation of a specific number of draft orders, as directed by the merchant, each containing a single variant of the chosen product.
This is useful if releases are expected to get high volumes of traffic in a short timeframe, but not recommended for casual selling as the number of draft orders created will not be alterable later.`

let localPrepopulateObject = null;

function PrepopulateDraftOrders({
                                  draftOrderProducts,
                                  allowPrepopulate,
                                  setAllowPrepopulate,
                                  setProductDetails,
                                  setPrepopulateData,
                                  unifiedAccessControlConditions,
                                  disabled
                                }) {

  useEffect(() => {
    localPrepopulateObject = null;
    if (draftOrderProducts && draftOrderProducts.length === 1) {
      sortPrepopulateObj(draftOrderProducts);
    }
  }, [ draftOrderProducts, allowPrepopulate ]);

  const sortPrepopulateObj = (products) => {
    localPrepopulateObject = {};
    console.log('draftOrderProducts', products)
    products.forEach(product => {
      product.variants.forEach(variant => {
        if (variant.inventoryManagement === 'SHOPIFY' && variant.inventoryQuantity === 0 && variant.inventoryPolicy === 'DENY') {

        } else {
          const variantId = variant.id.split('/').pop();
          localPrepopulateObject[variantId] = {
            draftOrderUrls: [],
            numberOfOrders: 1,
            title: variant.title,
            status: 'inprogress'
          }
        }
      })
    })
    let prepopulateHolder = JSON.parse(JSON.stringify(localPrepopulateObject));
    updatePrepopulateObj(prepopulateHolder);
  }

  const updatePrepopulateValue = (value, variantId) => {
    localPrepopulateObject[variantId].numberOfOrders = value;
    let prepopulateHolder = JSON.parse(JSON.stringify(localPrepopulateObject));
    updatePrepopulateObj(prepopulateHolder)
    console.log('localPrepopulateObject', localPrepopulateObject)
  }

  const updatePrepopulateObj = (prepopulateHolder) => {
    setPrepopulateData(prepopulateHolder);
    setProductDetails(draftOrderProducts);
  }

  return (
    <Fragment>
      {unifiedAccessControlConditions?.length && (
        <Fragment>
          <div style={{borderTop: '1px solid #777', paddingTop: '1em'}}>
            <span style={{margin: '0.5rem 0', display: 'flex', justifyContent: 'flex-start'}}>
              <p style={{'color': 'blue'}}>Pre-populate draft orders. <strong>Note:</strong> Can only create draft orders that contain a single variant. Cannot be used with redemption limit.</p>
              <span style={{marginLeft: '1em'}}>
                <Tooltip
                  content={prepopulateText}>
                  <Icon source={CircleInformationMajor}/>
                </Tooltip>
              </span>
            </span>
            <Checkbox
              label="Pre-populate draft orders"
              checked={allowPrepopulate}
              onChange={setAllowPrepopulate}
              disabled={disabled}
            />
            {allowPrepopulate && localPrepopulateObject !== null && (
              <div>
                {draftOrderProducts.map((product, i) => {
                  return (
                    <div key={i} style={{borderTop: '1px solid #777', marginTop: '1em', paddingTop: '1em'}}>
                      <TextContainer>
                        <Heading>Product title: {product.title}</Heading>
                      </TextContainer>
                      {product.variants.map((variant, j) => {
                        if (variant.inventoryManagement === 'SHOPIFY' && variant.inventoryQuantity === 0 && variant.inventoryPolicy === 'DENY') {
                          return (
                            <div key={`${i}-${j}`} style={{display: 'flex', flexDirection: 'column', marginTop: '1em'}}>
                              <TextStyle>Variant: <strong>{variant.title}</strong></TextStyle>
                              <TextStyle variation={'warning'}>Cannot create draft orders as this variant is out of
                                stock</TextStyle>
                            </div>
                          )
                        } else {
                          const variantId = variant.id.split('/').pop()
                          return (
                            <div key={`${i}-${j}`} style={{marginTop: '1em'}}>
                              <TextStyle>Variant: <strong>{variant.title}</strong></TextStyle>
                              <TextField helpText={'Number of draft orders to make'}
                                         value={localPrepopulateObject[variantId].numberOfOrders}
                                         type={'number'}
                                         onChange={(value) => updatePrepopulateValue(value, variantId)}/>
                            </div>
                          )
                        }
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default PrepopulateDraftOrders;
