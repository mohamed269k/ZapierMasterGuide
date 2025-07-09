import { Automation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Video } from "lucide-react";

interface AutomationCardProps {
  automation: Automation;
  index: number;
}

export default function AutomationCard({ automation, index }: AutomationCardProps) {
  const getBadgeVariant = (badge: string | null) => {
    if (!badge) return "secondary";
    switch (badge.toLowerCase()) {
      case "popular": return "default";
      case "essential": return "default";
      case "advanced": return "destructive";
      case "premium": return "secondary";
      default: return "secondary";
    }
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return "bg-slate-100 text-slate-600";
    switch (badge.toLowerCase()) {
      case "popular": return "bg-green-100 text-green-700";
      case "essential": return "bg-blue-100 text-blue-700";
      case "advanced": return "bg-orange-100 text-orange-700";
      case "premium": return "bg-purple-100 text-purple-700";
      case "content": return "bg-purple-100 text-purple-700";
      case "monitoring": return "bg-purple-100 text-purple-700";
      case "analytics": return "bg-blue-100 text-blue-700";
      case "integration": return "bg-orange-100 text-orange-700";
      case "revenue": return "bg-orange-100 text-orange-700";
      case "support": return "bg-blue-100 text-blue-700";
      case "sync": return "bg-purple-100 text-purple-700";
      case "team": return "bg-purple-100 text-purple-700";
      case "tracking": return "bg-orange-100 text-orange-700";
      case "security": return "bg-green-100 text-green-700";
      case "reporting": return "bg-blue-100 text-blue-700";
      case "client": return "bg-orange-100 text-orange-700";
      case "planning": return "bg-purple-100 text-purple-700";
      case "curation": return "bg-blue-100 text-blue-700";
      case "distribution": return "bg-orange-100 text-orange-700";
      case "ideas": return "bg-purple-100 text-purple-700";
      case "reading": return "bg-blue-100 text-blue-700";
      case "finance": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  // Parse trigger and action text to extract structured information
  const parseTriggerAction = (text: string) => {
    const parts = text.split('. ');
    const app = parts[0]?.split(' - ')[0] || '';
    const event = parts[0]?.split(' - ')[1] || '';
    const setup = parts.slice(1).join('. ');
    return { app, event, setup };
  };

  const trigger = parseTriggerAction(automation.trigger);
  const action = parseTriggerAction(automation.action);

  return (
    <Card className="automation-card" id={`automation-${automation.id}`} data-category={automation.category}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-xl font-semibold text-slate-900 flex-1">
            {index}. {automation.title}
          </h4>
          {automation.badge && (
            <Badge className={`${getBadgeColor(automation.badge)} text-xs font-medium ml-4`}>
              {automation.badge}
            </Badge>
          )}
        </div>
        
        <p className="text-slate-600 mb-4">
          <strong>Why this is awesome:</strong> {automation.description}
        </p>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <h5 className="font-medium text-slate-900 mb-2">Apps You'll Need:</h5>
          <ul className="list-disc list-inside text-slate-600 space-y-1">
            {automation.apps.map((app, idx) => (
              <li key={idx}>{app}</li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-slate-200 pt-4">
          <h5 className="font-semibold text-slate-900 mb-3">Step-by-Step Guide</h5>
          
          <div className="mb-4">
            <h6 className="font-medium text-slate-900 mb-2">Trigger:</h6>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-4">
              <li><strong>App:</strong> {trigger.app}</li>
              <li><strong>Event:</strong> {trigger.event}</li>
              <li><strong>Setup:</strong> {trigger.setup}</li>
            </ol>
          </div>
          
          <div className="mb-4">
            <h6 className="font-medium text-slate-900 mb-2">Action:</h6>
            <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-4">
              <li><strong>App:</strong> {action.app}</li>
              <li><strong>Event:</strong> {action.event}</li>
              <li><strong>Setup:</strong> {action.setup}</li>
            </ol>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <h6 className="font-medium text-emerald-900 mb-2 flex items-center">
            <Rocket className="mr-2 h-4 w-4" />
            Pro Tip:
          </h6>
          <p className="text-emerald-800">{automation.proTip}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h6 className="font-medium text-blue-900 mb-2 flex items-center">
            <Video className="mr-2 h-4 w-4" />
            Video Tutorial:
          </h6>
          <p className="text-blue-800 font-mono text-sm">{automation.videoId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
