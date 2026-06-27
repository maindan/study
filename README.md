# Study 📚

Aplicação **desktop (Electron)** + **Next.js** para estudar, num só lugar:

🐧 Linux · ☕ Java · 🟣 Kotlin · 🧩 Orientação a Objetos · ⚙️ Algoritmos · 🗄️ SQL · 🤖 Sistema Android · 🏛️ Arquitetura Android · 📱 Dev Android Nativo

Cada módulo tem **documentação**, **atividades** e **exercícios corrigidos automaticamente**. O progresso é salvo num **banco SQLite** local (sem login).

---

## ✨ Como os exercícios são validados

| Tipo | Validação |
|------|-----------|
| **Algoritmos (Java)** | Você escreve o código; o app **compila e executa** no JDK contra vários casos de teste e compara a saída. ✅/❌ |
| **Linux** | Você digita o comando; é validado contra respostas aceitas (regex). |
| **Quizzes** (Java, Kotlin, OOP, SQL, Android…) | Múltipla escolha e resposta curta corrigidas na hora. |
| **Leitura** | Checkboxes de atividades, com barra de progresso por módulo. |

Tudo que você completa é persistido no SQLite, então o progresso continua entre sessões.

---

## 🔧 Requisitos

- **Node.js 18+**
- **JDK 17+** (necessário para os desafios de Java — precisa de `java` e `javac` no `PATH`). Verifique com `java -version` e `javac -version`.

> Sem o JDK, todo o resto funciona; apenas o botão "Rodar testes" dos algoritmos avisará que o Java não foi encontrado.

---

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Gerar as saídas esperadas dos desafios Java (uma vez, e sempre que adicionar/alterar desafios)
```bash
npm run seed
```
Isso compila e roda a solução de referência de cada desafio e grava a saída esperada no JSON.

### 3a. Rodar como app de desktop (Electron)
```bash
npm run app
```
(equivale a `npm run build` seguido de `npm run electron`)

### 3b. Rodar no navegador (modo desenvolvimento)
```bash
npm run dev
```
Abra http://localhost:3000

> No modo navegador o progresso é salvo no `localStorage`. No app Electron, é salvo no **SQLite**.

---

## 📦 Gerar o instalador (.exe)

```bash
npm run dist
```

Isso roda o `next build` e o **electron-builder**, gerando em `release/`:

- `Study Setup 1.0.0.exe` — **instalador** (NSIS) com escolha de pasta e atalho na área de trabalho. Instala no perfil do usuário (não pede admin).
- `win-unpacked/` — o app já descompactado (dá para rodar `Study.exe` direto).

> **Atenção (Windows):** o electron-builder baixa o `winCodeSign`, que contém symlinks de macOS. Criar symlink no Windows exige **Modo Desenvolvedor** ligado (Configurações → Privacidade e segurança → Para desenvolvedores) **ou** rodar o comando num terminal **como Administrador**. Sem isso, a build falha com *"o cliente não tem o privilégio necessário"*.
> Alternativa sem admin: pré-extrair o `winCodeSign` sem a pasta `darwin` para o cache (`%LOCALAPPDATA%\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0`).

---

## 🗄️ Onde fica o banco de dados

No app Electron, os dados ficam em um arquivo SQLite dentro da pasta de dados do usuário:

- **Windows:** `%APPDATA%/Study/study.sqlite`
- **macOS:** `~/Library/Application Support/Study/study.sqlite`
- **Linux:** `~/.config/Study/study.sqlite`

O SQLite usa **sql.js** (WebAssembly), então **não precisa de compilação nativa** — funciona em qualquer máquina. Se por algum motivo o engine não carregar, há um fallback automático para um arquivo `.json` no mesmo diretório.

Tabela única `kv (key, value)`: guarda os flags de conclusão (`p:...`) e o código que você escreveu em cada desafio (`code:...`).

---

## 🧩 Estrutura do conteúdo

Todo o conteúdo vive em `content/<modulo>/`. Cada módulo tem um `_meta.json`:

```json
{
  "title": "Algoritmos",
  "icon": "⚙️",
  "order": 5,
  "description": "...",
  "sections": [
    { "slug": "complexidade", "title": "Complexidade", "type": "doc",  "file": "01-complexidade.md" },
    { "slug": "arrays-facil", "title": "Arrays — Fácil", "type": "java", "file": "03-arrays-facil.json" }
  ]
}
```

Tipos de seção (`type`):

- **`doc`** — arquivo Markdown. Atividades viram checkboxes com `- [ ] texto`.
- **`java`** — JSON com desafios `{ id, title, statement, starter, reference, harness }`. O `seed` preenche `expected`.
- **`linux`** — JSON com tarefas `{ id, prompt, accept: [regex], hint, explain }`.
- **`quiz`** — JSON com perguntas `{ id, q, options, answer, explain }` (ou `accept` para resposta curta).

> Seções cujo arquivo ainda não existe são **ignoradas automaticamente** — dá para crescer o conteúdo aos poucos.

---

## 📁 Principais pastas

```
app/                 Páginas Next.js (App Router)
components/           UI (editor de código, quiz, progresso, sidebar…)
lib/                 Carregador de conteúdo e store de progresso
content/             Toda a documentação e exercícios
electron/            Processo principal, preload e camada SQLite
scripts/seed-java.mjs  Calcula as saídas esperadas dos desafios Java
```

---

## ➕ Adicionar um novo desafio de Java

1. Acrescente um objeto em `content/algoritmos/0X-arrays-*.json`.
2. Garanta que a classe se chama `Solution` e que o `harness` (`public class Main`) imprime os resultados.
3. Rode `npm run seed` para gerar o `expected`.
4. `npm run app`.
