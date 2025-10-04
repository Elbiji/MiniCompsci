import supabase from "./supabaseClient.js";

export async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

export async function requireAuth() {
    const session = await checkAuth()
    console.log(session)
    if (!session) {
        window.location.href = './login.html'
        return null
    }
    return session
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  location.reload()
}

export async function redirect() {
    const session = await checkAuth()
    if (session) {
        window.location.href = './index.html'
    }
}

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
        console.error('Auth error:', error.message)
        return null
    }
    
    return data.user 
}