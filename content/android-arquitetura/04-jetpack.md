---
title: "Android Jetpack"
---

# Android Jetpack

O **Android Jetpack** é um conjunto de bibliotecas oficiais do Google que resolvem problemas comuns do desenvolvimento Android. Em vez de você reinventar a roda (e cometer erros sutis de ciclo de vida, threads e persistência), o Jetpack oferece soluções testadas e mantidas. Vamos conhecer os componentes mais importantes para a arquitetura de um app.

## ViewModel

O **ViewModel** armazena e gerencia dados ligados à UI de forma consciente do ciclo de vida. Seu grande benefício: ele **sobrevive a mudanças de configuração**, como girar a tela. Sem ele, ao girar o aparelho a Activity é recriada e você perderia os dados em memória.

```kotlin
class TarefasViewModel : ViewModel() {
    val tarefas = MutableStateFlow<List<String>>(emptyList())

    fun adicionar(tarefa: String) {
        tarefas.value = tarefas.value + tarefa
    }
}
```

**Resolve:** manter o estado da tela vivo entre recriações e separar a lógica da UI.

## LiveData e StateFlow

Ambos servem para **expor dados observáveis**: a UI "se inscreve" e é notificada quando o valor muda.

- **LiveData:** observável consciente do ciclo de vida. Só notifica observadores ativos. Foi muito usado com Views tradicionais.
- **StateFlow:** parte das **Coroutines** do Kotlin. É a recomendação atual, sempre tem um valor e integra muito bem com Jetpack Compose.

```kotlin
// StateFlow (recomendado hoje)
private val _nome = MutableStateFlow("")
val nome: StateFlow<String> = _nome.asStateFlow()
```

```kotlin
// Coletando o StateFlow respeitando o ciclo de vida
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.nome.collect { nome -> /* atualiza a UI */ }
    }
}
```

**Resolve:** atualizar a UI automaticamente quando os dados mudam, sem vazamentos de memória.

## Room

O **Room** é uma camada de abstração sobre o banco de dados **SQLite**. Ele transforma tabelas em objetos Kotlin, valida as queries em tempo de compilação e funciona muito bem com Coroutines e Flow.

```kotlin
@Entity(tableName = "usuarios")
data class Usuario(
    @PrimaryKey val id: Int,
    val nome: String
)

@Dao
interface UsuarioDao {
    @Query("SELECT * FROM usuarios")
    fun listar(): Flow<List<Usuario>>

    @Insert
    suspend fun inserir(usuario: Usuario)
}
```

**Resolve:** persistência local segura e tipada, evitando SQL solto e propenso a erros.

## Navigation

O componente **Navigation** centraliza a navegação entre telas (destinos). Ele gerencia a pilha de retorno (back stack), passagem de argumentos de forma segura e deep links. Há versões para Views (grafo XML) e para **Compose** (`NavHost`).

```kotlin
NavHost(navController, startDestination = "lista") {
    composable("lista") { ListaScreen(onItem = { id ->
        navController.navigate("detalhe/$id")
    }) }
    composable("detalhe/{id}") { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id")
        DetalheScreen(id)
    }
}
```

**Resolve:** navegação consistente, back stack correta e passagem de dados entre telas.

## WorkManager

O **WorkManager** agenda tarefas em segundo plano que **precisam ser executadas com garantia**, mesmo que o app feche ou o aparelho reinicie. Exemplos: sincronizar dados, enviar logs, fazer upload quando houver Wi-Fi.

```kotlin
class SyncWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        // Sincroniza dados
        return Result.success()
    }
}

val pedido = OneTimeWorkRequestBuilder<SyncWorker>()
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()
    )
    .build()
WorkManager.getInstance(context).enqueue(pedido)
```

**Resolve:** trabalho em segundo plano confiável e adiável, respeitando bateria e restrições do sistema. É a alternativa moderna a Services manuais para esse tipo de tarefa.

## Lifecycle

A biblioteca **Lifecycle** disponibiliza ferramentas para reagir ao ciclo de vida de Activities e Fragments sem encher seus métodos `onCreate`/`onStop` de código. O `lifecycleScope` e o `viewModelScope` permitem lançar Coroutines que são canceladas automaticamente no momento certo, evitando vazamentos.

```kotlin
viewModelScope.launch {
    // cancelada automaticamente quando o ViewModel é destruído
}
```

**Resolve:** código consciente do ciclo de vida, sem vazamentos de memória.

## DataStore

O **DataStore** é o substituto moderno do antigo `SharedPreferences`. Guarda pequenos volumes de dados (preferências, configurações) de forma **assíncrona** e segura, usando Coroutines e Flow.

```kotlin
val TEMA = stringPreferencesKey("tema")

suspend fun salvarTema(context: Context, tema: String) {
    context.dataStore.edit { prefs -> prefs[TEMA] = tema }
}

val temaFlow: Flow<String> = context.dataStore.data
    .map { prefs -> prefs[TEMA] ?: "claro" }
```

**Resolve:** salvar preferências sem bloquear a thread principal, ao contrário do `SharedPreferences`.

## Visão geral

| Componente | Resolve |
|---|---|
| ViewModel | Estado da UI sobrevive a recriações |
| LiveData / StateFlow | UI reage a mudanças de dados |
| Room | Banco de dados local tipado |
| Navigation | Navegação e back stack |
| WorkManager | Tarefas em segundo plano garantidas |
| Lifecycle | Código consciente do ciclo de vida |
| DataStore | Preferências assíncronas |

Esses componentes foram feitos para trabalhar **juntos** e se encaixam naturalmente em uma arquitetura MVVM em camadas.

## Atividades
- [ ] Crie um ViewModel com um StateFlow e observe-o na UI usando `repeatOnLifecycle`.
- [ ] Configure um banco Room com uma entidade, um DAO e exponha os dados via Flow.
- [ ] Implemente navegação entre duas telas passando um argumento.
- [ ] Agende um WorkManager com uma restrição de rede conectada.
- [ ] Migre um uso de SharedPreferences para DataStore.
- [ ] Liste, em texto, qual componente Jetpack você usaria em cada camada (UI/dados).
