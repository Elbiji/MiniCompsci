import supabase from "./supabaseClient.js"

async function signInWithEmail(email, password) {
    const button = document.getElementById('signin-btn')
    button.disabled = true
    button.innerHTML = `<div class="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full mx-auto"></div>`

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
        })

        if (error) throw error 

        window.location.href = './index.html'
    } catch (error) {
        handleError(error.message)
    } finally {
        button.disabled = false
        button.textContent = 'Login'
    }
}

function signInHandler() {
    const signInButton = document.getElementById('signin-btn')

    signInButton.addEventListener('click', async () => {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        await signInWithEmail(email,password)
    })
}


function handleError(message) {
    const errorDiv = document.getElementById('error-message')
    errorDiv.className = "border-[2px] border-red-500 w-96 p-4 rounded-lg font-semibold text-red-500 bg-red-50 text-xs"
    errorDiv.textContent = message
    errorDiv.classList.remove('hidden')
}

signInHandler()