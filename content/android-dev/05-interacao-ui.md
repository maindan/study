---
title: "Listas e Interação"
---

# Listas e Interação

Um app que só mostra texto não serve para muito. Vamos aprender a responder a toques, exibir listas de dados com `RecyclerView` e navegar entre telas passando informações.

## Eventos: setOnClickListener

A forma mais comum de interação é o clique. Usando ViewBinding:

```kotlin
binding.botaoEnviar.setOnClickListener {
    val nome = binding.campoNome.text.toString()
    binding.textoResultado.text = "Olá, $nome!"
    Log.d("UI", "Botão clicado com nome: $nome")
}
```

O `setOnClickListener` recebe uma **lambda** que executa quando o usuário toca. Outros listeners úteis: `setOnLongClickListener` (toque longo), `addTextChangedListener` (texto digitado), `setOnCheckedChangeListener` (checkbox/switch).

## RecyclerView

Para exibir **listas** (contatos, produtos, tarefas), usamos a `RecyclerView`. Ela é eficiente porque **recicla** as Views: em vez de criar mil itens, mantém só os visíveis na tela e reaproveita conforme você rola.

A RecyclerView precisa de três peças:

1. **A View** no layout (`RecyclerView`).
2. **Um Adapter**: conecta os dados às Views.
3. **Um ViewHolder**: guarda as referências das Views de cada item.

### 1. Layout da lista e do item

No layout da tela:

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recyclerTarefas"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

Crie um layout para cada item, `item_tarefa.xml`:

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:padding="16dp"
    android:orientation="vertical">

    <TextView
        android:id="@+id/textoTitulo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="18sp" />
</LinearLayout>
```

### 2. O Adapter e o ViewHolder

```kotlin
data class Tarefa(val id: Int, val titulo: String)

class TarefaAdapter(
    private val tarefas: List<Tarefa>,
    private val aoClicar: (Tarefa) -> Unit
) : RecyclerView.Adapter<TarefaAdapter.TarefaViewHolder>() {

    // Guarda as referências das Views de um item
    class TarefaViewHolder(val binding: ItemTarefaBinding) :
        RecyclerView.ViewHolder(binding.root)

    // Cria um novo item (infla o layout)
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TarefaViewHolder {
        val binding = ItemTarefaBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return TarefaViewHolder(binding)
    }

    // Preenche um item com os dados na posição
    override fun onBindViewHolder(holder: TarefaViewHolder, position: Int) {
        val tarefa = tarefas[position]
        holder.binding.textoTitulo.text = tarefa.titulo
        holder.itemView.setOnClickListener { aoClicar(tarefa) }
    }

    override fun getItemCount() = tarefas.size
}
```

Os três métodos obrigatórios:

- **`onCreateViewHolder`**: cria a estrutura de um item (inflando o XML).
- **`onBindViewHolder`**: "amarra" os dados a um item já criado.
- **`getItemCount`**: quantos itens existem.

### 3. Conectando na Activity

```kotlin
val lista = listOf(
    Tarefa(1, "Estudar Kotlin"),
    Tarefa(2, "Fazer exercícios"),
    Tarefa(3, "Revisar o ciclo de vida")
)

binding.recyclerTarefas.layoutManager = LinearLayoutManager(this)
binding.recyclerTarefas.adapter = TarefaAdapter(lista) { tarefa ->
    Toast.makeText(this, "Clicou em ${tarefa.titulo}", Toast.LENGTH_SHORT).show()
}
```

O **`LayoutManager`** define como os itens são organizados: `LinearLayoutManager` (lista vertical/horizontal), `GridLayoutManager` (grade) ou `StaggeredGridLayoutManager` (grade irregular).

> Dica: para listas que mudam, use `ListAdapter` com `DiffUtil`, que calcula automaticamente o que mudou e anima as alterações.

## Navegação entre Activities

Para abrir outra tela, usamos um **Intent**:

```kotlin
val intent = Intent(this, DetalheActivity::class.java)
startActivity(intent)
```

### Passando dados

Você anexa dados ao Intent com `putExtra`:

```kotlin
val intent = Intent(this, DetalheActivity::class.java)
intent.putExtra("TAREFA_ID", tarefa.id)
intent.putExtra("TAREFA_TITULO", tarefa.titulo)
startActivity(intent)
```

E recupera na tela de destino:

```kotlin
class DetalheActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalhe)

        val id = intent.getIntExtra("TAREFA_ID", -1)
        val titulo = intent.getStringExtra("TAREFA_TITULO") ?: ""
        binding.textoDetalhe.text = "$titulo (id: $id)"
    }
}
```

Lembre-se: toda Activity precisa estar declarada no `AndroidManifest.xml`.

## Navegação entre Fragments

Em apps modernos de tela única (Single Activity), navegamos entre **Fragments** usando o **Navigation Component**. Você define um grafo de navegação (`nav_graph.xml`) e usa o `NavController`:

```kotlin
findNavController().navigate(R.id.action_listaFragment_to_detalheFragment)
```

Para passar dados de forma segura entre fragments, usa-se o plugin **Safe Args**, que gera classes tipadas:

```kotlin
val action = ListaFragmentDirections.actionListaToDetalhe(tarefaId = 5)
findNavController().navigate(action)
```

Isso evita erros de digitação nas chaves dos extras e garante os tipos em tempo de compilação.

## Atividades

- [ ] Adicione um `Button` e mostre um `Toast` ao clicar nele.
- [ ] Crie uma `RecyclerView` com pelo menos cinco itens de uma `data class`.
- [ ] Implemente o clique em um item exibindo um `Toast` com o conteúdo.
- [ ] Crie uma segunda Activity e navegue até ela com um `Intent`.
- [ ] Passe um dado pelo `Intent` e exiba-o na tela de destino.
- [ ] Troque o `LinearLayoutManager` por `GridLayoutManager` com 2 colunas.
