import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase, user } = await parent();
	const { data: past_trips } = await supabase
		.from('past_trips')
		.select(
			'*,trips!inner(*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*))'
		)
		.eq('user_id', user?.id)
		.order('created_at', { ascending: false });
	return { past_trips };
}) satisfies PageLoad;
