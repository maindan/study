---
title: "Herança"
---

# Herança

## O que é herança?

**Herança** é o pilar que permite criar uma classe **a partir de outra**, reaproveitando seus atributos e métodos. A classe que dá origem é a **superclasse** (ou classe-pai/base); a que herda é a **subclasse** (ou classe-filha/derivada).

A relação que a herança representa é o **"é um"** (em inglês, *is-a*): um `Gato` **é um** `Animal`; um `Gerente` **é um** `Funcionario`.

## Reuso de código

Imagine que todo animal tem nome e sabe comer. Em vez de repetir isso em cada classe, colocamos na superclasse:

```java
class Animal {
    protected String nome;

    public Animal(String nome) {
        this.nome = nome;
    }

    public void comer() {
        System.out.println(nome + " está comendo.");
    }
}
```

Agora `Gato` e `Cachorro` herdam tudo isso com **`extends`**:

```java
class Gato extends Animal {
    public Gato(String nome) {
        super(nome);  // chama o construtor da superclasse
    }

    public void miar() {
        System.out.println(nome + " diz: Miau!");
    }
}
```

```java
Gato felix = new Gato("Felix");
felix.comer();  // herdado de Animal -> "Felix está comendo."
felix.miar();   // próprio de Gato  -> "Felix diz: Miau!"
```

A subclasse ganha tudo da superclasse **mais** o que ela adiciona.

## A palavra-chave `super`

`super` se refere à **superclasse**. Dois usos principais:

- **`super(...)`**: chama o **construtor** da superclasse (deve ser a 1ª linha do construtor da subclasse).
- **`super.metodo()`**: chama um **método** da superclasse, útil quando você sobrescreveu e quer reaproveitar o comportamento original.

```java
class Cachorro extends Animal {
    public Cachorro(String nome) {
        super(nome);
    }

    @Override
    public void comer() {
        super.comer();  // reaproveita o comportamento do pai
        System.out.println(nome + " abana o rabo.");
    }
}
```

## Override (sobrescrita)

**Override** é redefinir, na subclasse, um método que já existe na superclasse, com a anotação **`@Override`**. Isso permite mudar o comportamento herdado:

```java
class Animal {
    public void emitirSom() {
        System.out.println("Som genérico");
    }
}

class Gato extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Miau");
    }
}
```

A anotação `@Override` é opcional, mas **muito recomendada**: o compilador avisa se você errar a assinatura. (Veremos o override em ação no próximo pilar, Polimorfismo.)

## Quando NÃO usar herança

Herança é poderosa, mas frequentemente **abusada**. Não use herança quando:

- A relação **não** é realmente "é um". Ex: `Carro extends Motor` está errado — um carro **não é** um motor; um carro **tem um** motor.
- Você só quer **reaproveitar código** sem que haja relação conceitual real.
- A hierarquia ficaria profunda e frágil (mudar o pai quebra muitos filhos).

Um teste simples: se a frase **"A é um B"** soa estranha, não use herança.

## Composição vs Herança

A **composição** representa a relação **"tem um"** (*has-a*): em vez de herdar, o objeto **contém** outro objeto como atributo.

```java
// COMPOSIÇÃO: Carro TEM UM Motor
class Motor {
    public void ligar() {
        System.out.println("Motor ligado");
    }
}

class Carro {
    private Motor motor = new Motor();  // composição

    public void ligar() {
        motor.ligar();  // delega para o motor
    }
}
```

| Herança ("é um") | Composição ("tem um") |
|------------------|-----------------------|
| `Gato extends Animal` | `Carro` tem um `Motor` |
| Forte acoplamento com o pai | Mais flexível e desacoplado |
| Difícil mudar em tempo de execução | Fácil trocar peças |

Existe um princípio famoso: **"prefira composição a herança"**. A herança cria forte dependência da superclasse; a composição é mais flexível. Use herança quando a relação "é um" for clara e estável.

## Comparação com Kotlin

Em Kotlin, as classes são **`final` por padrão** — para permitir herança você precisa marcar a classe e os métodos com `open`:

```kotlin
open class Animal(val nome: String) {
    open fun comer() = println("$nome está comendo.")
}

class Gato(nome: String) : Animal(nome) {
    override fun comer() {
        super.comer()
        println("$nome lambe as patas.")
    }
}
```

Isso força você a pensar antes de permitir herança — uma decisão de design consciente.

## Atividades
- [ ] Crie uma superclasse `Funcionario` e uma subclasse `Gerente` que adiciona um bônus.
- [ ] Use `super(...)` no construtor da subclasse para inicializar atributos do pai.
- [ ] Sobrescreva um método com `@Override` e reaproveite o original com `super.metodo()`.
- [ ] Dê um exemplo de relação "é um" e outro de relação "tem um".
- [ ] Reescreva um caso de herança incorreta usando composição.
- [ ] Em Kotlin, crie uma classe `open` e uma subclasse com `override`.
