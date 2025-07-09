import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Automation } from "@shared/schema";
import { loadAutomations } from "@/lib/api";
import SearchSidebar from "@/components/search-sidebar";
import AutomationSection from "@/components/automation-section";
import { Zap, Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const categories = [
  { id: "marketing", name: "Marketing & Lead Management", icon: "📢", count: 8 },
  { id: "sales", name: "Sales & E-commerce", icon: "🛒", count: 6 },
  { id: "project", name: "Project Management & Team Collaboration", icon: "📋", count: 7 },
  { id: "content", name: "Content Creation & Social Media", icon: "✍️", count: 5 },
  { id: "productivity", name: "Personal Productivity", icon: "⚙️", count: 4 },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);

  const { data: automations = [], isLoading } = useQuery<Automation[]>({
    queryKey: ["automations"],
    queryFn: loadAutomations,
  });

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch = 
      automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.apps.some(app => app.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategories.includes("all") || 
      selectedCategories.includes(automation.category);
    
    return matchesSearch && matchesCategory;
  });

  const groupedAutomations = categories.reduce((acc, category) => {
    acc[category.id] = filteredAutomations.filter(automation => automation.category === category.id);
    return acc;
  }, {} as Record<string, Automation[]>);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Zap className="text-brand-500 h-8 w-8" />
              <h1 className="text-xl font-bold text-slate-900">Zapier Automations Guide</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-slate-600">30 Essential Automations</span>
              <Button className="bg-brand-500 text-white hover:bg-brand-600">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SearchSidebar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  categories={categories}
                  automations={automations}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <SearchSidebar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                categories={categories}
                automations={automations}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                The Ultimate Guide to the Top 30 Zapier Automations
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Transform your business productivity with these powerful automations. Each automation includes 
                step-by-step instructions, pro tips, and real-world applications.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center">
                  <span className="mr-2">👥</span>
                  For small business owners & freelancers
                </span>
                <span className="flex items-center">
                  <span className="mr-2">⏰</span>
                  Save hours of manual work weekly
                </span>
                <span className="flex items-center">
                  <span className="mr-2">📈</span>
                  Boost productivity by 40%
                </span>
              </div>
            </div>

            {/* Automations List */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading automations...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => (
                  <AutomationSection
                    key={category.id}
                    category={category}
                    automations={groupedAutomations[category.id] || []}
                  />
                ))}
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Zapier Automations Guide</h4>
              <p className="text-slate-300">
                Transform your productivity with 30 powerful automations designed for small businesses and entrepreneurs.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">Marketing Automations</a></li>
                <li><a href="#" className="hover:text-white">Sales Automations</a></li>
                <li><a href="#" className="hover:text-white">Project Management</a></li>
                <li><a href="#" className="hover:text-white">Personal Productivity</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">Video Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white">Twitter</a>
                <a href="#" className="text-slate-300 hover:text-white">LinkedIn</a>
                <a href="#" className="text-slate-300 hover:text-white">YouTube</a>
                <a href="#" className="text-slate-300 hover:text-white">GitHub</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2024 Zapier Automations Guide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
