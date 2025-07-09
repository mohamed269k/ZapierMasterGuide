import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Automation } from "@shared/schema";

interface SearchSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
  automations: Automation[];
}

export default function SearchSidebar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategories, 
  setSelectedCategories, 
  categories,
  automations 
}: SearchSidebarProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (categoryId === "all") {
      setSelectedCategories(checked ? ["all"] : []);
    } else {
      const newCategories = checked 
        ? [...selectedCategories.filter(c => c !== "all"), categoryId]
        : selectedCategories.filter(c => c !== categoryId);
      
      setSelectedCategories(newCategories.length === 0 ? ["all"] : newCategories);
    }
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return automations.length;
    return automations.filter(a => a.category === categoryId).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search automations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Categories
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                checked={selectedCategories.includes("all")}
                onCheckedChange={(checked) => handleCategoryChange("all", checked as boolean)}
              />
              <span className="ml-2 text-sm text-slate-600">All Automations</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {getCategoryCount("all")}
            </Badge>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <span className="ml-2 text-sm text-slate-600">{category.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getCategoryCount(category.id)}
              </Badge>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Navigation</h3>
        <div className="space-y-1">
          {automations.slice(0, 5).map((automation, index) => (
            <a
              key={automation.id}
              href={`#automation-${automation.id}`}
              className="block text-sm text-slate-600 hover:text-brand-500 py-1"
            >
              {index + 1}. {automation.title.substring(0, 30)}...
            </a>
          ))}
          {automations.length > 5 && (
            <div className="text-xs text-slate-500 pt-2">
              + {automations.length - 5} more automations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
