const TIPO_VALOR = {
	ENTERO:         'V_ENTERO',
	DOUBLE:			'V_DECIMAL',
	IDENTIFICADOR:  'IDENTIFICADOR',
	CADENA:         'V_CADENA',
	CARACTER:		'V_CARACTER',
	BOOLEAN:		'V_BOOLEAN',
	VOID:			'VOID'
}

const TIPO_OPERACION = {
	SUMA:           'OP_SUMA',
	RESTA:          'OP_RESTA',
	MULTIPLICACION: 'OP_MULTIPLICACION',
	DIVISION:       'OP_DIVISION',
	POTENCIA:		'OP_POTENCIA',
	MODULO:			'OP_MODULO',
	NEGATIVO:       'OP_NEGATIVO',
	INCREMENTO:		'OP_INCREMENTO',
	DECREMENTO: 	'OP_DECREMENTO',

	MAYOR_QUE:      'OP_MAYOR_QUE',
	MENOR_QUE:      'OP_MENOR_QUE',
	MAYOR_IGUAL: 	'OP_MAYOR_IGUAL',
	MENOR_IGUAL:    'OP_MENOR_IGUAL',
	DOBLE_IGUAL:    'OP_DOBLE_IGUAL',
	DIFERENTE:    	'OP_NO_IGUAL',

	AND:  			'OP_AND',
	OR: 			'OP_OR',
	NOT:   			'OP_NOT',
	TERNARIO:		'OP_TERNARIO',

	CASTEO:			'OP_CASTEO',
	TOLOWER:		'OP_TOLOWER',
	TOUPPER:		'OP_TOUPPER',
	ROUND:			'OP_ROUND',
	TYPEOF: 		'OP_TYPEOF',
	LENGTH:			'OP_LENGTH'
};

const TIPO_INSTRUCCION = {
	IMPRIMIRLN:		'INSTR_IMPRIMIRLN',
	IMPRIMIR:		'INSTR_IMPRIMIR',
	MIENTRAS:		'INSTR_MIENTRAS',
	DOMIENTRAS:		'INSTR_DOMIENTRAS',
	DECLARACION:	'INSTR_DECLARACION',
	ASIGNACION:		'INSTR_ASIGANCION',
	IF:				'INSTR_IF',
	IF_ELSE:		'INSTR_ELSE',
	BREAK:			'INSTR_BREAK',
	CONTINUE:		'INSTR_CONTINUE',
	FOR: 			'INST_FOR',
	/*SWITCH:			'SWITCH',
	SWITCH_OP:		'SWITCH_OP',
	SWITCH_DEF:		'SWITCH_DEF',
	ASIGNACION_SIMPLIFICADA: 'ASIGNACION_SIMPLIFICADA'*/
	METODO:			'INSTR_METODO',
	PARAMETRO:		'INSTR_PARAMETRO',
	LLAMAR:    		'INSTR_LLAMAR'
}

function nuevaOperacion(operandoIzq, operandoDer, tipo) {
	return {
		operandoIzq: operandoIzq,
		operandoDer: operandoDer,
		tipo: tipo
	}
}

const instruccionesAPI = {
    nuevoOperacionBinaria: function(operandoIzq, operandoDer, tipo) {
		return nuevaOperacion(operandoIzq, operandoDer, tipo);
	},
    nuevoOperacionUnaria: function(operando, tipo) {
		return nuevaOperacion(operando, undefined, tipo);
	},
    nuevoValor: function(valor, tipo) {
		return {
			tipo: tipo,
			valor: valor
		}
	},
    nuevoImprimirLn: function(expresion) {
		return {
			tipo: TIPO_INSTRUCCION.IMPRIMIRLN,
			expresion: expresion
		};
	},
	nuevoImprimir: function(expresion) {
		return {
			tipo: TIPO_INSTRUCCION.IMPRIMIR,
			expresion: expresion
		};
	},
    nuevoDeclaracion: function(identificador, tipo, valor) {
		return {
			tipo: TIPO_INSTRUCCION.DECLARACION,
			identificadores: identificador,
			tipo_dato: tipo,
			valor: valor
		}
	},
    nuevoAsignacion: function(identificador, valor) {
		return {
			tipo: TIPO_INSTRUCCION.ASIGNACION,
			identificadores: identificador,
			valor: valor
		}
	},
    nuevoCasteo: function(tipo,valor){
		return {
			tipo: TIPO_OPERACION.CASTEO,
			tipo_casteo: tipo,
			valor: valor
		} 
	},
	nuevoIf: function(expresionLogica, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.IF,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		}
	},
	nuevoIfElse: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso) {
		return {
			tipo: TIPO_INSTRUCCION.IF_ELSE,
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso
		}
	},
	nuevoOperadorTernario: function(expresionLogica, instruccionesIfVerdadero, instruccionesIfFalso) {
		return {
			tipo: TIPO_OPERACION.TERNARIO,
			expresionLogica: expresionLogica,
			instruccionesIfVerdadero: instruccionesIfVerdadero,
			instruccionesIfFalso: instruccionesIfFalso
		}
	},
	nuevoBreak: function(){
		return{
			tipo: TIPO_INSTRUCCION.BREAK
		}
	},
	nuevoContinue: function(){
		return{
			tipo: TIPO_INSTRUCCION.CONTINUE
		}
	},
	nuevoParametro: function(tipo,identificador){
		return{
			tipo: TIPO_INSTRUCCION.PARAMETRO,
			tipo_dato: tipo,
			identificador:identificador
		}
	},
	nuevoMetodo: function(identificador,parametros, instrucciones, tipo){
		return{
			tipo: TIPO_INSTRUCCION.METODO,
			identificador:identificador,
			parametros: parametros,
			instrucciones: instrucciones,
			tipo_dato: tipo
		}
	},
	nuevoLlamar: function(id,params){
		return{
			tipo: TIPO_INSTRUCCION.LLAMAR,
			identificador: id,
			parametros: params
		}
	},
	nuevoToLower: function(cadena){
		return{
			tipo: TIPO_OPERACION.TOLOWER,
			cadena: cadena
		}
	},
	nuevoToUpper: function(cadena){
		return{
			tipo: TIPO_OPERACION.TOUPPER,
			cadena: cadena
		}
	},
	nuevoRound: function(expresion){
		return{
			tipo: TIPO_OPERACION.ROUND,
			expresion: expresion
		}
	},
	nuevoTypeOf: function(expresion){
		return{
			tipo: TIPO_OPERACION.TYPEOF,
			expresion: expresion
		}
	},
	nuevoMientras: function(expresionLogica, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.MIENTRAS,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		};
	},
	nuevoDoMientras: function(expresionLogica, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.DOMIENTRAS,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones
		};
	},
	nuevoFor: function (variable, expresionLogica, aumento, instrucciones) {
		return {
			tipo: TIPO_INSTRUCCION.FOR,
			expresionLogica: expresionLogica,
			instrucciones: instrucciones,
			aumento: aumento,
			variable: variable
		}
	},
	nuevoLength: function(expresion){
		return{
			tipo: TIPO_OPERACION.LENGTH,
			expresion: expresion
		}
	}
}

module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION = TIPO_INSTRUCCION;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
//module.exports.TIPO_OPCION_SWITCH = TIPO_OPCION_SWITCH;