import { questions as pythonVizQuestions } from "./constant/pythonVizQuestions.js";

const quizProgress = document.getElementById('quizProgress')
const questionContainer = document.getElementById('questionContainer')
const answerContainer = document.getElementById('answerContainer')
const backgroundAudio = document.getElementById('backgroundAudio')
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

function loadAppropriateQuestions() {
    const quizElement = document.querySelector('div[data-quiz-id]');
    const quizId = quizElement?.getAttribute('data-quiz-id');
    
    if (quizId === "python-viz") {
        return pythonVizQuestions;
    }
    return []; // Fallback
}


function handleQuestion(index) {
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
            setTimeout(() => {
                if (currentQuestionIndex === questions.length - 1) {
                    currentQuestionIndex = 0
                    showQuizCompletion()
                    return
                } else {
                    currentQuestionIndex ++
                }
                handleQuestion(currentQuestionIndex)
            }, 3000)
        })
    })
}

function showQuizCompletion() {
    // Show completion message
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
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
        history.back() // Redirect to home page
    }, 3000); // 3 second delay
}

handleQuestion(currentQuestionIndex);

