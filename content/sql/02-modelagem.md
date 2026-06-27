---
title: "Modelagem e Normalização"
---

# Modelagem e Normalização

Antes de criar tabelas, precisamos **planejar** como os dados se relacionam. Uma boa modelagem evita dados duplicados, inconsistências e dores de cabeça no futuro.

## Chave primária (Primary Key)

A **chave primária** (PK) é a coluna (ou conjunto de colunas) que **identifica unicamente** cada linha de uma tabela. Ela:

- nunca pode se repetir;
- nunca pode ser nula (`NULL`).

Geralmente usamos uma coluna `id` numérica e auto-incrementável.

```sql
CREATE TABLE clientes (
    id    INTEGER PRIMARY KEY,
    nome  VARCHAR(100),
    email VARCHAR(150)
);
```

| id (PK) | nome | email |
|---------|------|-------|
| 1 | Ana Souza | ana@email.com |
| 2 | Bruno Lima | bruno@email.com |

## Chave estrangeira (Foreign Key)

A **chave estrangeira** (FK) é uma coluna que aponta para a chave primária de **outra** tabela. É assim que conectamos tabelas.

Por exemplo, cada `pedido` pertence a um `cliente`:

```sql
CREATE TABLE pedidos (
    id          INTEGER PRIMARY KEY,
    cliente_id  INTEGER,
    total       DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

Tabela `pedidos`:

| id (PK) | cliente_id (FK) | total |
|---------|-----------------|-------|
| 10 | 1 | 150.00 |
| 11 | 1 | 89.90 |
| 12 | 2 | 230.00 |

O `cliente_id = 1` aponta para a Ana na tabela `clientes`. A FK **garante a integridade**: não dá pra criar um pedido para um cliente que não existe.

## Relacionamentos

### 1:1 (um para um)

Cada registro de A se relaciona com **no máximo um** de B. Ex: um `usuario` tem um `perfil`.

### 1:N (um para muitos)

Um registro de A se relaciona com **vários** de B. É o mais comum. Ex: um `cliente` tem **vários** `pedidos`, mas cada `pedido` pertence a **um** cliente. A FK fica do lado "muitos" (em `pedidos`).

### N:N (muitos para muitos)

Vários de A se relacionam com vários de B. Ex: um `aluno` cursa várias `disciplinas`, e uma `disciplina` tem vários `alunos`. Resolvemos isso com uma **tabela de junção** (associativa):

```sql
CREATE TABLE matriculas (
    aluno_id      INTEGER,
    disciplina_id INTEGER,
    PRIMARY KEY (aluno_id, disciplina_id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);
```

| aluno_id | disciplina_id |
|----------|---------------|
| 1 | 100 |
| 1 | 101 |
| 2 | 100 |

## Diagrama ER (Entidade-Relacionamento)

Um **diagrama ER** é um desenho que mostra as entidades (tabelas) e como elas se conectam. Em texto, podemos representar assim:

```
clientes (1) ────< (N) pedidos
   id ◄──────────── cliente_id

alunos (N) >──── matriculas ────< (N) disciplinas
```

O símbolo `<` indica o lado "muitos". Ferramentas como **dbdiagram.io** e **draw.io** ajudam a desenhar esses diagramas.

## Normalização

**Normalizar** é organizar as tabelas para **eliminar redundância** e evitar dados inconsistentes. Veja a tabela mal modelada abaixo:

| pedido_id | cliente_nome | cliente_cidade | produtos |
|-----------|--------------|----------------|----------|
| 10 | Ana Souza | São Paulo | Caneta, Caderno |
| 11 | Ana Souza | São Paulo | Lápis |

Problemas: o nome da Ana se repete (se ela mudar de cidade, precisamos alterar em vários lugares) e a coluna `produtos` guarda mais de um valor.

### 1FN — Primeira Forma Normal

**Cada célula deve ter um único valor (atômico)** e não pode haver grupos repetidos.

Quebramos a coluna `produtos`:

| pedido_id | cliente_nome | produto |
|-----------|--------------|---------|
| 10 | Ana Souza | Caneta |
| 10 | Ana Souza | Caderno |
| 11 | Ana Souza | Lápis |

### 2FN — Segunda Forma Normal

Estar na 1FN **e** todos os atributos dependerem da **chave primária inteira** (importa quando a PK é composta). Separamos os dados do cliente e do produto em tabelas próprias, ligadas por FK:

`pedidos`:

| id | cliente_id |
|----|-----------|
| 10 | 1 |
| 11 | 1 |

`clientes`:

| id | nome | cidade |
|----|------|--------|
| 1 | Ana Souza | São Paulo |

### 3FN — Terceira Forma Normal

Estar na 2FN **e** não ter dependências entre colunas que não são chave (dependência transitiva). Por exemplo, se tivéssemos `cidade` e `estado` na mesma tabela e `estado` dependesse de `cidade`, moveríamos a relação cidade/estado para uma tabela `cidades`.

> **Resumo prático:** cada fato deve ser guardado **uma única vez**, no lugar certo. Quando estiver em dúvida, busque a 3FN.

## Atividades

- [ ] Modele as tabelas de um blog: `usuarios`, `posts` e `comentarios`, indicando PKs e FKs.
- [ ] Identifique o tipo de relacionamento (1:1, 1:N ou N:N) entre `autores` e `livros`.
- [ ] Crie uma tabela de junção para o relacionamento N:N entre `produtos` e `pedidos`.
- [ ] Pegue uma planilha "bagunçada" e normalize-a até a 3FN, explicando cada passo.
- [ ] Desenhe um diagrama ER simples (em papel ou no dbdiagram.io) com pelo menos 3 tabelas.
