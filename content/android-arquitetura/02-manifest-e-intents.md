---
title: "Manifest e Intents"
---

# Manifest e Intents

Dois pilares conectam os componentes de um app Android: o **AndroidManifest.xml**, que descreve o app para o sistema, e os **Intents**, que são as "mensagens" usadas para iniciar componentes e passar dados entre eles.

## AndroidManifest.xml

O `AndroidManifest.xml` é o "documento de identidade" do app. Ele fica na raiz do módulo e informa ao sistema operacional tudo o que ele precisa saber **antes** de executar qualquer código:

- Quais componentes existem (Activities, Services, Receivers, Providers).
- Quais permissões o app solicita.
- Recursos de hardware exigidos (câmera, GPS).
- O ícone, o nome e o tema do app.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.exemplo.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.App">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service android:name=".MusicService" />
    </application>
</manifest>
```

### Declaração de componentes e permissões

- Cada componente é declarado com uma tag (`<activity>`, `<service>`, etc.) dentro de `<application>`.
- **Permissões** são declaradas com `<uses-permission>`. Permissões consideradas perigosas (câmera, localização, contatos) também precisam ser **solicitadas em tempo de execução**.
- O atributo `android:exported` define se outros apps podem iniciar aquele componente. A partir do Android 12, declará-lo é **obrigatório** para componentes com `intent-filter`.

```kotlin
// Solicitando permissão de câmera em runtime (API moderna)
val launcher = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { concedida ->
    if (concedida) abrirCamera()
}
launcher.launch(Manifest.permission.CAMERA)
```

## Intents

Um **Intent** é um objeto de mensagem usado para solicitar uma ação a outro componente. Com ele você abre uma tela, inicia um service, dispara um broadcast ou pede a outro app que faça algo (abrir um link, compartilhar um texto).

Existem dois tipos: **explícito** e **implícito**.

### Intent explícito

Você diz **exatamente** qual componente deve ser iniciado, indicando a classe. É o que usamos para navegar dentro do próprio app.

```kotlin
val intent = Intent(this, DetalhesActivity::class.java)
startActivity(intent)
```

### Intent implícito

Você descreve a **ação desejada**, sem dizer qual app deve executá-la. O sistema procura todos os apps capazes de lidar com aquela ação e, se houver mais de um, deixa o usuário escolher.

```kotlin
// Abrir uma página web em qualquer navegador
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://developer.android.com"))
startActivity(intent)

// Compartilhar um texto
val compartilhar = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Olá do meu app!")
}
startActivity(Intent.createChooser(compartilhar, "Compartilhar via"))
```

| Tipo | O que define | Uso típico |
|---|---|---|
| Explícito | A classe exata | Navegar dentro do app |
| Implícito | A ação/categoria | Abrir link, compartilhar, ligar |

### Intent Filters

Um **intent-filter** declara, no Manifest, quais Intents implícitos um componente é capaz de tratar. É assim que sua Activity aparece, por exemplo, na lista de apps que podem abrir um tipo de arquivo ou um link.

```xml
<activity android:name=".VisualizadorActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:scheme="https" android:host="meusite.com" />
    </intent-filter>
</activity>
```

O filtro acima faz a Activity responder a links `https://meusite.com` (conceito por trás de **deep links**).

## Passando dados com extras

Para enviar dados de um componente a outro, use **extras** — pares chave/valor anexados ao Intent.

```kotlin
// Activity de origem: enviando dados
val intent = Intent(this, DetalhesActivity::class.java).apply {
    putExtra("usuario_id", 42)
    putExtra("nome", "Maria")
}
startActivity(intent)
```

```kotlin
// Activity de destino: recebendo dados
class DetalhesActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val id = intent.getIntExtra("usuario_id", -1)
        val nome = intent.getStringExtra("nome")
        // Usa os dados recebidos
    }
}
```

Para objetos complexos, faça a classe implementar `Parcelable` (recomendado no Android) e passe o objeto inteiro como extra.

## Resumo

- O **Manifest** descreve componentes e permissões antes da execução.
- **Intents explícitos** iniciam um componente conhecido; **implícitos** descrevem uma ação.
- **Intent filters** declaram o que um componente sabe tratar.
- **Extras** carregam dados entre componentes.

## Atividades
- [ ] Crie duas Activities e navegue entre elas com um Intent explícito passando um extra.
- [ ] Faça um botão que abra uma URL usando um Intent implícito (`ACTION_VIEW`).
- [ ] Implemente o compartilhamento de texto com `ACTION_SEND` e `createChooser`.
- [ ] Declare uma permissão perigosa no Manifest e solicite-a em runtime.
- [ ] Configure um intent-filter de deep link e teste abrir um link que caia no seu app.
- [ ] Receba um objeto `Parcelable` em uma Activity de destino.
