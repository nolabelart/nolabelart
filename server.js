import express from "express";
import Stripe from "stripe";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe("process.env.STRIPE_SECRET");

app.post("/create-checkout", async (req, res) => {
  const { cart } = req.body;

  const line_items = cart.map(item => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name + " (" + item.size + ")"
      },
      unit_amount: item.price * 100
    },
    quantity: item.qty
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    
success_url: "https://nolabelart1.vercel.app/success",
cancel_url: "https://nolabelart1.vercel.app/"

  });

  res.json({ url: session.url });
});

app.listen(3001, () => console.log("Server running on 3001"));
