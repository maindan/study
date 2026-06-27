---
title: "Complexidade (Big-O)"
---

# Complexidade (Big-O)

Antes de resolver problemas, você precisa saber **medir** o custo de uma solução. A notação **Big-O** descreve como o tempo (ou a memória) de um algoritmo cresce conforme o tamanho da entrada `n` aumenta. Ela ignora constantes e foca no termo dominante.

## As classes mais comuns

| Notação | Nome | Exemplo típico |
|---|---|---|
| `O(1)` | Constante | Acessar `nums[i]` |
| `O(log n)` | Logarítmica | Busca binária |
| `O(n)` | Linear | Percorrer um array uma vez |
| `O(n log n)` | Linearítmica | Ordenação eficiente (`Arrays.sort`) |
| `O(n²)` | Quadrática | Dois loops aninhados sobre o array |
| `O(2ⁿ)` | Exponencial | Gerar todos os subconjuntos |

> Regra de ouro: em entrevistas e desafios, busque sempre a melhor complexidade possível. Para arrays, isso geralmente significa sair de `O(n²)` (força bruta) para `O(n)` usando um **HashMap** ou **dois ponteiros**.

## Como analisar na prática

Conte quantas vezes a operação mais frequente executa em função de `n`.

```java
// O(n): um único loop sobre n elementos
int soma = 0;
for (int i = 0; i < n; i++) soma += nums[i];

// O(n²): loop dentro de loop
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        if (nums[i] + nums[j] == alvo) { /* ... */ }

// O(log n): a cada passo o espaço de busca cai pela metade
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = (lo + hi) / 2;
    // descarta metade
}
```

## Complexidade de espaço

Mede a **memória extra** que o algoritmo usa (além da entrada). Resolver um problema "in-place" (alterando o próprio array) é `O(1)` de espaço; criar um novo `HashMap` com `n` chaves é `O(n)`.

```java
// O(1) de espaço extra — só algumas variáveis
int max = nums[0];
for (int x : nums) max = Math.max(max, x);

// O(n) de espaço extra — guarda todos os vistos
Set<Integer> vistos = new HashSet<>();
```

## Dicas para "ler" a complexidade rápido

- Loops sequenciais somam: `O(n) + O(n) = O(n)`.
- Loops aninhados multiplicam: `O(n) * O(n) = O(n²)`.
- Dividir a entrada pela metade repetidamente gera `O(log n)`.
- `Arrays.sort()` custa `O(n log n)` — às vezes ordenar primeiro simplifica tudo.

## Atividades

- [ ] Explique, com suas palavras, a diferença entre `O(n)` e `O(n²)`.
- [ ] Identifique a complexidade de tempo de um código que tem dois `for` aninhados de 0 a n.
- [ ] Escreva um exemplo de algoritmo `O(1)` e um `O(n)`.
- [ ] Diga qual a complexidade da busca binária e por quê.
- [ ] Reescreva mentalmente uma solução `O(n²)` de "Two Sum" para `O(n)` usando HashMap.
