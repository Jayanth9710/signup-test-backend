const express = require('express')
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8080
const router = require("./Routes/userRoutes");


dotenv.config();

app.use(express.json());

app.use((cors({
    origin:'*'
})))

app.use("/",router);

app.listen(PORT,function(){
    console.log(`The App is running on Port ${PORT}`)
})