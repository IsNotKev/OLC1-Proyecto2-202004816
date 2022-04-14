/**
 * Ejemplo mi primer proyecto con Jison
 */

/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
(\/\*(\s*|.*?)*\*\/)                		// comentario multiple líneas

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