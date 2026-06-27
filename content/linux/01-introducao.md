---
title: "Introdução ao Linux"
---

# Introdução ao Linux

O Linux é um dos sistemas operacionais mais importantes do mundo da tecnologia. Ele roda na maioria dos servidores da internet, em celulares Android, em supercomputadores, em roteadores, em dispositivos de Internet das Coisas (IoT) e, claro, nos computadores de muitos desenvolvedores. Entender Linux é praticamente obrigatório para quem trabalha com desenvolvimento de software.

## O que é o Linux?

De forma simples, o **Linux** é um sistema operacional livre e de código aberto (open source). Um sistema operacional é o software que gerencia o hardware do computador (processador, memória, disco, rede) e fornece uma base para que outros programas funcionem.

O Linux nasceu em 1991, quando o estudante finlandês **Linus Torvalds** criou o núcleo (kernel) do sistema e o disponibilizou gratuitamente. Combinado com ferramentas do projeto **GNU**, ele se tornou um sistema operacional completo. Por isso você às vezes verá o nome **GNU/Linux**.

As principais características que tornam o Linux popular:

- É **gratuito** e de código aberto: qualquer pessoa pode ver, modificar e distribuir o código.
- É **estável** e pode rodar por meses ou anos sem reiniciar.
- É **seguro** e tem um modelo de permissões robusto.
- É **flexível**: você pode adaptá-lo para servidores, desktops, ou dispositivos pequenos.

## Kernel vs Distribuição

É comum confundir "kernel" com "distribuição". Vamos esclarecer.

### O Kernel

O **kernel** é o coração do sistema. Ele é o único componente que tecnicamente se chama "Linux". O kernel é responsável por:

- Gerenciar a memória.
- Controlar o processador e agendar tarefas (processos).
- Conversar com o hardware (discos, placas de rede, etc.).
- Controlar permissões e segurança.

O kernel sozinho não é muito útil para o usuário final. Ele precisa de programas, utilitários e uma interface para se tornar um sistema completo.

### A Distribuição (Distro)

Uma **distribuição** (ou "distro") é o kernel Linux **mais** um conjunto de programas, bibliotecas, gerenciador de pacotes, ferramentas de linha de comando e, opcionalmente, uma interface gráfica. É a distro que você realmente instala no computador.

Pense assim: o kernel é o motor, e a distribuição é o carro completo, com bancos, volante e painel.

## Principais Distribuições

Existem centenas de distros. As mais conhecidas para desenvolvedores são:

| Distribuição | Família | Uso típico |
|---|---|---|
| **Ubuntu** | Debian | Iniciantes, desktop, servidores |
| **Debian** | Debian | Servidores estáveis |
| **Fedora** | Red Hat | Desktop moderno, novidades |
| **CentOS / Rocky / AlmaLinux** | Red Hat | Servidores empresariais |
| **Arch Linux** | Independente | Usuários avançados, controle total |
| **Linux Mint** | Debian/Ubuntu | Desktop amigável |

Cada família tem seu **gerenciador de pacotes** (programa que instala softwares):

```bash
# Família Debian/Ubuntu usa apt
sudo apt update
sudo apt install git

# Família Red Hat/Fedora usa dnf
sudo dnf install git

# Arch usa pacman
sudo pacman -S git
```

## O que é o Terminal e o Shell?

O **terminal** (ou emulador de terminal) é o programa que abre uma janela onde você digita comandos em texto. O **shell** é o programa que **interpreta** esses comandos e os executa.

O shell mais comum no Linux é o **Bash** (Bourne Again Shell). Outros populares são o **Zsh** e o **Fish**.

Quando você abre o terminal, vê algo como:

```bash
usuario@maquina:~$
```

- `usuario` é o nome do usuário logado.
- `maquina` é o nome do computador.
- `~` indica o diretório atual (nesse caso, a pasta pessoal).
- `$` indica que você é um usuário comum (`#` indicaria o usuário root/administrador).

Você digita um comando e pressiona Enter:

```bash
echo "Olá, Linux!"
```

O comando acima imprime a frase na tela. Comandos seguem o padrão: o nome do comando, seguido de opções (flags, geralmente começando com `-`) e argumentos.

```bash
ls -l /home
# ls   = comando (listar)
# -l   = opção (formato longo)
# /home = argumento (o diretório a listar)
```

## Por que desenvolvedores usam Linux?

- **Servidores rodam Linux**: a grande maioria dos servidores web, bancos de dados e serviços em nuvem usam Linux. Conhecer Linux ajuda a fazer deploy e depurar problemas.
- **Ferramentas nativas**: Git, Docker, Node.js, Python e muitas outras ferramentas funcionam de forma natural no Linux.
- **Produtividade na linha de comando**: tarefas repetitivas podem ser automatizadas com scripts.
- **Gratuito e personalizável**: você controla cada aspecto do ambiente.
- **Próximo da produção**: desenvolver no mesmo tipo de ambiente em que o software vai rodar evita surpresas.

## Atividades

- [ ] Identifique qual distribuição Linux você usa ou gostaria de usar e anote sua família (Debian, Red Hat, etc.).
- [ ] Abra um terminal e execute o comando `echo "Olá, Linux!"`.
- [ ] Execute `uname -a` e observe a versão do kernel exibida.
- [ ] Identifique no prompt do seu terminal o nome de usuário, o nome da máquina e o diretório atual.
- [ ] Pesquise qual gerenciador de pacotes a sua distro usa (apt, dnf ou pacman).
