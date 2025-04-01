import type { PageLoad } from './$types';

export const load = (async ({ parent, depends }) => {
	depends('trips:all-trips');
	const { supabase, user } = await parent();

	const { data: my_trips } = await supabase
		.from('trips')
		.select(
			'*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)'
		)
		.eq('created_by', user.id)
		.not('status', 'eq', 'closed');
	const { data: trips } = await supabase
		.from('trips')
		.select(
			'*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)'
		)
		.not('created_by', 'eq', user.id)
		.not('status', 'eq', 'closed');

	const { data: joined_trips, error: error_joined_trips } = await supabase
		.from('trip_passengers')
		.select('*,trips!inner(*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*))')
		.eq('user_id', user?.id)
		.not('trips.status', 'eq', 'closed');


		const { data: messages } = await supabase
		.from('messages_lobby')
		.select('*')
		.range(0,10)
		.order('created_at', { ascending: true })

		const { data: online_users } = await supabase
		.from('online_users')
		.select('*')

	return {
		my_trips: my_trips?.filter((trip) => new Date(trip.departure_time) > new Date()),
		trips: trips?.filter((trip) => new Date(trip.departure_time) > new Date()),
		joined_trips,
		messages,
		online_users
	};
}) satisfies PageLoad;
