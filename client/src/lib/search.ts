import { Automation } from "@shared/schema";

export function searchAutomations(automations: Automation[], query: string): Automation[] {
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
}

export function filterAutomationsByCategory(automations: Automation[], categories: string[]): Automation[] {
  if (categories.includes("all")) return automations;
  
  return automations.filter(automation => 
    categories.includes(automation.category)
  );
}
