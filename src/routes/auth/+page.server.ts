import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;
		const tg_username = formData.get('tg_username') as string;

		if (!email || !password || !name) {
			return { success: false };
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
					phone,
					tg_username
				},
				emailRedirectTo: 'https://www.carpool.asia/auth/confirm'
			}
		});
		if (error) {
			if (error.message.includes('User already registered')) {
				return { success: false, user_exists: 'User already exists' };
			}

			return { success: false, error_message: 'Fail to create' };
		} else {
			return { success: true };
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.log(error.message);
			if (error.message.includes('Invalid login credentials')) {
				return fail(400, { email, invalid_login: 'Invalid login credentials' });
			}
			if (error.message === 'Email not confirmed') {
				return fail(400, { email, email_not_verified: 'Email not verified' });
			}

			return { success: false, error_message: 'Fail to Login' };
		} else {
			redirect(303, '/private');
		}
	}
};
