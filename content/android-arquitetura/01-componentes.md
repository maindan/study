---
title: "Componentes do App"
---

# Componentes do App

No Android, um aplicativo não é apenas uma tela com código. Ele é montado a partir de **componentes** bem definidos, cada um com um papel específico e um ciclo de vida próprio gerenciado pelo sistema operacional. Entender esses componentes é a base de tudo o que você fará como desenvolvedor Android.

Existem **quatro componentes fundamentais**:

| Componente | Responsabilidade principal | Tem interface? |
|---|---|---|
| Activity | Tela com a qual o usuário interage | Sim |
| Service | Trabalho em segundo plano, sem UI | Não |
| BroadcastReceiver | Reagir a eventos do sistema ou do app | Não |
| ContentProvider | Compartilhar dados entre apps | Não |

Todos eles precisam ser declarados no `AndroidManifest.xml` (com exceção de alguns BroadcastReceivers registrados em tempo de execução).

## Activity

A **Activity** representa uma única tela com a qual o usuário interage. Abrir a lista de e-mails, escrever uma mensagem, ver configurações — cada uma dessas telas costuma ser uma Activity.

A Activity tem um **ciclo de vida** controlado pelo sistema. Métodos como `onCreate`, `onStart`, `onResume`, `onPause`, `onStop` e `onDestroy` são chamados conforme a tela aparece, fica em segundo plano ou é fechada.

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // Inicializa a tela aqui
    }

    override fun onResume() {
        super.onResume()
        // A tela está visível e em primeiro plano
    }
}
```

**Quando usar:** sempre que precisar de uma tela visível para o usuário. Hoje, com Jetpack Compose, é comum ter poucas Activities (às vezes uma só) e navegar entre telas usando composables.

## Service

O **Service** executa operações de longa duração em segundo plano, **sem interface de usuário**. Exemplos: tocar música enquanto o usuário usa outro app, sincronizar dados, fazer um upload grande.

Existem tipos importantes:

- **Foreground Service**: tarefas que o usuário percebe (música, navegação GPS). Exige uma notificação visível.
- **Background Service**: tarefas sem percepção direta. Hoje é bastante restrito pelo sistema para economizar bateria.
- **Bound Service**: outros componentes se "conectam" a ele para interagir.

```kotlin
class MusicService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Inicia a reprodução de música
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
```

**Quando usar:** trabalho contínuo que deve seguir mesmo sem o usuário olhando a tela. **Importante:** para a maioria das tarefas em segundo plano modernas (sincronização, agendamento), prefira o **WorkManager** em vez de Services manuais.

## BroadcastReceiver

O **BroadcastReceiver** permite que o app **reaja a eventos** — do sistema ou de outros apps. Exemplos de eventos: bateria fraca, conexão com a internet mudou, o dispositivo terminou de iniciar.

```kotlin
class ConnectivityReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == ConnectivityManager.CONNECTIVITY_ACTION) {
            // A conectividade de rede mudou
        }
    }
}
```

Pode ser registrado de duas formas:

- **Estático** (no Manifest): para eventos que devem ser captados mesmo com o app fechado. Hoje há muitas restrições.
- **Dinâmico** (em código, com `registerReceiver`): ativo apenas enquanto o componente que o registrou está vivo.

**Quando usar:** responder a mudanças de estado do dispositivo ou comunicar eventos. Para comunicação interna ao app, prefira soluções como `LiveData`, `StateFlow` ou `LocalBroadcastManager` (legado).

## ContentProvider

O **ContentProvider** gerencia o acesso a um conjunto estruturado de dados e permite **compartilhá-los entre apps** de forma segura, por meio de URIs (`content://`).

Você usa um ContentProvider toda vez que lê os contatos, a agenda ou a galeria do dispositivo:

```kotlin
val cursor = contentResolver.query(
    ContactsContract.Contacts.CONTENT_URI,
    null, null, null, null
)
```

**Quando usar:** quando precisa expor dados do seu app para outros apps, ou consumir dados de provedores do sistema. Para dados internos do próprio app, normalmente você usa **Room** diretamente, sem criar um ContentProvider.

## Resumo

- **Activity** = tela (com UI e ciclo de vida).
- **Service** = trabalho em segundo plano (sem UI).
- **BroadcastReceiver** = reage a eventos.
- **ContentProvider** = compartilha dados entre apps.

Cada componente é um **ponto de entrada** pelo qual o sistema (ou outro app) pode iniciar o seu aplicativo.

## Atividades
- [ ] Crie um projeto novo e identifique a Activity inicial declarada no Manifest.
- [ ] Adicione logs em `onCreate`, `onResume` e `onStop` e observe o ciclo de vida ao girar a tela.
- [ ] Implemente um BroadcastReceiver dinâmico que detecte mudanças de conectividade.
- [ ] Escreva, com suas palavras, quando você usaria um Service em vez de WorkManager.
- [ ] Use o `contentResolver` para listar os contatos do dispositivo (peça a permissão necessária).
