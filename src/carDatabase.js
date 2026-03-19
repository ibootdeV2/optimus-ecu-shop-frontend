// ═══════════════════════════════════════════════════════════════
// DAGOAUTO — Base de données catalogue
// Tout est vide au départ — l'admin remplit depuis le panneau admin
// ═══════════════════════════════════════════════════════════════

// Démarre vide — l'admin ajoute les marques depuis l'interface
export const BRANDS = {};

// Démarre vide — l'admin ajoute les types d'ECU depuis l'interface
export const ECU_TYPES = [];

// ── Helpers
export function getBrandList(brands = BRANDS) {
  return Object.keys(brands).sort();
}

export function getModelList(brand, brands = BRANDS) {
  return brand && brands[brand] ? Object.keys(brands[brand].models).sort() : [];
}

export function getEngineList(brand, model, brands = BRANDS) {
  if (!brand || !model || !brands[brand]?.models[model]) return [];
  return brands[brand].models[model].engines || [];
}

// Génère la clé S3 automatiquement
export function generateS3Key(brand, model, engineLabel, ecuRef, calcType) {
  const s = str => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  return `${s(brand)}/${s(model)}/${s(engineLabel)}_${s(ecuRef)}_${s(calcType)}.zip`;
}

export const CATALOG_STATS = {
  totalBrands:  0,
  totalModels:  0,
  totalEngines: 0,
};
