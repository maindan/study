---
title: "Controle de Fluxo"
---

# Controle de Fluxo

Controle de fluxo é o que permite o programa **tomar decisões** e **repetir ações**. Sem isso, o código só roda de cima para baixo, uma vez.

## if / else

Executa um bloco apenas se uma condição for verdadeira:

```java
int idade = 18;

if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}
```

Para várias condições, use `else if`:

```java
int nota = 75;

if (nota >= 90) {
    System.out.println("A");
} else if (nota >= 70) {
    System.out.println("B");
} else if (nota >= 50) {
    System.out.println("C");
} else {
    System.out.println("Reprovado");
}
```

A condição **deve** resultar em `boolean`. Diferente de outras linguagens, `if (1)` não compila em Java.

## Operador ternário

Um atalho para `if/else` que **retorna um valor**:

```java
int idade = 20;
String status = (idade >= 18) ? "Adulto" : "Menor";
System.out.println(status);  // Adulto
```

Forma geral: `condição ? valorSeVerdadeiro : valorSeFalso`

## switch clássico

Compara uma variável com vários valores possíveis:

```java
int dia = 3;

switch (dia) {
    case 1:
        System.out.println("Domingo");
        break;
    case 2:
        System.out.println("Segunda");
        break;
    case 3:
        System.out.println("Terça");
        break;
    default:
        System.out.println("Outro dia");
}
```

> **Cuidado com o `break`!** Sem ele, a execução "vaza" para o próximo `case` (fall-through), um erro clássico.

## switch expression (Java 14+)

Versão moderna, mais segura e concisa. Usa `->` e **não precisa de `break`**:

```java
int dia = 3;

String nome = switch (dia) {
    case 1 -> "Domingo";
    case 2 -> "Segunda";
    case 3, 4, 5 -> "Meio de semana";  // vários valores juntos
    default -> "Fim de semana";
};

System.out.println(nome);  // Meio de semana
```

O `switch` aqui é uma **expressão**: ele produz um valor que pode ser atribuído. Prefira essa forma em código novo.

## for

Repete um bloco um número conhecido de vezes:

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Contagem: " + i);
}
// Imprime 0, 1, 2, 3, 4
```

As três partes: **inicialização** (`int i = 0`), **condição** (`i < 5`) e **atualização** (`i++`).

## while

Repete **enquanto** a condição for verdadeira. A condição é testada **antes** de cada repetição:

```java
int contador = 0;
while (contador < 3) {
    System.out.println("while: " + contador);
    contador++;
}
```

Se a condição já começar falsa, o bloco **nunca** executa. Cuidado com loops infinitos — sempre garanta que a condição mude.

## do-while

Parecido com o `while`, mas testa a condição **depois**. Por isso, executa **pelo menos uma vez**:

```java
int n = 10;
do {
    System.out.println("do-while: " + n);
    n++;
} while (n < 3);
// Imprime "do-while: 10" uma vez, mesmo n já sendo > 3
```

## break e continue

- **`break`** — interrompe o loop imediatamente.
- **`continue`** — pula para a próxima iteração.

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break;       // para tudo quando chega no 5
    }
    System.out.println(i);  // imprime 1, 2, 3, 4
}

for (int i = 1; i <= 5; i++) {
    if (i % 2 == 0) {
        continue;    // pula os pares
    }
    System.out.println(i);  // imprime 1, 3, 5
}
```

## for-each (for aprimorado)

Percorre coleções e arrays sem precisar de índice. Mais legível quando você só quer visitar cada elemento:

```java
int[] numeros = {10, 20, 30};

for (int n : numeros) {
    System.out.println(n);  // 10, 20, 30
}

String[] nomes = {"Ana", "Bruno", "Carla"};
for (String nome : nomes) {
    System.out.println("Olá, " + nome);
}
```

Leia `for (int n : numeros)` como "para cada `n` em `numeros`".

## Atividades

- [ ] Escreva um programa que classifica uma nota (0 a 100) em conceitos A/B/C/D usando `if/else if`.
- [ ] Refaça a classificação anterior usando `switch expression`.
- [ ] Use o operador ternário para decidir se um número é "par" ou "ímpar".
- [ ] Imprima a tabuada de um número usando um loop `for`.
- [ ] Some todos os números de um array usando `for-each`.
- [ ] Use `continue` para imprimir apenas os múltiplos de 3 entre 1 e 30.
