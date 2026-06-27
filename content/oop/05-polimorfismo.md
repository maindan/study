---
title: "Polimorfismo"
---

# Polimorfismo

## O que é polimorfismo?

A palavra **polimorfismo** vem do grego: *poli* (muitas) + *morfo* (formas) — "muitas formas". Na POO, significa que **um mesmo comando pode se comportar de maneiras diferentes** dependendo do objeto que o executa.

É o pilar que dá flexibilidade ao código: você escreve uma instrução genérica e cada objeto responde do seu jeito.

## Sobrescrita (override) vs Sobrecarga (overload)

Existem duas formas comuns de polimorfismo que costumam confundir. Atenção à diferença:

| | Sobrescrita (override) | Sobrecarga (overload) |
|---|------------------------|-----------------------|
| **O que é** | Redefinir um método herdado na subclasse | Vários métodos com **mesmo nome** e parâmetros diferentes |
| **Onde** | Entre superclasse e subclasse | Na mesma classe (ou herdados) |
| **Assinatura** | **Igual** à do pai | **Diferente** (nº/tipo de parâmetros) |
| **Quando é resolvido** | Em tempo de **execução** (dinâmico) | Em tempo de **compilação** (estático) |

### Sobrecarga (overload)

Mesmo nome, parâmetros diferentes:

```java
class Calculadora {
    int somar(int a, int b) {
        return a + b;
    }

    double somar(double a, double b) {
        return a + b;
    }

    int somar(int a, int b, int c) {
        return a + b + c;
    }
}
```

O compilador escolhe qual versão chamar com base nos argumentos que você passou.

### Sobrescrita (override)

Mesma assinatura, comportamento redefinido na subclasse:

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

class Cachorro extends Animal {
    @Override
    public void emitirSom() {
        System.out.println("Au au");
    }
}
```

## Ligação dinâmica (dynamic binding)

A **ligação dinâmica** é a mágica do override: o Java decide, **em tempo de execução**, qual versão do método chamar, com base no **tipo real do objeto** — não no tipo da variável.

```java
Animal animal = new Gato();  // tipo da variável: Animal; objeto real: Gato
animal.emitirSom();          // imprime "Miau" -> usa o tipo REAL
```

Mesmo a variável sendo do tipo `Animal`, o método executado é o do `Gato`. Isso é decidido na hora da execução.

## Upcasting

**Upcasting** é tratar um objeto de uma subclasse como se fosse do tipo da superclasse. É seguro e automático (não precisa de cast explícito):

```java
Gato gato = new Gato();
Animal animal = gato;  // upcasting automático: um Gato É UM Animal
```

Isso é o que torna o polimorfismo possível: você pode guardar diferentes tipos numa variável do tipo base.

> O caminho inverso (**downcasting**, de `Animal` para `Gato`) precisa de cast explícito e pode falhar em tempo de execução. Use `instanceof` para verificar antes.

## Exemplo: lista de formas

O poder do polimorfismo aparece quando temos uma coleção de objetos diferentes tratados de forma uniforme:

```java
abstract class Forma {
    abstract double area();
}

class Circulo extends Forma {
    double raio;
    Circulo(double raio) { this.raio = raio; }

    @Override
    double area() { return Math.PI * raio * raio; }
}

class Retangulo extends Forma {
    double largura, altura;
    Retangulo(double l, double a) { largura = l; altura = a; }

    @Override
    double area() { return largura * altura; }
}
```

Agora processamos todas as formas com o **mesmo código**:

```java
List<Forma> formas = List.of(
    new Circulo(2),
    new Retangulo(3, 4)
);

for (Forma forma : formas) {
    System.out.println("Área: " + forma.area());  // cada uma calcula do seu jeito
}
```

Repare: o `for` não sabe (nem precisa saber) se é círculo ou retângulo. Cada objeto responde com seu próprio cálculo. Se amanhã surgir um `Triangulo`, o loop **não muda** — basta criar a nova classe.

## Comparação com Kotlin

Kotlin funciona da mesma forma, com `override` obrigatório por palavra-chave:

```kotlin
abstract class Forma {
    abstract fun area(): Double
}

class Circulo(val raio: Double) : Forma() {
    override fun area() = Math.PI * raio * raio
}

val formas: List<Forma> = listOf(Circulo(2.0))
formas.forEach { println(it.area()) }
```

## Atividades
- [ ] Crie uma classe `Calculadora` com pelo menos 3 métodos `somar` sobrecarregados.
- [ ] Crie uma hierarquia `Animal` com `Gato` e `Cachorro` sobrescrevendo `emitirSom`.
- [ ] Guarde vários animais numa `List<Animal>` e percorra chamando `emitirSom`.
- [ ] Explique, com seu código, a diferença entre tipo da variável e tipo real do objeto.
- [ ] Adicione uma nova `Forma` (ex: `Triangulo`) e confirme que o loop não precisa mudar.
- [ ] Descreva com suas palavras o que é ligação dinâmica.
