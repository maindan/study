---
title: "O que é o Android"
---

# O que é o Android

O **Android** é um sistema operacional baseado no kernel **Linux**, criado principalmente para dispositivos com tela sensível ao toque, como smartphones e tablets. Hoje ele é o sistema operacional mais usado no mundo, presente em bilhões de aparelhos.

## Um pouco de história

- **2003** — A empresa *Android Inc.* é fundada por Andy Rubin e outros, inicialmente pensando em câmeras digitais e depois em celulares.
- **2005** — O **Google** compra a Android Inc.
- **2007** — É anunciada a **Open Handset Alliance (OHA)**, um consórcio de empresas (Google, fabricantes de aparelhos, operadoras e fabricantes de chips) com o objetivo de criar padrões abertos para dispositivos móveis.
- **2008** — É lançado o primeiro celular Android comercial, o **HTC Dream (T-Mobile G1)**.

Desde então o Android evoluiu de um sistema apenas para celulares para uma plataforma que roda em muitos tipos de dispositivos.

## Google e Open Handset Alliance

O **Google** lidera o desenvolvimento do Android, mas o trabalho é apoiado pela **Open Handset Alliance**. A ideia central é ter um sistema **aberto**, que qualquer fabricante possa adaptar para o seu hardware, em vez de cada empresa criar um sistema fechado do zero.

## AOSP — o coração aberto do Android

O **AOSP (Android Open Source Project)** é a versão de código aberto do Android, mantida pelo Google. Qualquer pessoa pode baixar, estudar e modificar esse código.

É importante separar dois conceitos:

| Conceito | O que é |
| --- | --- |
| **AOSP** | O Android "puro", de código aberto, gratuito |
| **Google Mobile Services (GMS)** | Apps e serviços proprietários do Google (Play Store, Maps, Gmail, etc.) que exigem licenciamento |

Por isso existem aparelhos baseados em Android **sem** a Play Store (por exemplo, alguns dispositivos da Amazon e alguns aparelhos vendidos onde os serviços do Google não estão disponíveis).

## Versões e API levels

Cada versão do Android tem um **nome/número de versão** voltado ao usuário e um **API level** voltado aos desenvolvedores. O API level é um número inteiro que identifica o conjunto de recursos (APIs) disponíveis naquela versão.

| Versão Android | API level (aproximado) | Ano |
| --- | --- | --- |
| Android 10 | 29 | 2019 |
| Android 11 | 30 | 2020 |
| Android 12 | 31 / 32 | 2021 |
| Android 13 | 33 | 2022 |
| Android 14 | 34 | 2023 |
| Android 15 | 35 | 2024 |
| Android 16 | 36 | 2025 |

Quando você desenvolve um app, configura valores como:

- **`minSdk`** — o API level mínimo em que o app roda.
- **`targetSdk`** — o API level para o qual o app foi testado e otimizado.
- **`compileSdk`** — o API level usado para compilar.

```kotlin
android {
    defaultConfig {
        minSdk = 24       // Android 7.0
        targetSdk = 35    // Android 15
    }
}
```

> As versões antigas usavam nomes de doces (Cupcake, KitKat, Oreo, Pie). A partir do Android 10 o Google passou a usar apenas números na comunicação pública, embora ainda existam nomes internos de sobremesas.

## Ecossistema: onde o Android roda

Embora seja famoso pelos celulares, o Android (e variações dele) roda em muitos lugares:

- **Smartphones e tablets** — o uso mais comum.
- **Wear OS** — relógios e wearables.
- **Android TV / Google TV** — TVs e set-top boxes.
- **Android Automotive / Android Auto** — sistemas de carros.
- **Dispositivos embarcados e IoT** — quiosques, painéis, equipamentos.
- **Chromebooks** — muitos rodam apps Android.

## Por que isso importa para você, dev?

Entender que o Android é **aberto (AOSP)**, **fragmentado em várias versões/API levels** e **presente em muitos tipos de hardware** ajuda a tomar boas decisões: escolher o `minSdk` certo, testar em diferentes versões e não assumir que todo dispositivo tem a Play Store.

## Atividades

- [ ] Pesquise qual API level corresponde ao Android 14.
- [ ] Liste três empresas que fazem parte (ou já fizeram) da Open Handset Alliance.
- [ ] Explique com suas palavras a diferença entre AOSP e Google Mobile Services (GMS).
- [ ] Verifique no seu próprio celular qual versão do Android ele usa (Configurações > Sobre o telefone).
- [ ] Pesquise um exemplo de dispositivo que roda Android mas que NÃO é um smartphone.
- [ ] Pesquise o que significa "fragmentação do Android" e por que ela é um desafio para devs.
