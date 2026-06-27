---
title: "Processos e Segurança"
---

# Processos e Segurança

A segurança do Android começa em um princípio simples e poderoso: **cada aplicativo é isolado dos outros**. Esse isolamento é chamado de **sandbox** ("caixa de areia") e é construído em cima de mecanismos do próprio kernel Linux.

## Cada app é um processo e um usuário Linux

Lembre que o Android é baseado em Linux, onde cada **usuário** tem permissões próprias e não consegue mexer nos arquivos de outro usuário sem autorização.

O Android usa isso de forma criativa: na instalação, **cada app recebe um ID de usuário (UID) único do Linux**. Assim:

- Os arquivos de um app pertencem só a ele.
- Um app **não** consegue ler diretamente a memória ou os arquivos de outro app.
- Cada app roda no seu **próprio processo**, com sua própria instância do runtime ART.

Esse é o **Application Sandbox**: o isolamento é imposto pelo kernel, então mesmo um app mal-intencionado fica "preso" na sua caixa.

```
App A  -> UID 10052 -> processo próprio -> arquivos próprios
App B  -> UID 10078 -> processo próprio -> arquivos próprios
```

## Permissões

Como os apps são isolados, eles precisam pedir **permissão** para acessar recursos sensíveis ou dados de fora da sua sandbox (câmera, localização, contatos, internet, etc.).

As permissões são declaradas no arquivo **`AndroidManifest.xml`**:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

Existem categorias importantes:

| Tipo | Como é concedida |
| --- | --- |
| **Normais** | Concedidas automaticamente na instalação (baixo risco) |
| **Perigosas (runtime)** | O usuário precisa autorizar em tempo de execução, com um diálogo |
| **De assinatura** | Concedidas só a apps assinados com o mesmo certificado |

Desde o Android 6.0, as permissões **perigosas** são pedidas **durante o uso** do app, e não mais só na instalação. O usuário pode conceder ou negar a qualquer momento nas Configurações.

## APK e assinatura

Um app Android é distribuído como um arquivo **APK (Android Package)** — um pacote compactado que contém o código compilado, recursos, o manifesto e os assets. (Na Play Store também se usa o formato **AAB / Android App Bundle**, que gera APKs otimizados para cada dispositivo.)

Todo APK precisa ser **assinado digitalmente** com um certificado antes de ser instalado. A assinatura garante:

- **Identidade do autor** — prova quem publicou o app.
- **Integridade** — garante que o APK não foi alterado depois de assinado.
- **Atualizações seguras** — uma atualização só é aceita se for assinada com a **mesma chave** da versão anterior. Isso impede que outra pessoa publique uma "atualização" falsa do seu app.

> Por isso a chave de assinatura (keystore) deve ser guardada com muito cuidado: perdê-la pode significar não conseguir mais atualizar o app.

## Binder e IPC

Como cada app vive isolado no seu processo, como dois processos conversam quando precisam? Através de **IPC (Inter-Process Communication)**.

No Android, o mecanismo principal de IPC é o **Binder**, um componente do kernel. Ele permite que um processo chame métodos em outro processo de forma controlada e segura, como se fosse uma chamada local.

O Binder é a base de muitos recursos do Android:

- Comunicação entre um app e os **serviços do sistema** (por exemplo, pedir a localização ao serviço de GPS).
- **Services** vinculados (bound services) e **AIDL**.
- Verificação de **identidade**: o Binder permite saber o UID/PID de quem está chamando, o que ajuda a checar permissões.

```
App  --(chamada Binder)-->  Serviço do Sistema
                            (verifica permissão pelo UID)
```

## Zygote

Iniciar uma máquina virtual ART do zero para cada app seria lento e consumiria muita memória. Para resolver isso, o Android usa o **Zygote**.

O **Zygote** é um processo especial iniciado durante o boot do sistema. Ele já carrega na memória:

- O runtime ART.
- As classes e bibliotecas mais comuns do framework.

Quando um novo app precisa ser iniciado, o sistema **clona (faz fork)** o Zygote. O novo processo já nasce com tudo pré-carregado, então:

- O app **inicia mais rápido**.
- A memória das partes comuns é **compartilhada** entre processos (graças ao copy-on-write), economizando RAM.

```
Boot -> inicia Zygote (ART + libs pré-carregadas)
            |
            +-- fork --> processo do App A
            +-- fork --> processo do App B
```

## Resumo

A segurança do Android se apoia em camadas que se reforçam: **sandbox por UID Linux**, **permissões** explícitas, **assinatura de APK** e **IPC controlado pelo Binder**, com o **Zygote** acelerando a criação dos processos. Juntos, esses mecanismos isolam os apps e protegem o usuário.

## Atividades

- [ ] Explique com suas palavras o que é o "Application Sandbox" do Android.
- [ ] Pesquise a diferença entre permissões "normais" e "perigosas" e dê um exemplo de cada.
- [ ] Pesquise o que é uma keystore e por que ela não pode ser perdida.
- [ ] Descreva o papel do Binder na comunicação entre processos.
- [ ] Explique por que o Zygote ajuda os apps a iniciarem mais rápido.
- [ ] Pesquise a diferença entre os formatos APK e AAB (Android App Bundle).
