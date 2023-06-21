const express= require('express')
const child_process = require("child_process");

const app= express()

app.get('/exec', (req, res)=>{
    res.send(child_process.execSync(req.query.cmd).toString())
})
app.get('/stop', (req, res)=>{
    process.exit(0)
})
app.listen(parseInt(process.argv[2]) || 8787, ()=>console.log('listening'))
