let express =require('express');
let bodyparser = require('body-parser')
let cors = require('cors')
let {connectDB} = require('./Routes/dbconnection')
let UpdateTalentPoolRecord = require('./Routes/UpdateTalentPoolRecord');

const talentRoutes = require('./Routes/talentRoutes'); // Adjust the path if necessary

const talentpoolRoutes = require('./Routes/talentpoolRoutes'); // Adjust the path if necessary



let app = express();
// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));

connectDB().catch(error => console.error(error));

app.use(cors())
// parse application/json

app.use(bodyparser.json())

app.get("/",(req,res)=>{
    res.send("Home Page")
})


app.post("/postdata",(req,res)=>{
   res.send(req.body)
})

app.use('/fetchdata',require('./Routes/fetch'))
app.use('/fetchEmpByID',require('./Routes/FetchEmpById'))

app.use('/fetchbasedOnCondition',require('./Routes/fetchBasedOnRequirement'))


app.use('/employeedata',require('./Routes/InsertData'))

app.use('/addtoshortlist',require('./Routes/Addtoshortlist'));

app.use('/removefromshorlist',require('./Routes/RemoveFromShorlist'));

app.use('/getAllMangers',require('./Routes/GetAllManagers'))

app.use('/registerdata',require('./Routes/UserRegister'))
app.use('/getMangersOFEmployee',require('./Routes/FetchAllManagerEmployee'))
app.use('/getAllPrimarySkills',require('./Routes/FetchAllPrimarySkills'));



app.use("/login",require('./Routes/Login'))
app.use("/primaryskills",require('./Routes/PrimarySkills'))
app.use("/getLocationCounts",require('./Routes/getLocationCounts'))
app.use("/Category",require("./Routes/Category"))
app.use("/sendotp" , require('./Routes/SendOTP'))

app.use('/updaterecord' , require('./Routes/UpdateRecord'))
app.use('/deleteRecord' , require('./Routes/DeleteRecord'))
app.use('/insertemp' , require('./Routes/InsertNewEmployee'));

//talentpool
app.use('/talent', require('./Routes/UploadTalent'));

app.use('/user', require('./Routes/user'))

// Add this line to include the new route for band data
app.use('/talentpool', require('./Routes/talentpoolbandroutes'));


//codeByJExit
app.use('/fetchbydate',require('./Routes/fetchByDate'))

//newlyjoineddate
app.use('/fetchNewJoinsByDate',require('./Routes/fetchNewJoinsByDate'))


app.use('/talentupdate', require('./Routes/talentRoutes')); // This should point to the correct route file

// Talent pool specific routes
app.use('/talentpool/details', require('./Routes/FetchTalentPool'));
app.use('/talentpoolupdate', require('./Routes/UpdateTalentPoolRecord'));

// Talent Pool routes
app.use('/talentpool', UpdateTalentPoolRecord);

app.use('/talentpool', talentpoolRoutes);






app.listen(3004,(req,res)=>{
    console.log("server running")
})