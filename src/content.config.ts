// src/content.config.ts
// =============================================================================
// PoliticaBR — Esquema de conteúdo (a "fonte única" do site).
//
// Cada coleção é um conjunto de dados estruturados. As páginas do site são
// GERADAS a partir daqui: você preenche os arquivos de conteúdo (um por cargo,
// um por poder, etc.) e o Astro monta as páginas automaticamente.
//
// Vantagem no seu estilo de trabalho (dados > páginas na mão):
//   - corrigiu um número num cargo? a página atualiza sozinha;
//   - o roteiro de cada reel sai do mesmo registro (campo `ganchoVideo`);
//   - a consistência (todos os cargos com os mesmos campos) é garantida pelo
//     esquema, validado em tempo de build pelo Zod.
// =============================================================================

import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// -----------------------------------------------------------------------------
// PODERES — Executivo, Legislativo, Judiciário (3 registros)
// Arquivo: src/content/poderes/executivo.md  (o "id" é o nome do arquivo)
// -----------------------------------------------------------------------------
const poderes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/poderes' }),
  schema: z.object({
    nome: z.string(),
    funcao: z.string(),          // o que o poder faz, em uma frase
    cor: z.string().optional(),  // cor de identidade para a UI (ex.: '#D85A30')
    ordem: z.number(),           // ordem de exibição
  }),
});

// -----------------------------------------------------------------------------
// CONCEITOS — glossário (quociente eleitoral, segundo turno, federação...)
// Arquivo: src/content/conceitos/quociente-eleitoral.md
// -----------------------------------------------------------------------------
const conceitos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conceitos' }),
  schema: z.object({
    termo: z.string(),
    definicao: z.string(),       // explicação curta, acessível
  }),
});

// -----------------------------------------------------------------------------
// CARGOS — as 7 fichas (a estrela do site)
// Os campos abaixo são exatamente o template de ficha do Módulo 2.
// Arquivo: src/content/cargos/presidente.md
// -----------------------------------------------------------------------------
const cargos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cargos' }),
  schema: z.object({
    nome: z.string(),
    poder: reference('poderes'),                         // chave p/ a coleção poderes
    esfera: z.enum(['federal', 'estadual', 'municipal']),
    sistema: z.enum(['majoritario', 'proporcional']),

    resumo: z.string(),                                  // 1 frase (cards + SEO)
    oQueE: z.string(),

    mandatoAnos: z.number().default(4),
    reeleicao: z.enum(['uma', 'ilimitada', 'nao']),      // uma = 1 consecutiva
    idadeMinima: z.number(),                             // 18, 21, 30 ou 35
    nacionalidade: z.enum(['nato', 'nato-ou-naturalizado']),

    requisitos: z.array(z.string()).optional(),          // itens extras, se houver
    atribuicoes: z.array(z.string()),
    limites: z.string(),

    ganchoVideo: z.string(),                             // ideia de reel
    reelUrl: z.string().url().optional(),               // preenchido quando o vídeo existir

    conceitos: z.array(reference('conceitos')).optional(), // termos ligados à ficha
    ordem: z.number(),
  }),
});

// -----------------------------------------------------------------------------
// MECANISMOS — Módulo 3 "como se vota" (ciclos, turnos, Justiça Eleitoral...)
// Conteúdo mais livre: o texto fica no corpo do arquivo markdown.
// Arquivo: src/content/mecanismos/dois-ciclos.md
// -----------------------------------------------------------------------------
const mecanismos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/mecanismos' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string(),
    ordem: z.number(),
  }),
});

export const collections = { poderes, cargos, conceitos, mecanismos };
