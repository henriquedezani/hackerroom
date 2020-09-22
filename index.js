const express = require('express')
const {spawn} = require('child_process');

const app = express()
const port = process.env.PORT || 3000;

teste = 'hello.txt'
script = 'hello.py'

app.get('/', (req, res) => {
    var dataToSend;
    // spawn new child process to call the python script
    // const python = spawn('python', ['hello.py']);
    const python = spawn(`python ${script} < ${teste}`, { shell: true });
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
    });
    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.send(`<html><body><pre>${data.toString()}</pre></body></html>`)
      });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))