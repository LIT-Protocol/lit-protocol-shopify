const litContainer = document.getElementById("lit-promotional-container");

const forwardToLitPromotion = () => {
  window.open(
    // `http://localhost:4000/shopify?shop=${window.Shopify["shop"]}&productId=${window.ShopifyAnalytics?.meta?.product["gid"]}`
    `https://oauth-app.litgateway.com/shopify?shop=${window.Shopify["shop"]}&productId=${window.ShopifyAnalytics?.meta?.product["gid"]}`
  );
};
