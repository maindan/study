---
title: "Classes e Objetos"
---

# Classes e Objetos

Kotlin é uma linguagem orientada a objetos, mas com sintaxe muito mais enxuta que o Java. Vamos ver como criar classes, propriedades e os tipos especiais de classe.

## Classes e construtor primário

Em Kotlin, o **construtor primário** faz parte da declaração da classe. As propriedades podem ser declaradas direto nos parâmetros usando `val` ou `var`.

```kotlin
class Pessoa(val nome: String, var idade: Int)

val p = Pessoa("Ana", 30)   // sem "new"!
println(p.nome)             // Ana
p.idade = 31                // var pode mudar
```

Repare em duas coisas importantes:

- **Não existe `new`** em Kotlin. Você cria objetos chamando a classe diretamente.
- Declarar `val nome: String` no construtor já cria a propriedade e atribui automaticamente.

Compare com o Java equivalente, que precisa de campos, construtor e getters/setters:

```java
// Java
public class Pessoa {
    private final String nome;
    private int idade;
    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }
}
```

### Bloco `init`

Para lógica de inicialização, use o bloco `init`:

```kotlin
class Conta(val titular: String, saldoInicial: Double) {
    var saldo = saldoInicial
    init {
        require(saldoInicial >= 0) { "Saldo não pode ser negativo" }
        println("Conta criada para $titular")
    }
}
```

## Propriedades e métodos

```kotlin
class Retangulo(val largura: Int, val altura: Int) {
    // propriedade calculada
    val area: Int
        get() = largura * altura

    // método
    fun descrever() = "Retângulo ${largura}x$altura"
}

val r = Retangulo(3, 4)
println(r.area)        // 12
println(r.descrever()) // Retângulo 3x4
```

## `data class`

Para classes que apenas **guardam dados**, use `data class`. O Kotlin gera automaticamente `equals()`, `hashCode()`, `toString()` e a função `copy()`.

```kotlin
data class Produto(val nome: String, val preco: Double)

val p1 = Produto("Café", 15.0)
val p2 = Produto("Café", 15.0)

println(p1)              // Produto(nome=Café, preco=15.0)
println(p1 == p2)        // true (compara conteúdo!)

// copy: cria uma cópia mudando só o que você quiser
val p3 = p1.copy(preco = 18.0)
```

Em Java, fazer tudo isso à mão (ou com Lombok) é trabalhoso. A `data class` resolve numa linha.

## `enum`

Enums representam um conjunto fixo de valores.

```kotlin
enum class Direcao {
    NORTE, SUL, LESTE, OESTE
}

val d = Direcao.NORTE
println(d.name)        // NORTE

// enum com propriedades
enum class Planeta(val raio: Double) {
    TERRA(6371.0),
    MARTE(3389.5);

    fun descrever() = "Raio: $raio km"
}
```

## `sealed class`

Uma **sealed class** (classe selada) restringe a herança a um conjunto **conhecido e fechado** de subtipos. É muito útil com `when`, pois o compilador sabe todos os casos possíveis.

```kotlin
sealed class Resultado

data class Sucesso(val dados: String) : Resultado()
data class Erro(val mensagem: String) : Resultado()
object Carregando : Resultado()

fun tratar(r: Resultado) = when (r) {
    is Sucesso -> "OK: ${r.dados}"
    is Erro -> "Falhou: ${r.mensagem}"
    Carregando -> "Aguarde..."
    // não precisa de "else": o compilador sabe que cobrimos todos os casos
}
```

Isso é muito usado no Android para representar estados de tela.

## `object` e singleton

A palavra-chave `object` cria um **singleton** — uma única instância garantida pela linguagem.

```kotlin
object Configuracao {
    val versao = "1.0"
    fun imprimir() = println("Versão $versao")
}

Configuracao.imprimir()   // acessa direto, sem instanciar
```

## `companion object`

Para ter membros "estáticos" (que pertencem à classe, não a uma instância), use `companion object`. É o equivalente ao `static` do Java.

```kotlin
class Usuario(val nome: String) {
    companion object {
        const val TIPO = "padrão"
        fun criarAnonimo() = Usuario("Anônimo")
    }
}

val u = Usuario.criarAnonimo()   // chamado na classe
println(Usuario.TIPO)            // padrão
```

## Herança: `open` e `override`

Em Kotlin, classes e métodos são **`final` por padrão** (não podem ser herdados/sobrescritos). Para permitir herança, use `open`. Para sobrescrever, use `override`.

```kotlin
open class Animal(val nome: String) {
    open fun fazerSom() = "..."
}

class Cachorro(nome: String) : Animal(nome) {
    override fun fazerSom() = "Au au!"
}

val c = Cachorro("Rex")
println(c.fazerSom())   // Au au!
```

Isso é o oposto do Java, onde tudo é herdável por padrão. A escolha do Kotlin força você a pensar antes de permitir herança.

## Resumo

| Tipo | Uso |
|------|-----|
| `class` | Classe comum |
| `data class` | Classe para dados (gera equals/copy/etc.) |
| `enum class` | Conjunto fixo de valores |
| `sealed class` | Hierarquia fechada e conhecida |
| `object` | Singleton |
| `companion object` | Membros "estáticos" |
| `open` / `override` | Habilitar e sobrescrever herança |

## Atividades

- [ ] Crie uma `class Carro` com construtor primário e um método `buzinar()`.
- [ ] Transforme uma classe simples em `data class` e teste `==` e `copy()`.
- [ ] Crie um `enum` de dias da semana e imprima o `.name` de um deles.
- [ ] Modele uma `sealed class` para os estados de um download (sucesso, erro, carregando).
- [ ] Crie um `object` de configuração e acesse seus membros sem instanciar.
- [ ] Crie uma classe `open` e uma subclasse que faz `override` de um método.
