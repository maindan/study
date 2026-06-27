---
title: "Sintaxe Básica"
---

# Sintaxe Básica

Nesta seção vamos aprender o básico para escrever qualquer programa Kotlin: variáveis, tipos, inferência, interpolação de strings e conversões.

## `val` vs `var`

Existem duas formas de declarar variáveis:

- **`val`** (de *value*): variável **imutável**. Uma vez atribuída, não pode mudar. Equivale ao `final` do Java.
- **`var`** (de *variable*): variável **mutável**. Pode ser reatribuída.

```kotlin
val nome = "Ana"      // não pode mudar
var idade = 30        // pode mudar
idade = 31            // OK

// nome = "Bia"       // ERRO de compilação: val não pode ser reatribuído
```

> **Boa prática:** prefira sempre `val`. Use `var` só quando realmente precisar mudar o valor. Isso deixa o código mais seguro e previsível.

## Tipos básicos

Kotlin tem tipos para os dados mais comuns:

| Tipo | Exemplo | Descrição |
|------|---------|-----------|
| `Int` | `42` | Número inteiro (32 bits) |
| `Long` | `42L` | Inteiro grande (64 bits) |
| `Double` | `3.14` | Número decimal (64 bits) |
| `Float` | `3.14f` | Decimal (32 bits) |
| `Boolean` | `true` / `false` | Verdadeiro ou falso |
| `Char` | `'A'` | Um caractere |
| `String` | `"texto"` | Cadeia de caracteres |

Diferente do Java, em Kotlin **todos os tipos são objetos** — não existem "tipos primitivos" visíveis ao programador (`int`, `double`, etc.). O compilador otimiza isso por baixo dos panos.

## Inferência de tipos

Você pode declarar o tipo explicitamente ou deixar o compilador inferir:

```kotlin
val pi: Double = 3.14   // tipo explícito
val e = 2.71            // tipo Double inferido

val ativo: Boolean = true
val contador = 0        // Int inferido
```

A inferência funciona quando há um valor inicial. Se você declarar sem inicializar, precisa informar o tipo:

```kotlin
val mensagem: String
mensagem = "agora sim"
```

## String templates (interpolação)

Um dos recursos mais úteis: inserir valores dentro de strings com `$`.

```kotlin
val nome = "Carlos"
val idade = 28

println("Olá, $nome!")                       // Olá, Carlos!
println("Daqui a 2 anos você terá ${idade + 2} anos") // expressão com chaves
```

- Use `$variavel` para uma variável simples.
- Use `${expressao}` para uma expressão mais complexa.

Compare com a concatenação do Java:

```java
// Java
System.out.println("Olá, " + nome + "! Idade: " + idade);
```

```kotlin
// Kotlin — muito mais legível
println("Olá, $nome! Idade: $idade")
```

## Números e operações

```kotlin
val soma = 10 + 5        // 15
val divisao = 7 / 2      // 3  (divisão inteira!)
val divisaoReal = 7.0 / 2 // 3.5
val resto = 7 % 2        // 1
```

Atenção: `7 / 2` dá `3` porque ambos são `Int`. Para obter decimal, ao menos um deve ser `Double`.

### Separador de dígitos

Para legibilidade, você pode usar `_` em números grandes:

```kotlin
val umMilhao = 1_000_000
```

## Conversões de tipo

Kotlin **não converte tipos numéricos automaticamente**. Você precisa converter explicitamente com funções `to...()`:

```kotlin
val inteiro = 10
val comoDouble: Double = inteiro.toDouble()  // 10.0
val comoLong = inteiro.toLong()

val texto = "42"
val numero = texto.toInt()        // String -> Int
val talvez = "abc".toIntOrNull()  // retorna null em vez de quebrar
```

Em Java, `int x = 10; double y = x;` funcionaria direto. Em Kotlin isso dá erro — é uma decisão de **segurança** para evitar perdas de precisão acidentais.

## Comentários

```kotlin
// Comentário de uma linha

/*
   Comentário
   de várias linhas
*/

/**
 * Comentário de documentação (KDoc).
 * @param nome o nome da pessoa
 */
fun saudar(nome: String) = println("Oi, $nome")
```

## Resumo da comparação com Java

| Recurso | Java | Kotlin |
|---------|------|--------|
| Imutável | `final int x = 1;` | `val x = 1` |
| Mutável | `int x = 1;` | `var x = 1` |
| Inferência | `var` (Java 10+) | `val`/`var` |
| Interpolação | concatenação com `+` | `"$x"` / `"${x}"` |
| Conversão numérica | implícita | explícita (`.toInt()`) |
| Ponto e vírgula | obrigatório | opcional |

## Atividades

- [ ] Declare um `val` e um `var` e tente reatribuir ambos; observe qual dá erro.
- [ ] Crie variáveis com tipo inferido e imprima cada uma usando string template.
- [ ] Calcule a média de 3 notas e imprima com uma casa decimal usando interpolação.
- [ ] Converta uma `String` "100" para `Int` e some 50.
- [ ] Use `toIntOrNull()` com um texto inválido e veja o resultado.
- [ ] Reescreva uma concatenação Java de exemplo usando string templates do Kotlin.
