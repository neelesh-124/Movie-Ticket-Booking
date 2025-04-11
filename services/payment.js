// for Integrating Stripe Payment
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_NODE_KEY);
//

async function handlePayment(req, res) {
  const { product, token } = req.body;

  const idempotencyKey = uuidv4();
  // this key help prevent charging the same user twice

  return await stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email, // this sends a email upon successful completion of payment
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
}

export { handlePayment };
