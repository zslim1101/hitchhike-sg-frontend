import {
	PRIVATE_OTP_SERVICE_SID,
	PRIVATE_TWILIO_ACCOUNT_SID,
	PRIVATE_TWILIO_AUTH_TOKEN
} from '$env/static/private';
import type { RequestHandler } from './$types';
import twilio from 'twilio';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { phone_number } = await request.json();

		const accountSid = PRIVATE_TWILIO_ACCOUNT_SID;
		const authToken = PRIVATE_TWILIO_AUTH_TOKEN;
		const client = twilio(accountSid, authToken);

		const verification = await client.verify.v2
			.services(PRIVATE_OTP_SERVICE_SID)
			.verifications.create({
				channel: 'sms',
				to: phone_number
			});

		return new Response(JSON.stringify(verification), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		// Return an error response if sending the email failed
		return new Response(
			JSON.stringify({
				message: 'Failed to send email',
				error: error
			}),
			{ status: 500 }
		);
	}
};
