---
title: "Sistema de Arquivos"
---

# Sistema de Arquivos

No Linux, **tudo é organizado em arquivos e diretórios** (pastas) a partir de uma única raiz. Diferente do Windows, que tem várias letras de unidade (C:, D:), o Linux tem apenas **um** ponto de partida: o diretório raiz `/`. Todos os discos, dispositivos e pastas ficam "pendurados" a partir dele, formando uma única árvore.

## A Hierarquia FHS

O Linux segue um padrão chamado **FHS** (Filesystem Hierarchy Standard), que define onde cada tipo de arquivo deve ficar. Isso torna o sistema previsível: você sabe onde procurar configurações, programas e dados.

Veja os diretórios mais importantes:

| Diretório | O que contém |
|---|---|
| `/` | A raiz de tudo. Todos os outros diretórios partem daqui. |
| `/home` | Pastas pessoais dos usuários (ex.: `/home/ana`). |
| `/root` | Pasta pessoal do usuário **root** (administrador). |
| `/etc` | Arquivos de **configuração** do sistema e dos programas. |
| `/var` | Dados **variáveis**: logs, caches, filas, bancos de dados. |
| `/usr` | Programas e bibliotecas instalados para os usuários. |
| `/bin` | Comandos essenciais (ls, cp, cat...). |
| `/sbin` | Comandos essenciais de administração do sistema. |
| `/tmp` | Arquivos **temporários** (geralmente apagados ao reiniciar). |
| `/opt` | Softwares opcionais de terceiros. |
| `/dev` | Arquivos que representam dispositivos (discos, etc.). |
| `/proc` | Informações do kernel e dos processos em execução. |

### `/` (raiz)

O diretório raiz é o topo da árvore. Não confunda `/` (raiz do sistema) com `/root` (pasta pessoal do administrador) ou `~` (sua pasta pessoal).

### `/home`

Cada usuário comum tem uma pasta dentro de `/home`. Se seu usuário é `ana`, sua pasta pessoal é `/home/ana`. É lá que ficam seus documentos, downloads e configurações pessoais.

### `/etc`

Guarda arquivos de configuração em texto puro. Por exemplo, `/etc/hosts` mapeia nomes para endereços IP, e `/etc/passwd` lista os usuários do sistema.

### `/var`

Contém dados que mudam com frequência. Os **logs** ficam em `/var/log` — um dos primeiros lugares para investigar problemas.

```bash
ls /var/log        # ver arquivos de log
cat /etc/hostname  # ver o nome da máquina
```

### `/usr` e `/bin`

`/usr` contém a maior parte dos programas instalados (em `/usr/bin`). `/bin` contém os comandos básicos necessários até nos modos de recuperação.

## Caminhos: Absolutos vs Relativos

Um **caminho** (path) indica a localização de um arquivo ou diretório.

### Caminho Absoluto

Começa sempre com `/` (a raiz) e descreve o caminho completo, independentemente de onde você está.

```bash
/home/ana/projetos/app.py
/etc/hosts
/var/log/syslog
```

### Caminho Relativo

Parte do **diretório atual** (onde você está agora). Não começa com `/`.

```bash
projetos/app.py    # a partir do diretório atual
documentos/nota.txt
```

Se você está em `/home/ana` e digita `projetos/app.py`, o sistema entende `/home/ana/projetos/app.py`.

Use `pwd` para descobrir onde você está:

```bash
pwd
# /home/ana
```

## Atalhos Especiais: `~`, `.` e `..`

Esses três símbolos aparecem o tempo todo:

| Símbolo | Significado |
|---|---|
| `~` | Sua pasta pessoal (ex.: `/home/ana`). |
| `.` | O diretório **atual**. |
| `..` | O diretório **pai** (um nível acima). |

Exemplos práticos:

```bash
cd ~              # vai para a sua pasta pessoal
cd ~/projetos     # vai para /home/ana/projetos
cd ..             # sobe um nível
cd ../..          # sobe dois níveis
cd .              # fica no mesmo lugar (raramente útil sozinho)
./script.sh       # executa o script no diretório atual
cp arquivo.txt .. # copia o arquivo para o diretório pai
```

O `.` é especialmente importante para executar programas no diretório atual, porque por segurança o Linux não procura programas na pasta atual por padrão.

### Combinando os atalhos

```bash
cd ~/projetos          # entra em projetos
cd ../documentos       # sobe e entra em documentos
ls ./subpasta          # lista subpasta dentro do atual
cat ../config/dados.txt # acessa arquivo na pasta vizinha
```

## Navegando com confiança

Sempre que estiver perdido, use estes comandos:

```bash
pwd        # onde estou?
ls         # o que tem aqui?
cd ~       # me leve para casa
```

Com a prática, navegar pela árvore de diretórios se torna tão natural quanto abrir pastas com o mouse — só que muito mais rápido.

## Atividades

- [ ] Execute `pwd` e identifique seu diretório atual.
- [ ] Navegue até a raiz com `cd /` e liste seu conteúdo com `ls`.
- [ ] Volte para sua pasta pessoal usando `cd ~` e confirme com `pwd`.
- [ ] Liste o conteúdo de `/etc` e identifique pelo menos dois arquivos de configuração.
- [ ] Crie um caminho relativo e um absoluto para o mesmo arquivo e compare-os.
- [ ] Use `cd ..` para subir um nível e observe como o `pwd` muda.
