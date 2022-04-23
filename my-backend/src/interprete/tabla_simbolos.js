const { TIPO_VALOR } = require("./instrucciones");

const TIPO_DATO = {
    ENTERO:         0,
	DOUBLE:			1,
	IDENTIFICADOR:  2,
	CADENA:         3,
	CARACTER:		4,
	BOOLEAN:		5
}

function crearSimbolo(id, tipo, valor) {
    return {
        id: id,
        tipo: tipo,
        valor: valor
    }
}

class TS{

    constructor (simbolos) {
        this._simbolos = simbolos;
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

        if (simbolo) return true; //aqui devolvemos el simbolo completo
        else return false;
    }

    get simbolos() {
        return this._simbolos;
    }

}

module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;