import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const tg_username = formData.get('tg_username') as string

    const { error } = await supabase.auth.signUp({ email, password, options:{data:{
      name,
        phone,
        tg_username
    }} })
    if (error) {
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/private')
    }
  },
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/private')
    }
  },
}