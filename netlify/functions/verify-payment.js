const crypto = require('crypto');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        // Mapping incoming data to the exact variables requested
        const order_id = data.razorpay_order_id;
        const razorpay_payment_id = data.razorpay_payment_id;
        const razorpay_signature = data.razorpay_signature;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        // EXACT LOGIC REQUESTED:
        // generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature == razorpay_signature) {
            // payment is successful
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'verified', message: 'Payment verified successfully' }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ status: 'invalid', message: 'Signature verification failed' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
