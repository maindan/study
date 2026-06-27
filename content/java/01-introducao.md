---
title: "Introdução e Ambiente"
---

# Introdução ao Java

Java é uma linguagem de programação **orientada a objetos**, fortemente tipada e de propósito geral. Foi criada pela Sun Microsystems em 1995 e hoje é mantida pela Oracle. Seu lema histórico é *"Write Once, Run Anywhere"* (Escreva uma vez, rode em qualquer lugar), porque o mesmo programa pode rodar em Windows, Linux, macOS e até celulares Android.

Para Android, Java é fundamental: foi a linguagem oficial por anos e ainda sustenta grande parte do ecossistema, mesmo com a chegada do Kotlin.

## JVM, JDK e JRE

Esses três termos confundem quem está começando. Veja a diferença:

| Sigla | Nome | O que é |
|-------|------|---------|
| **JVM** | Java Virtual Machine | A máquina virtual que **executa** o bytecode Java. É ela que garante o "rode em qualquer lugar". |
| **JRE** | Java Runtime Environment | A JVM + bibliotecas necessárias para **rodar** programas Java. |
| **JDK** | Java Development Kit | O JRE + ferramentas de **desenvolvimento** (compilador `javac`, depurador, etc.). |

Para **desenvolver**, você precisa do **JDK**. Recomenda-se uma versão LTS (Long-Term Support), como o **Java 17** ou o **Java 21**.

Verifique sua instalação no terminal:

```bash
java -version
javac -version
```

## Compilação: javac e java

Diferente de linguagens interpretadas, o Java passa por **duas etapas**:

1. **Compilação**: o `javac` transforma seu código-fonte (`.java`) em **bytecode** (`.class`).
2. **Execução**: o comando `java` carrega o bytecode na **JVM**, que o traduz para instruções da máquina.

```bash
javac Ola.java   # gera Ola.class (bytecode)
java Ola         # a JVM executa o bytecode
```

### O que é bytecode?

Bytecode é um código intermediário, independente de sistema operacional. Ele não é texto legível nem código de máquina nativo — é uma representação que **qualquer JVM entende**. Por isso o mesmo `.class` roda em qualquer plataforma que tenha uma JVM.

```
Código (.java)  --javac-->  Bytecode (.class)  --JVM-->  Programa rodando
```

> A partir do Java 11, você pode rodar um arquivo único diretamente com `java Ola.java`, sem compilar antes — útil para testes rápidos.

## Hello World

O programa mais simples possível. Crie um arquivo chamado **`Ola.java`**:

```java
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
    }
}
```

Compile e execute:

```bash
javac Ola.java
java Ola
```

Saída:

```
Olá, mundo!
```

## Estrutura de uma classe com main

Vamos entender cada parte do exemplo acima:

```java
public class Ola {              // 1. Declaração da classe
    public static void main(String[] args) {  // 2. Método principal
        System.out.println("Olá, mundo!");    // 3. Instrução
    }
}
```

1. **`public class Ola`** — toda execução Java começa em uma classe. O nome da classe **pública** deve ser **igual ao nome do arquivo** (`Ola.java`).
2. **`public static void main(String[] args)`** — é o **ponto de entrada** do programa. A JVM procura exatamente por esse método para começar:
   - `public` — acessível de fora.
   - `static` — pertence à classe, não a um objeto.
   - `void` — não retorna nada.
   - `String[] args` — recebe argumentos passados pela linha de comando.
3. **`System.out.println(...)`** — imprime texto na saída e pula uma linha. Use `System.out.print(...)` para imprimir sem quebra de linha.

### Regras importantes

- Java é **case-sensitive**: `Ola` é diferente de `ola`.
- Cada instrução termina com **ponto e vírgula** (`;`).
- Blocos de código ficam entre **chaves** `{ }`.
- Por convenção, nomes de classes usam **PascalCase** (`MinhaClasse`).

## Atividades

- [ ] Instale um JDK LTS (17 ou 21) e confirme com `java -version` e `javac -version` no terminal.
- [ ] Crie, compile e execute o programa `Ola.java` mostrando "Olá, mundo!".
- [ ] Modifique o programa para imprimir três linhas diferentes usando `println`.
- [ ] Teste a diferença entre `print` e `println` em um mesmo programa.
- [ ] Rode o arquivo diretamente com `java Ola.java` (sem `javac`) e compare com o processo de dois passos.
- [ ] Desenhe (ou escreva) com suas palavras o fluxo: código → javac → bytecode → JVM.
