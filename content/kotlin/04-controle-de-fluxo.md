---
title: "Controle de Fluxo"
---

# Controle de Fluxo

Controle de fluxo são as estruturas que decidem **o que** e **quantas vezes** o código executa: condicionais e laços. Em Kotlin, muitas delas são **expressões** (retornam valor), o que torna o código mais enxuto.

## `if` como expressão

O `if` funciona como em qualquer linguagem, mas em Kotlin ele também **retorna um valor**. Por isso, Kotlin não tem operador ternário (`? :`) — o próprio `if` faz esse papel.

```kotlin
val idade = 20

// if como instrução
if (idade >= 18) {
    println("Maior de idade")
} else {
    println("Menor de idade")
}

// if como expressão (retorna valor)
val status = if (idade >= 18) "adulto" else "menor"
println(status)
```

Compare com o ternário do Java:

```java
// Java
String status = (idade >= 18) ? "adulto" : "menor";
```

```kotlin
// Kotlin
val status = if (idade >= 18) "adulto" else "menor"
```

## `when`

O `when` substitui o `switch` do Java, mas é muito mais poderoso. Ele também é uma expressão.

### `when` com argumento

```kotlin
val nota = 7

val conceito = when (nota) {
    10 -> "Excelente"
    8, 9 -> "Ótimo"          // vários valores
    in 6..7 -> "Bom"         // intervalo (range)
    in 1..5 -> "Insuficiente"
    else -> "Nota inválida"
}
println(conceito)            // Bom
```

Diferente do `switch` do Java, **não precisa de `break`** e você pode usar intervalos, múltiplos valores e condições.

### `when` sem argumento

Funciona como uma cadeia de `if/else if`, mas mais limpo:

```kotlin
val temperatura = 28

val clima = when {
    temperatura < 10 -> "Frio"
    temperatura < 25 -> "Agradável"
    else -> "Quente"
}
println(clima)               // Quente
```

### `when` verificando tipos

```kotlin
fun descrever(x: Any): String = when (x) {
    is Int -> "É um inteiro: $x"
    is String -> "É um texto de tamanho ${x.length}"
    else -> "Tipo desconhecido"
}
```

## `for` com ranges

O `for` percorre qualquer coisa iterável. Os **ranges** (intervalos) são a forma mais comum de iterar números.

```kotlin
// 1 até 10 (inclusivo nos dois lados)
for (i in 1..10) {
    print("$i ")             // 1 2 3 4 5 6 7 8 9 10
}

// until: exclui o último
for (i in 1 until 10) {
    print("$i ")             // 1 2 3 4 5 6 7 8 9
}

// step: pula de N em N
for (i in 0..10 step 2) {
    print("$i ")             // 0 2 4 6 8 10
}

// downTo: contagem decrescente
for (i in 10 downTo 1) {
    print("$i ")             // 10 9 8 ... 1
}
```

### Iterando coleções

```kotlin
val frutas = listOf("maçã", "banana", "uva")

for (fruta in frutas) {
    println(fruta)
}

// com índice
for ((indice, fruta) in frutas.withIndex()) {
    println("$indice: $fruta")
}
```

| Sintaxe | Resultado |
|---------|-----------|
| `1..5` | 1, 2, 3, 4, 5 |
| `1 until 5` | 1, 2, 3, 4 |
| `5 downTo 1` | 5, 4, 3, 2, 1 |
| `1..10 step 2` | 1, 3, 5, 7, 9 |

## `while` e `do-while`

```kotlin
var contador = 0
while (contador < 3) {
    println("contador = $contador")
    contador++
}

// do-while: executa ao menos uma vez
var x = 10
do {
    println("x = $x")
    x--
} while (x > 8)
```

## `break` e `continue`

- `break`: sai do laço imediatamente.
- `continue`: pula para a próxima iteração.

```kotlin
for (i in 1..10) {
    if (i == 3) continue   // pula o 3
    if (i == 6) break      // para no 6
    print("$i ")           // 1 2 4 5
}
```

### Labels (rótulos)

Para controlar laços aninhados, use rótulos com `@`:

```kotlin
outer@ for (i in 1..3) {
    for (j in 1..3) {
        if (j == 2) break@outer  // sai do laço externo
        println("$i, $j")
    }
}
```

## Resumo

- `if` e `when` são **expressões**: retornam valor.
- `when` substitui o `switch` e aceita ranges, múltiplos valores e tipos.
- `for` usa ranges: `..`, `until`, `step`, `downTo`.
- `break` sai do laço; `continue` pula a iteração.

## Atividades

- [ ] Use `if` como expressão para definir "par" ou "ímpar" de um número.
- [ ] Crie um `when` que classifica uma nota de 0 a 10 em conceitos.
- [ ] Imprima os números pares de 0 a 20 usando `for` com `step`.
- [ ] Faça uma contagem regressiva de 5 até 1 com `downTo`.
- [ ] Use `break` e `continue` em um laço de 1 a 10 e explique a saída.
- [ ] Escreva um `when` sem argumento que descreva uma temperatura.
