import { Router } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const stripeRoute = Router()

stripeRoute.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: 'price_1PRzNRP70EJWhTEsOxBTNnoq',
                    quantity: 1,
                },
            ],
            success_url: `${process.env.SERVER_URL}/stripe/success`,
            cancel_url: `${process.env.SERVER_URL}/stripe/cancel`,
        })
        return res.json({ url: session.url })
    }
    catch (e) {
        //@ts-ignore
        res.status(500).json({ error: e.message })
    }
})


stripeRoute.get("/purchase-success", (req, res) => {
    res.redirect("https://frontend-builder--nutrition-tracks-f2141.us-central1.hosted.app/")
})

stripeRoute.get("/purchase-cancel", (req, res) => {
    res.send("Purchase-Unsuccessful")
})




