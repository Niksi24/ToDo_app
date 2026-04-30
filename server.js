const express = require("express")
const sanitizeHTML = require('sanitize-html')
const db = require("better-sqlite3")("todo.db")
db.pragma("journal_mode = WAL")


//database setup start

const createTables = db.transaction(() =>{
    db.prepare(`
        CREATE TABLE IF NOT EXISTS todos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        done INTEGER DEFAULT 0
        )
        `).run()
})

createTables()
//database setup end
const app = express()

app.use(express.static("public"))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))


// app.get("/",(req,res)=>{
//     res.render("index")
// })
function sharedTodoValidation(req){
    const errors =[]
    if(typeof req.body.task !== "string") req.body.task = ""

    //trim -sanitize or strip html

    req.body.task = sanitizeHTML(req.body.task.trim(),{allowedTags:[],allowedAttributes:{}})

    if(!req.body.task) errors.push("You must provide a task")

    return errors
}
app.get("/edit-todo/:id",(req,res)=>{
    //try to look up todo in question
    const statment = db.prepare("SELECT * FROM todos WHERE id= ?")
    const todo = statment.get(req.params.id)


    res.render("edit-todo",{todo})
})
app.post("/edit-todo/:id",(req,res)=>{
    //try to look up todo in question
    const statment = db.prepare("SELECT * FROM todos WHERE id= ?")
    const todo = statment.get(req.params.id)

    const errors=sharedTodoValidation(req)
    if(errors.length){
        return res.render("edit-todo",{errors,todo})

    }

    const updateTodo = db.prepare("UPDATE  todos SET task = ? WHERE id=?")
    updateTodo.run(req.body.task,req.params.id)
    res.redirect("/")
})
//dodavanje todo taskova u bazu 
app.post("/add",(req,res) =>{
    const errors= sharedTodoValidation(req)

    if(errors.length){
        return res.render("/",{errors})
    }
    //save the data into database
    const addTodo = db.prepare("INSERT INTO todos (task) VALUES (?)")
    const result = addTodo.run(req.body.task)
    res.redirect("/")
})

//shows all todos
app.get("/",(req,res)=>{
    try{
        const getTodos = db.prepare("SELECT * FROM todos")
        const todos = getTodos.all()
        res.render("index",{todos})

    } catch(err){
        console.error("Greška u čitanju baze:", err.message)
        return res.status(500).send("Greška u čitanju baze")
    }
    
})

//deleting todo
app.post("/delete/:id",(req,res)=>{
    try{
        const deletedTodo = db.prepare("DELETE FROM todos WHERE id= ?")
        deletedTodo.run(req.params.id)
        res.redirect("/")
    } catch(err){
        console.error("Greška u brisanu", err.message)
        return res.status(500).send("Greška u brisanju")
    }
})
//checking todo 
app.post("/done/:id",(req,res)=>{
    try{
        const checkedTodo = db.prepare("UPDATE todos SET done=1 WHERE id= ?")
        checkedTodo.run(req.params.id)
        res.redirect("/")
    }catch(err){
        console.error("Greška u azuriranju!", err.message)
        return res.status(500).send("Greška u azuriranju!")
    }
})



app.listen(3000)