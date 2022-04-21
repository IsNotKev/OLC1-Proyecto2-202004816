//PARA SERVIDOR
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//VARIABLES PARA INTERPRETE
var fs = require('fs'); 
var parser = require('./interprete/gramatica');
const exp = require('constants');
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


//-------------------------------------------------------------INSTRUCCIONES----------------------------------------------------
//PROCESANDO FUNCIONES
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
        }else if (instruccion.tipo === TIPO_INSTRUCCION.DECLARACION) {
            procesarDeclaracion(instruccion, tablaDeSimbolos);
        }
    });
    return salida;
}

//METODO IMPRIMIR
function procesarImprimir(instruccion, tablaDeSimbolos,anterior) {
    const cadena = procesarExpresion(instruccion.expresion, tablaDeSimbolos).valor;
    if(anterior){
        return '\n>>>' + cadena;
    }else{
        return cadena
    }
    
}

//METODO IMPRIMIRLN
function procesarImprimirLn(instruccion, tablaDeSimbolos) {
    const cadena = procesarExpresion(instruccion.expresion, tablaDeSimbolos).valor;
    //console.log('> ' + cadena);
    return '\n>>>' + cadena;
}

// EXPRESION
function procesarExpresion(expresion,tablaDeSimbolos){
    if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
        const valor = procesarExpresion(expresion.operandoIzq, tablaDeSimbolos);
        if(valor.tipo === TIPO_VALOR.ENTERO || valor.tipo === TIPO_VALOR.DOUBLE){
            const res= valor.valor * -1;
            return {valor: res, tipo: TIPO_VALOR.ENTERO};
        }else{
            throw 'ERROR -> expresion: "' + valor.valor + '" No se puede negar';
        }
    }else if(expresion.tipo === TIPO_OPERACION.SUMA){
        var valor = procesarExpresion(expresion.operandoIzq,tablaDeSimbolos);
        var valor2 = procesarExpresion(expresion.operandoDer,tablaDeSimbolos);
        return suma(valor,valor2);
    }else if(expresion.tipo === TIPO_OPERACION.RESTA){
        var valor = procesarExpresion(expresion.operandoIzq,tablaDeSimbolos);
        var valor2 = procesarExpresion(expresion.operandoDer,tablaDeSimbolos);
        return resta(valor,valor2);
    }else if(expresion.tipo === TIPO_OPERACION.MULTIPLICACION){
        var valor = procesarExpresion(expresion.operandoIzq,tablaDeSimbolos);
        var valor2 = procesarExpresion(expresion.operandoDer,tablaDeSimbolos);
        return multiplicar(valor,valor2);
    }else if(expresion.tipo === TIPO_OPERACION.DIVISION){
        var valor = procesarExpresion(expresion.operandoIzq,tablaDeSimbolos);
        var valor2 = procesarExpresion(expresion.operandoDer,tablaDeSimbolos);
        return dividir(valor,valor2);
    }else if (expresion.tipo === TIPO_VALOR.CADENA) {
        return {valor: expresion.valor, tipo: TIPO_VALOR.CADENA };
    }else if (expresion.tipo === TIPO_VALOR.ENTERO) {
        return {valor: expresion.valor, tipo: TIPO_VALOR.ENTERO };
    }else if (expresion.tipo === TIPO_VALOR.BOOLEAN) {
        return {valor: expresion.valor.toLowerCase(), tipo: TIPO_VALOR.BOOLEAN };
    }else if (expresion.tipo === TIPO_VALOR.DOUBLE) {
        return {valor: expresion.valor, tipo: TIPO_VALOR.DOUBLE };
    }else if (expresion.tipo === TIPO_VALOR.CARACTER) {
        return {valor: expresion.valor, tipo: TIPO_VALOR.CARACTER};
    }else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
        const sym = tablaDeSimbolos.obtener(expresion.valor);
        return {valor: sym.valor, tipo: sym.tipo};
    }
}

//DECLARACION
function procesarDeclaracion(instruccion, tablaDeSimbolos) { //aqui cambiamos para que acepte el tipo_dato de la declaracion
    var nvalor;
    instruccion.identificadores.forEach(identificador=>{
        if(instruccion.valor.tipo === TIPO_VALOR.IDENTIFICADOR){
            nvalor = obtenerValor(instruccion.valor.valor,tablaDeSimbolos);
            tablaDeSimbolos.agregar(identificador.toLowerCase(), instruccion.tipo_dato, nvalor);
        }else{
            var v = procesarExpresion(instruccion.valor,tablaDeSimbolos);
            nvalor = instruccionesAPI.nuevoValor(v.valor,v.tipo);
            /*if(instruccion.valor.tipo === TIPO_OPERACION.NEGATIVO || instruccion.valor.tipo === TIPO_OPERACION.SUMA){
                v = procesarExpresion(instruccion.valor,tablaDeSimbolos);
                nvalor = instruccionesAPI.nuevoValor(v.valor,v.tipo);
            }*/
            tablaDeSimbolos.agregar(identificador.toLowerCase(), instruccion.tipo_dato, nvalor);
        }
    });  
}

// OBTENER VALOR DE OTRA VARIABLE
function obtenerValor(id,tablaDeSimbolos){
    const sym = tablaDeSimbolos.obtener(id);
    if(sym.valor.tipo === TIPO_VALOR.IDENTIFICADOR){
        return obtenerValor(sym.valor.id,tablaDeSimbolos);
    }else{
        return sym;
    }
}

