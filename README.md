# Kalatori-frontend
Collection of frontends for Kalatori Substrate-based web shop. Example demo deployments should be running (normally, this is low-budget demo, not some high availability setup) for all models, see links below. The demo deployments use the newer backend version and thus have more features but are also not stable. To place an "order", use Alice's account in any Substrate-compatible wallet:

`bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice`

# OpenCart v4

The first original attempt to create DOT store. This is currently used in production in https://kampe.la webstore, so no special demo. Choosing this as prototyping tool was a mistake in hindsight, as most of community plugins and other goodies were developed for not forward-compatible (intentionally it seems) OpenCart3.

# OpenCart v3

Implementation of the same plugin as in OpenCart4, but better and has more features.

[demo deployment](https://opencart3.zymologia.fi)

# PrestaShop

Minimalistic and neat store front.

[demo deployment](https://dev-prestashop.zymologia.fi)

Instructions:

# How to install plugin to OpenCart3 ?

![1. In /admin go to Extensions-Installer and Upload polkadot.opencart3.ocmod.zip](/images/01 ADMIN go Extensions-Installer-Upload.webp)
![2. Go to  Extensions-Extensions, select Payments](/images/02 ADMIN go Extensions-Payments.webp)
![3. Find Polkadot, press EDIT button](/images/03 ADMIN go Polkadot-EDIT.webp)
![4. Check Settins, press SAVE. Done!](/images/04 ADMIN settings press SAVE.webp)

# How to pay with Polkadot?

![1. Checkout, use method "Polkadot payment", select your wallet](/images/05 Seelect_wallet.webp)
![2. Sign the transaction](/images/06 Sign transaction.webp)
![3. Wait about 20-40 seconds, watch a prosess bar below screen](/images/07 Processbar 74 percents.webp)
![4. Debug info: Finalized](/images/08 Finalized debug info.webp)
![5. Done! Your order was placed!](/images/09 Order placed.webp)

