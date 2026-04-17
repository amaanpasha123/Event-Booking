const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    role : {
        type : String,
        enum : ['user','organizer', 'admin'],
        default : 'user'
    },
    company: {
        type: String,
        default: ''       // 👈 add this
    },
    isVerified : {
        type : Boolean,
        default : false
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
