import { Automation } from "@shared/schema";
import AutomationCard from "./automation-card";

interface AutomationSectionProps {
  category: {
    id: string;
    name: string;
    icon: string;
    count: number;
  };
  automations: Automation[];
}

export default function AutomationSection({ category, automations }: AutomationSectionProps) {
  if (automations.length === 0) return null;

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case "📢": return "🔊";
      case "🛒": return "🛍️";
      case "📋": return "📊";
      case "✍️": return "📝";
      case "⚙️": return "🔧";
      default: return icon;
    }
  };

  return (
    <div className="automation-section" data-category={category.id}>
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <span className="mr-3 text-2xl">{getIconComponent(category.icon)}</span>
        {category.name}
      </h3>
      
      <div className="space-y-6">
        {automations.map((automation, index) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
