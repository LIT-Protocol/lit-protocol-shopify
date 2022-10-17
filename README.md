This is the source code for the Lit Token Access Shopify app.

As of Oct 10th, 2022, Lit Token Access has been open sourced. The hope is this becomes a community supported, free, and
transparent alternative for token gating on Shopify.

We hope this will become a living project, and will continue to actively maintain the repo to that end. This includes
answering questions, providing support wherever we can, and reviewing PRs if anyone wishes to contribute additional
features.

This repo is the Shopify app itself, along with the theme app extension that allows interaction
within the storefront. There are two other parts to the full thing, the first of which is the product select
screen, available [here](https://github.com/LIT-Protocol/lit-oauth/tree/main/src/pages/shopify), and the backend
that interacts with the database, available [here](https://github.com/LIT-Protocol/lit-oauth/tree/main/server/oauth).

Feel free to reach out with any questions to LitTokenAccessSupport@litprotocol.com

MIT License.

---

## Original Shopify Readme

# Shopify App Node

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://travis-ci.com/Shopify/shopify-app-node.svg?branch=master)](https://travis-ci.com/Shopify/shopify-app-node)

Boilerplate to create an embedded Shopify app made with Node, [Next.js](https://nextjs.org/)
, [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth)
, [Polaris](https://github.com/Shopify/polaris-react),
and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).

## Installation

Using the [Shopify CLI](https://github.com/Shopify/shopify-cli) run:

```
~/ $ shopify app create node -n APP_NAME
```

Or, fork and clone repo

## Requirements

- If you don’t have one, [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have
  one, [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store)
  where you can install and test your app.
- In the Partner
  dashboard, [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app).
  You’ll need this app’s API credentials during the setup process.

## Usage

This repository is used by [Shopify CLI](https://github.com/Shopify/shopify-cli) as a scaffold for Node apps. You can
clone or fork it yourself, but it’s faster and easier to use Shopify App CLI, which handles additional routine
development tasks for you.

## License

This repository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
