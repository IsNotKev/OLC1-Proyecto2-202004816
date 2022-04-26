
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

\"[^\"]*\"				            { yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
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
"void"                  return 'VOID';


//Aritmetica
"++"                    return "INCREMENTO";
"--"                    return "DECREMENTO";
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


%left 'NOT' 'INTERROGACION' 'DOSPUNTOS' 'COMA'
%left 'OR'
%left 'AND'
%left 'DIFERENTE' 'D_IGUAL'
%left 'MENOR_IGUAL' 'MAYOR_IGUAL' 'MENOR' 'MAYOR'
%left 'MAS' 'MENOS' 
%left 'POR' 'DIVIDIR'
%left UMENOS
%left UNOT 

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
    |if
    |BREAK PUNTOYCOMA                                               { $$ = instruccionesAPI.nuevoBreak(); }
    |metodo
    |llamado
    |while
    |for
;

for
    :FOR PAR_ABRE declaracion expresion PUNTOYCOMA asignaciones PAR_CIERRA statement { $$ = instruccionesAPI.nuevoFor($3,$4,$6,$8); }
;

while
    :WHILE PAR_ABRE expresion PAR_CIERRA statement                  { $$ = instruccionesAPI.nuevoMientras($3,$5); }
    |DO statement WHILE PAR_ABRE expresion PAR_CIERRA PUNTOYCOMA    { $$ = instruccionesAPI.nuevoDoMientras($5,$2); }
;

llamado
    :IDENTIFICADOR PAR_ABRE pp PAR_CIERRA PUNTOYCOMA                { $$ = instruccionesAPI.nuevoLlamar($1,$3); }
    |IDENTIFICADOR PAR_ABRE PAR_CIERRA PUNTOYCOMA                   { $$ = instruccionesAPI.nuevoLlamar($1,[]); }
;

pp
    : pp COMA expresion             { $1.push($3); $$ = $1; }
    | expresion                     { $$ = [$1] }
;

metodo
    :IDENTIFICADOR pars DOSPUNTOS VOID statement        { $$ = instruccionesAPI.nuevoMetodo($1,$2,$5,TIPO_VALOR.VOID); }    
    |IDENTIFICADOR pars statement                       { $$ = instruccionesAPI.nuevoMetodo($1,$2,$3,TIPO_VALOR.VOID); } 
    |IDENTIFICADOR pars DOSPUNTOS tipos statement       { $$ = instruccionesAPI.nuevoMetodo($1,$2,$5,$4); }
;

pars
    : PAR_ABRE parametros PAR_CIERRA        {$$ = $2;}
    | PAR_ABRE PAR_CIERRA                   {$$ = [];}
;

parametros
    : parametros COMA tipos IDENTIFICADOR   { $1.push(instruccionesAPI.nuevoParametro($3,$4)); $$=$1; }
    | tipos IDENTIFICADOR                   { $$ = [instruccionesAPI.nuevoParametro($1,$2)]; }          
;

tipos
    : INT                   { $$ = TIPO_VALOR.ENTERO; }
    | DOUBLE                { $$ = TIPO_VALOR.DOUBLE; }
    | CHAR                  { $$ = TIPO_VALOR.CARACTER; }
    | STRING                { $$ = TIPO_VALOR.CADENA; }
    | BOOLEAN               { $$ = TIPO_VALOR.BOOLEAN; }
;

if
    :IF PAR_ABRE expresion PAR_CIERRA statement                                             { $$ = instruccionesAPI.nuevoIf($3,$5);}
    |IF PAR_ABRE expresion PAR_CIERRA statement ELSE statement                              { $$ = instruccionesAPI.nuevoIfElse($3,$5,$7); }
    |IF PAR_ABRE expresion PAR_CIERRA statement ELSE if                                     { $$ = instruccionesAPI.nuevoIfElse($3,$5,$7); }
;

statement
    : LLAVE_ABRE instrucciones LLAVE_CIERRA         { $$ = $2; }
    | LLAVE_ABRE LLAVE_CIERRA                       { $$ = []; }
;

declaracion
    :INT listaid IGUAL expresion PUNTOYCOMA       { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.ENTERO,$4); }
    |INT listaid PUNTOYCOMA                       { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.ENTERO,instruccionesAPI.nuevoValor(0, TIPO_VALOR.ENTERO)); }
    |DOUBLE listaid IGUAL expresion PUNTOYCOMA    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.DOUBLE,$4); }
    |DOUBLE listaid PUNTOYCOMA                    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.DOUBLE,instruccionesAPI.nuevoValor(0.0, TIPO_VALOR.DOUBLE)); }
    |CHAR listaid IGUAL expresion PUNTOYCOMA      { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CARACTER,$4); }
    |CHAR listaid PUNTOYCOMA                      { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CARACTER,instruccionesAPI.nuevoValor('', TIPO_VALOR.CARACTER)); }
    |STRING listaid IGUAL expresion PUNTOYCOMA    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CADENA,$4); }
    |STRING listaid PUNTOYCOMA                    { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.CADENA,instruccionesAPI.nuevoValor("", TIPO_VALOR.CADENA)); }
    |BOOLEAN listaid IGUAL expresion PUNTOYCOMA   { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.BOOLEAN,$4); }
    |BOOLEAN listaid PUNTOYCOMA                   { $$ = instruccionesAPI.nuevoDeclaracion($2, TIPO_DATO.BOOLEAN,instruccionesAPI.nuevoValor('TRUE', TIPO_VALOR.BOOLEAN)); }
    |asignaciones PUNTOYCOMA                      { $$ = $1; }
