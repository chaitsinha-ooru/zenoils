const crypto = require('crypto');

exports.handler = async (event, context) => {
    // 1. Only allow POST requests from Razorpay
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = event.headers['x-razorpay-signature'];

    // 2. Verify Webhook Signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(event.body);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
        console.error('Invalid Webhook Signature');
        return { statusCode: 400, body: 'Invalid Signature' };
    }

    // 3. Process the Event
    const payload = JSON.parse(event.body);
    const eventType = payload.event;

    console.log('Razorpay Webhook Received:', eventType);

    if (eventType === 'payment.captured') {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;

        // Here you can add logic to update your database or send a secondary email alert.
        // Since this runs on the server, you could use a service like SendGrid or Mailgun
        // to send yourself a notification that says: "Payment for Order X was successful!"

        console.log(`Payment captured for Order: ${orderId}`);
    }

    // 4. Always respond with 200 to Razorpay
    return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok' })
    };
};
