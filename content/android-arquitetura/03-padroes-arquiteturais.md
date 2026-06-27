---
title: "Padrões Arquiteturais"
---

# Padrões Arquiteturais

À medida que um app cresce, colocar tudo dentro da Activity vira um problema: o código fica gigante, difícil de testar e de manter. **Padrões arquiteturais** existem para organizar o código, separar responsabilidades e tornar o app testável. Vamos ver os principais.

## O problema da separação de responsabilidades

A ideia central por trás de todos os padrões é: **cada parte do código deve ter uma única responsabilidade clara**. Misturar lógica de tela, regras de negócio e acesso a dados no mesmo arquivo é o que chamamos de "código espaguete".

Os padrões costumam separar o app em três grandes responsabilidades:

- **UI (apresentação):** mostrar dados e capturar interações.
- **Lógica/estado:** decidir o que acontece quando o usuário age.
- **Dados:** buscar e salvar informações (rede, banco, cache).

## MVC (Model-View-Controller)

O padrão mais antigo. Divide em:

- **Model:** os dados e regras de negócio.
- **View:** a interface.
- **Controller:** recebe as ações e atualiza Model e View.

No Android "puro", a Activity acaba sendo View **e** Controller ao mesmo tempo, o que mistura responsabilidades. Por isso o MVC clássico não se encaixa bem no Android.

## MVP (Model-View-Presenter)

O MVP melhora o MVC criando um **Presenter** que contém a lógica de apresentação. A View (Activity/Fragment) fica "burra" e apenas exibe o que o Presenter manda, geralmente comunicando-se por interfaces.

```kotlin
interface LoginView {
    fun mostrarErro(msg: String)
    fun irParaHome()
}

class LoginPresenter(private val view: LoginView) {
    fun logar(usuario: String, senha: String) {
        if (usuario.isBlank() || senha.isBlank()) {
            view.mostrarErro("Preencha todos os campos")
        } else {
            view.irParaHome()
        }
    }
}
```

O MVP é testável, mas exige muito código repetitivo (uma interface para cada tela) e o Presenter precisa lidar manualmente com o ciclo de vida.

## MVVM (recomendado)

O **MVVM (Model-View-ViewModel)** é o padrão **recomendado pelo Google** para apps Android modernos. A diferença chave é que a View **observa** o estado exposto pelo ViewModel, em vez de o ViewModel chamar a View diretamente.

- **View (Activity/Fragment/Compose):** observa o estado e desenha a tela.
- **ViewModel:** guarda o estado da tela e a lógica de apresentação. Sobrevive a mudanças de configuração (como girar a tela).
- **Model:** os dados, normalmente acessados via Repository.

```kotlin
class ContadorViewModel : ViewModel() {
    private val _contagem = MutableStateFlow(0)
    val contagem: StateFlow<Int> = _contagem.asStateFlow()

    fun incrementar() {
        _contagem.value += 1
    }
}
```

```kotlin
// A View apenas observa e reage — não contém lógica de negócio
class ContadorActivity : AppCompatActivity() {
    private val viewModel: ContadorViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contador)

        lifecycleScope.launch {
            viewModel.contagem.collect { valor ->
                textoContagem.text = valor.toString()
            }
        }
        botao.setOnClickListener { viewModel.incrementar() }
    }
}
```

Vantagens: menos código repetitivo que o MVP, integração natural com o Jetpack (ViewModel, StateFlow) e fácil de testar.

## Clean Architecture e camadas

Para apps grandes, a recomendação oficial do Google divide o app em **camadas**, ideia inspirada na **Clean Architecture**:

| Camada | Responsabilidade | Exemplos |
|---|---|---|
| UI | Exibir estado e capturar eventos | Activity, Compose, ViewModel |
| Domínio (opcional) | Regras de negócio reutilizáveis | Use Cases / Interactors |
| Dados | Fornecer e persistir dados | Repository, Room, API |

A regra de ouro é a **direção das dependências**: as camadas de fora dependem das de dentro, **nunca o contrário**. A UI conhece o domínio; o domínio não conhece a UI.

```kotlin
// Camada de dados: Repository abstrai a origem dos dados
class UsuarioRepository(
    private val api: UsuarioApi,
    private val dao: UsuarioDao
) {
    suspend fun buscarUsuario(id: Int): Usuario {
        return dao.buscar(id) ?: api.buscar(id).also { dao.salvar(it) }
    }
}
```

```kotlin
// Camada de domínio: um Use Case com uma única responsabilidade
class BuscarUsuarioUseCase(private val repo: UsuarioRepository) {
    suspend operator fun invoke(id: Int): Usuario = repo.buscarUsuario(id)
}
```

```kotlin
// Camada de UI: o ViewModel orquestra, sem saber de banco ou rede
class PerfilViewModel(private val buscarUsuario: BuscarUsuarioUseCase) : ViewModel() {
    private val _usuario = MutableStateFlow<Usuario?>(null)
    val usuario: StateFlow<Usuario?> = _usuario.asStateFlow()

    fun carregar(id: Int) {
        viewModelScope.launch { _usuario.value = buscarUsuario(id) }
    }
}
```

Note como o `ViewModel` não sabe se os dados vêm da rede ou do banco — isso é responsabilidade do Repository. Essa separação torna cada parte testável de forma isolada.

## Qual usar?

- Apps pequenos: **MVVM** com Repository já é mais que suficiente.
- Apps grandes/complexos: **MVVM + camada de domínio (Use Cases)**, seguindo a Clean Architecture.
- Evite começar projetos novos com MVC ou MVP.

## Resumo

- Separar responsabilidades = código testável e fácil de manter.
- **MVVM** é o padrão recomendado, com a View observando o estado do ViewModel.
- Em apps grandes, organize em camadas **UI → domínio → dados** com dependências apontando para dentro.

## Atividades
- [ ] Reescreva uma tela simples movendo a lógica da Activity para um ViewModel.
- [ ] Crie um Repository que decida entre buscar dados do cache ou da rede.
- [ ] Implemente um Use Case com uma única responsabilidade e o use no ViewModel.
- [ ] Desenhe um diagrama das camadas UI/domínio/dados do seu app.
- [ ] Escreva um teste unitário para um ViewModel sem depender da UI.
- [ ] Compare, em texto, as diferenças práticas entre MVP e MVVM.
