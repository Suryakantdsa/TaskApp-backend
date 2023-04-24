const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const Task = require("./models/task")
const uri = `mongodb+srv://Suryakant:Suryadas@cluster0.mydbwj6.mongodb.net/TaskApp?retryWrites=true&w=majority`

app.use(cors())
app.use(express.json())


mongoose.connect(uri)
    .then(() => { console.log("Connected to database sucessfully ") })



app.get("/", (req, resp) => {
    resp.send({ msg: "working" })
})

app.post("/v1/tasks", async (req, resp) => {

    try {
        let newTask = new Task(req.body)
        let result = await newTask.save()
        result=result.toObject()
        resp.status(201).send({id:result._id})
    }
    catch {
        console.log(req.body.tasks)
        if (req.body.tasks) {
            let n = req.body.tasks.length
            let ans = []
            for (let i = 0; i < n; i++) {
                let newOne=req.body.tasks[i]
                let newTask = new Task(newOne)
                let result = await newTask.save()
                result=result.toObject()

                ans.push({id:result._id})


            }
            resp.status(201).send({tasks:ans})
        }
        else {
            resp.status(400).send({ msg: 'Somthing went wrong' })
        }
    }
})
app.get("/v1/tasks", async (req, resp) => {
    try {
        let result = await Task.find()
        resp.status(200).send({ tasks: result })
    } catch {
        resp.status(400).send({ msg: "No task are found" })
    }
})
app.get("/v1/tasks/:id", async (req, resp) => {
    try {
        let result = await Task.findOne({ _id: req.params.id })
        resp.status(200).send(result)
    } catch {
        resp.status(404).send({ error: "There is no task at that id" })
    }
})
app.delete("/v1/tasks/:id", async (req, resp) => {
    try {
        let result = await Task.deleteOne({ _id: req.params.id })
        resp.status(204).send(result)
    } catch {
        resp.status(204).send({ msg: "not done" })

    }
})
app.delete("/v1/tasks/", async (req, resp) => {
    try {
        let n = req.body.tasks.length
            let ans = []
            for (let i = 0; i < n; i++) {
                let newOne=req.body.tasks[i]._id
                let result = await Task.deleteOne(newOne)
                ans.push(result)
            }
            resp.status(204).send(ans)

    } catch {
        resp.status(204).send({ msg: "not done" })

    }
})
app.put("/v1/tasks/:id", async (req, resp) => {
    try {
        let result = await Task.updateOne({ _id: req.params.id },
            { $set: req.body }
        )
        resp.status(204).send(result)
    } catch {
        resp.status(404).send({ error: "There is no task at that id" })

    }
})




app.listen(5000, () => { console.log("app is running at 5000") })