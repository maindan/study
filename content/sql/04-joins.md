---
title: "JOINs"
---

# JOINs

Quando os dados estão espalhados em várias tabelas (graças à normalização!), usamos **JOINs** para combiná-los em uma única consulta. O JOIN conecta tabelas usando a **chave estrangeira**.

## As tabelas de exemplo

`clientes`:

| id | nome | cidade |
|----|------|--------|
| 1 | Ana | São Paulo |
| 2 | Bruno | Recife |
| 3 | Carla | Curitiba |

`pedidos` (a coluna `cliente_id` é a FK que aponta para `clientes.id`):

| id | cliente_id | total |
|----|-----------|-------|
| 10 | 1 | 150.00 |
| 11 | 1 | 89.90 |
| 12 | 2 | 230.00 |
| 13 | NULL | 50.00 |

Repare:

- A **Carla (id 3)** não tem nenhum pedido.
- O **pedido 13** não tem cliente (`cliente_id = NULL`).

Esses casos ajudam a entender a diferença entre os tipos de JOIN.

## A chave estrangeira na prática

Para juntar as tabelas, dizemos qual coluna de uma "casa" com qual da outra: `pedidos.cliente_id = clientes.id`. Essa é a **condição do JOIN** (`ON`).

## INNER JOIN

Retorna apenas as linhas que **têm correspondência nas DUAS tabelas**. É o JOIN mais usado.

```sql
SELECT clientes.nome, pedidos.id AS pedido, pedidos.total
FROM clientes
INNER JOIN pedidos ON pedidos.cliente_id = clientes.id;
```

| nome | pedido | total |
|------|--------|-------|
| Ana | 10 | 150.00 |
| Ana | 11 | 89.90 |
| Bruno | 12 | 230.00 |

A Carla **não aparece** (não tem pedido) e o pedido 13 **não aparece** (não tem cliente). `JOIN` sozinho, sem palavra antes, é o mesmo que `INNER JOIN`.

> **Dica:** use alias para encurtar: `FROM clientes c INNER JOIN pedidos p ON p.cliente_id = c.id`.

## LEFT JOIN

Retorna **todas as linhas da tabela da esquerda** (a primeira, depois do `FROM`), mesmo sem correspondência. Onde não houver par, as colunas da direita vêm como `NULL`.

```sql
SELECT c.nome, p.id AS pedido, p.total
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id;
```

| nome | pedido | total |
|------|--------|-------|
| Ana | 10 | 150.00 |
| Ana | 11 | 89.90 |
| Bruno | 12 | 230.00 |
| Carla | NULL | NULL |

Agora a **Carla aparece**, mesmo sem pedidos. Ótimo para perguntas como "quais clientes nunca compraram?":

```sql
SELECT c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;
```

## RIGHT JOIN

O espelho do `LEFT JOIN`: retorna **todas as linhas da tabela da direita**, mesmo sem correspondência na esquerda.

```sql
SELECT c.nome, p.id AS pedido, p.total
FROM clientes c
RIGHT JOIN pedidos p ON p.cliente_id = c.id;
```

| nome | pedido | total |
|------|--------|-------|
| Ana | 10 | 150.00 |
| Ana | 11 | 89.90 |
| Bruno | 12 | 230.00 |
| NULL | 13 | 50.00 |

Agora o **pedido 13 aparece** (sem cliente). Na prática, qualquer `RIGHT JOIN` pode ser reescrito como `LEFT JOIN` invertendo a ordem das tabelas; por isso o `LEFT` é bem mais usado.

> **Atenção:** o **SQLite não suporta `RIGHT JOIN`** em versões antigas. Use `LEFT JOIN` com as tabelas trocadas.

## FULL JOIN (FULL OUTER JOIN)

Retorna **tudo dos dois lados**: linhas com correspondência e também as "órfãs" de ambas as tabelas.

```sql
SELECT c.nome, p.id AS pedido, p.total
FROM clientes c
FULL JOIN pedidos p ON p.cliente_id = c.id;
```

| nome | pedido | total |
|------|--------|-------|
| Ana | 10 | 150.00 |
| Ana | 11 | 89.90 |
| Bruno | 12 | 230.00 |
| Carla | NULL | NULL |
| NULL | 13 | 50.00 |

A Carla (sem pedido) **e** o pedido 13 (sem cliente) aparecem.

> **Atenção:** **MySQL e SQLite não têm `FULL JOIN` nativo**. O PostgreSQL tem. Em MySQL costuma-se simular com `UNION` de um `LEFT` e um `RIGHT`.

## Diferença visual (diagrama de conjuntos)

Pense em dois círculos sobrepostos, A (esquerda) e B (direita):

```
INNER JOIN  →  apenas a interseção (A ∩ B)
LEFT JOIN   →  todo o A + interseção
RIGHT JOIN  →  todo o B + interseção
FULL JOIN   →  tudo de A e de B (A ∪ B)
```

| JOIN | Mantém esquerda sem par? | Mantém direita sem par? |
|------|:---:|:---:|
| INNER | Não | Não |
| LEFT | Sim | Não |
| RIGHT | Não | Sim |
| FULL | Sim | Sim |

## JOIN de várias tabelas

Você pode encadear vários JOINs:

```sql
SELECT c.nome, p.id, i.produto_id
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id
INNER JOIN itens_pedido i ON i.pedido_id = p.id;
```

## Atividades

- [ ] Escreva um `INNER JOIN` que mostre o nome do cliente e o total de cada pedido.
- [ ] Use `LEFT JOIN` + `WHERE ... IS NULL` para listar clientes que nunca fizeram pedidos.
- [ ] Liste todos os clientes e, quando houver, seus pedidos (incluindo quem não comprou).
- [ ] Explique, com suas palavras, a diferença entre `INNER JOIN` e `LEFT JOIN`.
- [ ] Pesquise como simular um `FULL JOIN` no MySQL usando `UNION`.
- [ ] Faça um JOIN de 3 tabelas (`clientes`, `pedidos`, `itens_pedido`).
