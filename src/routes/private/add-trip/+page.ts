import type { PageLoad } from './$types';

export const load = (async ({parent}) => {
    const { supabase} = await parent()
    const {data:locations} = await supabase.from('locations').select('*')
    return {locations};
}) satisfies PageLoad;