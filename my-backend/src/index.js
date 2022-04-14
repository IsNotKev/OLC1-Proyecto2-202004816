const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World 2.0'
    });
});

/*app.get('/:name', (req, res) => {
    let name = req.params.name;

    res.json({
        message: `Hello ${name}`
    });
});*/

app.post('/ejecutar', function (req, res){
    //let cod = req.body.codigo;
    res.json({
        message: `El código es: ${req.body.codigo}`
    });
});

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});