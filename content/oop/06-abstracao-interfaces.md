---
title: "Abstração e Interfaces"
---

# Abstração e Interfaces

## O que é abstração?

**Abstração** é o pilar de **focar no essencial e esconder a complexidade**. Você modela "o que" um objeto faz, sem se prender ao "como" ele faz internamente.

Exemplo do dia a dia: ao usar um controle remoto, você aperta "ligar". Não precisa saber a eletrônica por trás. O controle expõe uma **abstração** simples sobre algo complexo.

Na prática, em Java a abstração é feita principalmente com **classes abstratas** e **interfaces**.

## Classes abstratas

Uma **classe abstrata** é uma classe que **não pode ser instanciada** diretamente — ela serve de base para outras. Pode conter:

- **Métodos abstratos**: declarados sem corpo, que as subclasses **devem** implementar.
- **Métodos concretos**: já implementados, herdados normalmente.
- Atributos, construtores, etc.

```java
abstract class Forma {
    String cor;

    // método concreto (já implementado)
    public void descrever() {
        System.out.println("Forma de cor " + cor + " com área " + area());
    }

    // método abstrato (sem corpo: cada subclasse implementa)
    public abstract double area();
}
```

```java
class Circulo extends Forma {
    double raio;

    @Override
    public double area() {
        return Math.PI * raio * raio;
    }
}

// Forma f = new Forma();  -> ERRO: classe abstrata não pode ser instanciada
Forma c = new Circulo();   // OK
```

A classe abstrata define um "esqueleto" parcial, deixando lacunas (métodos abstratos) que as filhas preenchem.

## Interfaces

Uma **interface** é um **contrato** puro: define **o que** uma classe deve saber fazer, sem dizer como. Tradicionalmente, só tem assinaturas de métodos (sem corpo).

```java
interface Pagavel {
    void pagar(double valor);
    double getTotal();
}
```

Uma classe **implementa** uma interface com **`implements`** e é obrigada a fornecer todos os métodos:

```java
class Fatura implements Pagavel {
    private double total;

    public Fatura(double total) {
        this.total = total;
    }

    @Override
    public void pagar(double valor) {
        total -= valor;
    }

    @Override
    public double getTotal() {
        return total;
    }
}
```

Vantagem-chave: uma classe pode implementar **várias** interfaces (Java não permite herdar de várias classes, mas permite múltiplas interfaces):

```java
class Pedido implements Pagavel, Comparable<Pedido> {
    // implementa métodos das duas interfaces
}
```

## Default methods

Desde o Java 8, interfaces podem ter **métodos default** — métodos com implementação padrão. Assim você adiciona comportamento sem quebrar as classes que já implementam a interface:

```java
interface Pagavel {
    void pagar(double valor);

    // método default: já vem com corpo
    default void exibirRecibo() {
        System.out.println("Recibo gerado.");
    }
}
```

Classes que implementam `Pagavel` ganham `exibirRecibo()` de graça, mas podem sobrescrevê-lo se quiserem.

## Interface vs Classe abstrata

Esta é uma pergunta clássica de entrevista. Resumo:

| | Interface | Classe abstrata |
|---|-----------|-----------------|
| **Herança múltipla** | Sim (várias interfaces) | Não (uma só superclasse) |
| **Atributos de estado** | Só constantes (`static final`) | Atributos de instância normais |
| **Construtor** | Não tem | Tem |
| **Métodos com corpo** | Apenas `default`/`static` | Sim, livremente |
| **Relação** | "é capaz de" / contrato | "é um tipo de" |

Regra prática:

- Use **interface** quando quer definir um **contrato** que classes diversas (sem relação entre si) podem cumprir. Ex: `Comparable`, `Pagavel`.
- Use **classe abstrata** quando há uma **base comum com código compartilhado** entre classes relacionadas. Ex: `Forma` com `descrever()` pronto.

## Contratos: por que isso importa?

Programar voltado a interfaces (contratos) deixa o código **flexível**. Você depende da abstração, não da implementação concreta:

```java
public void processar(Pagavel item) {  // aceita QUALQUER coisa que seja Pagavel
    item.pagar(100);
}
```

Esse método funciona com `Fatura`, `Pedido` ou qualquer classe futura que implemente `Pagavel`. Isso conecta diretamente com o princípio **DIP** do SOLID (próxima seção).

## Comparação com Kotlin

Em Kotlin, interfaces também podem ter métodos com corpo, e a sintaxe é enxuta:

```kotlin
interface Pagavel {
    fun pagar(valor: Double)
    fun exibirRecibo() {          // equivalente ao default do Java
        println("Recibo gerado.")
    }
}

abstract class Forma {
    abstract fun area(): Double
}
```

## Atividades
- [ ] Crie uma classe abstrata `Forma` com método abstrato `area()` e um método concreto `descrever()`.
- [ ] Implemente `Circulo` e `Retangulo` a partir de `Forma`.
- [ ] Crie uma interface `Pagavel` e faça uma classe `Fatura` implementá-la.
- [ ] Faça uma classe implementar **duas** interfaces ao mesmo tempo.
- [ ] Adicione um método `default` a uma interface e teste numa classe que a implementa.
- [ ] Monte uma tabela comparando interface e classe abstrata com suas próprias palavras.
