# PoliticaBR — Arquitetura do site

Plataforma de educação cívica sobre os **cargos eletivos** e os **três poderes** do Brasil.
São duas frentes: este **site de referência** e **reels curtos** para redes sociais que
apontam de volta para o site. **Público-alvo:** público geral, linguagem acessível, sem
juridiquês. **Ordem de produção:** o site vem primeiro; os reels, depois, usando o site
como referência (cada vídeo termina com "entenda o resto no link").

---

## Princípio central: conteúdo como dado

O conteúdo é modelado como **dados estruturados** (coleções), e as páginas são **geradas a
partir deles** — não escritas uma a uma na mão. Isso garante:

- **Correção única:** ajustou um número num cargo, a página atualiza sozinha.
- **Reuso nos reels:** o roteiro de cada vídeo sai do mesmo registro da ficha.
- **Consistência por construção:** todos os cargos têm os mesmos campos, validados no build.

O esquema concreto está em [`src/content.config.ts`](./src/content.config.ts).

---

## Modelo de conteúdo

**Poder** (3 registros) — Executivo, Legislativo, Judiciário. Campos: `nome`, `funcao`, `cor`, `ordem`.

**Cargo** (7 registros) — as fichas, o coração do site. Campos: `nome`, `poder` (→ Poder),
`esfera` (federal/estadual/municipal), `sistema` (majoritário/proporcional), `resumo`,
`oQueE`, `mandatoAnos`, `reeleicao`, `idadeMinima`, `nacionalidade`, `requisitos`,
`atribuicoes`, `limites`, `ganchoVideo`, `reelUrl` (vazio no começo), `conceitos` (→ Conceito), `ordem`.

**Conceito** (glossário) — `termo`, `definicao`. Ex.: quociente eleitoral, segundo turno, federação, voto de legenda.

**Mecanismo** (Módulo 3, "como se vota") — `titulo`, `resumo` + texto livre no corpo. Ex.: os dois ciclos, turno único x segundo turno, a Justiça Eleitoral.

Os 7 cargos: Presidente, Senador, Deputado Federal, Governador, Deputado Estadual, Prefeito, Vereador.

---

## Mapa de páginas

- **Home — "o mapa do sistema":** visão geral em 30s + diagrama dos 3 poderes; página que converte quem vem dos reels.
- **Os 3 Poderes:** uma seção por poder, com o diagrama de freios e contrapesos.
- **Cargos:** índice em grid **filtrável por esfera e por poder** + 7 páginas de ficha geradas do modelo.
- **Como se vota:** o Módulo 3 (ciclos, majoritário x proporcional, turnos, Justiça Eleitoral, partidos/federações).
- **Glossário:** os conceitos, com links de ida e volta para as fichas.
- **Sobre / Fontes:** a página da credibilidade — explica o projeto e cita as fontes oficiais.

**Navegação em teia, não linear:** a ficha do Deputado linka para o conceito "quociente
eleitoral"; o diagrama da home é clicável para cada poder; "como se vota" referencia os
cargos afetados. O visitante entra por qualquer ponto (muitos por um reel específico) e
navega para o resto.

---

## Stack

- **Astro** — gerador de site estático. Tem coleções de conteúdo (encaixam no modelo acima),
  manda zero JS por padrão (site rápido) e é ótimo para **SEO** — importante porque muita
  gente vai cair no site pesquisando "o que faz um vereador".
- **Cloudflare Pages** — hospedagem gratuita; terreno já conhecido.
- **Banco de dados: nenhum no MVP.** Postgres/Supabase entra só quando houver recursos
  **dinâmicos** (comentários, contas, quiz, estatísticas). Aí o site estático passa a
  consumir uma API. Começar estático e crescer para dinâmico não gera retrabalho.

### Estrutura de pastas sugerida

```
src/
  content.config.ts          # o esquema (fonte única)
  content/
    poderes/                 # executivo.md, legislativo.md, judiciario.md
    cargos/                  # presidente.md, senador.md, ... (7)
    conceitos/               # quociente-eleitoral.md, ...
    mecanismos/              # dois-ciclos.md, turnos.md, ...
  pages/
    index.astro              # home
    poderes/[...slug].astro
    cargos/index.astro       # índice filtrável
    cargos/[...slug].astro   # ficha
    como-se-vota/index.astro
    glossario.astro
    sobre.astro
  components/
  layouts/
```

---

## Fluxo site → reels

Cada ficha tem `reelUrl`, vazio no início. Quando o vídeo existir, preenche-se o campo e a
página passa a exibir o reel. O **roteiro do vídeo é derivado dos campos da ficha** (sobretudo
`ganchoVideo`), mantendo o princípio de fonte única.

---

## Fases

1. **MVP estático:** esquema + 7 fichas + 3 poderes + "como se vota" + glossário + sobre/fontes.
2. **Polimento visual e SEO.**
3. **(Opcional) Recursos dinâmicos** com Postgres.

---

## Fontes e credibilidade

Num projeto sobre política, a página **Sobre / Fontes** é escudo contra acusação de viés e
âncora de confiança. Fontes base: **Constituição de 1988**, **TSE**, sites da **Câmara**,
**Senado** e assembleias. Os números que mudam a cada eleição — número de deputados,
cláusula de desempenho, valores do fundo eleitoral — devem ser **conferidos em fonte oficial
antes de publicar**, nunca de memória.

---

## Exemplo de ficha preenchida

`src/content/cargos/presidente.md`:

```md
---
nome: Presidente da República
poder: executivo
esfera: federal
sistema: majoritario
resumo: Chefe do Executivo federal, eleito por voto majoritário com possível segundo turno.
oQueE: Acumula chefe de governo (comanda a administração do país) e chefe de Estado (representa o Brasil).
mandatoAnos: 4
reeleicao: uma
idadeMinima: 35
nacionalidade: nato
atribuicoes:
  - Comanda a administração federal e nomeia ministros
  - Comandante supremo das Forças Armadas
  - Sanciona ou veta leis; edita medidas provisórias e decretos
  - Indica ministros do STF (com aval do Senado)
limites: Impeachment julgado pelo Senado; fiscalização do Congresso e do TCU.
ganchoVideo: "3 coisas que você acha que o presidente controla — mas não controla."
conceitos:
  - segundo-turno
  - maioria-absoluta
ordem: 1
---

Texto opcional em markdown para a página (aprofundamento).
```
