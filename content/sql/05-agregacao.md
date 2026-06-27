---
title: "Agregação e Agrupamento"
---

# Agregação e Agrupamento

Até agora cada linha do resultado correspondia a uma linha da tabela. As **funções de agregação** mudam isso: elas resumem **vários registros em um único valor** — como um total, uma média ou uma contagem. Vamos usar a tabela `vendas` abaixo.

`vendas`:

| id | vendedor | regiao | valor |
|----|----------|--------|-------|
| 1 | Ana | Sul | 100.00 |
| 2 | Bruno | Sul | 250.00 |
| 3 | Ana | Sul | 50.00 |
| 4 | Carla | Norte | 300.00 |
| 5 | Bruno | Norte | 150.00 |
| 6 | Carla | Norte | 200.00 |

## As cinco funções principais

| Função | O que calcula |
|--------|---------------|
| `COUNT` | quantidade de linhas |
| `SUM` | soma dos valores |
| `AVG` | média dos valores |
| `MIN` | menor valor |
| `MAX` | maior valor |

### COUNT: contando linhas

```sql
SELECT COUNT(*) AS total_vendas
FROM vendas;
```

| total_vendas |
|--------------|
| 6 |

`COUNT(*)` conta todas as linhas. Já `COUNT(coluna)` conta apenas as linhas em que a coluna **não é NULL**, e `COUNT(DISTINCT coluna)` conta valores distintos:

```sql
SELECT COUNT(DISTINCT vendedor) AS qtd_vendedores
FROM vendas;
```

| qtd_vendedores |
|----------------|
| 3 |

### SUM, AVG, MIN e MAX

```sql
SELECT
  SUM(valor)  AS total,
  AVG(valor)  AS media,
  MIN(valor)  AS menor,
  MAX(valor)  AS maior
FROM vendas;
```

| total | media | menor | maior |
|-------|-------|-------|-------|
| 1050.00 | 175.00 | 50.00 | 300.00 |

> **Atenção aos NULL:** funções como `SUM` e `AVG` **ignoram** valores nulos. Por isso uma média pode não bater com `SUM / COUNT(*)` se houver `NULL` na coluna.

## GROUP BY: agregando por grupo

Sem `GROUP BY`, a agregação resume a tabela inteira em **uma linha**. Com `GROUP BY`, ela é aplicada **separadamente para cada grupo**.

```sql
SELECT regiao, SUM(valor) AS total_regiao
FROM vendas
GROUP BY regiao;
```

| regiao | total_regiao |
|--------|--------------|
| Sul | 400.00 |
| Norte | 650.00 |

Agrupar por vendedor e contar quantas vendas cada um fez:

```sql
SELECT vendedor, COUNT(*) AS qtd, SUM(valor) AS total
FROM vendas
GROUP BY vendedor;
```

| vendedor | qtd | total |
|----------|-----|-------|
| Ana | 2 | 150.00 |
| Bruno | 2 | 400.00 |
| Carla | 2 | 500.00 |

> **Regra de ouro:** toda coluna no `SELECT` que **não** esteja dentro de uma função de agregação **precisa** aparecer no `GROUP BY`. Caso contrário, o banco não sabe qual valor da coluna escolher para o grupo.

## HAVING vs WHERE

As duas cláusulas filtram, mas em **momentos diferentes**:

- `WHERE` filtra as **linhas individuais** **antes** do agrupamento. Não pode usar funções de agregação.
- `HAVING` filtra os **grupos** **depois** da agregação. Pode usar funções como `SUM` e `COUNT`.

A ordem lógica de execução é: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`.

```sql
-- Considera apenas vendas acima de 80 (WHERE),
-- agrupa por vendedor e mantém só quem somou mais de 200 (HAVING)
SELECT vendedor, SUM(valor) AS total
FROM vendas
WHERE valor > 80
GROUP BY vendedor
HAVING SUM(valor) > 200;
```

| vendedor | total |
|----------|-------|
| Bruno | 400.00 |
| Carla | 500.00 |

No exemplo: o `WHERE valor > 80` descarta a venda de 50.00 da Ana **antes** de agrupar; depois o `HAVING` elimina grupos cujo total não passe de 200.

### Comparação rápida

| | WHERE | HAVING |
|---|-------|--------|
| Quando age | antes do GROUP BY | depois do GROUP BY |
| Filtra | linhas | grupos |
| Usa agregação? | não | sim |

## Combinando com ORDER BY

Você pode ordenar o resultado agregado, inclusive por um valor agregado:

```sql
SELECT regiao, SUM(valor) AS total_regiao
FROM vendas
GROUP BY regiao
ORDER BY total_regiao DESC;
```

| regiao | total_regiao |
|--------|--------------|
| Norte | 650.00 |
| Sul | 400.00 |

## Atividades

- [ ] Escreva uma query que retorne o número total de vendas e o valor total vendido.
- [ ] Calcule a média de valor de venda por região usando `GROUP BY`.
- [ ] Liste cada vendedor e a sua maior venda (`MAX`).
- [ ] Use `HAVING` para mostrar apenas os vendedores com mais de uma venda registrada.
- [ ] Conte quantos vendedores distintos existem na tabela com `COUNT(DISTINCT ...)`.
- [ ] Ordene as regiões da que mais vendeu para a que menos vendeu.
