---
title: "Encapsulamento"
---

# Encapsulamento

## O que é encapsulamento?

**Encapsulamento** é o pilar que consiste em **esconder os detalhes internos** de um objeto e **controlar o acesso** aos seus dados. A ideia é que o mundo externo interaja com o objeto apenas pelo que ele **expõe**, sem mexer diretamente nas "engrenagens".

Analogia: você dirige um carro usando volante e pedais (a interface pública). Você **não** mexe diretamente nos pistões do motor (o detalhe interno). O carro **encapsula** sua complexidade.

## O problema sem encapsulamento

Quando os atributos ficam livres, qualquer parte do código pode estragar o estado do objeto:

```java
class ContaBancaria {
    double saldo;  // acessível por qualquer um
}

ContaBancaria conta = new ContaBancaria();
conta.saldo = -5000;  // estado inválido! Ninguém impediu.
```

Um saldo negativo absurdo entrou sem nenhuma validação. Isso é perigoso.

## Modificadores de acesso

Java oferece **modificadores de acesso** para controlar quem pode ver/usar cada membro:

| Modificador | Acesso permitido |
|-------------|------------------|
| `public` | Qualquer classe, de qualquer lugar. |
| `protected` | A própria classe, subclasses e classes do mesmo pacote. |
| *(nenhum / package-private)* | Apenas classes do mesmo pacote. |
| `private` | Apenas dentro da própria classe. |

A regra prática do encapsulamento: **atributos `private`**, comportamento exposto via **métodos `public`**.

## Getters e setters

Como deixamos os atributos `private`, oferecemos métodos públicos controlados para ler (**getter**) e alterar (**setter**) os dados:

```java
class ContaBancaria {
    private double saldo;

    // getter
    public double getSaldo() {
        return saldo;
    }

    // setter com validação
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        saldo += valor;
    }

    public void sacar(double valor) {
        if (valor > saldo) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }
        saldo -= valor;
    }
}
```

Agora o saldo **nunca** fica inválido, porque toda alteração passa por validação. O objeto **protege seu próprio estado**.

```java
ContaBancaria conta = new ContaBancaria();
conta.depositar(100);
conta.sacar(30);
System.out.println(conta.getSaldo());  // 70.0
// conta.saldo = -5000;  -> ERRO de compilação: saldo é private
```

## Cuidado: getter/setter não é regra cega

Um erro comum de júnior é criar getter **e** setter para **tudo** automaticamente. Isso na prática quebra o encapsulamento, pois volta a expor o atributo livremente.

Boas práticas:

- Só crie setter se **realmente** fizer sentido alterar aquele dado externamente.
- Prefira métodos com **nomes de negócio** (`depositar`, `sacar`) em vez de `setSaldo`.
- Atributos que não devem mudar podem ser `final` (imutáveis).

## Por que o encapsulamento importa?

- **Integridade dos dados**: o objeto valida e mantém estado sempre válido.
- **Flexibilidade interna**: você pode mudar a implementação interna sem quebrar quem usa a classe, desde que a interface pública continue igual.
- **Menos acoplamento**: o resto do sistema não depende dos detalhes internos.
- **Segurança**: dados sensíveis não ficam expostos.

## Comparação com Kotlin

Em Kotlin, getters e setters são **gerados automaticamente** para propriedades. Você pode customizá-los quando precisa:

```kotlin
class ContaBancaria {
    var saldo: Double = 0.0
        private set  // só a própria classe altera

    fun depositar(valor: Double) {
        require(valor > 0) { "Valor deve ser positivo" }
        saldo += valor
    }
}
```

O `private set` permite ler `conta.saldo` de fora, mas só a classe pode alterá-lo — encapsulamento limpo e enxuto.

## Atividades
- [ ] Modele uma classe `ContaBancaria` com `saldo` privado e métodos `depositar` e `sacar` com validação.
- [ ] Tente alterar o `saldo` diretamente de fora da classe e observe o erro de compilação.
- [ ] Crie uma classe `Usuario` com `senha` privada e apenas um método para validar senha (sem getter de senha).
- [ ] Explique por que expor setter para tudo enfraquece o encapsulamento.
- [ ] Marque um atributo como `final` e veja que ele não pode ser alterado depois.
- [ ] Reescreva a `ContaBancaria` em Kotlin usando `private set`.
