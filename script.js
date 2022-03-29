const form = document.getElementById("itemForm")
const itemList = document.getElementById("itemList")
const itemInput = document.getElementById("itemInput")
let itemArray = [];

function createItem(name, isFinished) {
    const newItem = document.createElement("div")
    newItem.classList.add("item", "d-flex", "justify-content-between", "m-3")
    const finishedButtonState = (isFinished == true) ? "active" : ''
    newItem.innerHTML = `
        <div class="d-flex">
            <button class="me-3 btn btn-outline-success d-flex align-items-center align-self-center finish-button ${finishedButtonState}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
            </button>
            <h4 class="text-break me-3">${name}</h4>
        </div>
        <div class="d-flex align-items-start">
            <button class="btn d-flex align-items-center btn-primary edit-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </button>
            <button class="btn d-flex align-items-center btn-danger" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                </svg>
            </button>
            <!-- Modal / dialog -->
            <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="">
                        <div class="d-flex justify-content-between m-3">
                            <h5 class="modal-title" id="confirmDeleteModalLabel">Are you sure you want to delete this todo item?</h5>

                            <button type="button" class="ms-5 btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="my-4 mx-3">
                            
                            <button type="button" class="btn btn-dark delete-button" data-bs-dismiss="modal">Delete</button>
                            <button type="button" class="btn btn-outline-secondary me-1" data-bs-dismiss="modal">Cancel</button>
                                                  
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div> 
        `
    itemList.appendChild(newItem)

    // evenlisteners for item buttons
    newItem.querySelector(".delete-button").addEventListener("click",()=> {
        itemList.removeChild(newItem);
        refetchItemArray();
    })
    newItem.querySelector(".edit-button").addEventListener("click",()=> {
        newItem.querySelector(".edit-button").disabled = true
        editTodoItem(newItem);
    })
    newItem.querySelector(".finish-button").addEventListener("click",()=> {
        newItem.querySelector(".finish-button").classList.toggle("active")
        refetchItemArray();
    })
}

function editTodoItem(item) {
    const itemH4 = item.querySelector("h4")
    const itemName = itemH4.innerText
    if (itemName.length < 100) {
        itemH4.outerHTML = `
            <div id="editDiv" class="input-group me-3">
                <input id="editInput" class="form-control" size="1000" value="${itemName}">
                <button class="btn btn-outline-secondary" id="cancelButton">Cancel</button>
                <button class="btn btn-primary" id="confirmEditButton">Edit</button>
            </div>
            ` 
    } else {
        itemH4.outerHTML = `
            <div id="editDiv" class="me-3">  
                <textarea id="editInput" class="form-control me-5" onkeyup="textAreaAdjust(this)" style="overflow:hidden" cols="150">${itemName}</textarea>
                <div>             
                    <button class="btn btn-outline-secondary" id="cancelButton">Cancel</button>
                    <button class="btn btn-primary" id="confirmEditButton">Edit</button>
                </div>
            </div>
            `  
        textAreaAdjust(item.querySelector("#editInput"));
    }
    item.querySelector("#editInput").focus();
    // event listeners
    item.querySelector("#cancelButton").addEventListener("click", ()=> {
        item.querySelector(".edit-button").disabled = false
        item.querySelector("#editDiv").outerHTML = `<h4 class="text-break me-3">${itemName}</h4>`
    })
    item.querySelector("#confirmEditButton").addEventListener("click", ()=> {
        const editedName = item.querySelector("#editInput").value;
        item.querySelector(".edit-button").disabled = false
        item.querySelector("#editDiv").outerHTML = `<h4 class="text-break me-3">${editedName}</h4>`;
        refetchItemArray();
    })
}

function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (10 + element.scrollHeight)+"px";
  }

function setLocalStorage() {
    localStorage.setItem("todoItems", JSON.stringify(itemArray))
}

function getLocalStorage() {
    const todoStorage = localStorage.getItem("todoItems")
    if (todoStorage === 'undefined' || todoStorage === null) {
        itemArray = [];
    } else {
        itemArray = JSON.parse(todoStorage);
    }
}

getLocalStorage();

/*  
Reloads the itemlist:
Fills the itemlist div with items from localStorage
(used only for filling the itemlist when loading page) 
*/
function refetchList() {
    itemList.innerHTML = ''
    itemArray.forEach(function(item) {
        createItem(item.name, item.isFinished);
})}

refetchList();

// puts all item elements from the DOM into an array
function refetchItemArray() {
    itemArray = [];
    const items = itemList.querySelectorAll(".item")
    
    items.forEach(function(item) {
        const itemName = item.querySelector("h4").innerText
        const itemFinishedButtonClasses = item.querySelector(".finish-button").classList
        console.log(itemFinishedButtonClasses)
        const itemIsFinished = (itemFinishedButtonClasses.contains("active")) ? true : false
        const itemObject = {
            "name": itemName,
            "isFinished": itemIsFinished
        }
        itemArray.push(itemObject)
        console.log(itemArray)
    })
    setLocalStorage();
}

form.addEventListener("submit", (e)=> {
    // prevent reload page
    e.preventDefault() 
    const itemName = itemInput.value
    if (itemName.length === 0){
        const alert = document.getElementById("noItemNameAlert");
        alert.classList.add("show")
        setTimeout(function() {
            alert.classList.remove("show")
        },3000
        )
    } else {
        itemInput.value = ''
        createItem(itemName, false);
        refetchItemArray();
        itemInput.focus();
    }
})

document.getElementById("clearAllButton").addEventListener("click",()=> {
    localStorage.clear();
    window.location.reload();
})

