---
title: "APIs Nativas do Sistema"
---

# APIs Nativas do Sistema

Uma das vantagens do desenvolvimento nativo é o acesso completo aos recursos do aparelho: câmera, GPS, sensores, notificações. Mas com grande poder vem grande responsabilidade: o Android protege esses recursos com **permissões**.

## Permissões

Há dois tipos de permissão:

- **Normais**: concedidas automaticamente (ex: internet). Basta declarar no manifesto.
- **Perigosas**: envolvem privacidade (câmera, localização, contatos) e exigem que o usuário aprove **em tempo de execução (runtime)**.

Toda permissão começa declarada no `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Pedindo permissão em runtime

Desde o Android 6 (API 23), permissões perigosas precisam ser solicitadas em execução. Use a API moderna `ActivityResultContracts`:

```kotlin
private val pedirCamera = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { concedida ->
    if (concedida) {
        abrirCamera()
    } else {
        Toast.makeText(this, "Permissão negada", Toast.LENGTH_SHORT).show()
    }
}

private fun verificarCamera() {
    when {
        ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_GRANTED -> abrirCamera()
        else -> pedirCamera.launch(Manifest.permission.CAMERA)
    }
}
```

Sempre **verifique antes de usar** o recurso; o usuário pode revogar a permissão a qualquer momento.

## Câmera

A forma mais simples de tirar uma foto é delegar ao app de câmera do sistema via contrato pronto:

```kotlin
private val tirarFoto = registerForActivityResult(
    ActivityResultContracts.TakePicturePreview()
) { bitmap: Bitmap? ->
    bitmap?.let { binding.imagem.setImageBitmap(it) }
}

binding.botaoFoto.setOnClickListener {
    tirarFoto.launch(null)
}
```

Para controle total (foco, resolução, gravação), use a biblioteca **CameraX**, que simplifica muito a API de câmera de baixo nível.

## Localização / GPS

Para obter a localização, use o **FusedLocationProviderClient** dos Google Play Services — ele combina GPS, Wi-Fi e rede de forma eficiente.

```kotlin
dependencies {
    implementation("com.google.android.gms:play-services-location:21.3.0")
}
```

```kotlin
private val fusedClient = LocationServices.getFusedLocationProviderClient(this)

@SuppressLint("MissingPermission") // já verificamos a permissão antes
private fun obterLocalizacao() {
    fusedClient.lastLocation.addOnSuccessListener { local ->
        if (local != null) {
            Log.d("GPS", "Lat: ${local.latitude}, Lng: ${local.longitude}")
        }
    }
}
```

`lastLocation` retorna a última posição conhecida. Para acompanhar o movimento em tempo real, use `requestLocationUpdates` com um `LocationRequest`. Lembre de pedir a permissão `ACCESS_FINE_LOCATION` antes.

## Sensores

O Android expõe sensores físicos (acelerômetro, giroscópio, luz, proximidade) pelo `SensorManager`:

```kotlin
private lateinit var sensorManager: SensorManager

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
}

private val listener = object : SensorEventListener {
    override fun onSensorChanged(event: SensorEvent) {
        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]
        Log.d("Sensor", "x=$x y=$y z=$z")
    }
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}

override fun onResume() {
    super.onResume()
    val acelerometro = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    sensorManager.registerListener(listener, acelerometro, SensorManager.SENSOR_DELAY_NORMAL)
}

override fun onPause() {
    super.onPause()
    sensorManager.unregisterListener(listener)  // economiza bateria!
}
```

Sempre **registre no `onResume` e cancele no `onPause`** para não gastar bateria com a tela em segundo plano.

## Notificações

Notificações precisam de um **canal** (a partir do Android 8) e, desde o Android 13, da permissão `POST_NOTIFICATIONS` em runtime.

```kotlin
private fun criarCanal() {
    val canal = NotificationChannel(
        "canal_geral",
        "Notificações Gerais",
        NotificationManager.IMPORTANCE_DEFAULT
    )
    val gerenciador = getSystemService(NotificationManager::class.java)
    gerenciador.createNotificationChannel(canal)
}

private fun mostrarNotificacao() {
    val notificacao = NotificationCompat.Builder(this, "canal_geral")
        .setSmallIcon(R.drawable.ic_notificacao)
        .setContentTitle("Olá!")
        .setContentText("Esta é sua primeira notificação.")
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .build()

    NotificationManagerCompat.from(this).notify(1, notificacao)
}
```

## Intents para Recursos do Sistema

Em vez de reimplementar tudo, você pode **delegar** ações a outros apps via `Intent`:

```kotlin
// Abrir um site
startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://android.com")))

// Fazer uma ligação (discador)
startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:11999999999")))

// Compartilhar texto
val share = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Veja este app incrível!")
}
startActivity(Intent.createChooser(share, "Compartilhar via"))

// Enviar e-mail
startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:contato@exemplo.com")))
```

Esses **Intents implícitos** pedem ao sistema "quem sabe fazer isso?", e o usuário escolhe o app. É a forma idiomática de integrar com câmera, mapas, e-mail, telefone e mais.

## Atividades

- [ ] Declare e solicite a permissão de câmera em runtime usando `ActivityResultContracts`.
- [ ] Tire uma foto com `TakePicturePreview` e exiba o `Bitmap` em um `ImageView`.
- [ ] Obtenha e exiba a latitude/longitude com o `FusedLocationProviderClient`.
- [ ] Leia os valores do acelerômetro e mostre-os no Logcat, cancelando no `onPause`.
- [ ] Crie um canal e dispare uma notificação local.
- [ ] Use um Intent implícito para abrir um site e outro para compartilhar texto.
