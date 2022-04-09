const express = require('express');
const app = express();
const morgan=require('morgan');
 
//Configuraciones
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2)
 
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
 
//Nuestro primer WS Get
app.get('/', (req, res) => {  
    /*if(req.body.Mensaje == "Hola Mundo"){
        res.json(
            {
                "Title": "Hola BB"
            }
        );
    }else{
        res.json(
            {
                "Title": "Error"
            }
        );
    }*/
    res.json(
        {
            "Title": "Bienvenido"
        }
    );
})
 
//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});