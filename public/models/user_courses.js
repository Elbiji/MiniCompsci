import supabase from "../util/supabaseClient.js";
import { getCurrentUser } from "../util/auth.js";

export async function registerUser(course_id){
    const user = await getCurrentUser()
    console.log(user)
    
    if (user){
        const { error } = await supabase.from('user_courses').insert([{ 
            user_id: user.id,
            course_id: course_id,
            status: false
        }])

        if (error) {
            console.log(error.message)
            throw error
        }
    }
}

export async function checkUser(course_id){
    const user = await getCurrentUser()

    if (user){
        const { data, error } = await supabase
        .from('user_courses')
        .select()
        .eq('user_id', user.id)
        .eq('course_id', course_id)

        if (error){
            throw error
        }

        return data.length > 0 ? data[0] : null
    }
}