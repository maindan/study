---
title: "Arquitetura em Camadas"
---

# Arquitetura em Camadas

O Android é organizado em **camadas (layers)**, cada uma com uma responsabilidade específica. As camadas de cima dependem das de baixo, mas ficam isoladas dos detalhes mais técnicos. Isso facilita a manutenção e permite que fabricantes adaptem o sistema ao seu hardware.

Da camada mais baixa para a mais alta:

```
+------------------------------------------+
|         Aplicativos (Apps)               |  <- você usa / desenvolve
+------------------------------------------+
|   Java/Kotlin API Framework              |  <- APIs do sistema
+------------------------------------------+
|  Bibliotecas nativas (C/C++)  |  ART     |  <- runtime + libs
+------------------------------------------+
|   HAL (Hardware Abstraction Layer)       |  <- ponte para o hardware
+------------------------------------------+
|         Kernel Linux                     |  <- base do sistema
+------------------------------------------+
```

## 1. Kernel Linux

Na base de tudo está o **kernel Linux**. Ele é o "coração" do sistema operacional e cuida das tarefas mais fundamentais:

- **Gerenciamento de processos e memória**
- **Drivers de hardware** (câmera, tela, Wi-Fi, Bluetooth, áudio)
- **Segurança** (cada app é tratado como um usuário Linux separado)
- **Gerenciamento de energia**

O Android adiciona ao kernel alguns componentes próprios, como o **Binder** (para comunicação entre processos) e mecanismos de economia de energia (como o *low memory killer*).

## 2. HAL — Hardware Abstraction Layer

A **HAL (Camada de Abstração de Hardware)** é uma ponte entre o hardware físico e as camadas de software de cima. Ela define **interfaces padronizadas** para componentes como câmera, sensores, áudio e Bluetooth.

A vantagem: o framework do Android conversa sempre com a mesma interface, independente da marca do componente. O fabricante implementa a HAL específica do seu chip, e o resto do sistema não precisa saber os detalhes.

## 3. Runtime ART (e o antigo Dalvik)

Todo app Android escrito em Java/Kotlin é compilado para um formato de **bytecode** e executado por um *runtime* (ambiente de execução).

- **Dalvik** — o runtime antigo (até o Android 4.4). Usava **JIT (Just-In-Time)**: traduzia o código para instruções da máquina **durante** a execução.
- **ART (Android Runtime)** — substituiu o Dalvik a partir do Android 5.0. Usa principalmente **AOT (Ahead-Of-Time)**: parte do código é compilada **antes** de rodar, no momento da instalação ou em segundo plano. Versões modernas combinam **AOT + JIT + perfis** para equilibrar velocidade e espaço.

| | Dalvik | ART |
| --- | --- | --- |
| Compilação | JIT (em execução) | AOT + JIT (híbrido) |
| Início do app | Mais lento | Mais rápido |
| Uso da bateria/CPU | Maior em execução | Menor em execução |
| Desde | Android antigo | Android 5.0+ |

Cada app roda na sua **própria instância** do ART, dentro do seu próprio processo — o que reforça o isolamento entre apps.

## 4. Bibliotecas nativas (C/C++)

Muitas funções do sistema são implementadas em **C/C++** por questões de desempenho. Exemplos:

- **OpenGL ES / Vulkan** — gráficos.
- **Media frameworks** — áudio e vídeo.
- **SQLite** — banco de dados local.
- **WebKit/Chromium** — renderização de páginas web.
- **libc (Bionic)** — biblioteca C do Android.

Desenvolvedores também podem escrever código nativo usando o **NDK (Native Development Kit)** quando precisam de máxima performance (jogos, processamento pesado).

## 5. Java/Kotlin API Framework

Esta é a camada com a qual a maioria dos desenvolvedores trabalha diretamente. Ela oferece as **APIs de alto nível** em Java/Kotlin para construir apps, como:

- **Activity Manager** — gerencia o ciclo de vida das telas (Activities).
- **View System** — componentes de interface (botões, listas, etc.).
- **Content Providers** — compartilhamento de dados entre apps.
- **Notification Manager** — notificações.
- **Resource Manager** — textos, imagens, layouts.

Quando você chama uma API do framework, ela aciona, por baixo dos panos, as bibliotecas nativas e o kernel.

## 6. Aplicativos (Apps)

No topo estão os **aplicativos** — tanto os que já vêm com o sistema (telefone, contatos, navegador) quanto os instalados pelo usuário. Do ponto de vista do Android, **todos os apps usam as mesmas APIs do framework**; não há tratamento especial para apps do sistema só por estarem ali.

## Resumo

Cada camada esconde a complexidade da camada abaixo. Você programa apps usando o **Framework** em Kotlin; ele usa **bibliotecas nativas** e o **ART**; estes falam com a **HAL**; e a HAL conversa com o **kernel Linux**, que controla o hardware de verdade.

## Atividades

- [ ] Desenhe (em papel ou ferramenta) a pilha de camadas do Android, de baixo para cima.
- [ ] Pesquise a diferença entre compilação AOT e JIT e dê um exemplo de cada.
- [ ] Explique com suas palavras para que serve a HAL.
- [ ] Pesquise o que é o NDK e em que situações vale a pena usá-lo.
- [ ] Liste três bibliotecas nativas do Android e diga para que cada uma serve.
- [ ] Descreva o papel do kernel Linux dentro do Android.
