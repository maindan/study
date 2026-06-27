---
title: "Processos e Sistema"
---

# Processos e Sistema

Tudo o que está em execução no Linux é um **processo**. Quando você abre o navegador, roda um script ou inicia um servidor, o sistema cria processos para executá-los. Saber observar e controlar processos é fundamental para diagnosticar lentidão, travamentos e uso excessivo de recursos.

## O que é um Processo?

Um **processo** é uma instância de um programa em execução. Cada processo tem:

- Um **PID** (Process ID): um número único que identifica o processo.
- Um **PPID** (Parent PID): o PID do processo que o criou.
- Um **dono**: o usuário que o iniciou.
- Recursos: memória, CPU, arquivos abertos.

O primeiro processo do sistema é o `init` ou `systemd`, com PID 1. Todos os outros descendem dele.

## Vendo Processos: ps

O comando `ps` lista processos. As formas mais usadas:

```bash
ps              # processos do terminal atual
ps aux          # TODOS os processos do sistema, com detalhes
ps -ef          # outra forma de listar tudo
```

A saída de `ps aux` traz colunas importantes:

| Coluna | Significado |
|---|---|
| `USER` | dono do processo |
| `PID` | identificador do processo |
| `%CPU` | uso de processador |
| `%MEM` | uso de memória |
| `COMMAND` | comando que iniciou o processo |

Para encontrar um processo específico, combine com `grep`:

```bash
ps aux | grep node    # encontra processos do Node.js
```

## Monitorando em Tempo Real: top e htop

O comando `top` mostra os processos atualizando em tempo real, ordenados por uso de CPU:

```bash
top
```

Dentro do `top`, pressione `q` para sair. Ele exibe carga do sistema, memória usada e os processos mais "famintos".

O `htop` é uma versão melhorada, colorida e mais fácil de navegar (use as setas e o mouse). Pode ser que precise instalá-lo:

```bash
sudo apt install htop   # em distros Debian/Ubuntu
htop
```

No `htop` você pode rolar a lista, filtrar (F4) e matar processos (F9) de forma visual.

## Encerrando Processos: kill

Às vezes um programa trava e você precisa encerrá-lo. O comando `kill` envia um **sinal** a um processo, identificado pelo PID.

```bash
kill 1234          # pede ao processo 1234 para encerrar (sinal TERM)
kill -9 1234       # força o encerramento (sinal KILL)
killall firefox    # encerra todos os processos chamados firefox
pkill node         # encerra processos cujo nome contém "node"
```

- `kill PID` envia o sinal **SIGTERM** (15), pedindo um encerramento limpo.
- `kill -9 PID` envia **SIGKILL** (9), que força a parada imediata. Use só quando o processo não responde.

## Controle de Jobs: jobs, fg, bg e &

Quando você roda um comando demorado, ele "prende" o terminal. O Linux permite controlar esses **jobs**.

Coloque um comando para rodar em **segundo plano** adicionando `&` ao final:

```bash
sleep 60 &      # roda em segundo plano e libera o terminal
```

Comandos relacionados:

```bash
jobs            # lista os jobs do terminal atual
fg              # traz o último job para o primeiro plano (foreground)
fg %1           # traz o job número 1 para o primeiro plano
bg              # continua um job pausado em segundo plano
```

Você também pode pausar um processo em execução com `Ctrl+Z` e depois retomá-lo com `bg` (em segundo plano) ou `fg` (em primeiro plano).

```bash
# rodar, pausar com Ctrl+Z, e mandar para o fundo
ping google.com
# (pressione Ctrl+Z)
bg
jobs
```

## Recursos do Sistema: df, du, free

Monitorar disco e memória evita surpresas como "disco cheio".

### df — espaço em disco

O `df` (disk free) mostra o espaço usado e livre nas partições. Use `-h` para tamanhos legíveis (human-readable):

```bash
df -h
# Sistema  Tam   Usado  Disp  Uso%  Montado em
# /dev/sda1 50G   30G    20G   60%   /
```

### du — uso por pasta

O `du` (disk usage) mostra quanto espaço pastas e arquivos ocupam:

```bash
du -h arquivo.txt        # tamanho de um arquivo
du -sh pasta/            # tamanho TOTAL de uma pasta (-s = resumo)
du -h --max-depth=1 .    # tamanho de cada subpasta do diretório atual
```

### free — memória RAM

O `free` mostra a memória RAM e a área de swap:

```bash
free -h
#         total  usado  livre  ...
# Mem:    16G    8G     4G
# Swap:   2G     0B     2G
```

## Juntando tudo

Um fluxo típico de diagnóstico quando o computador está lento:

```bash
top                      # ver quem consome CPU
free -h                  # ver se a memória acabou
df -h                    # ver se o disco está cheio
ps aux | grep programa   # localizar um processo específico
kill -9 PID              # encerrar um processo travado
```

Com esses comandos, você consegue entender e controlar o que está acontecendo na sua máquina ou em um servidor remoto.

## Atividades

- [ ] Execute `ps aux` e identifique o processo que mais consome CPU.
- [ ] Abra o `top` (ou `htop`) e observe o uso de memória; saia com `q`.
- [ ] Rode `sleep 30 &` em segundo plano e liste os jobs com `jobs`.
- [ ] Verifique o espaço em disco com `df -h`.
- [ ] Descubra qual pasta da sua home ocupa mais espaço usando `du -sh`.
- [ ] Inicie um processo, descubra seu PID e encerre-o com `kill`.
