---
title: "Exceções"
---

# Exceções

Uma **exceção** é um evento anormal que interrompe o fluxo normal do programa — uma divisão por zero, um arquivo que não existe, um índice fora do array. Em vez de travar, Java permite **capturar** e **tratar** esses erros de forma controlada.

## try / catch / finally

O bloco `try` contém o código que pode falhar; o `catch` trata o erro; o `finally` sempre executa, dando certo ou não:

```java
try {
    int[] v = {1, 2, 3};
    System.out.println(v[10]);   // vai falhar
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Índice inválido: " + e.getMessage());
} finally {
    System.out.println("Sempre executa (limpeza, fechar recursos).");
}
```

Você pode capturar vários tipos:

```java
try {
    int x = Integer.parseInt("abc");
    int y = 10 / 0;
} catch (NumberFormatException e) {
    System.out.println("Texto não é número");
} catch (ArithmeticException e) {
    System.out.println("Divisão por zero");
}
```

Ou usar **multi-catch** quando o tratamento é o mesmo:

```java
try {
    // ...
} catch (NumberFormatException | ArithmeticException e) {
    System.out.println("Erro: " + e.getMessage());
}
```

> A ordem importa: catches mais específicos vêm antes dos mais genéricos (`Exception`).

## throw e throws

- **`throw`** dispara uma exceção manualmente.
- **`throws`** declara, na assinatura do método, que ele pode lançar uma exceção (o chamador precisa lidar com ela).

```java
static void sacar(double saldo, double valor) {
    if (valor > saldo) {
        throw new IllegalArgumentException("Saldo insuficiente");
    }
    System.out.println("Saque de " + valor + " realizado");
}

static void lerArquivo(String caminho) throws IOException {
    // se algo falhar aqui, a exceção sobe para quem chamou
}
```

## Checked vs unchecked

Esta distinção define **quando o compilador obriga** o tratamento:

| Tipo | Verificada em | Exemplos | Tratamento |
|------|---------------|----------|------------|
| **Checked** | compilação | `IOException`, `SQLException` | obrigatório (try/catch ou throws) |
| **Unchecked** | execução | `NullPointerException`, `ArithmeticException` | opcional |

```java
// CHECKED: o compilador exige tratar ou declarar throws
void m() throws IOException {
    throw new IOException("falha de E/S");
}

// UNCHECKED: compila sem tratamento; estoura em runtime
void n() {
    String s = null;
    s.length();   // NullPointerException
}
```

Em geral, **unchecked** indica um bug de programação (corrija o código); **checked** indica uma condição externa esperada (arquivo ausente, rede fora), que merece tratamento.

## Hierarquia de exceções

Tudo descende de `Throwable`:

```text
Throwable
├── Error            (graves, da JVM — não trate. Ex.: OutOfMemoryError)
└── Exception
    ├── IOException, SQLException ...   → CHECKED
    └── RuntimeException                → UNCHECKED
        ├── NullPointerException
        ├── ArithmeticException
        ├── ArrayIndexOutOfBoundsException
        └── IllegalArgumentException
```

- **`Error`**: problemas sérios da máquina virtual; normalmente não se captura.
- **`Exception`** (exceto `RuntimeException`): checked.
- **`RuntimeException`** e suas filhas: unchecked.

## try-with-resources

Recursos como arquivos e conexões precisam ser **fechados**. O `try-with-resources` fecha automaticamente qualquer objeto que implemente `AutoCloseable`, mesmo se ocorrer uma exceção:

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

try (BufferedReader br = new BufferedReader(new FileReader("dados.txt"))) {
    String linha = br.readLine();
    System.out.println(linha);
} catch (IOException e) {
    System.out.println("Erro ao ler: " + e.getMessage());
}
// br.close() é chamado automaticamente — sem precisar de finally
```

Você pode declarar vários recursos separados por `;`. Isso elimina o `finally` manual e evita vazamento de recursos.

## Exceção customizada

Criar sua própria exceção deixa os erros mais expressivos. Basta estender `Exception` (checked) ou `RuntimeException` (unchecked):

```java
// Exceção customizada unchecked
public class SaldoInsuficienteException extends RuntimeException {
    public SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}

public class Conta {
    private double saldo = 100;

    public void sacar(double valor) {
        if (valor > saldo) {
            throw new SaldoInsuficienteException(
                "Tentou sacar " + valor + " mas o saldo é " + saldo);
        }
        saldo -= valor;
    }
}

// Uso
Conta c = new Conta();
try {
    c.sacar(500);
} catch (SaldoInsuficienteException e) {
    System.out.println("Operação negada: " + e.getMessage());
}
```

## Boas práticas

- Capture exceções **específicas**, não `catch (Exception e)` genérico.
- Nunca deixe um `catch` **vazio** — engole o erro silenciosamente.
- Não use exceções para controle de fluxo normal (ex.: laços).
- Use `try-with-resources` para qualquer recurso fechável.
- Mensagens de erro devem ser claras e úteis para o diagnóstico.

## Atividades

- [ ] Provoque uma `ArithmeticException` dividindo por zero e trate-a com try/catch.
- [ ] Escreva um método que use `throw` para rejeitar uma idade negativa.
- [ ] Classifique em uma tabela: `NullPointerException`, `IOException`, `IllegalArgumentException` como checked ou unchecked.
- [ ] Use multi-catch para tratar `NumberFormatException` e `ArithmeticException` no mesmo bloco.
- [ ] Crie uma exceção customizada `IdadeInvalidaException` e lance-a quando a idade for menor que zero.
- [ ] Reescreva uma leitura de arquivo usando try-with-resources em vez de finally manual.
