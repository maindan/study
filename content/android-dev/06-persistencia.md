---
title: "Banco de Dados e Persistência"
---

# Banco de Dados e Persistência

Apps precisam guardar dados: preferências do usuário, listas, cadastros. O Android oferece várias opções, da mais simples à mais robusta. Vamos do básico até o **Room**, a solução moderna e recomendada.

## SharedPreferences

Para guardar **valores pequenos** (configurações, flags, último login), use o `SharedPreferences`. Ele salva pares chave-valor em um arquivo XML interno.

```kotlin
// Obter as preferências
val prefs = getSharedPreferences("config", Context.MODE_PRIVATE)

// Salvar
prefs.edit()
    .putString("nome_usuario", "Maria")
    .putBoolean("modo_escuro", true)
    .putInt("pontos", 100)
    .apply()   // apply() é assíncrono; commit() é síncrono

// Ler
val nome = prefs.getString("nome_usuario", "")     // valor padrão ""
val escuro = prefs.getBoolean("modo_escuro", false)
val pontos = prefs.getInt("pontos", 0)
```

Use para coisas simples — **não** para listas grandes ou dados estruturados.

## Arquivos Internos

Você pode gravar arquivos no armazenamento privado do app (só ele acessa):

```kotlin
// Escrever
openFileOutput("dados.txt", Context.MODE_PRIVATE).use { saida ->
    saida.write("conteúdo do arquivo".toByteArray())
}

// Ler
val texto = openFileInput("dados.txt").bufferedReader().use { it.readText() }
```

Útil para arquivos de texto, JSON, cache ou imagens. O `.use { }` fecha o recurso automaticamente.

## SQLite

O Android traz o **SQLite**, um banco de dados relacional embutido. Você pode usá-lo diretamente com SQL puro, mas é trabalhoso: precisa criar tabelas com strings SQL, gerenciar cursores e converter manualmente cada linha em objeto. Exemplo do estilo antigo:

```kotlin
val db = openOrCreateDatabase("app.db", MODE_PRIVATE, null)
db.execSQL("CREATE TABLE IF NOT EXISTS tarefa (id INTEGER PRIMARY KEY, titulo TEXT)")
db.execSQL("INSERT INTO tarefa (titulo) VALUES ('Estudar')")
val cursor = db.rawQuery("SELECT * FROM tarefa", null)
```

Funciona, mas é propenso a erros (SQL como texto não é verificado em compilação) e verboso. Por isso surgiu o Room.

## Room (recomendado)

O **Room** é uma biblioteca de persistência que funciona como uma camada por cima do SQLite. Ele verifica suas queries em **tempo de compilação**, mapeia objetos para tabelas automaticamente e integra com corrotinas e Flow. **Esta é a forma que você deve usar** em apps modernos.

O Room tem três componentes:

1. **Entity**: uma classe que representa uma tabela.
2. **DAO** (Data Access Object): interface com os métodos de acesso (insert, query, delete).
3. **Database**: a classe que conecta tudo.

### 1. Dependências

No `build.gradle.kts`:

```kotlin
plugins {
    id("com.google.devtools.ksp")  // processador de anotações
}

dependencies {
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")
}
```

### 2. Entity

```kotlin
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tarefas")
data class Tarefa(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val titulo: String,
    val concluida: Boolean = false
)
```

Cada propriedade vira uma coluna. `@PrimaryKey(autoGenerate = true)` faz o banco gerar o id sozinho.

### 3. DAO

```kotlin
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface TarefaDao {

    @Query("SELECT * FROM tarefas ORDER BY id DESC")
    fun listarTodas(): Flow<List<Tarefa>>

    @Insert
    suspend fun inserir(tarefa: Tarefa)

    @Update
    suspend fun atualizar(tarefa: Tarefa)

    @Delete
    suspend fun deletar(tarefa: Tarefa)
}
```

Note: os métodos de escrita são `suspend` (corrotinas), pois banco de dados não pode rodar na thread principal. O `listarTodas()` retorna um **`Flow`**, que emite uma nova lista automaticamente sempre que os dados mudam — perfeito para atualizar a tela em tempo real.

### 4. Database

```kotlin
import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [Tarefa::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun tarefaDao(): TarefaDao
}
```

### 5. Criando a instância

Crie **uma única instância** (singleton) do banco para todo o app:

```kotlin
val db = Room.databaseBuilder(
    applicationContext,
    AppDatabase::class.java,
    "app-database"
).build()

val dao = db.tarefaDao()
```

### 6. Usando

```kotlin
// Dentro de uma corrotina (ex: lifecycleScope ou viewModelScope)
lifecycleScope.launch {
    dao.inserir(Tarefa(titulo = "Aprender Room"))

    dao.listarTodas().collect { lista ->
        // Atualiza a UI com a lista sempre que mudar
        adapter.submitList(lista)
    }
}
```

## Comparação

| Solução | Quando usar |
|---------|-------------|
| SharedPreferences | Configurações e valores simples |
| Arquivos internos | Texto, JSON, cache, mídia |
| SQLite puro | Raramente; legado ou casos muito específicos |
| **Room** | **Dados estruturados, listas, relações — a escolha padrão** |

O Room reduz drasticamente o código repetitivo, pega erros de SQL antes de rodar e se integra ao restante do ecossistema moderno. Sempre prefira Room para qualquer dado relacional.

## Atividades

- [ ] Salve e leia o nome do usuário usando `SharedPreferences`.
- [ ] Grave um texto em um arquivo interno e leia-o de volta.
- [ ] Adicione as dependências do Room e o plugin KSP ao projeto.
- [ ] Crie uma `Entity`, um `DAO` e a classe `Database` para "tarefas".
- [ ] Insira tarefas e exiba a lista com `Flow` em uma `RecyclerView`.
- [ ] Implemente a exclusão de uma tarefa ao clicar (ou deslizar) sobre ela.
