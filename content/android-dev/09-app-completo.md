---
title: "Projeto: App Completo"
---

# Projeto: App Completo

Chegou a hora de juntar tudo. Vamos construir, passo a passo, um app real de **lista de tarefas com sincronização**, aplicando a arquitetura **MVVM** com **Room**, **Retrofit**, **corrotinas** e **RecyclerView**. Não vamos digitar cada linha, mas entender a estrutura, as telas e o fluxo dos dados.

## A Arquitetura MVVM

**MVVM** (Model-View-ViewModel) separa o app em camadas com responsabilidades claras. Isso deixa o código testável, organizado e fácil de manter.

```
View (Activity/Fragment)
   ↕  observa estado / envia eventos
ViewModel  (lógica de tela, sobrevive à rotação)
   ↕
Repository  (decide: vem do banco ou da rede?)
   ↙        ↘
Room        Retrofit
(local)     (remoto)
```

- **View**: só exibe dados e captura cliques. Não tem regra de negócio.
- **ViewModel**: guarda o estado da tela e a lógica. Sobrevive a mudanças de configuração.
- **Repository**: única fonte de verdade. Decide buscar do banco local (Room) ou da API (Retrofit).
- **Model**: as entidades de dados.

## Estrutura de Pacotes

Organize o código por camada:

```
com.exemplo.tarefas/
├── data/
│   ├── local/        (Entity, DAO, Database)
│   ├── remote/       (ApiService, modelos de rede)
│   └── repository/   (TarefaRepository)
├── ui/
│   ├── lista/        (ListaActivity, ListaViewModel, TarefaAdapter)
│   └── detalhe/      (DetalheActivity, DetalheViewModel)
└── TarefasApp.kt     (Application, instância do banco)
```

## Passo 1: A Camada de Dados (Model)

A `Entity` do Room é o nosso modelo central:

```kotlin
@Entity(tableName = "tarefas")
data class Tarefa(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val titulo: String,
    val descricao: String = "",
    val concluida: Boolean = false
)
```

O DAO (do capítulo 6) expõe um `Flow` para reatividade:

```kotlin
@Dao
interface TarefaDao {
    @Query("SELECT * FROM tarefas ORDER BY id DESC")
    fun listarTodas(): Flow<List<Tarefa>>

    @Insert suspend fun inserir(tarefa: Tarefa)
    @Update suspend fun atualizar(tarefa: Tarefa)
    @Delete suspend fun deletar(tarefa: Tarefa)
}
```

## Passo 2: O Repository

O repositório centraliza o acesso aos dados. Aqui ele usa o Room como fonte principal e pode sincronizar com a API:

```kotlin
class TarefaRepository(
    private val dao: TarefaDao,
    private val api: ApiService
) {
    val tarefas: Flow<List<Tarefa>> = dao.listarTodas()

    suspend fun adicionar(tarefa: Tarefa) = dao.inserir(tarefa)
    suspend fun alternarConcluida(tarefa: Tarefa) =
        dao.atualizar(tarefa.copy(concluida = !tarefa.concluida))
    suspend fun remover(tarefa: Tarefa) = dao.deletar(tarefa)

    suspend fun sincronizar() {
        val remotas = api.listarTarefas()   // busca da nuvem
        remotas.forEach { dao.inserir(it.toEntity()) }
    }
}
```

A View nunca fala direto com Room ou Retrofit — só com o repositório.

## Passo 3: O ViewModel

O ViewModel expõe o estado para a tela e trata os eventos. Ele usa `viewModelScope` para corrotinas:

```kotlin
class ListaViewModel(private val repo: TarefaRepository) : ViewModel() {

    // O estado da tela, observável pela View
    val tarefas: StateFlow<List<Tarefa>> = repo.tarefas
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun adicionar(titulo: String) = viewModelScope.launch {
        repo.adicionar(Tarefa(titulo = titulo))
    }

    fun alternar(tarefa: Tarefa) = viewModelScope.launch {
        repo.alternarConcluida(tarefa)
    }

    fun remover(tarefa: Tarefa) = viewModelScope.launch {
        repo.remover(tarefa)
    }

    fun sincronizar() = viewModelScope.launch {
        try { repo.sincronizar() } catch (e: Exception) { /* tratar erro */ }
    }
}
```

