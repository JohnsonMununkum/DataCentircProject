//adding express to my app
var express = require('express')
var app = express()
//connecting to mysql
const mysql = require('mysql');
 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024Mysql',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

//implementing mongoose for the lecturers page
const mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/proj2024MongoDB',  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

//defining schema 
const lectSchema = new mongoose.Schema({
    _id: String,          // Lecturer ID
    name: String,        // Lecturer name
    did: String   // Lecturer department
});

const Lecturer = mongoose.model('Lecturer', lectSchema);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
//can fetch data
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', __dirname + '/pages');

// Home page
app.get('/', (req, res) => {
    // title with my G number and links to pages 
    res.send(`
        <h1>G00419319@atu.ie</h1>
        <br>
        <a href='/students'>Students</a><br>
        <a href='/grades'>Grades</a><br>
        <a href='/lecturers'>Lecturers</a>
    `);
});


 // data for students can be accessed by all pages
 const students = [
    { id: "G001", name: "Sean Smith", age: 32 },
    { id: "G002", name: "Alison Conners", age: 23 },
    { id: "G003", name: "Thomas Murphy", age: 19 },  
    { id: "G004", name: "Anne Greene", age: 23 },
    { id: "G005", name: "Tom Riddle", age: 27 },
    { id: "G006", name: "Brian Collins", age: 38 },
    { id: "G007", name: "Fiona O'Hehir", age: 30 },
    { id: "G008", name: "George Johnson", age: 24 },
    { id: "G009", name: "Albert Newton", age: 31 },
    { id: "G010", name: "Marie Yeats", age: 21 },
    { id: "G011", name: "Jonathan Small", age: 22 },
    { id: "G012", name: "Barbara Harris", age: 23 },
    { id: "G013", name: "Oliver Flanagan", age: 19 },
    { id: "G014", name: "Neil Blaney", age: 34 },
    { id: "G015", name: "Nigel Delaney", age: 19 },
    { id: "G016", name: "Johnny Connors", age: 29 },
    { id: "G017", name: "Bill Turpin", age: 18 },
    { id: "G018", name: "Amanda Knox", age: 23 },
    { id: "G019", name: "James Joyce", age: 39 },
    { id: "G020", name: "Alice L'Estrange", age: 32 }
];

// data for student grades
const studentGradeData = [
    [
        { name: "Albert Newton", mid: "Algebra", grade: 49 },
        { name: "Albert Newton", mid: "Mechanics of Fluids", grade: 78 },
        { name: "Alice L'Estrange" },
        { name: "Alison Conners", mid: "Mechanics of Fluids", grade: 72 },
        { name: "Alison Conners", mid: "Mechanics of Solids", grade: 79 },
        { name: "Amanda Knox", mid: "Long Division", grade: 32 },
        { name: "Amanda Knox", mid: "Times Tables", grade: 65 },
        { name: "Amanda Knox", mid: "Algebra", grade: 77 },
        { name: "Anne Greene", mid: "Poetry", grade: 45 },
        { name: "Anne Greene", mid: "Creative Writing", grade: 56 },
        { name: "Anne Greene", mid: "Shakespeare", grade: 71 },
        { name: "Barbara Harris" },
        { name: "Bill Turpin", mid: "Shakespeare", grade: 68 },
        { name: "Brian Collins", mid: "Algebra", grade: 28 },
        { name: "Brian Collins", mid: "Times Tables", grade: 91 },
        { name: "Brian Collins", mid: "Long Division", grade: 92 },
        { name: "Fiona O'Hehir", mid: "Creative Writing", grade: 55 },
        { name: "George Johnson", mid: "Poetry", grade: 82 },
        { name: "George Johnson", mid: "Creative Writing", grade: 82 },
        { name: "James Joyce", mid: "Mobile Applications Development", grade: 32 },
        { name: "Johnny Connors", mid: "Mechanics of Fluids", grade: 35 },
        { name: "Johnny Connors", mid: "Mechanics of Solids", grade: 52 }
      ]
      ];

// Students route to render the students.ejs file
app.get('/students', (req, res) => {
    console.log("Rendering Students Page");

     // Render the EJS template with the students data
     res.render('students', { students });
    });
    

    //updating student info
app.get('/students/edit/:id', (req, res) => {
    const studentId = req.params.id;

    const student = students.find(s => s.id === studentId);

   // if student id dosent match any of the id student not found
   if (!student) {
     return res.status(404).send("Student not found");
    }

    // Render the edit form with the student's data
    res.render('updateStudent', { student });
});

//post for updating/edit student details
app.post('/students/edit/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, age } = req.body;

    let errors =[];
  //validation for them to be an error
    if(name.length < 2)
    {
        errors.push("Student Name must be at least 2 characters.");    
    } 
     if (age < 18) {
        errors.push("Student Age must be at least 18.");
    }

    if (errors.length > 0) {
        const student = { id: studentId, name, age }; 
        return res.render('updateStudent', { student, errors });
    }

    // Find the student by ID
    const studentIndex = students.findIndex(s => s.id === studentId);

    // If the student is found, update the data
    if (studentIndex !== -1) {
        students[studentIndex].name = name;
        students[studentIndex].age = parseInt(age);
    } else {
        return res.status(404).send("Student not found");
    }

    console.log(`Updated Student: ID=${studentId}, Name=${name}, Age=${age}`);
    res.redirect('/students');
});

//adding a new student 
app.get('/students/add/', (req, res) => {

    res.render('addStudent', { Validation: "" });
});


//post for adding a new student 
app.post('/students/add', (req, res) => {
    const { sid, name, age } = req.body;

    let errors =[];
    //validation for them to be an error
    if(sid.length < 4)
    {
        errors.push("Student ID is 4 characters.");   
     } 
     if (name.length < 2) 
        {
        errors.push("Name must be at least 2 characters.");
    }
    if (age < 18) 
        {
        errors.push("Age should be 18 or older.");
    }

    // Check for duplicate student ID
    const duplicateStudent = students.find(s => s.id === sid);
    if (duplicateStudent) {
        errors.push(`Student ID "${sid}" already exists.`);
    }
   
    //display errors to the addStudent page
    if (errors.length > 0) {
        const student = { sid, name, age };
        return res.render('addStudent', { student, errors });
    }

    // Add the new student to the list
    students.push({ id: sid, name, age: parseInt(age) });
    console.log(`Added Student: ID=${sid}, Name=${name}, Age=${age}`);

    // Redirect to the students page
    res.redirect('/students');
});

// grades route to render the grades.ejs file
app.get('/grades', (req, res) => {
    console.log("Rendering Grades Page");
   
    // Render the EJS template with the grades data
    res.render('grades', {grades: studentGradeData[0] });
});

// lecturers route to render the lecturers page
// .sort sort the lecturers in order by id
app.get('/lecturers', (req, res) => {
    Lecturer.find().sort({ _id: 1 })
        .then(lecturers => res.render('lecturers', { lecturers }))
        .catch(err => {
            console.error('Error fetching lecturers:', err);
            res.status(500).send('Error fetching lecturers');
        });
});

//get app to listen on port 3004
app.listen(3004, () => {
    console.log("Application listening on port 3004")
})


