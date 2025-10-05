import { modules as md } from "./constant/modules.js";
import { getCurrentUser, requireAuth } from "../util/auth.js";
import { loginButton } from "./navbarLoginButton.js";
import { checkUser, registerUser } from "../models/user_courses.js";
import supabase from "../util/supabaseClient.js";

const moduleContainer = document.getElementById('moduleContainer')

async function getUserQuizScores() {
    try {
        const {data: {session}} = await supabase.auth.getSession()

        const response = await fetch("https://zqhqdommdaqthfopkhnw.supabase.co/functions/v1/user_quizes", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${session.access_token}` 
            }
        });

        if (!response.ok) {
            throw new Error(`TTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log(result)
        const scoresMap = {}
        result.data.forEach(quiz => {
            scoresMap[quiz.course_id] = quiz.quiz_score
        })
        return scoresMap
    } catch (error) {
        console.log('Error fetching quiz scores:', error)
        return {}
    }
}

async function handleModule(){
    const userScores = await getUserQuizScores()

    md.forEach((module) => {
        const userScore = userScores[module.id] || null

        moduleContainer.innerHTML += `
         <div class="module-card flex-col rounded-2xl border-[1px] p-4 relative overflow-hidden shadow-sm hover:translate-y-[-5px] cursor-pointer transition-all duration-300 bg-gradient-to-br from-white to-gray-100/50 hover:shadow-2xl hover:shadow-amber-600/20" data-href=${module.href} data-id=${module.id}>
            <div class="flex flex-col justify-between h-[200px]">
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <p>
                            ${module.topic}
                        </p>
                        ${userScore !== null ? `
                            <div class="px-4 py-1 border-[1px] rounded-lg text-sm font-semibold bg-white">
                                ${userScore > 70 ? `
                                    Pass
                                ` : `
                                    Failed
                                `}
                            </div>
                        ` :
                        ``}
                    </div>
                    <div>
                        <h1 class="font-semibold">
                            ${module.title}
                        </h1>
                        <p class="text-xs mt-2 font-normal text-gray-600">
                            ${module.description}
                        </p>                        
                    </div>
                </div>
                <div class="w-auto">
                    <div class="flex-col p-2 border-[1px] px-4 rounded-lg bg-white">
                        <p class="font-semibold text-sm">
                            ${module.difficulty}
                        </p>
                        ${userScore !== null ? `
                            <div class="text-sm">
                                <a class="font-semibold">Score:</a> ${userScore}
                            </div>
                        ` : `
                            <div class="text-sm"> 
                            Not taken
                            </div>
                        `}
                    </div>
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

document.addEventListener('DOMContentLoaded', requireAuth(), loginButton(), handleModule())


