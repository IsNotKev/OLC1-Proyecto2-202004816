const { TIPO_VALOR } = require("./instrucciones");

const TIPO_DATO = {
    ENTERO:         'V_ENTERO',
	DOUBLE:			'V_DECIMAL',
	IDENTIFICADOR:  'IDENTIFICADOR',
	CADENA:         'V_CADENA',
	CARACTER:		'V_CARACTER',
	BOOLEAN:		'V_BOOLEAN',
	VOID:			'VOID'
}

function crearSimbolo(id, tipo, valor) {
    return {
        id: id,
        tipo: tipo,
        valor: valor
    }
}

function crearFuncion(id,parametros,tipo,instrucciones,dato){
    return {
        id: id,
        parametros: parametros,
        tipo: tipo,
        instrucciones: instrucciones,
        tipo_dato: dato
    }
}

class TS{

    constructor (simbolos,funciones) {
        this._simbolos = simbolos;
        this._funciones = funciones;
    }

    agregar(id, tipo, valor) {
        var verificar = this.existe(id);
        if(!verificar){
            const nuevoSimbolo = crearSimbolo(id, tipo);
            if(nuevoSimbolo.tipo===valor.tipo){
                nuevoSimbolo.valor = valor.valor;          
            }else{
                if(nuevoSimbolo.tipo === TIPO_VALOR.DOUBLE && valor.tipo === TIPO_VALOR.ENTERO){
                    nuevoSimbolo.valor = valor.valor; 
                }else{
                    throw 'ERROR DE TIPOS -> variable: ' + id + ' tiene tipo: '+ nuevoSimbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo;
                }          
            }
            this._simbolos.push(nuevoSimbolo);
        }else{
            throw 'ERROR DE TIPOS -> variable: ' + id + ' Ya Existe.'
        }
        
    }

    actualizar(id, valor) { //AQUI VAMOS A VALIDAR TIPOS
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) {
            if(simbolo.tipo===valor.tipo){
                simbolo.valor = valor.valor;            
            }else{
                if(simbolo.tipo === TIPO_VALOR.DOUBLE && valor.tipo === TIPO_VALOR.ENTERO){
                    simbolo.valor = valor.valor; 
                }else{
                    throw 'ERROR DE TIPOS -> variable: ' + id + ' tiene tipo: '+ simbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo;
                } 
            }
        }
        else {
            throw 'ERROR: variable: ' + id + ' no ha sido definida';
        }
    }

    obtener(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];

        if (simbolo) return simbolo; //aqui devolvemos el simbolo completo
        else throw 'ERROR: variable: ' + id + ' no ha sido definida';
    }

    existe(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];

        if (simbolo) return true;
        else return false;
    }

    existeFuncion(id){
        const funcion = this._funciones.filter(funcion => funcion.id === id)[0];

        if (funcion) return true;
        else return false;
    }

    agregarFuncion(id,parametros,tipo,instrucciones,dato){
        var verificar = this.existe(id);
        if(!verificar){
            const nuevaFuncion = crearFuncion(id,parametros,tipo,instrucciones,dato);
            this._funciones.push(nuevaFuncion);
        }else{
            throw 'ERROR DE TIPOS -> funcion: ' + id + ' Ya Existe.'
        }
    }

    obtenerFuncion(id) {
        const funcion = this._funciones.filter(funcion => funcion.id === id)[0];

        if (funcion) return funcion; //aqui devolvemos el simbolo completo
        else throw 'ERROR: funcion: ' + id + ' no ha sido definida';
    }

    get simbolos() {
        return this._simbolos;
    }

    get funciones() {
        return this._funciones;
    }

}

module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;