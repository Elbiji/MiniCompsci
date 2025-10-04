import supabase from "../util/supabaseClient.js";

export async function createUser(data) {
    console.log('Full data:', data);
    console.log('User:', data.user);
    console.log('User ID:', data.user?.id);
    if (data) {
        const { error } = await supabase.from('user_stats').insert([{ id: data.user.id }])

        if (error) {
            throw error.message
        }
    }
}