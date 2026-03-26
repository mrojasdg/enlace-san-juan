import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente público (browser/server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente admin (server-side únicamente)
// Solo se debe usar en API routes o Server Actions donde se use SERVICE_ROLE_KEY
export const createAdminClient = () => {
    return createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}
