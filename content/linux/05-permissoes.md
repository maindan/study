---
title: "Permissões e Usuários"
---

# Permissões e Usuários

O Linux foi projetado desde o início para ser um sistema **multiusuário**: várias pessoas podem usar a mesma máquina, cada uma com seus próprios arquivos e limites. Para que isso funcione com segurança, o Linux tem um sistema de **permissões** que controla quem pode ler, escrever ou executar cada arquivo. Entender esse sistema é essencial para evitar erros e proteger o sistema.

## Usuários e Grupos

Existem três tipos de "entidades" relevantes:

- **Usuário (owner)**: o dono do arquivo, normalmente quem o criou.
- **Grupo (group)**: um conjunto de usuários que compartilham permissões.
- **Outros (others)**: qualquer outro usuário do sistema.

O usuário mais poderoso é o **root** (também chamado de superusuário). O root pode fazer qualquer coisa: instalar programas, apagar arquivos do sistema e alterar configurações. Por isso, **usar root sem necessidade é perigoso**.

Comandos úteis para identificar usuários e grupos:

```bash
whoami     # mostra seu nome de usuário
id         # mostra seu UID, GID e grupos
groups     # mostra os grupos a que você pertence
```

## Lendo Permissões: rwx

Quando você lista arquivos com `ls -l`, vê algo assim:

```bash
ls -l
-rwxr-xr--  1 ana  devs  2048 jun 26 10:00 script.sh
```

A primeira coluna (`-rwxr-xr--`) descreve as permissões. Vamos decifrá-la em quatro partes:

```
-     rwx        r-x        r--
tipo  usuário    grupo      outros
```

- O **primeiro caractere** indica o tipo: `-` para arquivo comum, `d` para diretório, `l` para link.
- Os próximos **três grupos de três** mostram as permissões para o dono, o grupo e os outros.

Cada grupo tem três letras possíveis:

| Letra | Significado | Em arquivo | Em diretório |
|---|---|---|---|
| `r` | read (ler) | ler o conteúdo | listar arquivos |
| `w` | write (escrever) | modificar o conteúdo | criar/apagar arquivos |
| `x` | execute (executar) | rodar como programa | entrar no diretório |

Um traço `-` no lugar da letra significa que aquela permissão **não** está concedida.

No exemplo `-rwxr-xr--`:
- Dono (`ana`): pode ler, escrever e executar (`rwx`).
- Grupo (`devs`): pode ler e executar, mas não escrever (`r-x`).
- Outros: podem apenas ler (`r--`).

## Notação Octal: 755, 644

Cada permissão pode ser representada por um número:

| Permissão | Valor |
|---|---|
| `r` (ler) | 4 |
| `w` (escrever) | 2 |
| `x` (executar) | 1 |

Somando os valores de cada grupo, formamos um número de três dígitos:

- `rwx` = 4 + 2 + 1 = **7**
- `r-x` = 4 + 0 + 1 = **5**
- `r--` = 4 + 0 + 0 = **4**
- `rw-` = 4 + 2 + 0 = **6**

Por isso:

- **755** = `rwxr-xr-x` → dono pode tudo; grupo e outros leem e executam. Comum em **scripts e programas**.
- **644** = `rw-r--r--` → dono lê e escreve; grupo e outros apenas leem. Comum em **arquivos de texto e configuração**.
- **700** = `rwx------` → só o dono tem acesso. Comum em **arquivos privados**.

## Alterando Permissões: chmod

O comando `chmod` (change mode) altera permissões. Você pode usar a notação octal ou a simbólica.

### Notação octal

```bash
chmod 755 script.sh   # rwxr-xr-x
chmod 644 nota.txt    # rw-r--r--
chmod 700 segredo.txt # rwx------
```

### Notação simbólica

Use `u` (user), `g` (group), `o` (others), `a` (all), com `+` (adicionar), `-` (remover) ou `=` (definir):

```bash
chmod +x script.sh    # adiciona permissão de execução para todos
chmod u+x script.sh   # só o dono pode executar
chmod g-w arquivo.txt # remove escrita do grupo
chmod o=r arquivo.txt # outros só podem ler
```

Tornar um script executável é uma das tarefas mais frequentes:

```bash
chmod +x meu_script.sh
./meu_script.sh
```

## Mudando o Dono: chown

O comando `chown` (change owner) altera o dono e/ou o grupo de um arquivo. Geralmente exige privilégios de administrador.

```bash
sudo chown ana arquivo.txt          # muda o dono para ana
sudo chown ana:devs arquivo.txt     # muda dono para ana e grupo para devs
sudo chown -R ana:devs /var/www     # aplica recursivamente em uma pasta
```

A flag `-R` (recursivo) aplica a mudança a todos os arquivos e subpastas.

## sudo e root

O `sudo` (superuser do) permite executar **um comando** com privilégios de root, sem precisar logar como root. É a forma segura e recomendada de fazer tarefas administrativas.

```bash
sudo apt update              # atualiza a lista de pacotes
sudo systemctl restart nginx # reinicia um serviço
sudo nano /etc/hosts         # edita um arquivo do sistema
```

Quando você usa `sudo`, o sistema pede a **sua senha** (não a do root). Só usuários autorizados (no grupo `sudo` ou `wheel`) podem usá-lo.

Boas práticas:

- Use `sudo` apenas quando realmente precisar.
- Evite trabalhar logado como root o tempo todo.
- Pense duas vezes antes de rodar comandos destrutivos com `sudo`, como `sudo rm -rf`.

## Atividades

- [ ] Execute `whoami` e `id` para descobrir seu usuário e grupos.
- [ ] Crie um arquivo e veja suas permissões padrão com `ls -l`.
- [ ] Use `chmod 644` em um arquivo e confirme o resultado com `ls -l`.
- [ ] Torne um script executável com `chmod +x` e execute-o.
- [ ] Converta mentalmente as permissões `rwxr-xr--` para notação octal.
- [ ] Pesquise a diferença entre usar `sudo` e logar diretamente como root.
