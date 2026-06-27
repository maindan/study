---
title: "Princípios SOLID"
---

# Princípios SOLID

**SOLID** é um acrônimo para cinco princípios de design orientado a objetos, popularizados por Robert C. Martin. Eles ajudam a escrever código **flexível**, **fácil de manter** e **resistente a mudanças**. A ideia central: reduzir o acoplamento e isolar responsabilidades.

| Letra | Princípio |
|-------|-----------|
| **S** | Single Responsibility (Responsabilidade Única) |
| **O** | Open/Closed (Aberto/Fechado) |
| **L** | Liskov Substitution (Substituição de Liskov) |
| **I** | Interface Segregation (Segregação de Interfaces) |
| **D** | Dependency Inversion (Inversão de Dependência) |

## S — Single Responsibility Principle (SRP)

> Uma classe deve ter **apenas um motivo para mudar**, ou seja, uma única responsabilidade.

**Violação** — a classe faz coisas demais (regra de negócio + persistência + e-mail):

```java
class Pedido {
    void calcularTotal() { /* ... */ }
    void salvarNoBanco() { /* SQL aqui */ }
    void enviarEmail()   { /* SMTP aqui */ }
}
```

**Correção** — cada responsabilidade em sua própria classe:

```java
class Pedido {
    void calcularTotal() { /* ... */ }
}
class PedidoRepository {
    void salvar(Pedido p) { /* SQL aqui */ }
}
class EmailService {
    void enviar(Pedido p) { /* SMTP aqui */ }
}
```

Agora uma mudança no envio de e-mail não toca na lógica do pedido.

## O — Open/Closed Principle (OCP)

> As entidades devem estar **abertas para extensão**, mas **fechadas para modificação**.

**Violação** — adicionar um novo tipo exige editar o método existente:

```java
class CalculadoraDesconto {
    double calcular(String tipo, double valor) {
        if (tipo.equals("comum"))  return valor * 0.05;
        if (tipo.equals("vip"))    return valor * 0.10;
        // a cada novo tipo, é preciso mexer aqui...
        return 0;
    }
}
```

**Correção** — usar polimorfismo; novos tipos são adicionados sem alterar o que existe:

```java
interface Desconto {
    double calcular(double valor);
}
class DescontoComum implements Desconto {
    public double calcular(double valor) { return valor * 0.05; }
}
class DescontoVip implements Desconto {
    public double calcular(double valor) { return valor * 0.10; }
}
// Novo tipo? Basta criar outra classe — nada é modificado.
```

## L — Liskov Substitution Principle (LSP)

> Objetos de uma subclasse devem poder **substituir** os da superclasse sem quebrar o programa.

**Violação** — `Pinguim` é um `Ave`, mas não voa; o método herdado mente:

```java
class Ave {
    void voar() { System.out.println("Voando"); }
}
class Pinguim extends Ave {
    void voar() { throw new UnsupportedOperationException("Pinguim não voa!"); }
}
// Quem usar Ave.voar() em um Pinguim será surpreendido com erro.
```

**Correção** — modelar a hierarquia de forma honesta:

```java
class Ave { /* comportamentos comuns a toda ave */ }

interface Voadora {
    void voar();
}
class Andorinha extends Ave implements Voadora {
    public void voar() { System.out.println("Voando"); }
}
class Pinguim extends Ave {
    void nadar() { System.out.println("Nadando"); }
}
```

Agora qualquer `Voadora` realmente voa, e nenhum substituto quebra o contrato.

## I — Interface Segregation Principle (ISP)

> Prefira **muitas interfaces específicas** a uma interface grande e genérica. Nenhuma classe deve ser forçada a implementar métodos que não usa.

**Violação** — uma interface "gorda" obriga implementações vazias:

```java
interface Funcionario {
    void trabalhar();
    void programar();
}
class Gerente implements Funcionario {
    public void trabalhar() { /* ok */ }
    public void programar() { /* não faz sentido: implementação vazia */ }
}
```

**Correção** — quebrar em interfaces coesas:

```java
interface Trabalhador {
    void trabalhar();
}
interface Programador {
    void programar();
}
class Gerente implements Trabalhador {
    public void trabalhar() { /* ok */ }
}
class Dev implements Trabalhador, Programador {
    public void trabalhar() { /* ok */ }
    public void programar() { /* ok */ }
}
```

## D — Dependency Inversion Principle (DIP)

> Dependa de **abstrações** (interfaces), não de **implementações concretas**. Módulos de alto nível não devem depender de módulos de baixo nível.

**Violação** — a classe de alto nível instancia diretamente a concreta:

```java
class MySQLRepository {
    void salvar(String dado) { /* ... */ }
}
class ServicoPedido {
    private MySQLRepository repo = new MySQLRepository(); // acoplado!
    void processar(String dado) { repo.salvar(dado); }
}
// Trocar para outro banco exige reescrever ServicoPedido.
```

**Correção** — depender de uma interface e receber a implementação por injeção:

```java
interface Repository {
    void salvar(String dado);
}
class MySQLRepository implements Repository {
    public void salvar(String dado) { /* ... */ }
}
class ServicoPedido {
    private final Repository repo;
    ServicoPedido(Repository repo) { this.repo = repo; } // injeção
    void processar(String dado) { repo.salvar(dado); }
}
// Agora qualquer Repository (MySQL, Mongo, fake para teste) serve.
```

## Por que SOLID importa

- **Manutenção**: mudanças ficam localizadas, com menos efeito cascata.
- **Testabilidade**: depender de interfaces facilita usar dublês/mocks nos testes.
- **Extensibilidade**: adicionar funcionalidades sem reabrir código estável.
- **Legibilidade**: cada peça tem um propósito claro.

> SOLID são **diretrizes**, não dogmas. Aplique com bom senso — exagerar na abstração pode complicar mais do que ajudar.

## Atividades

- [ ] Identifique uma classe sua que faça mais de uma coisa e divida-a aplicando o SRP.
- [ ] Refatore um `if/else` por tipo usando polimorfismo, aplicando o OCP.
- [ ] Dê um exemplo próprio de violação do LSP e corrija a hierarquia.
- [ ] Quebre uma interface grande em duas ou mais interfaces específicas (ISP).
- [ ] Reescreva uma classe que faz `new` de uma dependência para recebê-la por injeção (DIP).
- [ ] Escreva, com suas palavras, uma frase resumindo cada uma das 5 letras de SOLID.
