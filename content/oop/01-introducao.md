---
title: "Introdução à POO"
---

# Introdução à Orientação a Objetos

## O que é um paradigma de programação?

Um **paradigma** é um estilo, uma forma de pensar e organizar o código. Não é uma linguagem específica, mas sim uma maneira de resolver problemas. As linguagens podem suportar um ou vários paradigmas.

Os mais comuns são:

- **Procedural**: o programa é uma sequência de instruções e funções que manipulam dados soltos.
- **Orientado a Objetos (POO)**: o programa é organizado em **objetos** que combinam dados e comportamento.
- **Funcional**: foco em funções puras e imutabilidade.

A **Orientação a Objetos** é hoje um dos paradigmas mais usados no mercado, especialmente em Java, Kotlin, C#, Python e muitos outros.

## Procedural vs Orientado a Objetos

No estilo **procedural**, os dados e as funções vivem separados. Você passa os dados para as funções:

```java
// Estilo procedural
String nomeCliente = "Ana";
double saldo = 100.0;

double sacar(double saldo, double valor) {
    return saldo - valor;
}

saldo = sacar(saldo, 30.0);
```

No estilo **orientado a objetos**, os dados e os comportamentos ficam **juntos** dentro de um objeto. O objeto cuida de si mesmo:

```java
// Estilo orientado a objetos
class Conta {
    String nomeCliente;
    double saldo;

    void sacar(double valor) {
        saldo = saldo - valor;
    }
}

Conta conta = new Conta();
conta.nomeCliente = "Ana";
conta.saldo = 100.0;
conta.sacar(30.0);
```

Repare na diferença: em POO, a `Conta` sabe como sacar de si mesma. O comportamento "anda junto" com o dado.

## Objetos do mundo real

A grande sacada da POO é modelar o software parecido com o mundo real. Pense em um **carro**:

- Ele tem **características** (cor, modelo, velocidade atual) — isso vira **atributos**.
- Ele tem **ações** (acelerar, frear, ligar) — isso vira **métodos**.

Outro exemplo: um **cachorro** tem nome, raça e idade (atributos) e late, corre e come (métodos). Em POO, transformamos esses substantivos em **classes/objetos** e os verbos em **métodos**.

## Os 4 pilares (visão geral)

A POO se apoia em quatro pilares fundamentais. Aqui está apenas a visão geral — cada um terá sua própria seção:

| Pilar | Ideia central |
|-------|---------------|
| **Encapsulamento** | Esconder os detalhes internos e proteger os dados, expondo só o necessário. |
| **Herança** | Reaproveitar código criando classes a partir de outras (relação "é um"). |
| **Polimorfismo** | Um mesmo comando pode se comportar de formas diferentes dependendo do objeto. |
| **Abstração** | Focar no essencial, escondendo a complexidade por trás de modelos simples. |

Uma forma de lembrar: **A-PIE** (Abstraction, Polymorphism, Inheritance, Encapsulation).

## Vantagens da POO

- **Organização**: o código fica dividido em pedaços com responsabilidades claras.
- **Reuso**: classes e métodos podem ser reaproveitados em vários lugares.
- **Manutenção**: mudar uma parte tende a afetar menos o resto.
- **Escalabilidade**: facilita o crescimento do sistema sem virar um caos.
- **Modelagem intuitiva**: o código se parece com o problema do mundo real.

> Atenção: POO não é "bala de prata". Mal usada, gera hierarquias confusas e código complicado. O objetivo é clareza, não criar classes por criar.

## Comparação rápida com Kotlin

Kotlin roda na mesma JVM do Java e é totalmente orientado a objetos, porém mais enxuto:

```kotlin
class Conta {
    var nomeCliente: String = ""
    var saldo: Double = 0.0

    fun sacar(valor: Double) {
        saldo -= valor
    }
}
```

Mesma ideia, menos cerimônia. Ao longo do módulo, vamos focar em Java e trazer Kotlin quando ajudar a entender.

## Atividades
- [ ] Escreva, em texto, um exemplo do seu dia a dia (ex: uma TV, uma conta de e-mail) e liste seus atributos e métodos.
- [ ] Reescreva mentalmente um código procedural que você conhece no estilo orientado a objetos.
- [ ] Explique com suas palavras a diferença entre procedural e orientado a objetos.
- [ ] Crie uma tabela com os 4 pilares e uma frase sua para cada um.
- [ ] Liste 3 vantagens da POO e dê um exemplo prático de cada.
