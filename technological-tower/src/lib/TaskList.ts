import { atom } from 'nanostores';

const todoArea = document.querySelector("#todo-area");
const inProgressArea = document.querySelector("#inprogress-area");
const doneArea = document.querySelector("#done-area");

type Task = {
    id: number
    title: string
    description: string
    category: string
}

class TaskList {
    static tasksId = 0
    tasks: Task[]

    constructor() {
        this.tasks = []
    }

    add(newTask: Task) {
        TaskList.tasksId ++
        newTask.id = TaskList.tasksId
        this.tasks.push(newTask)
        
        switch(newTask.category){
            case "ToDo":
                
                todoArea.appendChild(this.createTask(newTask))
                break;
            case "InProgress":
                
                inProgressArea.appendChild(this.createTask(newTask))
                break;

            case "Done":
                
                doneArea.appendChild(this.createTask(newTask))
                break;
        }
    }

    update(updatedTask: Task) {
        this.tasks.forEach((element) => {
            if(element.id === updatedTask.id){
                element.title = "Updated title"
                element.description = "Updated task"
            }
        })
        console.log(this.tasks)
        this.render()
    }

    delete(id: number){
        const newTasks = this.tasks.filter((element) => {
            return element.id !== id
        })
        this.tasks = newTasks
        console.log(this.tasks)
        this.render()
    }

    allowDrop(ev: any) {
        ev.preventDefault();
    }
    
    drag(ev: any) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
    
    drop(ev: any) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    }

    searchTask(keyword: string) {
        const resultTasks = this.tasks.filter((element) => {

        })
    }

    createTask(task: Task){
        const taskDiv = document.createElement("div");
        taskDiv.setAttribute("draggable", "true")
        taskDiv.setAttribute("ondragstart", "drag(event)")

        const title = document.createElement("h3")
        title.innerHTML = task.title
        const description = document.createElement("p")
        description.innerHTML = task.description

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteBtn"
        deleteBtn.addEventListener('click', () => this.delete(task.id))
        deleteBtn.innerHTML = "Delete"

        const updateBtn = document.createElement("button");
        updateBtn.className = "updateBtn"
        updateBtn.addEventListener('click', () => this.update(task))
        updateBtn.innerHTML = "Update"
        

        taskDiv.appendChild(title)
        taskDiv.appendChild(description)
        taskDiv.appendChild(deleteBtn)
        taskDiv.appendChild(updateBtn)
        return taskDiv
    }

    render(){
        todoArea.innerHTML = ""
        inProgressArea.innerHTML = ""
        doneArea.innerHTML = ""

        this.tasks.forEach((element, index) =>{
            switch(element.category){
                case "ToDo":
                    todoArea.appendChild(this.createTask(element))
                    break;
                case "InProgress":
                    inProgressArea.appendChild(this.createTask(element))
                    break;
    
                case "Done":
                    doneArea.appendChild(this.createTask(element))
                    break;
            }
        })
    }
}

export const tasksList = new TaskList()
export const isOpen = atom(false);