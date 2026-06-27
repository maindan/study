---
title: "Bancos Relacionais"
---

# Bancos Relacionais

Quase todo sistema que você vai construir precisa **guardar informações**: usuários, produtos, pedidos, mensagens. É aí que entram os bancos de dados.

## O que é um banco de dados?

Um **banco de dados** é uma coleção organizada de dados, guardada de forma que seja fácil **buscar, inserir, atualizar e remover** informações. Em vez de jogar tudo em arquivos de texto soltos, organizamos os dados em uma estrutura previsível.

## O que é um SGBD?

O **SGBD** (Sistema de Gerenciamento de Banco de Dados, ou *DBMS* em inglês) é o programa que gerencia o banco de dados para você. Ele cuida do armazenamento físico, da segurança, do acesso simultâneo de vários usuários e responde às suas consultas em **SQL** (*Structured Query Language*).

Os SGBDs **relacionais** mais comuns:

| SGBD | Quando usar | Observação |
|------|-------------|------------|
| **SQLite** | Apps pequenos, mobile, protótipos | Banco em um único arquivo, sem servidor |
| **MySQL / MariaDB** | Web, sites com muito acesso | Muito popular, fácil de hospedar |
| **PostgreSQL** | Sistemas robustos, dados complexos | Muito completo e fiel ao padrão SQL |

Todos falam SQL, então o que você aprende aqui serve para os três. Existem pequenas diferenças de sintaxe que vamos apontar quando relevante.

## O modelo relacional

O **modelo relacional** organiza os dados em **tabelas** (também chamadas de *relações*). Cada tabela representa um tipo de entidade, por exemplo `clientes`, `produtos` ou `pedidos`.

Pense em uma tabela como uma planilha:

- Cada **linha** (também chamada de *registro* ou *tupla*) é uma ocorrência. Por exemplo, **um** cliente.
- Cada **coluna** (também chamada de *campo* ou *atributo*) é uma propriedade. Por exemplo, o `nome` do cliente.

### Exemplo de tabela `clientes`

| id | nome | email | cidade |
|----|------|-------|--------|
| 1 | Ana Souza | ana@email.com | São Paulo |
| 2 | Bruno Lima | bruno@email.com | Recife |
| 3 | Carla Dias | carla@email.com | São Paulo |

Aqui temos uma tabela `clientes` com **4 colunas** e **3 linhas/registros**.

## Tipos de dados

Cada coluna tem um **tipo de dado**, que define o que pode ser armazenado nela. Definir o tipo certo evita erros e economiza espaço. Os mais comuns:

| Tipo | Para que serve | Exemplo |
|------|----------------|---------|
| `INTEGER` / `INT` | Números inteiros | `42`, `-7` |
| `DECIMAL(10,2)` / `NUMERIC` | Números com casas decimais (dinheiro) | `19.90` |
| `VARCHAR(n)` | Texto de tamanho variável até `n` | `'Ana Souza'` |
| `TEXT` | Texto longo, sem limite definido | um parágrafo |
| `BOOLEAN` | Verdadeiro ou falso | `TRUE`, `FALSE` |
| `DATE` | Data | `'2026-06-26'` |
| `TIMESTAMP` / `DATETIME` | Data e hora | `'2026-06-26 14:30:00'` |

> **Dica:** use `DECIMAL` (e não `FLOAT`) para valores monetários, porque `FLOAT` pode gerar arredondamentos imprecisos.

### Exemplo: como uma tabela é definida

Mais adiante veremos isso em detalhe, mas já dá pra ter uma ideia de como o SGBD sabe o tipo de cada coluna:

```sql
CREATE TABLE clientes (
    id      INTEGER,
    nome    VARCHAR(100),
    email   VARCHAR(150),
    cidade  VARCHAR(80)
);
```

## SQL: a linguagem dos bancos relacionais

Todas as operações são feitas com **SQL**. Um exemplo bem simples de consulta:

```sql
SELECT nome, cidade
FROM clientes;
```

Resultado:

| nome | cidade |
|------|--------|
| Ana Souza | São Paulo |
| Bruno Lima | Recife |
| Carla Dias | São Paulo |

Nos próximos módulos você vai dominar essa linguagem passo a passo.

## Atividades

- [ ] Liste 3 entidades de um app que você gostaria de criar (ex: `usuarios`, `posts`, `comentarios`) e descreva 3 colunas de cada uma.
- [ ] Para a tabela `clientes` do exemplo, escreva qual seria o tipo de dado ideal para cada coluna.
- [ ] Pesquise a diferença entre `VARCHAR` e `TEXT` no PostgreSQL.
- [ ] Instale o SQLite (ou use um ambiente online como db-fiddle / sqliteonline) e crie uma tabela simples.
- [ ] Explique com suas palavras a diferença entre "banco de dados" e "SGBD".
