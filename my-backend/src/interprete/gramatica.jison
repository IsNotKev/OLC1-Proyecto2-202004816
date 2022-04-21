
%{
    const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const TIPO_DATO			= require('./tabla_simbolos').TIPO_DATO; //para jalar el tipo de dato
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
%}

/* Definición Léxica */

%lex

%options case-insensitive

%%

\s+                                 // se ignoran espacios en blanco
"//".*                              // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas

\"[^\"]*\"				        { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'(\\(n|\"|\'|\\|t|r)|.)\'			{ yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }

//Palabras reservadas

"Int"                   return "INT";
"Double"                return "DOUBLE";
"Boolean"               return "BOOLEAN";
"Char"                  return "CHAR";
"String"                return "STRING";

"True"                  return "TRUE";
"False"                 return "FALSE";

";"                     return 'PUNTOYCOMA';
","                     return 'COMA';

"if"                    return 'IF';
"else"                  return 'ELSE';
"switch"                return 'SWITCH';
"case"                  return 'CASE';
"default"               return 'DEFAULT';
"break"                 return 'BREAK';

"while"                 return 'WHILE';
"for"                   return 'FOR';
"do"                    return 'DO';
"continue"              return 'CONTINUE';

"return"                return 'RETURN';

"print"                 return 'PRINT';
"println"               return 'PRINTLN';

"tolower"               return 'TOLOWER';
"toupper"               return 'TOUPPER';
"round"                 return 'ROUND';

"length"                return 'LENGTH';
"typeof"                return 'TYPEOF';
"tostring"              return 'TOSTRING';
"tochararray"           return 'TOCHARARRAY';
"run"                   return 'RUN';


//Aritmetica
"+"                     return "MAS";
"-"                     return "MENOS";
"*"                     return "POR";
"/"                     return "DIVIDIR";
"^"                     return "POTENCIA";
"%"                     return "MODULO";


//Relacionales
"=="                    return 'D_IGUAL';
"<="                    return 'MENOR_IGUAL';
"<"                     return 'MENOR';
">="                    return 'MAYOR_IGUAL';                     
">"                     return 'MAYOR';
"!="                    return 'DIFERENTE';
"="                     return 'IGUAL';

//Lógicos
"||"                    return 'OR';
"&&"                    return 'AND';
"!"                     return 'NOT';

//Operador Ternario
"?"                     return 'INTERROGACION';
":"                     return 'DOSPUNTOS';

//Agrupación
"("                     return 'PAR_ABRE';
")"                     return 'PAR_CIERRA';
"{"                     return 'LLAVE_ABRE';
"}"                     return 'LLAVE_CIERRA';
"["                     return 'C_ABRE';
"]"                     return 'C_CIERRA';


//DATOS

[0-9]+("."[0-9]+)\b  	            return 'DECIMAL';
[0-9]+\b				            return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]*	            return 'IDENTIFICADOR';

<<EOF>>				    return 'EOF';
.					   {console.log(yylloc.first_line, yylloc.first_column,'Lexico',yytext)}


/lex


%left 'NOT' 'DOSPUNTOS'
%left 'OR'
%left 'AND'
%left 'DIFERENTE' 'D_IGUAL'
%left 'MENOR_IGUAL' 'MAYOR_IGUAL' 'MENOR' 'MAYOR'
%left 'MAS' 'MENOS' 
%left 'POR' 'DIVIDIR'
%left UMENOS
%right 'NOT' 

%start ini

%% 

ini
	: instrucciones EOF{
		return $1;
	}
;

instrucciones
    : instrucciones inicio
        {$1.push($2); $$=$1;}
    | inicio
    {$$=[$1]}
;

inicio
    :declaracion
    |print
;

declaracion
    :INT listaid IGUAL expresion PUNTOYCOMA       { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.ENTERO,$4); }
    |INT listaid PUNTOYCOMA                       { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.ENTERO,instruccionesAPI.nuevoValor(0, TIPO_VALOR.ENTERO)); }
    |DOUBLE listaid IGUAL expresion PUNTOYCOMA    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.DOUBLE,$4); }
    |DOUBLE listaid PUNTOYCOMA                    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.DOUBLE,instruccionesAPI.nuevoValor(0.0, TIPO_VALOR.DOUBLE)); }
    |CHAR listaid IGUAL expresion PUNTOYCOMA       { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CARACTER,$4); }
    |CHAR listaid PUNTOYCOMA                      { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CARACTER,instruccionesAPI.nuevoValor('', TIPO_VALOR.CARACTER)); }
    |STRING listaid IGUAL expresion PUNTOYCOMA    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CADENA,$4); }
    |STRING listaid PUNTOYCOMA                    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CADENA,instruccionesAPI.nuevoValor("", TIPO_VALOR.CADENA)); }
    |BOOLEAN listaid IGUAL expresion PUNTOYCOMA   { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.BOOLEAN,$4); }
    |BOOLEAN listaid PUNTOYCOMA                   { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.BOOLEAN,instruccionesAPI.nuevoValor('TRUE', TIPO_VALOR.BOOLEAN)); }
;

listaid
    :listaid COMA IDENTIFICADOR         {$1.push($3); $$=$1;}
    |IDENTIFICADOR                      {$$=[$1]}
;

expresion
    :MENOS expresion %prec UMENOS	   { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
    |expresion MAS expresion           { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
    |expresion MENOS expresion         
    |expresion POR expresion               
    |expresion DIVIDIR expresion
    |expresion POTENCIA expresion
    |expresion MODULO expresion        
    |expresion D_IGUAL expresion         
    |expresion DIFERENTE expresion       
    |expresion MAYOR_IGUAL expresion    
    |expresion MENOR_IGUAL expresion    
    |expresion MAYOR expresion                   
    |expresion MENOR expresion          
    |PAR_ABRE expresion PAR_CIERRA      { $$= $2 }
	|ENTERO	                            { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.ENTERO); }					
	|CADENA                             { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
    |CARACTER                           { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CARACTER); }
    |DECIMAL                            { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.DOUBLE); }    					
    |TRUE                               { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }                            
    |FALSE                              { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }  
    |IDENTIFICADOR                      { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }  
;

print
    :PRINTLN PAR_ABRE expresion PAR_CIERRA PUNTOYCOMA {$$ = instruccionesAPI.nuevoImprimirLn($3);}
    |PRINT PAR_ABRE expresion PAR_CIERRA PUNTOYCOMA {$$ = instruccionesAPI.nuevoImprimir($3);}
;