import type { PageLoad } from './$types';

export const load = (async ({parent,params}) => {
    const { supabase} = await parent()
    const {data:my_trip} = await supabase.from('trips').select('*,trip_passengers(*),destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)')
    .eq('id',params.trip_id).single()

    const {data:messages} = await supabase.from('messages')
      .select('*')
      .eq('trip_id',params.trip_id)

    return {my_trip,messages};
}) satisfies PageLoad;