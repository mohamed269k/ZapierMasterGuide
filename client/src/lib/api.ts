import { Automation } from "@shared/schema";

// Check if we're in a static deployment environment
const isStaticDeployment = () => {
  return typeof window !== 'undefined' && (
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('surge.sh') ||
    (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'))
  );
};

// Load automations from static JSON file or API
export const loadAutomations = async (): Promise<Automation[]> => {
  try {
    // Try API first, then fallback to static JSON
    let response;
    
    try {
      response = await fetch('/api/automations');
      if (response.ok) {
        return await response.json();
      }
    } catch (apiError) {
      console.log('API not available, trying static file...');
    }
    
    // Fallback to static JSON file
    response = await fetch('/data/automations.json');
    if (!response.ok) {
      throw new Error('Failed to load automations data from both API and static file');
    }
    return await response.json();
    
  } catch (error) {
    console.error('Error loading automations:', error);
    // Return empty array as final fallback
    return [];
  }
};

// Search automations locally
export const searchAutomations = (automations: Automation[], query: string): Automation[] => {
  if (!query.trim()) return automations;
  
  const lowercaseQuery = query.toLowerCase();
  
  return automations.filter(automation => 
    automation.title.toLowerCase().includes(lowercaseQuery) ||
    automation.description.toLowerCase().includes(lowercaseQuery) ||
    automation.apps.some(app => app.toLowerCase().includes(lowercaseQuery)) ||
    automation.trigger.toLowerCase().includes(lowercaseQuery) ||
    automation.action.toLowerCase().includes(lowercaseQuery) ||
    automation.proTip.toLowerCase().includes(lowercaseQuery)
  );
};

// Filter automations by category
export const filterAutomationsByCategory = (automations: Automation[], categories: string[]): Automation[] => {
  if (categories.includes("all")) return automations;
  
  return automations.filter(automation => 
    categories.includes(automation.category)
  );
};