import { modules } from "../public/interface/constant/modules.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://zqhqdommdaqthfopkhnw.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxaHFkb21tZGFxdGhmb3BraG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTYxOTcsImV4cCI6MjA3NTAzMjE5N30.QVqcwVqyblYMmfw_0AEyNdF7j-vNT5NDK-BPCsKr5Fo")

async function seedingCourses() {
    for (const courses of modules) {

        const {data, error} = await supabase.from('courses').insert([{
            id: courses.id,
            title: courses.title,
            description: courses.description
        }])

        if (error) {
            throw error
        }
    }
}

seedingCourses()