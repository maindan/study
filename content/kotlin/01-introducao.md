---
title: "Introdução ao Kotlin"
---

# Introdução ao Kotlin

Kotlin é uma linguagem de programação moderna, concisa e segura, criada pela **JetBrains** (a mesma empresa por trás do IntelliJ IDEA). Sua primeira versão estável saiu em 2016, e em 2017 o Google a anunciou como linguagem oficial para o desenvolvimento Android. Desde 2019, o Android é **Kotlin-first**: a documentação, exemplos e novas APIs priorizam Kotlin.

## Por que Kotlin existe?

A JetBrains queria uma linguagem que fosse mais produtiva e menos verbosa que o Java, mas que aproveitasse todo o ecossistema da **JVM (Java Virtual Machine)**. As metas principais foram:

- **Concisão**: escrever menos código para fazer a mesma coisa.
- **Segurança**: evitar erros comuns em tempo de compilação, especialmente o famoso `NullPointerException`.
- **Interoperabilidade**: usar bibliotecas Java existentes sem atrito.
- **Pragmatismo**: focar em problemas reais do dia a dia do programador.

## Interoperável com Java

Kotlin e Java podem conviver no mesmo projeto. Você pode chamar código Java a partir de Kotlin e vice-versa, sem reescrever nada. Isso permitiu que empresas migrassem aos poucos, arquivo por arquivo, em vez de reescrever tudo de uma vez.

```kotlin
// Chamando uma classe Java padrão a partir de Kotlin
val lista = ArrayList<String>()
lista.add("Olá")
println(lista[0])
```

## Conciso e seguro

Compare a declaração de uma variável em Java e em Kotlin:

```java
// Java
String nome = "Maria";
final int idade = 25;
```

```kotlin
// Kotlin
var nome = "Maria"   // tipo String inferido
val idade = 25       // imutável (como o final do Java)
```

Repare que em Kotlin não precisamos repetir o tipo: o compilador **infere** que `nome` é `String` e `idade` é `Int`.

## Onde o Kotlin roda?

Kotlin é uma linguagem multiplataforma:

| Alvo | Descrição |
|------|-----------|
| **JVM** | Roda na máquina virtual Java (Android, back-end, desktop) |
| **Android** | Plataforma principal de uso |
| **Kotlin/JS** | Compila para JavaScript (front-end web) |
| **Kotlin/Native** | Compila para binários nativos (iOS, Windows, Linux, macOS) |
| **Kotlin Multiplatform** | Compartilha código entre Android, iOS, web, etc. |

Para um dev Android, o foco é a **JVM/Android**.

## Seu primeiro programa

Todo programa Kotlin começa pela função `main`. É o ponto de entrada que a JVM executa primeiro.

```kotlin
fun main() {
    println("Olá, Kotlin!")
}
```

Vamos entender cada parte:

- `fun` é a palavra-chave para declarar uma **função**.
- `main` é o nome especial do ponto de entrada do programa.
- `()` indica que a função não recebe parâmetros (ou que recebe argumentos da linha de comando).
- `println(...)` imprime um texto no console e pula uma linha.

### Versão com argumentos

```kotlin
fun main(args: Array<String>) {
    println("Argumentos recebidos: ${args.size}")
}
```

Note que **não precisa de ponto e vírgula** no fim das linhas (embora seja permitido) e **não precisa de classe** envolvendo o `main`, diferente do Java, onde tudo fica dentro de uma `public static void main`.

```java
// Em Java, o equivalente é bem mais verboso:
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

## Onde escrever e rodar?

Você pode experimentar Kotlin de várias formas:

- **Kotlin Playground** (play.kotlinlang.org): roda no navegador, sem instalar nada.
- **IntelliJ IDEA** ou **Android Studio**: IDEs oficiais da JetBrains.
- **Linha de comando**: com o compilador `kotlinc`.

Para começar, o Playground é o caminho mais rápido.

## Resumo

- Kotlin foi criado pela **JetBrains** e é a linguagem oficial do Android.
- É **conciso**, **seguro** (null safety) e **interoperável** com Java.
- Roda na JVM, em Android, no navegador e em binários nativos.
- O ponto de entrada é a função `fun main()`.

## Atividades

- [ ] Crie e rode um programa que imprime "Olá, mundo!" no Kotlin Playground.
- [ ] Escreva um `main` que imprime seu nome e sua idade em duas linhas.
- [ ] Pesquise uma biblioteca Java famosa e teste chamá-la a partir do Kotlin.
- [ ] Liste 3 diferenças que você percebeu entre o `main` de Kotlin e o de Java.
- [ ] Explique com suas palavras o que significa "interoperabilidade com Java".
