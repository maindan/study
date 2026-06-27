---
title: "Ambiente e Projeto"
---

# Ambiente e Projeto

Antes de escrever uma linha de código, precisamos montar nosso ambiente de desenvolvimento Android. Esta é a base de tudo: instalar as ferramentas, entender o que cada uma faz e conhecer a estrutura de um projeto. Vamos com calma.

## Android Studio

O **Android Studio** é a IDE (Ambiente de Desenvolvimento Integrado) oficial do Google para criar apps Android. Ele é baseado no IntelliJ IDEA e já vem com quase tudo que você precisa: editor de código com autocomplete, depurador, emulador, ferramentas de design de UI e integração com o Gradle.

Baixe sempre a versão mais recente em [developer.android.com/studio](https://developer.android.com/studio). Em 2025/2026, as versões recebem nomes de animais (ex: "Ladybug", "Meerkat"). Use Kotlin como linguagem padrão — é a linguagem oficial recomendada pelo Google.

## SDK do Android

O **SDK (Software Development Kit)** é o conjunto de bibliotecas, ferramentas e APIs que permitem compilar apps para uma versão específica do Android. Cada versão do Android tem um número de **API level**:

| Android | API Level | Apelido |
|---------|-----------|---------|
| Android 14 | 34 | Upside Down Cake |
| Android 15 | 35 | Vanilla Ice Cream |
| Android 16 | 36 | (em desenvolvimento) |

Pelo **SDK Manager** (dentro do Android Studio, em *Settings > Languages & Frameworks > Android SDK*) você instala as plataformas e ferramentas. Dois conceitos importantes:

- **`compileSdk`**: a versão do SDK usada para compilar (use sempre a mais nova).
- **`minSdk`**: a versão mais antiga do Android que seu app suporta (ex: 24 = Android 7.0).
- **`targetSdk`**: a versão que você testou e garante compatibilidade (idealmente igual ao `compileSdk`).

## Gradle

O **Gradle** é o sistema de build do Android. Ele automatiza a compilação, gerencia dependências (bibliotecas externas) e gera o arquivo final do app (`.apk` ou `.aab`). Você descreve *o que* quer e o Gradle cuida do *como*.

Os arquivos de configuração principais ficam em `build.gradle.kts` (Kotlin DSL, o padrão moderno) ou `build.gradle` (Groovy, o antigo). Há dois:

- **build.gradle.kts (nível do projeto)**: configurações globais.
- **build.gradle.kts (nível do módulo `app`)**: configurações do seu app.

Exemplo de um `build.gradle.kts` de módulo:

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.exemplo.meuapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.exemplo.meuapp"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
}
```

Cada linha em `dependencies` adiciona uma biblioteca ao projeto. Para organizar versões em projetos maiores, usa-se o **Version Catalog** (arquivo `libs.versions.toml`), mas no começo o formato acima já basta.

## AVD e Emulador

O **AVD (Android Virtual Device)** é um celular Android virtual que roda no seu computador. Pelo **Device Manager** você cria um AVD escolhendo o modelo (ex: Pixel 8) e a imagem do sistema (uma versão do Android). Ao iniciar, abre um emulador onde você testa o app sem precisar de um aparelho físico.

Dica: prefira imagens com a marca "Google Play" e arquitetura compatível com seu PC para melhor desempenho. Habilite a aceleração por hardware (Intel HAXM ou o emulador baseado em ARM/Apple Silicon) se possível.

Você também pode rodar em um **dispositivo físico**: ative as *Opções do desenvolvedor* (toque 7 vezes em *Configurações > Sobre o telefone > Número da versão*) e ligue a **Depuração USB**.

## Estrutura de Pastas

Quando você cria um projeto, o Android Studio gera esta estrutura:

```
MeuApp/
├── app/
│   ├── build.gradle.kts          ← config do módulo
│   ├── src/
│   │   └── main/
│   │       ├── java/             ← seu código Kotlin
│   │       ├── res/              ← recursos (layouts, imagens, textos)
│   │       │   ├── layout/       ← arquivos XML de tela
│   │       │   ├── drawable/     ← imagens e ícones
│   │       │   ├── values/       ← strings.xml, colors.xml, themes.xml
│   │       │   └── mipmap/       ← ícones do app
│   │       └── AndroidManifest.xml
├── build.gradle.kts              ← config do projeto
├── settings.gradle.kts
└── gradle/
```

O **`AndroidManifest.xml`** é o "documento de identidade" do app: declara o nome, ícone, permissões e quais telas (Activities) existem. A pasta **`res/`** guarda tudo que não é código: layouts, cores, textos e imagens, separados por tipo.

## Atividades

- [ ] Instale o Android Studio e abra o SDK Manager para instalar a plataforma da API 35.
- [ ] Crie um AVD (ex: Pixel 8 com Android 15) no Device Manager e inicie o emulador.
- [ ] Crie um projeto vazio "Empty Views Activity" e localize os dois arquivos `build.gradle.kts`.
- [ ] Adicione uma dependência qualquer no `build.gradle.kts` do módulo e clique em "Sync Now".
- [ ] Abra o `AndroidManifest.xml` e identifique o nome do pacote e a Activity principal.
- [ ] Explore a pasta `res/` e abra os arquivos `strings.xml` e `colors.xml`.
