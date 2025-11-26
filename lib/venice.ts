export const STYLES = [
  { 
    id: "modern", 
    label: "Modern", 
    prompt: "modern interior design, sleek furniture, clean lines, neutral color palette with bold accents, contemporary art, minimalist decor, glass and steel elements, open space, high end furniture" 
  },
  { 
    id: "scandinavian", 
    label: "Scandinavian", 
    prompt: "scandinavian interior design, light wood floors, white walls, cozy textiles, functional furniture, hygge atmosphere, natural light, minimalist but warm, plants, soft texture" 
  },
  { 
    id: "minimalist", 
    label: "Minimalist", 
    prompt: "minimalist interior design, decluttered space, monochromatic color scheme, essential furniture only, clean surfaces, hidden storage, simplicity, zen atmosphere, bright and airy" 
  },
  { 
    id: "japandi", 
    label: "Japandi", 
    prompt: "japandi interior design, blend of japanese rustic minimalism and scandinavian functionality, low profile furniture, natural materials, bamboo, warm neutrals, balanced composition, serene" 
  },
  { 
    id: "industrial", 
    label: "Industrial", 
    prompt: "industrial interior design, exposed brick walls, concrete floors, metal fixtures, leather furniture, raw materials, open ceiling, loft style, vintage edison bulbs, masculine aesthetic" 
  },
  { 
    id: "boho", 
    label: "Boho", 
    prompt: "bohemian interior design, eclectic mix of patterns and textures, rattan furniture, macrame, many plants, layered rugs, warm earth tones, vintage pieces, relaxed atmosphere, cozy" 
  },
  { 
    id: "luxury", 
    label: "Luxury", 
    prompt: "luxury interior design, opulence, velvet furniture, gold accents, marble surfaces, crystal chandeliers, rich colors, high ceilings, expensive decor, sophisticated, elegant" 
  },
];

export interface GenerationResponse {
  data: {
    b64_json: string;
  }[];
}

export interface GenerateRequest {
  imageBase64: string;
  style: string;
  resolution: string;
  count: number;
}

export interface HistoryItem {
  id: string;
  image: string; // The generated image
  original: string; // The input image
  style: string;
  date: number;
}
