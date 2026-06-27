---
title: "Consultas com SELECT"
---

# Consultas com SELECT

O comando `SELECT` é o coração do SQL: é com ele que você **lê** dados de uma tabela. Vamos usar a tabela `produtos` abaixo em todos os exemplos.

`produtos`:

| id | nome | categoria | preco | estoque |
|----|------|-----------|-------|---------|
| 1 | Caneta Azul | Papelaria | 2.50 | 100 |
| 2 | Caderno 200fl | Papelaria | 19.90 | 40 |
| 3 | Mouse USB | Informática | 45.00 | 0 |
| 4 | Teclado | Informática | 120.00 | 15 |
| 5 | Lápis HB | Papelaria | 1.20 | 200 |

## SELECT e FROM

`SELECT` define **quais colunas** você quer; `FROM` define **de qual tabela**.

```sql
SELECT nome, preco
FROM produtos;
```

| nome | preco |
|------|-------|
| Caneta Azul | 2.50 |
| Caderno 200fl | 19.90 |
| ... | ... |

Para trazer **todas** as colunas, use `*`:

```sql
SELECT * FROM produtos;
```

## WHERE: filtrando linhas

O `WHERE` define a **condição** que a linha precisa satisfazer para aparecer no resultado.

```sql
SELECT nome, preco
FROM produtos
WHERE categoria = 'Papelaria';
```

| nome | preco |
|------|-------|
| Caneta Azul | 2.50 |
| Caderno 200fl | 19.90 |
| Lápis HB | 1.20 |

## Operadores de comparação

| Operador | Significado | Exemplo |
|----------|-------------|---------|
| `=` | igual | `preco = 45.00` |
| `<>` ou `!=` | diferente | `categoria <> 'Papelaria'` |
| `>` `<` `>=` `<=` | maior / menor | `preco > 20` |
| `BETWEEN` | dentro de um intervalo | `preco BETWEEN 10 AND 50` |
| `IN` | dentro de uma lista | `categoria IN ('Papelaria','Informática')` |
| `LIKE` | padrão de texto | `nome LIKE 'C%'` |
| `IS NULL` | valor nulo | `categoria IS NULL` |

### Exemplos

Produtos com preço maior que 20:

```sql
SELECT nome, preco FROM produtos WHERE preco > 20;
```

`BETWEEN` (intervalo, inclusive nas pontas):

```sql
SELECT nome FROM produtos WHERE preco BETWEEN 10 AND 50;
```

`IN` (vários valores possíveis):

```sql
SELECT nome FROM produtos WHERE id IN (1, 3, 5);
```

`LIKE` com curingas:

- `%` → qualquer sequência de caracteres
- `_` → exatamente um caractere

```sql
-- nomes que começam com "C"
SELECT nome FROM produtos WHERE nome LIKE 'C%';

-- nomes que contêm "USB"
SELECT nome FROM produtos WHERE nome LIKE '%USB%';
```

`IS NULL` (cuidado: nunca use `= NULL`):

```sql
SELECT nome FROM produtos WHERE categoria IS NULL;
```

## AND, OR e NOT

Combine várias condições:

```sql
SELECT nome, preco, estoque
FROM produtos
WHERE categoria = 'Papelaria' AND preco < 10;
```

| nome | preco | estoque |
|------|-------|---------|
| Caneta Azul | 2.50 | 100 |
| Lápis HB | 1.20 | 200 |

```sql
-- Informática OU preço acima de 100
SELECT nome FROM produtos
WHERE categoria = 'Informática' OR preco > 100;
```

> **Dica:** use parênteses quando misturar `AND` e `OR` para deixar a lógica clara:
> `WHERE categoria = 'Papelaria' AND (preco < 2 OR estoque > 150)`

## ORDER BY: ordenando

```sql
SELECT nome, preco
FROM produtos
ORDER BY preco DESC;
```

`ASC` = crescente (padrão), `DESC` = decrescente.

| nome | preco |
|------|-------|
| Teclado | 120.00 |
| Mouse USB | 45.00 |
| Caderno 200fl | 19.90 |
| Caneta Azul | 2.50 |
| Lápis HB | 1.20 |

## LIMIT: limitando a quantidade

Retorna apenas as primeiras N linhas. Muito usado com `ORDER BY` para pegar "top N".

```sql
-- os 3 produtos mais caros
SELECT nome, preco
FROM produtos
ORDER BY preco DESC
LIMIT 3;
```

> **Variação:** no SQL Server usa-se `SELECT TOP 3 ...`; em Oracle moderno, `FETCH FIRST 3 ROWS ONLY`. Em MySQL, PostgreSQL e SQLite, `LIMIT` funciona.

## DISTINCT: removendo duplicatas

```sql
SELECT DISTINCT categoria FROM produtos;
```

| categoria |
|-----------|
| Papelaria |
| Informática |

## Alias com AS

`AS` renomeia colunas (ou tabelas) no resultado, deixando-o mais legível:

```sql
SELECT nome AS produto, preco AS valor_unitario
FROM produtos;
```

| produto | valor_unitario |
|---------|----------------|
| Caneta Azul | 2.50 |
| ... | ... |

A palavra `AS` é opcional: `SELECT preco valor` também funciona, mas usar `AS` é mais claro.

## Atividades

- [ ] Escreva uma query que retorne os 5 produtos mais caros.
- [ ] Liste apenas os produtos da categoria `Informática` com estoque maior que zero.
- [ ] Use `LIKE` para encontrar todos os produtos cujo nome contém a letra "a".
- [ ] Retorne as categorias distintas, ordenadas alfabeticamente.
- [ ] Escreva uma consulta com `BETWEEN` para preços entre R$ 5 e R$ 50.
- [ ] Use alias para renomear `preco` como `valor` e `nome` como `descricao`.
