import { getCurrentUser } from "../util/auth.js";
import supabase from "../util/supabaseClient.js";
import { questions as pythonVizQuestions } from "./constant/pythonVizQuestions.js";

const quizProgress = document.getElementById('quizProgress')
const questionContainer = document.getElementById('questionContainer')
const answerContainer = document.getElementById('answerContainer')
const backgroundAudio = document.getElementById('backgroundAudio')
const quizElement = document.querySelector('div[data-quiz-id]'); // Getting the course id in a div element
let currentQuestionIndex = 0;
let audioStarted = false


function startBackgroundAudio() {
    if (!audioStarted) {
        backgroundAudio.volume = 0.2;
        backgroundAudio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
        audioStarted = true;
    }
}

// Loading the appropriate question
function loadAppropriateQuestions() {
    const quizId = quizElement?.getAttribute('data-quiz-id');
    
    // For now just handle python-viz 
    if (quizId === "python-viz-libraries") {
        return pythonVizQuestions;
    }
    return []; // Fallback
}


async function handleQuestion(index) {
    // Quiz Progress
    // reset state
    const questions = loadAppropriateQuestions()
    quizProgress.innerHTML = ""
    questions.forEach((question) => { 
        // Appends each element in questions
        quizProgress.innerHTML += `<span class="flex-1 h-1.5 bg-gray-300 rounded-full transition-all duration-300 lg:w-[50px] md:w-[25px]"></span>`
    });

    // Current question indicator
    let spans = document.querySelectorAll('span');
    for (let i = 0; i <= index; i++) {
        // Add styling
        spans[i].classList.add('bg-gray-400');
    }

    // topic/question
    questionContainer.innerHTML = `
    <p class="text-gray-600 font-regular text-sm">${questions[index].topic}</p>
    <p class="text-lg">${questions[index].question}</p>`;

    // answers
    // reset state
    answerContainer.innerHTML = ''
    questions[index].possibleAnswers.forEach(answer => {
        answerContainer.innerHTML += `
        <div>
            <button class="border-[1px] hover:bg-gray-100 transition-all duration-300 rounded-md p-3 w-full">${answer}</button>
        </div>`
    })

    let answers = document.querySelectorAll('button');
    answers.forEach((answer) => {
        answer.addEventListener("click", e => {
            // Start background audio on first user interaction
            startBackgroundAudio();
            
            answers.forEach ((btn) => {
                btn.disabled = true
            })

            if (e.target.textContent === questions[index].correctAnswer) {
                e.target.classList.remove('hover:bg-gray-100')
                e.target.classList.add('border-green-500','bg-green-100','text-green-800')
            } else {
                e.target.classList.remove('hover:bg-gray-100')
                e.target.classList.add('border-red-500','bg-red-100','text-red-800')
                console.log('false!')
                answers.forEach((btn) => {
                    if (btn.textContent === questions[index].correctAnswer){
                        btn.classList.remove('hover:bg-gray-100')
                        btn.classList.add('border-green-500','bg-green-100','text-green-800')
                    }
                })
                // Timeout 2 seconds
            }
            setTimeout(async () => {
                if (currentQuestionIndex === questions.length - 1) {
                    currentQuestionIndex = 0
                    await showQuizCompletion()
                    return
                } else {
                    currentQuestionIndex ++
                }
                handleQuestion(currentQuestionIndex)
            }, 3000)
        })
    })
}

async function showQuizCompletion() {
    // Show completion message
    const quizId = quizElement?.getAttribute('data-quiz-id');
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = await getCurrentUser();
    console.log(currentUser.id)
    console.log(quizId)
    try {
        const response = await fetch("https://zqhqdommdaqthfopkhnw.supabase.co/functions/v1/user_quizes", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${session.access_token}` 
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                score: 50,
                course: quizId
            })
        });

        const responseText = await response.text();
        console.log('Server response:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
        }

        const result = JSON.parse(responseText);
        console.log('Quiz result saved:', result);
    } catch (error) {
        console.error('Error saving quiz result:', error.message);
    }

    quizProgress.innerHTML = ""
    questionContainer.innerHTML = `
        <div class="text-center">
            <h2 class="text-2xl font-bold text-green-800 mb-4">🎉 Quiz Completed!</h2>
            <p class="text-gray-600 mb-4">Great job! Redirecting you back to the home page...</p>
            <div class="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full mx-auto"></div>
        </div>
    `;
    
    // Clear answer container
    answerContainer.innerHTML = '';
    
    // // Auto redirect after 3 seconds
    // setTimeout(() => {
    //     history.back() // Redirect to home page
    // }, 3000); // 3 second delay
}

handleQuestion(currentQuestionIndex);

