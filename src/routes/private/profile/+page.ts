import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase, user } = await parent();

	const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();

	const { data: reviews, error } = await supabase
		.from('user_reviews')
		.select('*,profiles!user_reviews_created_by_fkey!inner(*)')
		.eq('review_for', user?.id);

	console.log(error);

	return { profile, reviews };
}) satisfies PageLoad;
