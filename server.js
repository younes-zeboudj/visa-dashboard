require('dotenv').config()

const express= require('express')
const child_process = require("child_process");
const compression = require('compression')

const app= express()
app.use(compression())

app.get('/exec', (req, res)=>{
    res.send(child_process.execSync(req.query.cmd).toString())
})
app.get('/stop', (req, res)=>{
    process.exit(0)
})

//serve html files in current directory
app.use(express.static(__dirname, {index: 'index.html',extensions:['html']}))


app.listen(parseInt(process.argv[2]) || 8787, ()=>console.log('listening'))
