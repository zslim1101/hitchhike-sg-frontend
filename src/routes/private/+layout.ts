import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({parent}) => {
    const { user } = await parent()
if (!user){
    redirect(300,'/')
}

    return {};
}) satisfies LayoutLoad;