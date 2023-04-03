// requiring module

const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
    

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it
// disk storage engine for the uploaded files, where the files are stored in a folder called "uploads". 
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        // uploads is the upload_folder_name
        cb(null, "uploads")
    },

    // The uploaded files are given a filename that includes the field name, the current timestamp, and a file extension of ".jpg".


    filename: function(req, file, cb){
        cb(null, "file.fieldname" + "-" + Date.now()+ ".jpg")}
})

// define maximu size for uploading
// picture 1mb it is optional

const maxSize = 1*1000*1000;

var upload = multer({
    storage: storage,
    limits: {fileSize:maxSize},
    fileFilter: function(req, file, cb){
        // set the filetypes, it is optional.

        // The code defines a regular expression pattern (/jpeg|jpg|png/) for the allowed file types, which includes JPEG, JPG, and PNG.

        // The file.mimetype property and path.extname(file.originalname).toLowerCase() function are used to extract the MIME type and extension of the uploaded file. These values are then tested against the filetypes regular expression using the .test() method.

        // If the MIME type and extension both match the allowed file types, the function will return cb(null, true), indicating that the file is valid and can be uploaded. Otherwise, the function may return an error to prevent the upload of an unsupported file type.
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname ){
            return cb(null,true);
        }

        cb("Error: File upload only supports the "+ "following filetypes - " + filetypes);
    }
// mypic is the name of file attribute
}).single("mypic");       

//app.get() method sets up a route for the homepage, where the user can submit a form to upload a profile picture
  
app.get("/",function(req,res){
    res.render("Signup");
})

app.post("/uploadProfilePicture",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
         if (err){
             // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
         }
         else {
            // suceess, Image successfully uploaded

            res.send("Success, image uploaded successfully!")
         }
         })

})

// Take any port number of your choice which
// is not taken by any other process
app.listen(8080,function(error) {
    if(error) throw error
        console.log("Server created Successfully on PORT 8080")
})