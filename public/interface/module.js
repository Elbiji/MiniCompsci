import { modules as md } from "./constant/modules.js";

const moduleContainer = document.getElementById('moduleContainer')

function handleModule(){
    md.forEach((module) => {
        moduleContainer.innerHTML += `
         <div class="flex-col rounded-2xl border-[1px] p-4 relative overflow-hidden shadow-sm hover:translate-y-[10px] cursor-pointer transition-all duration-300">
            <div class="flex flex-col space-y-6 justify-between h-[200px]">
                <div>
                <img src="./assets/Group 163.png" class="absolute z-[-10] top-[10px] right-[-100px] hidden lg:block"/>
                    <p class="text-md text-gray-400 font-normal">
                        ${module.topic}
                    </p>
                    <h1 class="font-semibold">
                        ${module.title}
                    </h1>
                </div>
                <div class="flex">
                    <p>
                        Courses ${module.totalcourses}
                    </p>
                    <p>
                </div>
            </div>
         </div>
        `
    })
}

handleModule()