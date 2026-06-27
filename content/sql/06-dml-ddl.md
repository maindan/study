---
title: "DML e DDL"
---

# DML e DDL

Os comandos do SQL costumam ser divididos em duas grandes famílias:

- **DML (Data Manipulation Language):** mexe nos **dados** das tabelas — `INSERT`, `UPDATE`, `DELETE`. (O `SELECT`, que apenas lê, às vezes é classificado à parte como DQL.)
- **DDL (Data Definition Language):** mexe na **estrutura** do banco — `CREATE`, `ALTER`, `DROP`.

Vamos usar a tabela `clientes` nos exemplos:

| id | nome | email | cidade |
|----|------|-------|--------|
| 1 | Ana | ana@mail.com | Recife |
| 2 | Bruno | bruno@mail.com | Olinda |

## DML — manipulando dados

### INSERT: inserindo registros

```sql
INSERT INTO clientes (nome, email, cidade)
VALUES ('Carla', 'carla@mail.com', 'Recife');
```

Você lista as colunas e, em `VALUES`, os valores na **mesma ordem**. É possível inserir várias linhas de uma vez:

```sql
INSERT INTO clientes (nome, email, cidade)
VALUES
  ('Diego', 'diego@mail.com', 'Jaboatão'),
  ('Elisa', 'elisa@mail.com', 'Recife');
```

> Colunas não informadas recebem o valor `DEFAULT` (se houver) ou `NULL`. Uma chave primária `AUTO_INCREMENT`/`SERIAL` normalmente não precisa ser informada.

### UPDATE: alterando registros

```sql
UPDATE clientes
SET cidade = 'Caruaru'
WHERE id = 2;
```

A cláusula `SET` define os novos valores; o `WHERE` define **quais linhas** mudam.

> ⚠️ **Cuidado com o WHERE!** Um `UPDATE` **sem** `WHERE` altera **TODAS as linhas** da tabela. O comando abaixo colocaria a mesma cidade em todos os clientes:
>
> ```sql
> -- PERIGOSO: atualiza a tabela inteira
> UPDATE clientes SET cidade = 'Recife';
> ```

Você pode atualizar várias colunas de uma vez:

```sql
UPDATE clientes
SET email = 'novo@mail.com', cidade = 'Olinda'
WHERE id = 1;
```

### DELETE: removendo registros

```sql
DELETE FROM clientes
WHERE id = 3;
```

> ⚠️ **O mesmo cuidado vale aqui:** `DELETE FROM clientes;` **sem** `WHERE` apaga **todos os registros** da tabela. Antes de rodar um `UPDATE` ou `DELETE`, é uma boa prática testar o filtro com um `SELECT` usando o mesmo `WHERE`.

```sql
-- confira o que será afetado ANTES de apagar
SELECT * FROM clientes WHERE id = 3;
```

## DDL — definindo a estrutura

### CREATE TABLE e tipos de dados

```sql
CREATE TABLE produtos (
  id        INTEGER      PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  preco     DECIMAL(10,2) DEFAULT 0,
  estoque   INTEGER      DEFAULT 0,
  email     VARCHAR(150) UNIQUE,
  criado_em DATE
);
```

Tipos de dados mais comuns:

| Tipo | Uso |
|------|-----|
| `INTEGER` / `INT` | números inteiros |
| `DECIMAL(p,s)` / `NUMERIC` | números com casas decimais (ex.: dinheiro) |
| `VARCHAR(n)` | texto de tamanho variável até `n` caracteres |
| `CHAR(n)` | texto de tamanho fixo |
| `TEXT` | texto longo |
| `DATE` / `TIMESTAMP` | data / data e hora |
| `BOOLEAN` | verdadeiro ou falso |

### Constraints (restrições)

As **constraints** garantem a integridade dos dados:

| Constraint | Garante que... |
|------------|----------------|
| `NOT NULL` | a coluna não pode ficar vazia (nula) |
| `UNIQUE` | não há valores repetidos na coluna |
| `DEFAULT valor` | usa um valor padrão quando nada é informado |
| `PRIMARY KEY` | identifica unicamente cada linha (NOT NULL + UNIQUE) |
| `FOREIGN KEY` | referencia a chave de outra tabela |
| `CHECK (cond)` | só aceita valores que satisfaçam a condição |

```sql
CREATE TABLE pedidos (
  id        INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  total     DECIMAL(10,2) CHECK (total >= 0),
  status    VARCHAR(20) DEFAULT 'aberto',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

### ALTER TABLE: mudando a estrutura

`ALTER TABLE` adiciona, remove ou modifica colunas e restrições de uma tabela já existente:

```sql
-- adicionar uma coluna
ALTER TABLE produtos ADD COLUMN ativo BOOLEAN DEFAULT TRUE;

-- remover uma coluna
ALTER TABLE produtos DROP COLUMN criado_em;

-- renomear uma coluna (sintaxe varia entre bancos)
ALTER TABLE produtos RENAME COLUMN nome TO descricao;
```

### DROP: apagando objetos

```sql
DROP TABLE produtos;
```

> ⚠️ `DROP TABLE` apaga a tabela **inteira** — estrutura **e** dados — de forma irreversível. Não confunda:
>
> - `DELETE FROM tabela;` → remove os **dados**, mantém a tabela.
> - `TRUNCATE TABLE tabela;` → esvazia rapidamente os dados, mantém a tabela.
> - `DROP TABLE tabela;` → remove **tabela e dados**.

## Atividades

- [ ] Escreva um `INSERT` que adicione dois novos clientes de uma só vez.
- [ ] Crie um `UPDATE` que mude a cidade de um cliente específico (com `WHERE`).
- [ ] Antes de um `DELETE`, escreva o `SELECT` com o mesmo `WHERE` para conferir o que será apagado.
- [ ] Crie uma tabela `funcionarios` com as constraints `NOT NULL`, `UNIQUE` e `DEFAULT`.
- [ ] Use `ALTER TABLE` para adicionar uma coluna `telefone` à tabela criada.
- [ ] Explique, com suas palavras, a diferença entre `DELETE`, `TRUNCATE` e `DROP`.
