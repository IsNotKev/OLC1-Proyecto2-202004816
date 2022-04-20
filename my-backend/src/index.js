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

app.post('/ejecutar', function (req, res){
    res.json({
        message: `El código es: ${req.body.codigo}`
    });
    
});

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});