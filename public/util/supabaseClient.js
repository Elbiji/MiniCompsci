import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js"


const supabase = createClient("https://zqhqdommdaqthfopkhnw.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxaHFkb21tZGFxdGhmb3BraG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTYxOTcsImV4cCI6MjA3NTAzMjE5N30.QVqcwVqyblYMmfw_0AEyNdF7j-vNT5NDK-BPCsKr5Fo")

console.log(supabase)
export default supabase