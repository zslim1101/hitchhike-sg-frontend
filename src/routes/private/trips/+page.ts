import type { PageLoad } from './$types';

export const load = (async ({ parent, depends }) => {
	depends('trips:all-trips');
	const { supabase, user } = await parent();

	const { data: my_trips } = await supabase
		.from('trips')
		.select(
			'*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)'
		)
		.eq('created_by', user.id);
	const { data: trips } = await supabase
		.from('trips')
		.select(
			'*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)'
		)
		.not('created_by', 'eq', user.id);

	const { data: joined_trips } = await supabase
		.from('trip_passengers')
		.select('*')
		.eq('user_id', user?.id)
		.maybeSingle();

	return {
		my_trips: my_trips?.filter((trip) => new Date(trip.departure_time) > new Date()),
		trips: trips?.filter((trip) => new Date(trip.departure_time) > new Date()),
		joined_trips
	};
}) satisfies PageLoad;
