import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({parent, params}) => {
    const {supabase,user} = await parent()
    const { chatroom_id } = params;
    const user_id = user?.id; // Assuming the logged-in user's id is stored here
  
    if (!user_id) {
      throw error(401, 'User must be logged in');
    }
  
    // Check if the user is part of the chatroom
    const {data:member} = await supabase.from('chatroom_members')
      .select('*')
      .eq('chatroom_id',params.chatroom_id)
      .eq('user_id',user_id)
  
    if (!member) {
      throw error(403, 'You are not a member of this chatroom');
    }
  
    // Fetch the messages of the current chatroom
    const {data:messages} = await supabase.from('messages')
      .select('*')
      .eq('chatroom_id',params.chatroom_id)

      const {data:chatroom_info} = await supabase.from('chatrooms')
      .select('*')
      .eq('id',params.chatroom_id).single()
  
    return { messages, chatroom_id,chatroom_info };
}) satisfies PageLoad;