---
title: "Ciclo de Vida"
---

# Ciclo de Vida

Apps Android não têm um único ponto de início e fim como um programa de console. O sistema operacional cria, pausa, retoma e destrói suas telas conforme o usuário navega, recebe ligações ou gira o aparelho. Entender o **ciclo de vida (lifecycle)** é fundamental para não perder dados nem causar vazamentos de memória.

## Ciclo de Vida da Activity

A `Activity` passa por estados, e o sistema chama métodos (callbacks) em cada transição:

| Método | Quando é chamado |
|--------|------------------|
| `onCreate()` | A tela está sendo criada (uma única vez). Aqui você inicializa a UI. |
| `onStart()` | A tela está prestes a ficar visível. |
| `onResume()` | A tela está em primeiro plano e o usuário pode interagir. |
| `onPause()` | A tela está perdendo o foco (ex: outra tela abriu na frente). |
| `onStop()` | A tela não está mais visível. |
| `onDestroy()` | A tela está sendo destruída (fim de vida). |

Visualizando o fluxo:

```
onCreate → onStart → onResume → [tela ativa]
                                      ↓
                                  onPause → onStop → onDestroy
                                      ↑         ↓
                                  onResume ← onRestart → onStart
```

Exemplo prático com logs:

```kotlin
class MainActivity : AppCompatActivity() {
    private val TAG = "Ciclo"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Log.d(TAG, "onCreate")
    }

    override fun onStart() { super.onStart(); Log.d(TAG, "onStart") }
    override fun onResume() { super.onResume(); Log.d(TAG, "onResume") }
    override fun onPause() { super.onPause(); Log.d(TAG, "onPause") }
    override fun onStop() { super.onStop(); Log.d(TAG, "onStop") }
    override fun onDestroy() { super.onDestroy(); Log.d(TAG, "onDestroy") }
}
```

Rode o app e observe o Logcat ao abrir, pressionar o botão Home e voltar. Você verá a sequência de chamadas.

### O que fazer em cada método

- **`onCreate`**: inflar layout, configurar listeners, inicializar variáveis.
- **`onResume`**: iniciar animações, câmera, sensores — recursos que só fazem sentido com a tela visível.
- **`onPause`**: pausar/salvar coisas rápidas; deve ser leve, pois bloqueia a transição.
- **`onStop`**: liberar recursos pesados.
- **`onDestroy`**: limpeza final.

## Ciclo de Vida do Fragment

Um **Fragment** é uma parte reutilizável de UI que vive dentro de uma Activity. Ele tem um ciclo de vida próprio, parecido mas com mais etapas:

```
onAttach → onCreate → onCreateView → onViewCreated →
onStart → onResume → [ativo] → onPause → onStop →
onDestroyView → onDestroy → onDetach
```

Pontos importantes:

- **`onCreateView`**: onde você infla o layout do fragment e retorna a View.
- **`onViewCreated`**: a View já existe; aqui você configura os elementos.
- **`onDestroyView`**: a View foi destruída, mas o fragment pode continuar vivo. **Sempre limpe referências de binding aqui** para evitar vazamentos:

```kotlin
class MeuFragment : Fragment() {
    private var _binding: FragmentMeuBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMeuBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

## Salvando Estado: onSaveInstanceState

Quando o sistema destrói a Activity temporariamente (por falta de memória ou mudança de configuração), você pode salvar dados pequenos no `Bundle`:

```kotlin
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.putString("nome", "Maria")
    outState.putInt("contador", 42)
}

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    val nome = savedInstanceState?.getString("nome")
    val contador = savedInstanceState?.getInt("contador") ?: 0
}
```

Use isso só para dados leves de UI (texto digitado, posição de rolagem). Dados grandes ou permanentes vão para banco de dados ou `ViewModel`.

## Mudanças de Configuração

Quando o usuário **gira a tela**, muda o idioma ou o tema (claro/escuro), o Android considera uma **mudança de configuração**. Por padrão, ele **destrói e recria a Activity** — chamando `onDestroy` e `onCreate` de novo. É por isso que um contador na variável volta a zero ao girar a tela!

Soluções:

1. **`onSaveInstanceState`**: para dados pequenos (mostrado acima).
2. **`ViewModel`** (recomendado): um objeto que **sobrevive** a mudanças de configuração. Ele mantém os dados da tela separados da Activity, que pode ser recriada à vontade.

```kotlin
class MeuViewModel : ViewModel() {
    var contador = 0
}

// Na Activity:
private val viewModel: MeuViewModel by viewModels()
```

O `ViewModel` é a base da arquitetura moderna (MVVM), que veremos no projeto final. Ele resolve o problema da rotação de forma limpa.

## Atividades

- [ ] Adicione logs em todos os métodos do ciclo de vida e observe a sequência no Logcat.
- [ ] Abra outro app e volte; identifique quais métodos foram chamados.
- [ ] Crie um contador em uma variável e gire a tela — veja-o zerar.
- [ ] Salve o contador com `onSaveInstanceState` e confirme que ele persiste ao girar.
- [ ] Crie um `ViewModel` que guarde o contador e teste a rotação.
- [ ] Crie um Fragment e implemente a limpeza de binding no `onDestroyView`.
