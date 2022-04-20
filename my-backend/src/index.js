//PARA SERVIDOR
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//VARIABLES PARA INTERPRETE
var fs = require('fs'); 
var parser = require('./interprete/gramatica');
const TIPO_INSTRUCCION = require('./interprete/instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('./interprete/instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('./interprete/instrucciones').TIPO_VALOR;
const instruccionesAPI = require('./interprete/instrucciones').instruccionesAPI;
// Tabla de Simbolos
const TIPO_DATO = require('./interprete/tabla_simbolos').TIPO_DATO;
const TS = require('./interprete/tabla_simbolos').TS;


//PETICIONES

app.get('/', (req, res) => {   
    res.json({
        message: 'Hello World 2.0'
    });
});

app.post('/ejecutar', function (req, res){
    //AST
    let ast;
    try {
        const entrada = req.body.codigo;
        ast = parser.parse(entrada.toString());
    } catch (e) {
        console.error(e);
        return;
    }

    const tsGlobal = new TS([]);
    var respuesta = procesarBloque(ast, tsGlobal);

    //respuesta
    res.json({
        message: respuesta
    });
    
});

app.listen(5000, () => {
    console.log('server is listening on port 5000');
});

function procesarBloque(instrucciones, tablaDeSimbolos) {
    var salida = 'Ejecutando...';
    var anterior = true;
    instrucciones.forEach(instruccion => {
        if (instruccion.tipo === TIPO_INSTRUCCION.IMPRIMIRLN) {
            salida += procesarImprimirLn(instruccion, tablaDeSimbolos);
            anterior = true;
        }else if (instruccion.tipo === TIPO_INSTRUCCION.IMPRIMIR) {
            salida += procesarImprimir(instruccion, tablaDeSimbolos,anterior);
            anterior = false;
        }
    });
    return salida;
}

function procesarImprimir(instruccion, tablaDeSimbolos,anterior) {
    const cadena = procesarExpresion(instruccion.expresion, tablaDeSimbolos).valor;
    //console.log('> ' + cadena);
    if(anterior){
        return '\n>>>' + cadena;
    }else{
        return cadena
    }
    
}

function procesarImprimirLn(instruccion, tablaDeSimbolos) {
    const cadena = procesarExpresion(instruccion.expresion, tablaDeSimbolos).valor;
    //console.log('> ' + cadena);
    return '\n>>>' + cadena;
}

function procesarExpresion(expresion,tablaDeSimbolos){

    if (expresion.tipo === TIPO_VALOR.CADENA) {
        return {valor: expresion.valor, tipo: TIPO_DATO.STRING };
    }else if (expresion.tipo === TIPO_VALOR.ENTERO) {
        return {valor: expresion.valor, tipo: TIPO_DATO.ENTERO };
    }else if (expresion.tipo === TIPO_VALOR.BOOLEAN) {
        return {valor: expresion.valor, tipo: TIPO_DATO.BOOLEAN };
    }else if (expresion.tipo === TIPO_VALOR.DOUBLE) {
        return {valor: expresion.valor, tipo: TIPO_DATO.DOUBLE };
    }else if (expresion.tipo === TIPO_VALOR.CARACTER) {
        return {valor: expresion.valor, tipo: TIPO_DATO.CARACTER};
    }
}
