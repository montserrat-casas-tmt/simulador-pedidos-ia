import { Product, ProductSuggestion } from '../types';
import { products } from '../data/products';

// Keywords that might indicate the need for specific products
const KEYWORDS = {
  OFFICE: ["office", "workplace", "business", "commercial"],
  HOME: ["home", "residential", "house", "apartment"],
  THREE_PHASE: ["three-phase", "three phase", "trifásica", "trifasica", "3-phase", "3 phase", "380v"],
  SINGLE_PHASE: ["single-phase", "single phase", "monofásica", "monofasica", "220v", "110v"],
  SMALL: ["small", "tiny", "minor", "little"],
  MEDIUM: ["medium", "regular", "standard"],
  LARGE: ["large", "big", "major", "extensive"],
  LIGHTING: ["lighting", "light", "lights", "illumination"],
  POWER: ["power", "socket", "outlet", "supply"],
  DISTRIBUTION: ["distribution", "panel", "board"]
};

/**
 * Simple "AI" to interpret natural language input and suggest products
 * In a real application, this would be replaced with a proper NLP service
 */
export function interpretRequirement(input: string): ProductSuggestion[] {
  const lowerInput = input.toLowerCase();
  
  // Determine installation type
  const isThreePhase = KEYWORDS.THREE_PHASE.some(keyword => lowerInput.includes(keyword));
  const isOffice = KEYWORDS.OFFICE.some(keyword => lowerInput.includes(keyword));
  const isLarge = KEYWORDS.LARGE.some(keyword => lowerInput.includes(keyword));
  const isMedium = KEYWORDS.MEDIUM.some(keyword => lowerInput.includes(keyword));
  const isSmall = KEYWORDS.SMALL.some(keyword => lowerInput.includes(keyword));
  const needsLighting = KEYWORDS.LIGHTING.some(keyword => lowerInput.includes(keyword));
  
  // Size multiplier affects quantities
  let sizeMultiplier = 1;
  if (isLarge) sizeMultiplier = 2;
  else if (isMedium) sizeMultiplier = 1.5;
  else if (isSmall) sizeMultiplier = 0.75;
  
  // Initialize suggestions array
  const suggestions: ProductSuggestion[] = [];
  
  // Add products based on requirements
  products.forEach(product => {
    let suggestedQuantity = product.minQuantity;
    let shouldInclude = false;
    
    // Wiring - always needed
    if (product.category === "Wiring") {
      shouldInclude = true;
      if (product.id === "wire-003" && isThreePhase) {
        suggestedQuantity = Math.round(50 * sizeMultiplier);
        shouldInclude = true;
      } else if (product.id === "wire-002") {
        suggestedQuantity = Math.round(30 * sizeMultiplier);
        shouldInclude = true;
      } else if (product.id === "wire-001") {
        suggestedQuantity = Math.round(80 * sizeMultiplier);
        shouldInclude = true;
      }
    }
    
    // Protection devices
    if (product.category === "Protection") {
      shouldInclude = true;
      if (product.id === "prot-002" && isThreePhase) {
        suggestedQuantity = 1;
      } else if (product.id === "prot-001") {
        suggestedQuantity = isThreePhase ? Math.round(8 * sizeMultiplier) : Math.round(6 * sizeMultiplier);
      } else if (product.id === "prot-003") {
        suggestedQuantity = 1;
      }
    }
    
    // Enclosures
    if (product.category === "Enclosures") {
      if (product.id === "enc-002" && (isThreePhase || isLarge || (isMedium && isOffice))) {
        suggestedQuantity = 1;
        shouldInclude = true;
      } else if (product.id === "enc-001" && !isLarge) {
        suggestedQuantity = 1;
        shouldInclude = true;
      }
    }
    
    // Equipment
    if (product.category === "Equipment") {
      if (product.id === "eqp-001" && isThreePhase) {
        suggestedQuantity = Math.round(2 * sizeMultiplier);
        shouldInclude = true;
      } else if (product.id === "eqp-002" && (needsLighting || isOffice)) {
        suggestedQuantity = Math.round(4 * sizeMultiplier);
        shouldInclude = true;
      }
    }
    
    // Always include accessories and connectors
    if (product.category === "Accessories" || product.category === "Connectors") {
      suggestedQuantity = Math.round(product.minQuantity * sizeMultiplier);
      shouldInclude = true;
    }
    
    if (shouldInclude) {
      suggestions.push({
        product,
        suggestedQuantity,
        selected: false
      });
    }
  });
  
  return suggestions;
}