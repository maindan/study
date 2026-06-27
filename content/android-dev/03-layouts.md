---
title: "Layouts e UI"
---

# Layouts e UI

A interface do usuário (UI) é como o app se apresenta. No Android, há duas abordagens: a clássica com **XML** e a moderna com **Jetpack Compose**. Vamos dominar a base com XML e depois conhecer o Compose.

## View e ViewGroup

Tudo na tela é uma **View** ou um **ViewGroup**:

- **View**: um elemento visual único, como um botão (`Button`), texto (`TextView`) ou campo de entrada (`EditText`).
- **ViewGroup**: um contêiner que organiza outras Views. Os layouts (`LinearLayout`, `ConstraintLayout`) são ViewGroups.

A tela é uma árvore: o ViewGroup raiz contém Views e outros ViewGroups, formando a hierarquia.

## Atributos comuns

Toda View tem atributos que controlam tamanho, posição e aparência. Os dois mais importantes:

- **`android:layout_width`** e **`android:layout_height`**: aceitam `match_parent` (ocupa todo o espaço disponível), `wrap_content` (apenas o necessário) ou um valor fixo em `dp`.
- **`android:id`**: identifica a View para acessá-la no código, no formato `@+id/nome`.
- **`android:padding`**: espaço interno; **`android:layout_margin`**: espaço externo.

## dp e sp

No Android, evitamos pixels brutos por causa das diferentes densidades de tela:

- **dp (density-independent pixels)**: unidade para dimensões e espaçamentos. Garante tamanho físico consistente em qualquer tela.
- **sp (scale-independent pixels)**: usado **apenas para texto**. Respeita o tamanho de fonte que o usuário configurou no sistema (acessibilidade).

Regra simples: **dp para tudo, sp para tamanho de texto**.

## LinearLayout

O `LinearLayout` empilha as Views em uma direção: vertical ou horizontal.

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Nome:"
        android:textSize="18sp" />

    <EditText
        android:id="@+id/campoNome"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Digite seu nome" />

    <Button
        android:id="@+id/botaoEnviar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Enviar" />
</LinearLayout>
```

O atributo `android:weight` permite distribuir o espaço proporcionalmente entre filhos — útil para dividir a tela.

## ConstraintLayout

O `ConstraintLayout` é o layout mais poderoso e recomendado. Em vez de empilhar, você posiciona cada View com **restrições (constraints)** em relação a outras Views ou às bordas do layout. Isso cria hierarquias planas (mais rápidas) e telas responsivas.

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/botaoCentro"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Centro"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

As quatro constraints (top, bottom, start, end ligadas ao `parent`) centralizam o botão. Você pode editar visualmente no **Layout Editor** arrastando as âncoras.

## Acessando Views no código

### findViewById (antigo)

```kotlin
val botao = findViewById<Button>(R.id.botaoEnviar)
botao.text = "Clique aqui"
```

Funciona, mas é verboso e pode falhar em tempo de execução se o id estiver errado.

### ViewBinding (recomendado)

O **ViewBinding** gera uma classe automática para cada layout, com referências seguras e tipadas. Ative no `build.gradle.kts`:

```kotlin
android {
    buildFeatures {
        viewBinding = true
    }
}
```

E use na Activity:

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.botaoEnviar.text = "Clique aqui"
        binding.campoNome.hint = "Seu nome aqui"
    }
}
```

O nome da classe vem do arquivo: `activity_main.xml` vira `ActivityMainBinding`. Sem strings mágicas, sem casts, sem `NullPointerException` por id errado.

## Introdução ao Jetpack Compose

O **Jetpack Compose** é o kit de UI moderno do Android, totalmente em Kotlin, sem XML. Você descreve a interface com funções `@Composable` e ela reage automaticamente a mudanças de estado (UI declarativa).

```kotlin
import androidx.compose.material3.Text
import androidx.compose.material3.Button
import androidx.compose.runtime.*

@Composable
fun Saudacao() {
    var contador by remember { mutableStateOf(0) }

    Button(onClick = { contador++ }) {
        Text("Cliquei $contador vezes")
    }
}
```

Quando `contador` muda, o Compose **recompõe** automaticamente apenas o que mudou. Não há `findViewById` nem XML. O Compose é o futuro do Android, mas entender XML ainda é essencial — muitos projetos usam os dois.

## Atividades

- [ ] Crie uma tela com `LinearLayout` contendo um `TextView`, um `EditText` e um `Button`.
- [ ] Recrie a mesma tela usando `ConstraintLayout` com constraints.
- [ ] Ative o ViewBinding no projeto e acesse o `Button` por ele.
- [ ] Use `weight` em um `LinearLayout` horizontal para dividir a largura em três partes iguais.
- [ ] Troque um tamanho de texto de `dp` para `sp` e explique a diferença em um comentário.
- [ ] Crie um `@Composable` simples que exibe um `Text` e um `Button`.
