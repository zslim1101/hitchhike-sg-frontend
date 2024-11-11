import type { PageLoad } from './$types';

export const load = (async ({parent}) => {
    const { supabase} = await parent()
    const {data:trips,error} = await supabase.from('trips').select('*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)')
    console.log(error)
    return {trips};
}) satisfies PageLoad;