require('dotenv').config()
const express = require('express');
var cors = require('cors');
const { allowedNodeEnvironmentFlags } = require('process');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

/**
 * Inbound request from Front End
 * includes payload 
 */
app.post('/checkout', async (req, res)=>{
    /**
     * req.body.items
     * [
     *  {
     *      id: 1, 
     *      quantity: 3
     *  }
     * ]
     * 
     * stripe wants
     * [
     *  {
     *      //our id property will get place in stripe's
     *      //price property
     *      price: 1, 
     *      quantity: 3
     *  }
     * ]
     */
    console.log(req.body);
    /**
     * Local array
     */
    const items = req.body.items;
    /**
     * Payload array
     */
    let lineItems = [];
    items.forEach((item)=>{

        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )

    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'
    })

    /**
     * Sends session to frontend so user can check out with stripe
     */
    res.send(JSON.stringify({
        url: session.url
    }));
})

app.listen(4000, () => console.log('Listining on port 4000'))