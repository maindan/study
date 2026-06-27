---
title: "Padrões de Arrays"
---

# Padrões de Arrays para Memorizar

A maioria dos problemas de array cai em **um punhado de padrões**. Se você reconhece o padrão, já sabe o esqueleto da solução. Decore estes templates — eles resolvem dezenas de problemas.

## 1. Two Pointers (dois ponteiros)

Use quando o array está **ordenado** ou quando você compara extremidades. Dois índices se movem um em direção ao outro (ou no mesmo sentido).

```java
int i = 0, j = nums.length - 1;
while (i < j) {
    int soma = nums[i] + nums[j];
    if (soma == alvo) return new int[]{i, j};
    else if (soma < alvo) i++;   // preciso de um valor maior
    else j--;                    // preciso de um valor menor
}
```
**Resolve:** Two Sum (ordenado), container with most water, inverter array, remover duplicatas, palíndromo.

## 2. Sliding Window (janela deslizante)

Use para **subarrays/substrings contíguos**: maior/menor janela que satisfaz uma condição, ou soma de janela fixa `k`.

```java
int soma = 0, melhor = 0, ini = 0;
for (int fim = 0; fim < nums.length; fim++) {
    soma += nums[fim];               // expande a janela
    while (soma > alvo) {            // encolhe quando passa do limite
        soma -= nums[ini++];
    }
    melhor = Math.max(melhor, fim - ini + 1);
}
```
**Resolve:** soma máxima de janela `k`, maior substring sem repetição, subarray com soma dada.

## 3. Hashing / Frequência

Troque busca `O(n)` por consulta `O(1)` guardando o que já viu num `HashMap`/`HashSet`.

```java
Map<Integer, Integer> mapa = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int falta = alvo - nums[i];
    if (mapa.containsKey(falta)) return new int[]{mapa.get(falta), i};
    mapa.put(nums[i], i);
}
```
**Resolve:** Two Sum `O(n)`, contar duplicatas, subarray sum = k, interseção, single number.

## 4. Prefix Sum (soma de prefixos)

Pré-calcule somas acumuladas para responder "soma do intervalo [i, j]" em `O(1)`.

```java
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++)
    prefix[i + 1] = prefix[i] + nums[i];
// soma de [i, j] = prefix[j + 1] - prefix[i]
```
**Resolve:** soma de intervalos, running sum, subarray sum = k (com HashMap).

## 5. Kadane (máxima soma de subarray)

```java
int melhor = nums[0], atual = nums[0];
for (int i = 1; i < nums.length; i++) {
    atual = Math.max(nums[i], atual + nums[i]);  // continuo ou recomeço?
    melhor = Math.max(melhor, atual);
}
```
**Resolve:** maximum subarray sum, maximum product subarray (variação).

## 6. Dutch National Flag (3 ponteiros)

Particiona o array em 3 grupos numa passada (ex.: 0s, 1s, 2s).

```java
int baixo = 0, meio = 0, alto = nums.length - 1;
while (meio <= alto) {
    if (nums[meio] == 0) troca(nums, baixo++, meio++);
    else if (nums[meio] == 1) meio++;
    else troca(nums, meio, alto--);
}
```
**Resolve:** sort colors, mover zeros, particionamento.

## Como memorizar

1. Leia o enunciado e pergunte: *é contíguo?* (window) *está ordenado?* (two pointers) *preciso lembrar o que já vi?* (hashing).
2. Escreva o template de cabeça **antes** de pensar nos detalhes.
3. Resolva os mesmos tipos várias vezes até o esqueleto sair automático.

## Atividades

- [ ] Escreva de memória o template de Two Pointers.
- [ ] Escreva de memória o template de Sliding Window.
- [ ] Liste 3 problemas que o padrão de Hashing resolve.
- [ ] Implemente Kadane sem olhar a referência.
- [ ] Para cada padrão, anote a "pergunta-gatilho" que faz você escolhê-lo.
