import supabase from "./supabaseClient.js"
import { createUser } from "../models/user_stats.js"

async function signUpNewUser(email , password) {
    const button = document.getElementById('signup-btn')
    button.disabled = true 
    button.innerHTML = `<div class="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full mx-auto"></div>`

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
            // emailRedirectTo: 'https://mini-compsci.vercel.app/index.html',
            },
        })

        if (error) throw error
        
        try {
            await createUser(data)
        } catch (error) {
            handleError(error.message)
        }

        window.location.href = './index.html'
    } catch (error) {
        handleError(error.message)
    } finally {
        button.disabled = false
        button.textContent = 'Create'
    }
}

function signUpHandler() {
    const signUpButton = document.getElementById('signup-btn')
    
    signUpButton.addEventListener('click', async () => {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        await signUpNewUser(email,password)
    })
}

function handleError(message) {
    const errorDiv = document.getElementById('error-message')
    errorDiv.className = "border-[2px] border-red-500 w-96 p-4 rounded-lg font-semibold text-red-500 bg-red-50 text-xs"
    errorDiv.textContent = message
    errorDiv.classList.remove('hidden')
}

signUpHandler()
