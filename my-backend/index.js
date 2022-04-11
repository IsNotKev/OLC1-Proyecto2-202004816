const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.get('/:name', (req, res) => {
    let name = req.params.name;

    res.json({
        message: `Hello ${name}`
    });
});

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});