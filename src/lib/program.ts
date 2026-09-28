// Spojí texty pilířů (src/data/program.ts) s návrhy z CMS.

import { pillars, type PillarMeta } from '../data/program';
import { cms, type Policy } from './cms';

export interface Pillar extends PillarMeta {
  policies: Policy[];
}

export async function loadProgram(): Promise<Pillar[]> {
  const fromCms = await cms.listPillars();
  return pillars.map((meta) => ({
    ...meta,
    policies: fromCms.find((p) => p.slug === meta.slug)?.policies ?? [],
  }));
}

/** „#Zeštíhlit stát“ → „#zeštíhlitstát“ (tvar hashtagu z původního webu). */
export const hashtag = (tag: string) => tag.toLowerCase().replace(/\s+/g, '');