//FUNCION SUMA
function suma(izq,der){
    var sum;
    if((izq.tipo === TIPO_VALOR.CADENA || der.tipo === TIPO_VALOR.CADENA)||(izq.tipo === TIPO_VALOR.CARACTER && der.tipo === TIPO_VALOR.CARACTER)){
        sum = izq.valor.toString() + der.valor.toString();
        return {valor: sum, tipo: TIPO_VALOR.CADENA }; 
    }else if(izq.tipo === TIPO_VALOR.DOUBLE || der.tipo === TIPO_VALOR.DOUBLE){
        sum = obtener_no(izq) + obtener_no(der);
        return {valor: sum, tipo: TIPO_VALOR.DOUBLE }; 
    }else if(izq.tipo === TIPO_VALOR.ENTERO || der.tipo === TIPO_VALOR.ENTERO){
        sum = obtener_no(izq) + obtener_no(der);
        return {valor: sum, tipo: TIPO_VALOR.ENTERO };
    }else{
        throw 'ERROR -> No se puede sumar: ' + izq.valor + ' con ' + der.valor;
    }
}

//FUNCION RESTA
function resta(izq,der){
    var resta;
    if((izq.tipo === TIPO_VALOR.CADENA || der.tipo === TIPO_VALOR.CADENA)||(izq.tipo === TIPO_VALOR.CARACTER && der.tipo === TIPO_VALOR.CARACTER)){
        throw 'ERROR -> No se puede restar: ' + izq.valor + ' con ' + der.valor;
    }else if(izq.tipo === TIPO_VALOR.DOUBLE || der.tipo === TIPO_VALOR.DOUBLE){
        resta = obtener_no(izq) - obtener_no(der);
        return {valor: resta, tipo: TIPO_VALOR.DOUBLE }; 
    }else if(izq.tipo === TIPO_VALOR.ENTERO || der.tipo === TIPO_VALOR.ENTERO){
        resta = obtener_no(izq) - obtener_no(der);
        return {valor: resta, tipo: TIPO_VALOR.ENTERO };
    }else{
        throw 'ERROR -> No se puede restar: ' + izq.valor + ' con ' + der.valor;
    }
}

//FUNCION MULTIPLICAR
function multiplicar(izq,der){
    var res;
    if((izq.tipo === TIPO_VALOR.CADENA || der.tipo === TIPO_VALOR.CADENA)||(izq.tipo === TIPO_VALOR.CARACTER && der.tipo === TIPO_VALOR.CARACTER)){
        throw 'ERROR -> No se puede Multiplicar: ' + izq.valor + ' con ' + der.valor;
    }else if((izq.tipo === TIPO_VALOR.DOUBLE || der.tipo === TIPO_VALOR.DOUBLE) && !(izq.tipo === TIPO_VALOR.BOOLEAN || der.tipo === TIPO_VALOR.BOOLEAN)){
        res = obtener_no(izq) * obtener_no(der);
        return {valor: res, tipo: TIPO_VALOR.DOUBLE }; 
    }else if((izq.tipo === TIPO_VALOR.ENTERO || der.tipo === TIPO_VALOR.ENTERO)&& !(izq.tipo === TIPO_VALOR.BOOLEAN || der.tipo === TIPO_VALOR.BOOLEAN)){
        res = obtener_no(izq) * obtener_no(der);
        return {valor: res, tipo: TIPO_VALOR.ENTERO };
    }else{
        throw 'ERROR -> No se puede multiplicar: ' + izq.valor + ' con ' + der.valor;
    }
}

//FUNCION DIVIDIR
function dividir(izq,der){
    var res;
    if((izq.tipo === TIPO_VALOR.CADENA || der.tipo === TIPO_VALOR.CADENA)||(izq.tipo === TIPO_VALOR.CARACTER && der.tipo === TIPO_VALOR.CARACTER)){
        throw 'ERROR -> No se puede Dividir: ' + izq.valor + ' con ' + der.valor;
    }else if((izq.tipo === TIPO_VALOR.DOUBLE || der.tipo === TIPO_VALOR.DOUBLE) && !(izq.tipo === TIPO_VALOR.BOOLEAN || der.tipo === TIPO_VALOR.BOOLEAN)){
        res = obtener_no(izq)/obtener_no(der);
        return {valor: res, tipo: TIPO_VALOR.DOUBLE }; 
    }else if((izq.tipo === TIPO_VALOR.ENTERO || der.tipo === TIPO_VALOR.ENTERO)&& !(izq.tipo === TIPO_VALOR.BOOLEAN || der.tipo === TIPO_VALOR.BOOLEAN)){
        res = obtener_no(izq)/obtener_no(der);
        return {valor: res, tipo: TIPO_VALOR.DOUBLE };
    }else{
        throw 'ERROR -> No se puede Dividir: ' + izq.valor + ' con ' + der.valor;
    }
}

//RETORNA VALOR ENTERO DE TRUE,FALSE Y CHAR
function obtener_no(val){
    if(val.tipo === TIPO_VALOR.BOOLEAN){
        if(val.valor == 'true'){
            return 1;
        }else{
            return 0;
        }
    }else if(val.tipo === TIPO_VALOR.CARACTER){
        return val.valor.charCodeAt()
    }else{
        return val.valor;
    }
}