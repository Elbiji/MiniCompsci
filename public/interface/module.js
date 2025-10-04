import { modules as md } from "./constant/modules.js";
import { requireAuth } from "../../src/util/auth.js";
import { loginButton } from "./navbarLoginButton.js";
import { checkUser, registerUser } from "../../src/models/user_courses.js";

const moduleContainer = document.getElementById('moduleContainer')

async function handleModule(){
    md.forEach((module) => {
        moduleContainer.innerHTML += `
         <div class="module-card flex-col rounded-2xl border-[1px] p-4 relative overflow-hidden shadow-sm hover:translate-y-[-5px] cursor-pointer transition-all duration-300 bg-gradient-to-br from-white to-gray-100/50" data-href=${module.href} data-id=${module.id}>
            <div class="flex flex-col space-y-6 justify-between h-[200px]">
                <div>
                        ${module.topic}
                    </p>
                    <h1 class="font-semibold">
                        ${module.title}
                    </h1>
                    <p class="text-sm mt-2 font-normal text-gray-600">
                        ${module.description}
                    </p>
                </div>
                <div class="flex">
                    <div class="p-2 border-[1px] px-4 rounded-lg bg-white">
                        <p class="font-semibold text-sm">
                        ${module.difficulty}
                    </p>
                    </div>
                    <p>
                </div>
            </div>
         </div>
        `
    })

    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', async () => {
            const href = card.dataset.href
            const moduleId = card.dataset.id


            if (href && href !== '#') {
                try {
                    const enrolled = await checkUser(moduleId)

                    if (!enrolled){
                        console.log('User is not enrolled')
                        console.log('Enrolling user in course:', moduleId)                        
                        await registerUser(moduleId)
                        console.log('User enrolled succesfully')
                    }

                    window.location.href = href
                } catch (error) {
                    console.log('Enrolling user in course:', moduleId)
                    window.location.href = href                    
                }
            } else {
                const moduleId = card.dataset.id
                alert(`${moduleId} module coming soon!`);
            }
        })
    })
}

document.addEventListener('DOMContentLoaded', requireAuth)
document.addEventListener('DOMContentLoaded', loginButton)
handleModule()

