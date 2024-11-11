import type { PageLoad } from './$types';

export const load = (async ({parent}) => {
    const { supabase} = await parent()
    const {data:trips} = await supabase.from('trips').select('*,destination_location:locations!trips_destination_fkey!inner(*),pickup_location:locations!trips_pickup_point_fkey!inner(*)')
    return {trips};
}) satisfies PageLoad;