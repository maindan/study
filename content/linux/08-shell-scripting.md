---
title: "Shell Scripting"
---

# Shell Scripting

Um dos maiores poderes do Linux é a capacidade de **automatizar tarefas**. Em vez de digitar os mesmos comandos repetidamente, você pode salvá-los em um arquivo e executá-los de uma vez. Esse arquivo é um **shell script** — um programa escrito na linguagem do shell (geralmente o Bash). Aprender shell scripting transforma tarefas chatas em comandos de uma linha só.

## O Shebang

Todo script começa com uma linha especial chamada **shebang**, que diz ao sistema qual interpretador usar:

```bash
#!/bin/bash
```

Os dois primeiros caracteres (`#!`) são o shebang, seguidos do caminho do interpretador. Para Bash, usamos `/bin/bash`. Sem essa linha, o sistema pode não saber como rodar o arquivo.

Depois de criar o script, torne-o executável e rode:

```bash
chmod +x meu_script.sh
./meu_script.sh
```

## Variáveis

Variáveis guardam valores. No Bash, **não** se usa espaço ao redor do `=`:

```bash
#!/bin/bash
nome="Ana"
idade=25
echo "Olá, $nome! Você tem $idade anos."
```

Para usar o valor de uma variável, coloque `$` na frente. Boas práticas:

- Use `$nome` ou `${nome}` (a segunda forma evita ambiguidades).
- Sempre coloque strings entre aspas duplas para evitar problemas com espaços.

```bash
arquivo="relatorio final.txt"
echo "Abrindo $arquivo"          # funciona
echo "Caminho: ${nome}_dados"    # chaves separam o nome da variável
```

## Substituição de Comandos: $(...)

Você pode capturar a **saída de um comando** dentro de uma variável usando `$(...)`:

```bash
#!/bin/bash
data_atual=$(date +%Y-%m-%d)
usuario=$(whoami)
echo "Hoje é $data_atual e o usuário é $usuario"

quantidade=$(ls | wc -l)
echo "Há $quantidade itens nesta pasta."
```

Isso é extremamente útil para montar valores dinamicamente.

## Condicionais: if / then

Os condicionais executam comandos dependendo de uma condição. A estrutura básica:

```bash
#!/bin/bash
if [ condição ]; then
    # comandos se verdadeiro
else
    # comandos se falso
fi
```

Observe os **espaços** dentro dos colchetes — eles são obrigatórios. Operadores comuns:

| Operador | Significado |
|---|---|
| `-eq` | igual (números) |
| `-ne` | diferente (números) |
| `-gt` / `-lt` | maior / menor que |
| `-z` | string vazia |
| `-f` | arquivo existe |
| `-d` | diretório existe |
| `=` / `!=` | igual / diferente (strings) |

Exemplos:

```bash
#!/bin/bash
idade=18
if [ $idade -ge 18 ]; then
    echo "Maior de idade"
else
    echo "Menor de idade"
fi

if [ -f "config.txt" ]; then
    echo "O arquivo de configuração existe."
else
    echo "Arquivo não encontrado."
fi
```

## Laços: for e while

### for

Repete comandos para cada item de uma lista:

```bash
#!/bin/bash
for nome in Ana Bruno Carla; do
    echo "Olá, $nome"
done

# percorrer arquivos
for arquivo in *.txt; do
    echo "Processando $arquivo"
done

# repetir N vezes
for i in 1 2 3 4 5; do
    echo "Iteração $i"
done
```

### while

Repete enquanto uma condição for verdadeira:

```bash
#!/bin/bash
contador=1
while [ $contador -le 5 ]; do
    echo "Contagem: $contador"
    contador=$((contador + 1))
done
```

O `$(( ... ))` faz operações aritméticas.

## Lendo Argumentos

Scripts podem receber **argumentos** na linha de comando. Eles ficam disponíveis em variáveis especiais:

| Variável | Significado |
|---|---|
| `$0` | nome do script |
| `$1`, `$2`, ... | primeiro, segundo argumento, etc. |
| `$#` | quantidade de argumentos |
| `$@` | todos os argumentos |

```bash
#!/bin/bash
echo "Script: $0"
echo "Primeiro argumento: $1"
echo "Total de argumentos: $#"
```

Executando:

```bash
./script.sh laranja banana
# Script: ./script.sh
# Primeiro argumento: laranja
# Total de argumentos: 2
```

Também é possível ler entrada do usuário com `read`:

```bash
#!/bin/bash
echo "Qual é o seu nome?"
read nome
echo "Bem-vindo, $nome!"
```

## Exemplo Completo de Script

Vamos juntar tudo em um script de backup simples que copia uma pasta para um destino, com data no nome:

```bash
#!/bin/bash
# backup.sh - faz backup de uma pasta
# Uso: ./backup.sh <pasta_origem>

origem="$1"

# Verifica se o argumento foi passado
if [ -z "$origem" ]; then
    echo "Erro: informe a pasta de origem."
    echo "Uso: $0 <pasta_origem>"
    exit 1
fi

# Verifica se a pasta existe
if [ ! -d "$origem" ]; then
    echo "Erro: a pasta '$origem' não existe."
    exit 1
fi

# Monta o nome do backup com a data
data=$(date +%Y-%m-%d_%H-%M)
destino="backup_${data}.tar.gz"

# Cria o arquivo compactado
tar -czf "$destino" "$origem"

echo "Backup de '$origem' criado em '$destino'"

# Conta quantos arquivos foram incluídos
total=$(find "$origem" -type f | wc -l)
echo "Total de arquivos: $total"
```

Para usar:

```bash
chmod +x backup.sh
./backup.sh /home/ana/projetos
```

Esse script demonstra shebang, argumentos, condicionais, substituição de comandos, variáveis e código de saída (`exit 1` indica erro). Com esses fundamentos, você já consegue automatizar boa parte das suas tarefas do dia a dia.

## Atividades

- [ ] Crie um script com shebang que imprima "Olá, Mundo!" e execute-o.
- [ ] Escreva um script que receba seu nome como argumento e o cumprimente.
- [ ] Use `$(date)` dentro de um script para imprimir a data atual.
- [ ] Crie um laço `for` que liste os arquivos `.txt` de uma pasta.
- [ ] Escreva um `if` que verifique se um arquivo existe com `-f`.
- [ ] Adapte o script de backup de exemplo e teste-o em uma pasta de teste.