Como os dados vêm de um `Flow`/`StateFlow`, qualquer inserção no banco atualiza a lista automaticamente — sem precisar recarregar manualmente.

## Passo 4: A View (Tela da Lista)

A Activity observa o estado e atualiza o `RecyclerView`:

```kotlin
class ListaActivity : AppCompatActivity() {
    private val viewModel: ListaViewModel by viewModels { Fabrica(...) }
    private val adapter = TarefaAdapter(
        aoClicar = { viewModel.alternar(it) },
        aoRemover = { viewModel.remover(it) }
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityListaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.recycler.adapter = adapter
        binding.recycler.layoutManager = LinearLayoutManager(this)

        // Observa o estado de forma segura quanto ao ciclo de vida
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.tarefas.collect { lista ->
                    adapter.submitList(lista)
                    binding.textoVazio.isVisible = lista.isEmpty()
                }
            }
        }

        binding.botaoAdicionar.setOnClickListener {
            val titulo = binding.campoTitulo.text.toString()
            if (titulo.isNotBlank()) {
                viewModel.adicionar(titulo)
                binding.campoTitulo.text?.clear()
            }
        }
    }
}
```

O `repeatOnLifecycle(STARTED)` garante que só coletamos o Flow enquanto a tela está visível, evitando trabalho desnecessário e vazamentos.

## As Telas e o Fluxo

O app terá basicamente duas telas:

1. **Tela da Lista** (`ListaActivity`)
   - Campo de texto + botão para adicionar tarefa.
   - `RecyclerView` mostrando todas as tarefas.
   - Clique no item alterna concluída/não concluída (visual riscado).
   - Deslizar para o lado remove (com `ItemTouchHelper`).
   - Botão de menu para "Sincronizar" (puxa da API).

2. **Tela de Detalhe** (`DetalheActivity`)
   - Abre ao tocar longamente em um item.
   - Mostra título e descrição completos, permite editar.
   - Salva ao confirmar, voltando à lista (que atualiza sozinha pelo Flow).

### Fluxo completo de um clique em "Adicionar"

1. Usuário digita "Comprar pão" e toca em Adicionar.
2. A View chama `viewModel.adicionar("Comprar pão")`.
3. O ViewModel lança uma corrotina e chama `repo.adicionar(...)`.
4. O Repository chama `dao.inserir(...)`, gravando no SQLite via Room.
5. O Room detecta a mudança e emite uma nova lista pelo `Flow`.
6. O `StateFlow` no ViewModel propaga a lista.
7. A View, que está coletando, recebe a lista e chama `adapter.submitList(...)`.
8. A `RecyclerView` anima a inserção do novo item.

Tudo isso de forma **reativa e unidirecional**: dados fluem do repositório para a tela, eventos fluem da tela para o ViewModel. Esse padrão (UDF — Unidirectional Data Flow) é a base dos apps Android modernos e do Jetpack Compose.

## Boas Práticas Aplicadas

- **Separação de responsabilidades** com MVVM.
- **Fonte única de verdade** no Room (funciona offline).
- **Corrotinas** para tudo que é assíncrono.
- **Flow/StateFlow** para reatividade automática.
- **ViewBinding** para acesso seguro às Views.
- Observação **consciente do ciclo de vida** com `repeatOnLifecycle`.

Com esse esqueleto, você consegue construir praticamente qualquer app CRUD conectado. A partir daqui, evolua: injeção de dependência (Hilt), testes, e migração da UI para Jetpack Compose.

## Atividades

- [ ] Crie a estrutura de pacotes (data, ui) e a `Entity`/`DAO`/`Database` de tarefas.
- [ ] Implemente o `TarefaRepository` expondo um `Flow` da lista.
- [ ] Crie o `ListaViewModel` com `adicionar`, `alternar` e `remover` usando `viewModelScope`.
- [ ] Monte a tela da lista observando o estado com `repeatOnLifecycle` e exibindo na `RecyclerView`.
- [ ] Implemente o swipe-to-delete com `ItemTouchHelper`.
- [ ] Adicione a opção "Sincronizar" que busca tarefas de uma API via Retrofit e grava no Room.
