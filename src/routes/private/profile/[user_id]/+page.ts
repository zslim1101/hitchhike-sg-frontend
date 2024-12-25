import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { supabase } = await parent();

	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', params.user_id)
		.single();

	const { data: reviews } = await supabase
		.from('user_reviews')
		.select('*,profiles!user_reviews_created_by_fkey!inner(*)')
		.eq('review_for', params.user_id);
	return { profile, reviews };
}) satisfies PageLoad;
