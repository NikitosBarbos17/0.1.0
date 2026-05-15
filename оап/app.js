let resources = JSON.parse(localStorage.getItem("resources")) || []

let editId = null

const form = document.getElementById("resourceForm")
const tableBody = document.getElementById("tableBody")

function readForm(){

    return{
        title: document.getElementById("title").value.trim(),
        url: document.getElementById("url").value.trim(),
        type: document.getElementById("type").value,
        description: document.getElementById("description").value.trim(),
        author: document.getElementById("author").value.trim(),
        rating: document.getElementById("rating").value
    }

}

function validate(data){

    let valid = true

    document.querySelectorAll(".error")
    .forEach(e => e.textContent = "")

    document.querySelectorAll("input,select,textarea")
    .forEach(e => e.classList.remove("invalid"))

    if(!data.title){
        titleError.textContent = "Введіть назву"
        title.classList.add("invalid")
        valid = false
    }

    if(!data.url || !data.url.startsWith("http")){
        urlError.textContent = "Введіть правильний URL"
        url.classList.add("invalid")
        valid = false
    }

    if(!data.type){
        typeError.textContent = "Оберіть тип"
        type.classList.add("invalid")
        valid = false
    }

    if(!data.description){
        descriptionError.textContent = "Введіть опис"
        description.classList.add("invalid")
        valid = false
    }

    if(!data.author){
        authorError.textContent = "Введіть автора"
        author.classList.add("invalid")
        valid = false
    }

    if(!data.rating){
        ratingError.textContent = "Оберіть рейтинг"
        rating.classList.add("invalid")
        valid = false
    }

    return valid

}

function saveStorage(){

    localStorage.setItem(
        "resources",
        JSON.stringify(resources)
    )

}

function addResource(data){

    if(editId){

        let resource = resources.find(r => r.id === editId)

        resource.title = data.title
        resource.url = data.url
        resource.type = data.type
        resource.description = data.description
        resource.author = data.author
        resource.rating = data.rating

        editId = null

    }else{

        data.id = Date.now()

        resources.push(data)

    }

    saveStorage()

    render()

    form.reset()

}

function deleteResource(id){

    resources = resources.filter(r => r.id !== id)

    saveStorage()

    render()

}

function editResource(id){

    let resource = resources.find(r => r.id === id)

    title.value = resource.title
    url.value = resource.url
    type.value = resource.type
    description.value = resource.description
    author.value = resource.author
    rating.value = resource.rating

    editId = id

}

function render(){

    tableBody.innerHTML = ""

    let search = document
    .getElementById("search")
    .value
    .toLowerCase()

    let filterType = document
    .getElementById("filterType")
    .value

    let sortRating = document
    .getElementById("sortRating")
    .value

    let filtered = resources.filter(r => {

        let matchSearch =
        r.title.toLowerCase().includes(search)

        let matchType =
        !filterType || r.type === filterType

        return matchSearch && matchType

    })

    if(sortRating === "asc"){
        filtered.sort((a,b) => a.rating - b.rating)
    }

    if(sortRating === "desc"){
        filtered.sort((a,b) => b.rating - a.rating)
    }

    filtered.forEach(r => {

        let row = document.createElement("tr")

        row.innerHTML = `

        <td>${r.title}</td>

        <td>
            <a href="${r.url}" target="_blank">
                Перейти
            </a>
        </td>

        <td>${r.type}</td>

        <td>${r.description}</td>

        <td>${r.author}</td>

        <td>${r.rating} ⭐</td>

        <td>

            <button data-edit="${r.id}">
                Редагувати
            </button>

            <button data-delete="${r.id}">
                Видалити
            </button>

        </td>

        `

        tableBody.appendChild(row)

    })

}

form.addEventListener("submit", function(e){

    e.preventDefault()

    let data = readForm()

    if(!validate(data)) return

    addResource(data)

})

tableBody.addEventListener("click", function(e){

    if(e.target.dataset.delete){

        deleteResource(
            Number(e.target.dataset.delete)
        )

    }

    if(e.target.dataset.edit){

        editResource(
            Number(e.target.dataset.edit)
        )

    }

})

document
.getElementById("search")
.addEventListener("input", render)

document
.getElementById("filterType")
.addEventListener("change", render)

document
.getElementById("sortRating")
.addEventListener("change", render)

render()