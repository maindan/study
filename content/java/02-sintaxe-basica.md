---
title: "Sintaxe Básica"
---

# Sintaxe Básica

Aqui você aprende os blocos fundamentais: variáveis, tipos, operadores e como o Java lida com a conversão entre tipos.

## Variáveis

Uma variável é um espaço na memória com um **nome** e um **tipo**. Em Java, você precisa declarar o tipo (linguagem fortemente tipada):

```java
int idade = 30;
double salario = 4500.50;
String nome = "Maria";
```

A forma geral é: `tipo nome = valor;`

## Tipos primitivos

Java tem **8 tipos primitivos**. Eles guardam valores simples diretamente (não são objetos):

| Tipo | Tamanho | Exemplo | Para que serve |
|------|---------|---------|----------------|
| `byte` | 8 bits | `byte b = 100;` | Inteiros bem pequenos (-128 a 127) |
| `short` | 16 bits | `short s = 30000;` | Inteiros pequenos |
| `int` | 32 bits | `int i = 100000;` | Inteiro padrão |
| `long` | 64 bits | `long l = 9000000000L;` | Inteiros muito grandes (note o `L`) |
| `float` | 32 bits | `float f = 3.14f;` | Decimal de menor precisão (note o `f`) |
| `double` | 64 bits | `double d = 3.14159;` | Decimal padrão |
| `boolean` | 1 bit | `boolean ativo = true;` | Verdadeiro ou falso |
| `char` | 16 bits | `char letra = 'A';` | Um único caractere (aspas simples) |

```java
int populacao = 215_000_000;   // _ melhora a leitura, é ignorado
long distancia = 384_400_000L; // sufixo L obrigatório p/ long grande
double pi = 3.14159;
char inicial = 'J';
boolean aprovado = true;
```

> **Atenção**: `String` (com S maiúsculo) **não** é um primitivo — é uma classe. Mas é tão usada que parece um tipo básico.

## var (inferência de tipo)

A partir do Java 10, você pode usar `var` para variáveis **locais**. O compilador descobre o tipo pelo valor:

```java
var idade = 30;          // inferido como int
var nome = "Carlos";     // inferido como String
var preco = 9.99;        // inferido como double
```

`var` só funciona dentro de métodos e **exige** um valor inicial. Não use em campos de classe nem em parâmetros. Use com bom senso: quando o tipo já está óbvio.

## Operadores aritméticos

```java
int a = 10, b = 3;
System.out.println(a + b);  // 13  soma
System.out.println(a - b);  // 7   subtração
System.out.println(a * b);  // 30  multiplicação
System.out.println(a / b);  // 3   divisão INTEIRA (descarta decimal)
System.out.println(a % b);  // 1   resto da divisão (módulo)

double x = 10.0 / 3;        // 3.333... divisão com decimal
```

Atalhos comuns:

```java
int n = 5;
n += 2;   // n = n + 2  → 7
n -= 1;   // 6
n++;      // incremento → 7
n--;      // decremento → 6
```

## Operadores relacionais

Comparam valores e resultam em `boolean`:

```java
int a = 5, b = 8;
System.out.println(a == b);  // false (igual)
System.out.println(a != b);  // true  (diferente)
System.out.println(a < b);   // true
System.out.println(a > b);   // false
System.out.println(a <= 5);  // true
System.out.println(a >= 6);  // false
```

## Operadores lógicos

Combinam expressões booleanas:

```java
boolean temIdade = true;
boolean temIngresso = false;

System.out.println(temIdade && temIngresso); // E (AND): false
System.out.println(temIdade || temIngresso); // OU (OR): true
System.out.println(!temIdade);               // NÃO (NOT): false
```

`&&` e `||` têm **curto-circuito**: se o primeiro operando já decide o resultado, o segundo nem é avaliado.

## Casting (conversão de tipos)

### Conversão implícita (widening)

Do menor para o maior, automática e segura:

```java
int i = 100;
double d = i;   // int vira double automaticamente: 100.0
```

### Conversão explícita (narrowing / cast)

Do maior para o menor, você precisa avisar o compilador — pode perder dados:

```java
double valor = 9.99;
int inteiro = (int) valor;   // 9  (a parte decimal é cortada)

long grande = 100000L;
int pequeno = (int) grande;  // cuidado com overflow se for muito grande
```

## Constantes com final

A palavra-chave `final` cria uma constante: depois de atribuído, o valor **não pode mudar**:

```java
final double PI = 3.14159;
final int DIAS_DA_SEMANA = 7;
// PI = 3.14;  // ERRO de compilação!
```

Por convenção, constantes usam **MAIÚSCULAS_COM_UNDERSCORE**.

## Comentários

```java
// Comentário de uma linha

/*
   Comentário de
   múltiplas linhas
*/

/**
 * Comentário de documentação (Javadoc)
 * usado para gerar documentação automática.
 */
```

## Atividades

- [ ] Declare uma variável de cada tipo primitivo e imprima todas com `println`.
- [ ] Demonstre a diferença entre divisão inteira (`int`) e divisão com `double`.
- [ ] Use `var` para declarar três variáveis e confirme que funcionam normalmente.
- [ ] Faça um cast de `double` para `int` e observe a perda da parte decimal.
- [ ] Crie uma constante `final` e tente alterá-la para ver o erro de compilação.
- [ ] Escreva uma expressão com `&&` e `||` que combine três condições booleanas.
