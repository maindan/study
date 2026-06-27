---
title: "Classes e Objetos"
---

# Classes e Objetos

## A classe como um molde

Uma **classe** é um **molde** (ou planta/forma) que descreve como um tipo de objeto deve ser. Ela define quais dados o objeto terá e o que ele saberá fazer — mas a classe em si **não é** o objeto.

Pense em uma **forma de bolo**: a forma é a classe. Cada bolo que você assa usando ela é um **objeto**.

```java
class Cachorro {
    // atributos (estado)
    String nome;
    String raca;
    int idade;

    // método (comportamento)
    void latir() {
        System.out.println(nome + " diz: Au au!");
    }
}
```

## Objeto e instância

Um **objeto** é uma **instância** de uma classe — ou seja, é a classe "ganhando vida" na memória. Cada objeto criado é independente dos outros.

```java
Cachorro rex = new Cachorro();   // rex é um OBJETO (instância de Cachorro)
Cachorro luna = new Cachorro();  // luna é OUTRO objeto, separado
```

`rex` e `luna` são duas instâncias diferentes. Mudar o `nome` de `rex` não afeta `luna`.

## A palavra-chave `new`

Em Java, criamos objetos com o operador **`new`**. Ele:

1. Reserva espaço na memória para o objeto.
2. Chama o **construtor** da classe.
3. Devolve uma **referência** para o objeto, que guardamos numa variável.

```java
Cachorro rex = new Cachorro();
//      ^         ^
//      |         chama o construtor e cria o objeto
//      variável que guarda a referência
```

## Atributos: o estado

Os **atributos** (também chamados de campos ou propriedades) guardam o **estado** do objeto: as informações que ele carrega num dado momento.

```java
rex.nome = "Rex";
rex.raca = "Labrador";
rex.idade = 3;
```

O conjunto de valores dos atributos é o **estado** atual do objeto. Se `rex.idade` muda de 3 para 4, o estado dele mudou.

## Métodos: o comportamento

Os **métodos** definem o **comportamento** — as ações que o objeto sabe executar. Eles podem usar e modificar os atributos.

```java
rex.latir();   // imprime: Rex diz: Au au!
```

Resumindo:

| Conceito | É o quê | Exemplo |
|----------|---------|---------|
| **Estado** | os dados atuais | nome = "Rex", idade = 3 |
| **Comportamento** | as ações | latir(), comer() |

## Construtores

Um **construtor** é um método especial chamado no momento da criação do objeto. Ele serve para **inicializar** o estado. Tem o **mesmo nome da classe** e **não tem tipo de retorno**.

```java
class Cachorro {
    String nome;
    int idade;

    // Construtor
    Cachorro(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    void latir() {
        System.out.println(nome + " diz: Au au!");
    }
}
```

Agora criamos o objeto já com os dados:

```java
Cachorro rex = new Cachorro("Rex", 3);
rex.latir();
```

A palavra **`this`** se refere ao próprio objeto. `this.nome = nome` significa "o atributo `nome` do objeto recebe o valor do parâmetro `nome`".

### Construtor padrão

Se você **não** escrever nenhum construtor, o Java cria um automático e vazio (`new Cachorro()`). Mas, ao escrever um construtor com parâmetros, o automático **deixa de existir** — então `new Cachorro()` daria erro nesse caso.

### Sobrecarga de construtores

Você pode ter vários construtores com parâmetros diferentes:

```java
class Cachorro {
    String nome;
    int idade;

    Cachorro(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    Cachorro(String nome) {
        this(nome, 0);  // chama o outro construtor
    }
}
```

## Comparação com Kotlin

Kotlin reduz muito a verbosidade. O construtor pode ir direto no cabeçalho da classe:

```kotlin
class Cachorro(val nome: String, var idade: Int) {
    fun latir() {
        println("$nome diz: Au au!")
    }
}

val rex = Cachorro("Rex", 3)  // sem "new"
rex.latir()
```

Repare que Kotlin **não usa `new`** e já declara atributos e construtor na mesma linha.

## Atividades
- [ ] Crie uma classe `Carro` com atributos (marca, modelo, velocidade) e métodos (acelerar, frear).
- [ ] Adicione um construtor à classe `Carro` que receba marca e modelo.
- [ ] Crie duas instâncias diferentes de `Carro` e confirme que mudar uma não afeta a outra.
- [ ] Explique a diferença entre estado e comportamento usando sua classe `Carro`.
- [ ] Crie um segundo construtor (sobrecarga) usando `this(...)`.
- [ ] Reescreva sua classe `Carro` em Kotlin e compare o tamanho do código.
