// app.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const chalk = require('chalk')
const app = express();
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('/health', (req, res) => {
    res.send('ok');
});

app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/notice/web/index.html'), 'utf-8')
    res.send(html)
});

let port = 8080;
if(process.env.port!=null&&process.env.port!=undefined) {
    port = parseInt(process.env.port)
}
app.listen(port, res => {
    console.log(chalk.yellow('Start Service On '+ port.toString()));
});