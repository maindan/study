---
title: "Networking e APIs REST"
---

# Networking e APIs REST

A maioria dos apps consome dados da internet: clima, notícias, produtos, perfis. Vamos aprender a fazer requisições HTTP, entender JSON e usar **Retrofit** com **corrotinas** para buscar dados de uma API REST e exibi-los numa lista.

## HTTP e REST

Uma **API REST** expõe recursos por meio de URLs e verbos HTTP:

| Verbo | Uso |
|-------|-----|
| GET | Buscar dados |
| POST | Criar |
| PUT/PATCH | Atualizar |
| DELETE | Remover |

Cada requisição recebe uma resposta com um **código de status**: 200 (OK), 404 (não encontrado), 500 (erro do servidor). O corpo da resposta geralmente vem em **JSON**.

## JSON

**JSON** (JavaScript Object Notation) é o formato padrão de troca de dados:

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@exemplo.com",
  "ativo": true
}
```

Precisamos converter esse JSON em objetos Kotlin (e vice-versa). Esse processo se chama **serialização/desserialização**, feito por bibliotecas como **Gson** ou **Moshi**.

## Permissão de Internet

Antes de tudo, declare no `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Retrofit

O **Retrofit** é a biblioteca padrão para consumir APIs REST no Android. Você descreve a API com uma interface Kotlin e ele cuida das requisições.

### Dependências

```kotlin
dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    // Alternativa moderna: converter-moshi
}
```

### 1. Modelo de dados

Mapeie o JSON para uma `data class`. Os nomes das propriedades devem bater com as chaves do JSON (ou use `@SerializedName`):

```kotlin
import com.google.gson.annotations.SerializedName

data class Usuario(
    val id: Int,
    val nome: String,
    @SerializedName("email") val email: String
)
```

### 2. Interface da API

```kotlin
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {

    @GET("usuarios")
    suspend fun listarUsuarios(): List<Usuario>

    @GET("usuarios/{id}")
    suspend fun buscarUsuario(@Path("id") id: Int): Usuario
}
```

Cada método é uma chamada. O `suspend` indica que é uma **corrotina** — o Retrofit executa a requisição fora da thread principal e retorna o resultado já desserializado.

### 3. Criando o Retrofit

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.exemplo.com/")  // deve terminar com /
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(ApiService::class.java)
```

## Corrotinas

Operações de rede **nunca** podem rodar na thread principal (UI), ou o app trava. As **corrotinas** do Kotlin permitem escrever código assíncrono de forma sequencial e legível.

```kotlin
lifecycleScope.launch {
    try {
        val usuarios = api.listarUsuarios()   // suspende sem travar a UI
        adapter.submitList(usuarios)           // volta para a thread principal
    } catch (e: Exception) {
        Log.e("API", "Erro: ${e.message}")
    }
}
```

- **`lifecycleScope.launch`**: inicia uma corrotina ligada ao ciclo de vida (cancelada se a tela for destruída). Em um ViewModel, use `viewModelScope.launch`.
- O `suspend fun` "pausa" enquanto espera a rede, sem bloquear a interface.

## Tratamento de Erros

A rede pode falhar de muitas formas: sem internet, timeout, erro do servidor, JSON inválido. Sempre trate exceções:

```kotlin
lifecycleScope.launch {
    binding.progresso.isVisible = true
    try {
        val usuarios = api.listarUsuarios()
        adapter.submitList(usuarios)
        binding.textoErro.isVisible = false
    } catch (e: IOException) {
        binding.textoErro.text = "Sem conexão. Tente novamente."
        binding.textoErro.isVisible = true
    } catch (e: HttpException) {
        binding.textoErro.text = "Erro do servidor: ${e.code()}"
        binding.textoErro.isVisible = true
    } finally {
        binding.progresso.isVisible = false
    }
}
```

- **`IOException`**: problemas de conexão.
- **`HttpException`**: respostas com código de erro (4xx, 5xx).
- O `finally` esconde o indicador de carregamento sempre.

Para um controle mais fino do status, você pode usar `Response<T>` em vez do tipo direto e checar `response.isSuccessful`.

## Gson x Moshi

Ambos convertem JSON em objetos:

- **Gson**: mais antigo, simples, muito usado.
- **Moshi**: moderno, mais rápido, melhor integração com Kotlin (nullabilidade e valores padrão). Recomendado para projetos novos.

A troca é só mudar o `ConverterFactory`:

```kotlin
.addConverterFactory(MoshiConverterFactory.create())
```

## Exibindo na Lista

Juntando tudo: buscamos os dados com Retrofit, tratamos erros e jogamos numa `RecyclerView` (do capítulo 5):

```kotlin
class UsuariosActivity : AppCompatActivity() {
    private val adapter = UsuarioAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_usuarios)

        binding.recycler.layoutManager = LinearLayoutManager(this)
        binding.recycler.adapter = adapter

        carregarUsuarios()
    }

    private fun carregarUsuarios() {
        lifecycleScope.launch {
            try {
                adapter.submitList(api.listarUsuarios())
            } catch (e: Exception) {
                Toast.makeText(this@UsuariosActivity, "Falha ao carregar", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```

Esse padrão — chamar a API numa corrotina e atualizar o adapter — é a espinha dorsal de qualquer app conectado.

## Atividades

- [ ] Adicione a permissão de internet e as dependências do Retrofit.
- [ ] Crie uma `data class` que represente o JSON de uma API pública (ex: JSONPlaceholder).
- [ ] Escreva uma interface com um endpoint `@GET` que retorne uma lista.
- [ ] Faça a chamada dentro de `lifecycleScope.launch` e logue o resultado.
- [ ] Exiba os dados em uma `RecyclerView`.
- [ ] Trate erros mostrando uma mensagem quando a requisição falhar.
