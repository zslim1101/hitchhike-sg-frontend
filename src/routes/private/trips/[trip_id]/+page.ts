import type { PageLoad } from './$types';

export const load = (async ({ parent, params, depends }) => {
	depends('trips:single-trip');
	const { supabase, user } = await parent();

	let HAS_JOINED_TRIP = false;

	const { data: if_owns_trip } = await supabase
		.from('trips')
		.select('*')
		.eq('id', params.trip_id)
		.eq('created_by', user?.id)
		.single();

	if (if_owns_trip) {
		//do nothing
	} else {
		const { data: if_join_the_trip } = await supabase
			.from('trip_passengers')
			.select('*')
			.eq('trip_id', params.trip_id)
			.eq('user_id', user?.id)
			.single();
		if (if_join_the_trip) {
			//do nothing
			HAS_JOINED_TRIP = true;
		} else {
			// redirect(301, '/private/trips');
			HAS_JOINED_TRIP = false;
		}
	}

	const { data: my_trip } = await supabase
		.from('trips')
		.select(
			'*,trip_passengers(*),destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)'
		)
		.eq('id', params.trip_id)
		.single();

	const { data: messages } = await supabase
		.from('messages')
		.select('*')
		.eq('trip_id', params.trip_id)
		.order('created_at', { ascending: false });

	return { my_trip, messages, HAS_JOINED_TRIP };
}) satisfies PageLoad;
