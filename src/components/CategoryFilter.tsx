import { Sparkles, Heart, Minimize2, Crown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'Semua', icon: Sparkles, color: 'from-[#f4b9b8] to-[#887bb0]' },
  { id: 'modern', label: 'Modern', icon: Sparkles, color: 'from-[#85d2d0] to-[#85d2d0]' },
  { id: 'classic', label: 'Classic', icon: Heart, color: 'from-[#f4b9b8] to-[#f4b9b8]' },
  { id: 'minimalist', label: 'Minimalist', icon: Minimize2, color: 'from-[#887bb0] to-[#887bb0]' },
  { id: 'elegant', label: 'Elegant', icon: Crown, color: 'from-[#fff4bd] to-[#f4b9b8]' },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
