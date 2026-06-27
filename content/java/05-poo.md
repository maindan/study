---
title: "POO em Java"
---

# Programação Orientada a Objetos em Java

Java é uma linguagem **orientada a objetos** por natureza. POO organiza o código em torno de **objetos**, que combinam dados (atributos) e comportamentos (métodos). Dominar isso é essencial para Android.

## Classe e objeto

Uma **classe** é o molde; um **objeto** é uma instância concreta desse molde.

```java
// A classe (molde)
public class Pessoa {
    String nome;
    int idade;
}

// Criando objetos (instâncias)
Pessoa p1 = new Pessoa();
p1.nome = "Ana";
p1.idade = 25;

Pessoa p2 = new Pessoa();
p2.nome = "Bruno";
```

A palavra `new` cria o objeto na memória e devolve uma referência a ele.

## Atributos e métodos

**Atributos** são as características; **métodos** são as ações:

```java
public class Carro {
    String marca;       // atributo
    int velocidade;     // atributo

    void acelerar() {   // método
        velocidade += 10;
    }

    void frear() {      // método
        velocidade -= 10;
    }
}
```

## Construtores

Um **construtor** é um método especial chamado ao criar o objeto com `new`. Ele tem o **mesmo nome da classe** e **não tem tipo de retorno**:

```java
public class Pessoa {
    String nome;
    int idade;

    // Construtor
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

// Uso:
Pessoa p = new Pessoa("Carla", 30);
```

Você pode ter **vários construtores** (sobrecarga). Se você não declarar nenhum, Java cria um construtor vazio automático.

## A palavra this

`this` se refere ao **objeto atual**. É usada principalmente para diferenciar o atributo de um parâmetro com o mesmo nome:

```java
public Pessoa(String nome) {
    this.nome = nome;  // this.nome = atributo; nome = parâmetro
}
```

## Encapsulamento

Encapsulamento significa **esconder os detalhes internos** e controlar o acesso aos dados. Em Java, isso é feito tornando os atributos `private` e expondo **getters** e **setters**:

```java
public class ContaBancaria {
    private double saldo;   // ninguém acessa direto

    // getter
    public double getSaldo() {
        return saldo;
    }

    // setter com validação
    public void depositar(double valor) {
        if (valor > 0) {
            this.saldo += valor;
        }
    }
}
```

Vantagem: você controla **como** os dados são alterados. Tentar `conta.saldo = -1000` direto não compila, porque `saldo` é `private`.

| Modificador | Acesso |
|-------------|--------|
| `private` | só dentro da própria classe |
| (padrão) | dentro do mesmo pacote |
| `protected` | mesmo pacote + subclasses |
| `public` | de qualquer lugar |

## Herança (extends e super)

Herança permite que uma classe **reaproveite** atributos e métodos de outra. Usa-se `extends`:

```java
public class Animal {
    String nome;

    public void comer() {
        System.out.println(nome + " está comendo");
    }
}

public class Cachorro extends Animal {
    public void latir() {
        System.out.println(nome + " está latindo");
    }
}

// Uso:
Cachorro dog = new Cachorro();
dog.nome = "Rex";
dog.comer();  // herdado de Animal
dog.latir();  // próprio de Cachorro
```

A palavra `super` acessa a superclasse (a classe "pai"), útil para chamar seu construtor:

```java
public class Cachorro extends Animal {
    String raca;

    public Cachorro(String nome, String raca) {
        super(nome);    // chama construtor de Animal
        this.raca = raca;
    }
}
```

> Java **não** suporta herança múltipla de classes (uma classe só pode estender uma). Para múltiplos comportamentos, usam-se interfaces.

## Override (sobrescrita)

Uma subclasse pode **redefinir** um método herdado. Use a anotação `@Override` para deixar claro e seguro:

```java
public class Animal {
    public void fazerSom() {
        System.out.println("Som genérico");
    }
}

public class Gato extends Animal {
    @Override
    public void fazerSom() {
        System.out.println("Miau");
    }
}
```

Isso é **polimorfismo**: o mesmo método se comporta diferente conforme o objeto real.

## Interfaces

Uma **interface** define um **contrato**: uma lista de métodos que a classe se compromete a implementar. Usa `implements`:

```java
public interface Forma {
    double area();   // método sem corpo (abstrato)
}

public class Circulo implements Forma {
    double raio;

    @Override
    public double area() {
        return Math.PI * raio * raio;
    }
}
```

Uma classe pode implementar **várias** interfaces (essa é a forma de ter "herança múltipla" em Java):

```java
public class Robo implements Andante, Falante { ... }
```

## Classes abstratas

Uma classe `abstract` **não pode ser instanciada** diretamente — serve como base. Pode misturar métodos concretos e métodos abstratos (sem corpo):

```java
public abstract class Veiculo {
    String modelo;

    public void ligar() {              // método concreto
        System.out.println("Ligando...");
    }

    public abstract void mover();      // método abstrato (subclasse implementa)
}

public class Bicicleta extends Veiculo {
    @Override
    public void mover() {
        System.out.println("Pedalando");
    }
}
```

**Interface vs classe abstrata**: use interface para definir capacidades (contratos) que classes diferentes podem compartilhar; use classe abstrata quando há código comum a ser herdado por classes relacionadas.

## Atividades

- [ ] Crie uma classe `Produto` com atributos privados, construtor e getters/setters.
- [ ] Implemente uma `ContaBancaria` com `depositar` e `sacar`, validando saldo insuficiente.
- [ ] Crie uma hierarquia `Animal` → `Cachorro`/`Gato` e use `@Override` em `fazerSom()`.
- [ ] Use `super` no construtor de uma subclasse para inicializar atributos herdados.
- [ ] Defina uma interface `Forma` e implemente em `Circulo` e `Retangulo`.
- [ ] Crie uma classe `abstract Veiculo` com um método abstrato e duas subclasses concretas.
