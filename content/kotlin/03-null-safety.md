---
title: "Null Safety"
---

# Null Safety

Um dos maiores destaques do Kotlin é o **sistema de null safety**, criado para eliminar o erro mais comum em Java: o `NullPointerException` (apelidado de "o erro de um bilhão de dólares" pelo seu próprio criador, Tony Hoare).

## O problema do `null` em Java

Em Java, qualquer variável de objeto pode ser `null`, e o compilador não te avisa. O erro só aparece em tempo de execução:

```java
// Java
String nome = null;
System.out.println(nome.length()); // NullPointerException em runtime!
```

## A solução do Kotlin: tipos nullable

Em Kotlin, por padrão **nenhuma variável pode ser null**. Se você tentar, o código nem compila:

```kotlin
var nome: String = "Ana"
// nome = null   // ERRO de compilação!
```

Para permitir `null`, você adiciona `?` ao tipo, criando um **tipo nullable**:

```kotlin
var nome: String? = "Ana"  // agora PODE ser null
nome = null                // OK
```

A diferença entre `String` e `String?` é a base de tudo: o compilador te obriga a tratar a possibilidade de `null` antes de usar a variável.

```kotlin
val tamanho = nome.length  // ERRO: nome pode ser null
```

## Operador de chamada segura `?.`

O `?.` chama um método/propriedade **apenas se** o objeto não for null. Caso contrário, retorna `null`.

```kotlin
val nome: String? = null
val tamanho = nome?.length   // retorna null em vez de quebrar

println(tamanho)             // imprime: null
```

Você pode encadear:

```kotlin
val cidade = usuario?.endereco?.cidade  // null se qualquer parte for null
```

## Operador Elvis `?:`

O `?:` fornece um **valor padrão** quando a expressão da esquerda é null. O nome vem da semelhança com o cabelo do Elvis Presley quando visto de lado.

```kotlin
val nome: String? = null
val tamanho = nome?.length ?: 0   // se for null, usa 0

val texto = nome ?: "desconhecido"
println(texto)                    // desconhecido
```

O Elvis também serve para retornar ou lançar erro cedo:

```kotlin
fun processar(nome: String?) {
    val n = nome ?: return            // sai da função se for null
    println("Processando $n")
}
```

## Operador `!!` (não-nulo asserção)

O `!!` força o Kotlin a tratar o valor como não-nulo. Se for null, lança `NullPointerException`. **Use com muito cuidado** — ele desliga a proteção.

```kotlin
val nome: String? = "Ana"
val tamanho = nome!!.length   // funciona, mas se nome fosse null, quebraria
```

> Regra prática: se você está usando `!!` com frequência, provavelmente há uma forma melhor com `?.` ou `?:`.

## Safe cast `as?`

O cast normal `as` lança exceção se o tipo não bater. O `as?` retorna `null` em vez de quebrar:

```kotlin
val obj: Any = "texto"
val numero: Int? = obj as? Int   // null, pois não é Int
val texto: String? = obj as? String // "texto"
```

## A função `let`

A `let` executa um bloco apenas se o valor não for null, útil junto com `?.`. Dentro do bloco, o valor não-nulo fica disponível como `it`.

```kotlin
val nome: String? = "Ana"

nome?.let {
    println("O nome tem ${it.length} caracteres")
}
// Se nome for null, o bloco simplesmente não roda
```

Isso é uma forma elegante de dizer "faça isso só se não for null".

## Smart cast

Depois de checar com `if`, o Kotlin "sabe" que o valor não é mais null e libera o uso direto:

```kotlin
val nome: String? = "Ana"

if (nome != null) {
    println(nome.length)  // OK: o compilador fez smart cast para String
}
```

## Resumo dos operadores

| Operador | Nome | O que faz |
|----------|------|-----------|
| `Tipo?` | Tipo nullable | Permite que a variável seja null |
| `?.` | Chamada segura | Chama só se não for null; senão retorna null |
| `?:` | Elvis | Valor padrão quando à esquerda é null |
| `!!` | Asserção não-nula | Força não-nulo; lança exceção se for null |
| `as?` | Safe cast | Cast que retorna null se falhar |
| `let` | Escopo | Executa bloco só se não for null |

## Por que isso evita o `NullPointerException`?

Porque o tratamento de null vira responsabilidade do **compilador**, não do programador. Você é obrigado, em tempo de compilação, a decidir o que acontece quando algo pode ser null. O erro deixa de aparecer "por surpresa" em produção.

## Atividades

- [ ] Declare uma `String?` com valor null e tente acessar `.length` diretamente; observe o erro.
- [ ] Use `?.` para acessar o tamanho de uma string que pode ser null.
- [ ] Use o operador Elvis `?:` para fornecer um valor padrão "vazio".
- [ ] Escreva uma função que usa `?: return` para sair cedo quando o parâmetro é null.
- [ ] Use `let` para imprimir algo apenas quando um valor não for null.
- [ ] Faça um `as?` que falha e confirme que ele retorna null em vez de quebrar.
