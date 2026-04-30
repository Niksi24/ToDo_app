document.addEventListener('DOMContentLoaded',()=>{
    const taskList = document.getElementById('task-list');
    const emptyImage = document.getElementById('empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    const input = document.getElementById("task-input");
    const editId = document.getElementById("edit-id");
    const form = document.getElementById("todo-form");
    const addBtn = document.getElementById("add-task-button");

    const toggleEmptyState = () =>{
        emptyImage.style.display = taskList.children.length === 0 ? 'block':'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    }

    const updateProgress = () => {
        const totalTasks = taskList ? taskList.children.length : 0;
        const completedTasks = taskList ? taskList.querySelectorAll('li.completed').length : 0;

        progressBar.style.width = totalTasks ? `${(completedTasks/totalTasks)*100}%` : `0%`;    
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
    };

    

    updateProgress();

   
 


    
  
  
    
    

    
});