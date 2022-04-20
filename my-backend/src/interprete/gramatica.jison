
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

\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'[^\"]*\'			    { yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; }
[0-9]+("."[0-9]+)\b  	return 'DECIMAL';
[0-9]+\b				return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';

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
    :INT IDENTIFICADOR IGUAL expresionint PUNTOYCOMA
    |INT IDENTIFICADOR PUNTOYCOMA
    |DOUBLE IDENTIFICADOR IGUAL expresion PUNTOYCOMA
    |DOUBLE IDENTIFICADOR PUNTOYCOMA
    |CHAR IDENTIFICADOR CARACTER PUNTOYCOMA
    |CHAR IDENTIFICADOR PUNTOYCOMA
    |STRING IDENTIFICADOR expresion PUNTOYCOMA
    |STRING IDENTIFICADOR PUNTOYCOMA
;

expresion
    :MENOS expresion %prec UMENOS		
    |expresion MAS expresion            
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