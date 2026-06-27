---
title: "Seu Primeiro App"
---

# Seu Primeiro App

Agora que o ambiente está pronto, vamos criar e rodar nosso primeiro app. O objetivo aqui não é fazer algo bonito, e sim entender o ciclo completo: criar o projeto, conhecer a `MainActivity`, mostrar algo na tela, rodar no emulador e usar logs para depurar.

## Criando o Projeto

No Android Studio, clique em **New Project**. Você verá vários templates. Para começar, escolha **Empty Views Activity** (a abordagem clássica com XML). Mais à frente veremos o **Empty Activity** (com Jetpack Compose).

Preencha:

- **Name**: MeuPrimeiroApp
- **Package name**: com.exemplo.meuprimeiroapp (identificador único do app, geralmente no formato de domínio invertido)
- **Language**: Kotlin
- **Minimum SDK**: API 24 (cobre a grande maioria dos aparelhos)

Clique em **Finish** e aguarde o Gradle sincronizar.

## A MainActivity

Uma **Activity** representa uma tela do app. O template já cria a `MainActivity.kt`:

```kotlin
package com.exemplo.meuprimeiroapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

Vamos entender cada parte:

- **`class MainActivity : AppCompatActivity()`**: nossa tela herda de `AppCompatActivity`, que fornece compatibilidade com versões antigas do Android.
- **`onCreate(...)`**: o primeiro método chamado quando a tela é criada. É aqui que preparamos a interface.
- **`super.onCreate(...)`**: chama a implementação da classe pai (sempre obrigatório).
- **`setContentView(R.layout.activity_main)`**: define qual layout XML será exibido na tela.

## O R e o setContentView

O **`R`** é uma classe gerada automaticamente pelo Android que dá acesso aos recursos. `R.layout.activity_main` aponta para o arquivo `res/layout/activity_main.xml`. Já `R.string.app_name` apontaria para um texto, e `R.id.meuBotao` para um elemento da tela.

O **`setContentView`** "infla" (carrega) o XML e o coloca na tela. Vamos editar o layout em `res/layout/activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="16dp">

    <TextView
        android:id="@+id/textoSaudacao"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Olá, Android!"
        android:textSize="24sp" />

</LinearLayout>
```

Esse XML mostra um texto centralizado na tela. Não se preocupe com os detalhes dos layouts agora — veremos no próximo capítulo.

## Rodando no Emulador

Com o emulador aberto (ou um celular conectado), selecione o dispositivo na barra superior do Android Studio e clique no botão **Run** (o triângulo verde) ou pressione `Shift + F10`.

O que acontece nos bastidores:

1. O Gradle compila seu código e os recursos.
2. Gera um arquivo `.apk`.
3. Instala o `.apk` no emulador.
4. Abre a `MainActivity`.

Após alguns segundos, você verá "Olá, Android!" na tela. Parabéns, seu primeiro app está rodando!

## Logs para Depuração

Durante o desenvolvimento, você vai querer "espiar" o que está acontecendo no código. O **Logcat** é a janela do Android Studio que mostra mensagens de log do app.

Para escrever no log, use a classe `Log`:

```kotlin
import android.util.Log

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d("MainActivity", "A tela foi criada!")
        Log.i("MainActivity", "Mensagem informativa")
        Log.e("MainActivity", "Algo deu errado")
    }
}
```

Os níveis de log mais comuns:

| Método | Nível | Quando usar |
|--------|-------|-------------|
| `Log.v` | Verbose | Detalhes muito específicos |
| `Log.d` | Debug | Informações de depuração (mais comum) |
| `Log.i` | Info | Eventos importantes |
| `Log.w` | Warning | Algo suspeito, mas não fatal |
| `Log.e` | Error | Erros de fato |

O primeiro parâmetro é a **tag** (um rótulo para filtrar mensagens) e o segundo é a mensagem. Abra o **Logcat** (aba inferior) e filtre pela tag "MainActivity" para ver suas mensagens.

Diferente do `println()`, o `Log` é o jeito padrão no Android porque permite filtrar por nível, tag e processo, e não aparece no console quando você compila para produção (se configurado).

## Atividades

- [ ] Crie um projeto "Empty Views Activity" em Kotlin com minSdk 24.
- [ ] Altere o texto do `TextView` para uma mensagem personalizada.
- [ ] Rode o app no emulador e confirme que o texto aparece.
- [ ] Adicione três chamadas de `Log.d` dentro do `onCreate` com mensagens diferentes.
- [ ] Abra o Logcat e filtre pela sua tag para encontrar as mensagens.
- [ ] Mude a cor do texto adicionando `android:textColor="#FF6200EE"` no XML e rode de novo.
