---
title: "Coleções"
---

# Coleções

Coleções guardam grupos de valores. Em Kotlin, uma decisão central separa **somente leitura** de **mutável**: `listOf` cria uma lista que não pode ser alterada; `mutableListOf` cria uma que pode. Esse padrão se repete em listas, mapas e conjuntos.

## Listas

```kotlin
// Somente leitura (imutável)
val frutas = listOf("maçã", "banana", "uva")
println(frutas[0])        // maçã
println(frutas.size)      // 3
println(frutas.first())   // maçã
println(frutas.last())    // uva
// frutas.add("pera")     // ERRO: List não tem add

// Mutável
val numeros = mutableListOf(1, 2, 3)
numeros.add(4)
numeros.removeAt(0)
numeros[0] = 99
println(numeros)          // [99, 3, 4]
```

## Mapas

Pares **chave → valor**:

```kotlin
val idades = mapOf(
    "Ana" to 25,
    "Bruno" to 30
)
println(idades["Ana"])              // 25
println(idades.containsKey("Bruno")) // true
println(idades.keys)                // [Ana, Bruno]
println(idades.values)              // [25, 30]

val estoque = mutableMapOf("maçã" to 10)
estoque["banana"] = 5     // adiciona
estoque["maçã"] = 12      // atualiza
println(estoque)          // {maçã=12, banana=5}
```

O infix `to` cria um `Pair`, usado para montar mapas de forma legível.

## Conjuntos (Set)

Coleção **sem duplicatas**:

```kotlin
val tags = setOf("kotlin", "android", "kotlin")
println(tags)          // [kotlin, android]  → duplicata removida
println(tags.size)     // 2
println("android" in tags)  // true

val visitados = mutableSetOf<Int>()
visitados.add(1)
visitados.add(1)       // ignorado
println(visitados)     // [1]
```

## Resumo dos construtores

| Função | Tipo | Mutável? |
|--------|------|----------|
| `listOf` | List | não |
| `mutableListOf` | MutableList | sim |
| `mapOf` | Map | não |
| `mutableMapOf` | MutableMap | sim |
| `setOf` | Set | não |
| `mutableSetOf` | MutableSet | sim |

## Acesso e iteração

```kotlin
val cores = listOf("vermelho", "verde", "azul")

for (cor in cores) println(cor)

// com índice
for ((i, cor) in cores.withIndex()) {
    println("$i: $cor")
}

// iterando um mapa
val idades = mapOf("Ana" to 25, "Bruno" to 30)
for ((nome, idade) in idades) {
    println("$nome tem $idade anos")
}
```

## Operações funcionais

Aqui está a grande força das coleções em Kotlin. Cada operação recebe uma lambda e retorna um novo resultado, permitindo encadear transformações.

### map — transforma cada elemento

```kotlin
val numeros = listOf(1, 2, 3, 4)
val dobrados = numeros.map { it * 2 }
println(dobrados)   // [2, 4, 6, 8]

val nomes = listOf("ana", "bruno")
println(nomes.map { it.uppercase() })  // [ANA, BRUNO]
```

`it` é o nome implícito do parâmetro único da lambda.

### filter — seleciona pelo critério

```kotlin
val numeros = listOf(1, 2, 3, 4, 5, 6)
val pares = numeros.filter { it % 2 == 0 }
println(pares)   // [2, 4, 6]
```

### forEach — executa uma ação para cada item

```kotlin
listOf("a", "b", "c").forEach { println(it) }
```

### find — retorna o primeiro que satisfaz (ou null)

```kotlin
val numeros = listOf(3, 7, 11, 4)
val primeiroPar = numeros.find { it % 2 == 0 }
println(primeiroPar)   // 4
```

### sortedBy — ordena por um critério

```kotlin
data class Pessoa(val nome: String, val idade: Int)

val pessoas = listOf(
    Pessoa("Ana", 30),
    Pessoa("Bruno", 25),
    Pessoa("Carla", 28)
)

val porIdade = pessoas.sortedBy { it.idade }
println(porIdade.map { it.nome })   // [Bruno, Carla, Ana]

// decrescente
val maisVelhos = pessoas.sortedByDescending { it.idade }
```

### groupBy — agrupa em um mapa

```kotlin
val palavras = listOf("ana", "bia", "carlos", "duda", "eva")
val porTamanho = palavras.groupBy { it.length }
println(porTamanho)
// {3=[ana, bia, eva], 6=[carlos], 4=[duda]}
```

### reduce — combina tudo em um único valor

```kotlin
val numeros = listOf(1, 2, 3, 4)
val soma = numeros.reduce { acc, n -> acc + n }
println(soma)   // 10

// para somas simples, há atalhos prontos:
println(numeros.sum())      // 10
println(numeros.average())  // 2.5
println(numeros.maxOrNull())// 4
```

## Encadeando operações

A verdadeira elegância vem ao combinar tudo em um pipeline legível:

```kotlin
val numeros = listOf(1, 2, 3, 4, 5, 6, 7, 8)

val resultado = numeros
    .filter { it % 2 == 0 }   // [2, 4, 6, 8]
    .map { it * it }          // [4, 16, 36, 64]
    .sum()                    // 120

println(resultado)   // 120
```

> Cada passo retorna uma nova coleção, o que torna o fluxo claro e seguro — sem efeitos colaterais sobre a lista original.

## Atividades

- [ ] Crie uma `listOf` e prove que ela não tem `add`; depois faça o mesmo com `mutableListOf` adicionando itens.
- [ ] Monte um `mapOf` de nome para nota e itere imprimindo "Fulano tirou X".
- [ ] Use `filter` para pegar só os números maiores que 10 de uma lista.
- [ ] Use `map` para transformar uma lista de nomes em uma lista de seus tamanhos.
- [ ] Use `groupBy` para agrupar palavras pela primeira letra.
- [ ] Encadeie `filter` + `map` + `sum` para somar o dobro dos números pares de uma lista.
