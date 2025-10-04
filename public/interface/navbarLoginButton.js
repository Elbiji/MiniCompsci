import { checkAuth, requireAuth, signOut } from "../util/auth.js";

export async function loginButton() {
    const loginBtn = document.getElementById('login-btn')
    const session = await checkAuth()
    if (!session) {
        loginBtn.textContent = "Sign in"
        loginBtn.className = "border-[1px] bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer  py-2 px-4 rounded-lg font-normal"
        loginBtn.addEventListener('click', requireAuth) 
    } else {
        loginBtn.textContent = "Logout"
        loginBtn.className = "border-[1px] bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer  py-2 px-4 rounded-lg font-normal"
        loginBtn.addEventListener('click', signOut) 
    }
}