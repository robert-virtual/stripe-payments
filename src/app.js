require("dotenv").config();
const cors = require("cors");
const express = require("express");
const Stripe = require("stripe");
const app = express();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);
const port = process.env.PORT || 3000;
// console.log(stripe.checkout.sessions.create);
//middlewares
app.use(cors());
app.use(express.json());
// 10,000 cents = 100 dollars
// 5,000 = 50
// 2,500 = 25
const storedItems = [
  {
    id: 1,
    priceInCents: 500,
    name: "Cable usb",
  },
  {
    id: 2,
    priceInCents: 2500,
    name: "Mouse ergonimico",
  },
];

app.post("/checkout", async (req, res) => {
  let { items } = req.body;

  try {
    let found;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map(({ id, quantity }) => {
        found = storedItems.find((e) => e.id == id);
        return {
          price_data: {
            unit_amount: found.priceInCents,
            currency: "usd",
            product_data: {
              name: found.name,
            },
          },
          quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
