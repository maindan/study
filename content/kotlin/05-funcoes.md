---
title: "Funções e Lambdas"
---

# Funções e Lambdas

Funções são blocos de código reutilizáveis. Kotlin oferece muitos recursos que tornam as funções mais flexíveis e expressivas que em Java.

## Declarando funções

Use a palavra-chave `fun`. O tipo de retorno vem **depois** dos parâmetros, separado por `:`.

```kotlin
fun somar(a: Int, b: Int): Int {
    return a + b
}

println(somar(2, 3))   // 5
```

A estrutura é: `fun nome(parametro: Tipo): TipoDeRetorno`.

### Funções sem retorno

Quando uma função não retorna nada útil, o tipo é `Unit` (equivale a `void` no Java) e pode ser omitido:

```kotlin
fun saudar(nome: String) {   // : Unit implícito
    println("Olá, $nome")
}
```

## Funções de uma única expressão

Se a função é só um `return`, você pode usar `=` e dispensar as chaves e o tipo (inferido):

```kotlin
fun somar(a: Int, b: Int) = a + b

fun dobro(x: Int) = x * 2

fun ehMaiorDeIdade(idade: Int) = idade >= 18
```

Isso deixa o código muito mais conciso que o Java.

## Parâmetros default

Você pode dar **valores padrão** aos parâmetros. Assim não precisa de várias sobrecargas (overloads) como em Java.

```kotlin
fun cumprimentar(nome: String, saudacao: String = "Olá") {
    println("$saudacao, $nome!")
}

cumprimentar("Ana")              // Olá, Ana!
cumprimentar("Beto", "Bom dia")  // Bom dia, Beto!
```

## Argumentos nomeados

Você pode passar argumentos pelo **nome**, em qualquer ordem. Isso melhora a legibilidade e combina muito bem com parâmetros default.

```kotlin
fun criarUsuario(nome: String, idade: Int = 0, ativo: Boolean = true) {
    println("$nome, $idade anos, ativo: $ativo")
}

criarUsuario(nome = "Lia", ativo = false)
criarUsuario(idade = 25, nome = "Theo")
```

## Lambdas (funções anônimas)

Uma **lambda** é uma função sem nome, escrita entre chaves `{ }`. É muito usada em coleções e callbacks.

```kotlin
val dobrar = { x: Int -> x * 2 }
println(dobrar(5))   // 10

val somar = { a: Int, b: Int -> a + b }
println(somar(3, 4)) // 7
```

A sintaxe é: `{ parametros -> corpo }`. A última expressão é o valor de retorno.

### O parâmetro implícito `it`

Quando a lambda tem **um único parâmetro**, você pode omiti-lo e usar `it`:

```kotlin
val numeros = listOf(1, 2, 3, 4)

numeros.filter { it > 2 }     // usa "it" em vez de "{ x -> x > 2 }"
       .forEach { println(it) }
```

## Higher-order functions (funções de ordem superior)

São funções que **recebem outras funções como parâmetro** ou **retornam funções**. É a base da programação funcional em Kotlin.

```kotlin
fun operar(a: Int, b: Int, operacao: (Int, Int) -> Int): Int {
    return operacao(a, b)
}

val soma = operar(4, 2) { x, y -> x + y }       // 6
val subtracao = operar(4, 2) { x, y -> x - y }  // 2
```

Repare na sintaxe `(Int, Int) -> Int`: ela descreve um **tipo de função** que recebe dois `Int` e retorna um `Int`.

> **Trailing lambda:** quando a lambda é o último parâmetro, ela pode ficar fora dos parênteses, como em `operar(4, 2) { ... }`. Isso deixa o código mais limpo.

## Funções de extensão

Recurso poderoso: você pode **adicionar funções a tipos existentes** sem modificar seu código-fonte, nem mesmo a classes do Java como `String`.

```kotlin
fun String.gritar(): String {
    return this.uppercase() + "!"
}

println("olá".gritar())   // OLÁ!
```

Aqui, `this` se refere ao objeto sobre o qual a função é chamada (a String). Outro exemplo:

```kotlin
fun Int.ehPar(): Boolean = this % 2 == 0

println(4.ehPar())   // true
println(7.ehPar())   // false
```

Funções de extensão são muito usadas para deixar o código mais legível e organizado.

## Resumo

| Recurso | Exemplo |
|---------|---------|
| Função básica | `fun somar(a: Int, b: Int): Int { return a + b }` |
| Uma expressão | `fun somar(a: Int, b: Int) = a + b` |
| Parâmetro default | `fun f(x: Int = 0)` |
| Argumento nomeado | `f(x = 5)` |
| Lambda | `{ x -> x * 2 }` |
| `it` | `{ it * 2 }` (um só parâmetro) |
| Higher-order | `fun f(op: (Int) -> Int)` |
| Extensão | `fun String.gritar() = uppercase()` |

## Atividades

- [ ] Escreva uma função de uma expressão que calcule a área de um retângulo.
- [ ] Crie uma função com parâmetro default e chame-a com e sem o argumento.
- [ ] Chame uma função usando argumentos nomeados fora de ordem.
- [ ] Crie uma lambda que verifica se um número é positivo e teste com `it`.
- [ ] Escreva uma higher-order function que aplica uma operação a dois números.
- [ ] Crie uma função de extensão `Int.aoQuadrado()` que retorna o quadrado do número.
