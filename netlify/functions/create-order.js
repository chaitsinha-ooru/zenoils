const Razorpay = require('razorpay');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { amount, receipt, notes } = JSON.parse(event.body);

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: receipt || `receipt#${Math.floor(Math.random() * 1000)}`,
            notes: notes || {}
        };

        const order = await instance.orders.create(options);

        return {
            statusCode: 200,
            body: JSON.stringify(order),
        };
    } catch (error) {
        console.error('Razorpay Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
