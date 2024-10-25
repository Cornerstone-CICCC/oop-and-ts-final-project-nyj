import { atom, map } from 'nanostores';
import type InProgress from '../components/InProgress.astro';

const todoArea = document.querySelector("#todo-area-list");
const inProgressArea = document.querySelector("#inprogress-area");
const doneArea = document.querySelector("#done-area");

const categoryTodo = "To Do"
const CategoryInProgress = "In Progress"
const CategoryDone = "Done"

type Task = {
    id: number
    title: string
    description: string
    category: string
}

class TaskList {
    static tasksId = 0
    todo: string
    inProgress: string
    done: string
    tasks: Task[]

    constructor() {
        this.todo = categoryTodo
        this.inProgress = CategoryInProgress
        this.done = CategoryDone

        this.tasks = [
            {id: 1, title: "HTML for header", description: "cord HTML", category: this.done },
            {id: 2, title: "CSS for header", description: "Test functions", category: this.inProgress },
            {id: 3, title: "HTML for footer", description: "cord HTML", category: this.inProgress },
            {id: 4, title: "Test task", description: "Test functions", category: this.todo },
        ]
    }

    add(newTask: Task) {
        TaskList.tasksId ++
        newTask.id = TaskList.tasksId
        this.tasks.push(newTask)

        this.render()
    }

    update(updatedTask: Task) {
        let result = prompt(`${updatedTask.title}`, `${updatedTask.description}`);
        if(result !== null && updatedTask.description !== result){
            this.tasks.forEach((element) => {
                if(element.id === updatedTask.id){
                    element.description = result
                }
            })
            this.render()
        }
    }

    delete(id: number){
        const newTasks = this.tasks.filter((element) => {
            return element.id !== id
        })
        this.tasks = newTasks
        this.render()
    }

    onDrag(event: DragEvent, taskId: number): void {
        event.dataTransfer?.setData('taskId', taskId.toString());
    }
    
    onDrop(event: DragEvent, newCategory: string): void {
        event.preventDefault();
    
        const taskId = event.dataTransfer?.getData('taskId');
        if (taskId) {
            const task = this.tasks.find(task => task.id === parseInt(taskId));
        if (task) {
            task.category = newCategory;
            this.render();
        }
        }
    }
    
    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    searchTask(keyword: string) {
        const resultTasks = this.tasks.filter((element) => {
            return element.title.includes(keyword)
        })
    }

    createTask(task: Task){
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-card"
        taskDiv.draggable = true;
        taskDiv.addEventListener('dragstart', (event) => this.onDrag(event, task.id));

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
        console.log(this.tasks)

        this.tasks.forEach((element, index) =>{
            switch(element.category){
                case categoryTodo:
                    todoArea.appendChild(this.createTask(element))
                    break;
                case CategoryInProgress:
                    inProgressArea.appendChild(this.createTask(element))
                    break;
    
                case CategoryDone:
                    doneArea.appendChild(this.createTask(element))
                    break;
            }
        })
    }
}

export const tasksList = new TaskList()
export const isOpen = atom(false);
export const cartItems = map({});

tasksList.render()