---
title: "Estruturas de Dados"
---

# Estruturas de Dados

Estruturas de dados organizam coleções de valores. Java oferece desde **arrays** (tamanho fixo) até as **Collections** (tamanho dinâmico), como listas, mapas e conjuntos.

## Arrays

Um **array** guarda vários valores do mesmo tipo, com **tamanho fixo** definido na criação:

```java
int[] numeros = new int[5];   // array de 5 inteiros (zeros)
numeros[0] = 10;              // índice começa em 0
numeros[1] = 20;

System.out.println(numeros[0]);     // 10
System.out.println(numeros.length); // 5 (tamanho)
```

Você pode criar já com valores:

```java
String[] nomes = {"Ana", "Bruno", "Carla"};

for (String nome : nomes) {
    System.out.println(nome);
}
```

> Acessar um índice inexistente lança `ArrayIndexOutOfBoundsException`.

## Arrays multidimensionais

Um array de arrays — útil para tabelas/matrizes:

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6}
};

System.out.println(matriz[1][2]);  // 6

for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}
```

## ArrayList

Lista de tamanho **dinâmico**: cresce e encolhe conforme você adiciona/remove. É a coleção mais usada:

```java
import java.util.ArrayList;
import java.util.List;

List<String> frutas = new ArrayList<>();
frutas.add("maçã");
frutas.add("banana");
frutas.add("uva");

System.out.println(frutas.get(0));   // maçã
System.out.println(frutas.size());   // 3
frutas.remove("banana");
System.out.println(frutas.contains("uva"));  // true

for (String f : frutas) {
    System.out.println(f);
}
```

O `<String>` é o **tipo genérico**: define que a lista guarda apenas Strings. Como genéricos não aceitam primitivos, usa-se `Integer` em vez de `int`.

## LinkedList

Também é uma `List`, mas internamente é uma lista **encadeada**. É eficiente para inserir/remover no início ou no meio:

```java
import java.util.LinkedList;

LinkedList<Integer> fila = new LinkedList<>();
fila.add(1);
fila.addFirst(0);    // adiciona no início
fila.addLast(2);     // adiciona no fim
System.out.println(fila);  // [0, 1, 2]
```

**ArrayList vs LinkedList**: o `ArrayList` é mais rápido para **acessar por índice** (`get`); o `LinkedList` é melhor para **muitas inserções/remoções** nas pontas. Na dúvida, use `ArrayList`.

## HashMap

Armazena pares **chave → valor**. Busca por chave é muito rápida:

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> idades = new HashMap<>();
idades.put("Ana", 25);
idades.put("Bruno", 30);

System.out.println(idades.get("Ana"));        // 25
System.out.println(idades.containsKey("Bruno")); // true

// Iterando
for (Map.Entry<String, Integer> e : idades.entrySet()) {
    System.out.println(e.getKey() + " tem " + e.getValue() + " anos");
}
```

As chaves são **únicas**: um novo `put` com a mesma chave substitui o valor. A ordem **não é garantida**.

## HashSet

Um **conjunto** que não permite elementos **duplicados** e não garante ordem:

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("android");
tags.add("java");   // ignorado (duplicado)

System.out.println(tags.size());          // 2
System.out.println(tags.contains("java")); // true
```

Ideal para **remover duplicatas** ou testar pertencimento rapidamente.

## TreeMap

Como o `HashMap`, mas mantém as chaves **ordenadas** automaticamente:

```java
import java.util.TreeMap;

TreeMap<String, Integer> notas = new TreeMap<>();
notas.put("Carlos", 8);
notas.put("Ana", 10);
notas.put("Bruno", 7);

System.out.println(notas);
// {Ana=10, Bruno=7, Carlos=8}  → ordenado pela chave
```

Existe também o `TreeSet`, equivalente ordenado do `HashSet`.

## Quando usar cada um

| Estrutura | Use quando... |
|-----------|---------------|
| **array** | tamanho fixo e conhecido, máximo desempenho |
| **ArrayList** | lista dinâmica, muito acesso por índice |
| **LinkedList** | muitas inserções/remoções nas pontas |
| **HashMap** | associar chaves a valores, busca rápida |
| **TreeMap** | mapa com chaves ordenadas |
| **HashSet** | coleção sem duplicatas, sem ordem |
| **TreeSet** | conjunto sem duplicatas e ordenado |

## Complexidade básica (Big O)

A notação **Big O** descreve como o tempo cresce com o tamanho dos dados:

| Operação | ArrayList | LinkedList | HashMap |
|----------|-----------|------------|---------|
| Acesso por índice/chave | O(1) | O(n) | O(1) |
| Busca por valor | O(n) | O(n) | O(1) chave |
| Inserção no fim | O(1)* | O(1) | O(1) |
| Remoção no meio | O(n) | O(1)** | O(1) |

`O(1)` = tempo constante (ótimo). `O(n)` = cresce proporcional ao tamanho. *amortizado. **se você já está na posição.

## Atividades

- [ ] Crie um array de 5 notas e calcule a média percorrendo-o.
- [ ] Preencha um `ArrayList<String>` com nomes e remova um deles pelo valor.
- [ ] Use um `HashMap<String, Integer>` para contar quantas vezes cada palavra aparece em uma frase.
- [ ] Use um `HashSet` para remover duplicatas de uma lista de números.
- [ ] Crie um `TreeMap` e mostre que as chaves saem ordenadas.
- [ ] Compare na prática o `get(0)` de um `ArrayList` e de um `LinkedList` e explique a diferença de complexidade.
