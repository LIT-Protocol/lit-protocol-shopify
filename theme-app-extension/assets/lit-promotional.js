const litContainer = document.getElementById("lit-promotional-container");

const forwardToLitPromotion = () => {
  window.open(
    // `https://oauth-app-dev.litgateway.com/shopify?shop=${window.Shopify["shop"]}&productId=${window.ShopifyAnalytics?.meta?.product["gid"]}`
    `https://oauth-app.litgateway.com/shopify?shop=${window.Shopify["shop"]}&productId=${window.ShopifyAnalytics?.meta?.product["gid"]}`
  );
};
