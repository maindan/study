---
title: "Strings e Utilitários"
---

# Strings e Utilitários

`String` é uma das classes mais usadas em Java. Junto com `StringBuilder`, a classe `Math`, as classes wrapper e o `Scanner`, ela forma o conjunto de utilitários básicos do dia a dia.

## String é imutável

Em Java, uma `String` é **imutável**: depois de criada, seu conteúdo nunca muda. Métodos que "modificam" na verdade retornam uma **nova** String:

```java
String nome = "ana";
nome.toUpperCase();          // gera "ANA", mas é descartado
System.out.println(nome);    // ana  (inalterado!)

nome = nome.toUpperCase();   // agora sim guardamos o resultado
System.out.println(nome);    // ANA
```

A imutabilidade traz segurança (a String pode ser compartilhada sem medo) e permite o **pool de Strings**, onde literais iguais reutilizam o mesmo objeto.

## Métodos comuns de String

```java
String s = "Java é demais";

System.out.println(s.length());          // 13
System.out.println(s.charAt(0));         // J
System.out.println(s.toUpperCase());     // JAVA É DEMAIS
System.out.println(s.toLowerCase());     // java é demais
System.out.println(s.substring(0, 4));   // Java
System.out.println(s.indexOf("é"));      // 5
System.out.println(s.contains("demais"));// true
System.out.println(s.replace("a", "@")); // J@v@ é dem@is
System.out.println("  oi  ".trim());     // "oi" (sem espaços nas pontas)
System.out.println(s.startsWith("Java")); // true
System.out.println(s.isEmpty());          // false
```

Dividir e juntar:

```java
String csv = "maçã,banana,uva";
String[] partes = csv.split(",");        // ["maçã", "banana", "uva"]
String junto = String.join(" - ", partes); // "maçã - banana - uva"
```

## `==` vs `equals()`

Esta é uma das maiores armadilhas de Java. O `==` compara **referências** (se são o mesmo objeto na memória); `equals()` compara **conteúdo**:

```java
String a = new String("oi");
String b = new String("oi");

System.out.println(a == b);       // false → objetos diferentes
System.out.println(a.equals(b));  // true  → mesmo conteúdo
```

| Operador | Compara |
|----------|---------|
| `==` | se é o mesmo objeto na memória |
| `.equals()` | se o conteúdo é igual |

> Regra de ouro: para comparar o **valor** de Strings, use sempre `equals()`. Use `equalsIgnoreCase()` para ignorar maiúsculas/minúsculas.

## StringBuilder

Como cada concatenação de String cria um novo objeto, montar texto dentro de um loop com `+` é ineficiente. O `StringBuilder` é **mutável** e resolve isso:

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i).append("-");
}
sb.append("fim");
System.out.println(sb.toString());  // 1-2-3-4-5-fim

sb.insert(0, ">> ");   // insere no início
sb.reverse();          // inverte o conteúdo
```

## String.format

Permite formatar texto com **placeholders**, semelhante ao `printf`:

```java
String msg = String.format("%s tem %d anos e nota %.2f", "Ana", 25, 9.5);
System.out.println(msg);  // Ana tem 25 anos e nota 9,50

System.out.printf("Total: R$ %.2f%n", 1234.5);  // imprime direto
```

| Especificador | Significado |
|---------------|-------------|
| `%s` | texto (String) |
| `%d` | número inteiro |
| `%f` | número decimal (`%.2f` = 2 casas) |
| `%n` | quebra de linha |

## Classe Math

Reúne funções matemáticas estáticas:

```java
System.out.println(Math.max(3, 8));    // 8
System.out.println(Math.min(3, 8));    // 3
System.out.println(Math.abs(-10));     // 10
System.out.println(Math.pow(2, 10));   // 1024.0
System.out.println(Math.sqrt(144));    // 12.0
System.out.println(Math.round(3.7));   // 4
System.out.println(Math.ceil(3.1));    // 4.0
System.out.println(Math.floor(3.9));   // 3.0
System.out.println(Math.random());     // decimal aleatório [0.0, 1.0)
```

## Wrappers e autoboxing

Cada tipo primitivo tem uma classe **wrapper** que o representa como objeto: `int → Integer`, `double → Double`, `boolean → Boolean`, etc. São necessárias em coleções genéricas (`List<Integer>`).

O **autoboxing** converte primitivo ↔ wrapper automaticamente:

```java
Integer caixa = 42;        // autoboxing: int → Integer
int valor = caixa;         // unboxing: Integer → int

List<Integer> nums = new ArrayList<>();
nums.add(5);               // autoboxing acontece aqui
```

Conversões úteis de texto para número:

```java
int n = Integer.parseInt("123");        // 123
double d = Double.parseDouble("3.14");   // 3.14
String t = Integer.toString(99);         // "99"

System.out.println(Integer.MAX_VALUE);   // 2147483647
```

## Scanner

Lê entrada do usuário pelo teclado:

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
System.out.print("Seu nome: ");
String nome = sc.nextLine();

System.out.print("Sua idade: ");
int idade = sc.nextInt();

System.out.println("Olá, " + nome + "! Você tem " + idade + " anos.");
sc.close();
```

> Cuidado: ao misturar `nextInt()` com `nextLine()`, o `nextInt()` deixa a quebra de linha no buffer. Um `sc.nextLine()` extra costuma resolver.

## Atividades

- [ ] Crie uma String e demonstre que `toUpperCase()` não altera a original, apenas retorna uma nova.
- [ ] Compare duas Strings com `==` e com `equals()` e explique a diferença do resultado.
- [ ] Use um `StringBuilder` para montar a string `"0,1,2,3,4"` dentro de um loop.
- [ ] Formate com `String.format` uma frase com um nome (`%s`), uma idade (`%d`) e um preço com 2 casas (`%.2f`).
- [ ] Use a classe `Math` para calcular a hipotenusa de um triângulo (`sqrt(a² + b²)`).
- [ ] Leia dois números com `Scanner` e imprima a soma deles.
