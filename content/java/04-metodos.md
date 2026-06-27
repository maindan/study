---
title: "Métodos"
---

# Métodos

Um **método** é um bloco de código com nome que executa uma tarefa. Ele permite **reutilizar** lógica e **organizar** o programa em partes menores. Em outras linguagens, isso seria chamado de "função".

## Declaração de um método

A estrutura básica é:

```java
modificador tipoRetorno nomeDoMetodo(parâmetros) {
    // corpo
    return valor;  // se houver retorno
}
```

Exemplo:

```java
public int somar(int a, int b) {
    return a + b;
}
```

- `public` — modificador de acesso.
- `int` — tipo de retorno.
- `somar` — nome (por convenção, **camelCase**).
- `(int a, int b)` — parâmetros.

## Parâmetros e retorno

**Parâmetros** são valores que o método recebe. **Retorno** é o valor que ele devolve com `return`:

```java
public double calcularMedia(double n1, double n2) {
    double media = (n1 + n2) / 2;
    return media;
}

// Chamando:
double resultado = calcularMedia(8.0, 6.0);
System.out.println(resultado);  // 7.0
```

O tipo declarado deve combinar com o que é retornado: se o método é `double`, o `return` precisa devolver um `double`.

## void (sem retorno)

Quando o método **não devolve** valor, o tipo de retorno é `void`:

```java
public void saudar(String nome) {
    System.out.println("Olá, " + nome + "!");
    // não precisa de return
}

saudar("Ana");  // Olá, Ana!
```

Você pode usar `return;` (sozinho) dentro de um `void` apenas para **sair** do método antes do fim.

## Sobrecarga (overloading)

Java permite **vários métodos com o mesmo nome**, desde que tenham **parâmetros diferentes** (em quantidade ou tipo). Isso se chama sobrecarga:

```java
public int somar(int a, int b) {
    return a + b;
}

public double somar(double a, double b) {
    return a + b;
}

public int somar(int a, int b, int c) {
    return a + b + c;
}
```

O compilador escolhe a versão certa com base nos argumentos:

```java
somar(2, 3);        // chama a primeira
somar(2.5, 3.5);    // chama a segunda
somar(1, 2, 3);     // chama a terceira
```

> O **tipo de retorno sozinho não diferencia** uma sobrecarga — a diferença precisa estar nos parâmetros.

## Escopo de variáveis

Uma variável só existe dentro do bloco onde foi declarada:

```java
public void exemplo() {
    int x = 10;        // x existe só dentro deste método
    if (x > 5) {
        int y = 20;    // y existe só dentro do if
        System.out.println(x + y);
    }
    // aqui y NÃO existe mais
}
```

Variáveis declaradas dentro de um método são **locais** e desaparecem quando o método termina.

## static vs instância

Há dois tipos de métodos (e atributos):

| | static | instância |
|---|--------|-----------|
| Pertence a | **classe** | **objeto** |
| Como chamar | `Classe.metodo()` | `objeto.metodo()` |
| Acessa | só membros static | tudo |

```java
public class Calculadora {
    public static int dobro(int n) {   // static
        return n * 2;
    }

    public int triplo(int n) {          // instância
        return n * 3;
    }
}

// Uso:
Calculadora.dobro(5);              // 10 — sem criar objeto

Calculadora c = new Calculadora();
c.triplo(5);                       // 15 — precisa de objeto
```

O método `main` é `static` justamente porque a JVM o chama **sem criar um objeto** da sua classe.

## varargs (argumentos variáveis)

Permite passar **qualquer quantidade** de argumentos do mesmo tipo, usando `...`:

```java
public int somarTodos(int... numeros) {
    int total = 0;
    for (int n : numeros) {
        total += n;
    }
    return total;
}

// Uso:
somarTodos(1, 2);           // 3
somarTodos(1, 2, 3, 4, 5);  // 15
somarTodos();               // 0
```

Dentro do método, `numeros` se comporta como um array. O varargs deve ser **sempre o último** parâmetro.

## Recursão

Um método **recursivo** chama a si mesmo. Sempre precisa de um **caso base** para parar, senão vira loop infinito:

```java
public int fatorial(int n) {
    if (n <= 1) {        // caso base
        return 1;
    }
    return n * fatorial(n - 1);  // chamada recursiva
}

fatorial(5);  // 5 * 4 * 3 * 2 * 1 = 120
```

Passo a passo de `fatorial(3)`:

```
fatorial(3) = 3 * fatorial(2)
            = 3 * (2 * fatorial(1))
            = 3 * (2 * 1)
            = 6
```

## Atividades

- [ ] Crie um método `multiplicar(int a, int b)` que retorna o produto e o teste no `main`.
- [ ] Escreva um método `void` que imprime uma linha de separadores.
- [ ] Implemente sobrecarga: `area(double lado)` para quadrado e `area(double base, double altura)` para retângulo.
- [ ] Crie um método static `ehPar(int n)` que retorna `boolean`.
- [ ] Escreva um método com varargs que calcula a média de quantos números forem passados.
- [ ] Implemente recursivamente a sequência de Fibonacci e teste com `fibonacci(7)`.
