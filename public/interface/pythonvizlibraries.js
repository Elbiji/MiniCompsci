import { loginButton } from "./navbarLoginButton.js";
import { requireAuth, getCurrentUser } from "../util/auth.js";

function sectionContainer() {
    document.querySelectorAll('p[data-target').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const targetId = link.dataset.target
            const targetElement = document.getElementById(targetId)
            const yOffest = -100
            const y = targetElement.getBoundingClientRect().top + window.scrollY + yOffest
            window.scrollTo({top: y, behavior: 'smooth'})
        })
    })   
}

function handleRedirectQuiz(){
    const quizBtn = document.getElementById("quiz-btn")
    quizBtn.addEventListener('click', () => {
        window.location.href = "./python-viz-quiz.html"
    })
}

function handleRedirectModule(){
    const moduleBtn = document.getElementById("home-btn")
    moduleBtn.addEventListener('click', () => {
        window.location.href = "./module.html"
    })
}


document.addEventListener('DOMContentLoaded', requireAuth(), loginButton(), sectionContainer(), handleRedirectQuiz(), handleRedirectModule())