;

asignaciones
    :listaid IGUAL expresion           { $$ = instruccionesAPI.nuevoAsignacion($1,$3); }
    |IDENTIFICADOR INCREMENTO          { $$ = instruccionesAPI.nuevoAsignacion([$1],instruccionesAPI.nuevoOperacionUnaria(instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR),TIPO_OPERACION.INCREMENTO)); }
    |IDENTIFICADOR DECREMENTO          { $$ = instruccionesAPI.nuevoAsignacion([$1],instruccionesAPI.nuevoOperacionUnaria(instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR),TIPO_OPERACION.DECREMENTO)); }
;

listaid
    :listaid COMA IDENTIFICADOR         {$1.push($3); $$=$1;}
    |IDENTIFICADOR                      {$$=[$1]}
;

mmuno
    :expresion INCREMENTO	            { $$ = instruccionesAPI.nuevoOperacionUnaria($1, TIPO_OPERACION.INCREMENTO); }
    |expresion DECREMENTO	            { $$ = instruccionesAPI.nuevoOperacionUnaria($1, TIPO_OPERACION.DECREMENTO); }
;

expresion
    :MENOS expresion %prec UMENOS	    { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
    |mmuno                              { $$=$1; }
    |expresion INTERROGACION expresion DOSPUNTOS expresion  { $$ = instruccionesAPI.nuevoOperadorTernario($1,$3,$5); }
    |expresion MAS expresion            { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
    |expresion MENOS expresion          { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
    |expresion POR expresion            { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }   
    |expresion DIVIDIR expresion        { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
    |expresion POTENCIA expresion       { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.POTENCIA); }
    |expresion MODULO expresion         { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MODULO); }
    |expresion D_IGUAL expresion        { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DOBLE_IGUAL); } 
    |expresion DIFERENTE expresion      { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.DIFERENTE); } 
    |expresion MAYOR_IGUAL expresion    { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL); } 
    |expresion MENOR_IGUAL expresion    { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL); } 
    |expresion MAYOR expresion          { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_QUE); }         
    |expresion MENOR expresion          { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_QUE); }
    |NOT expresion %prec UNOT           { $$ = instruccionesAPI.nuevoOperacionUnaria($2, TIPO_OPERACION.NOT); }
    |expresion AND expresion            { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
    |expresion OR expresion             { $$ = instruccionesAPI.nuevoOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
    |PAR_ABRE nums PAR_CIERRA expresion { $$ = instruccionesAPI.nuevoCasteo($2,$4);} 
    |TOSTRING PAR_ABRE expresion PAR_CIERRA { $$ = instruccionesAPI.nuevoCasteo(TIPO_VALOR.CADENA,$3);}
    |TOLOWER PAR_ABRE expresion PAR_CIERRA  { $$ = instruccionesAPI.nuevoToLower($3); }
    |TOUPPER PAR_ABRE expresion PAR_CIERRA  { $$ = instruccionesAPI.nuevoToUpper($3); }
    |ROUND PAR_ABRE expresion PAR_CIERRA    { $$ = instruccionesAPI.nuevoRound($3); }
    |TYPEOF PAR_ABRE expresion PAR_CIERRA   { $$ = instruccionesAPI.nuevoTypeOf($3); }
    |PAR_ABRE expresion PAR_CIERRA      { $$= $2 }
	|ENTERO	                            { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.ENTERO); }					
	|CADENA                             { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
    |CARACTER                           { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CARACTER); }
    |DECIMAL                            { $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.DOUBLE); }    					
    |TRUE                               { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }                            
    |FALSE                              { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.BOOLEAN); }  
    |IDENTIFICADOR                      { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); } 
;

nums
    :INT            {$$ = TIPO_VALOR.ENTERO;}
    |DOUBLE         {$$ = TIPO_VALOR.DOUBLE;}
    |CHAR           {$$ = TIPO_VALOR.CARACTER;}
;

print
    :PRINTLN PAR_ABRE expresion PAR_CIERRA PUNTOYCOMA {$$ = instruccionesAPI.nuevoImprimirLn($3);}
    |PRINT PAR_ABRE expresion PAR_CIERRA PUNTOYCOMA {$$ = instruccionesAPI.nuevoImprimir($3);}
;