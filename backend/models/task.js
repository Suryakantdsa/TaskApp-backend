const mongoose=require("mongoose")


const taskSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    is_completed:{
        type:Boolean,
    }
})

module.exports=mongoose.model("tasks",taskSchema)