"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { Heart, GraduationCap, Users, Lightbulb, LayoutGrid } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  goal: number;
  raised: number;
  image: string;
  fullname: string;
  donorsCount: number;
  daysLeft: number;
}

export default function HomeClient({ initialProjects }: { initialProjects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "Santé", name: "Santé", icon: <Heart className="w-4 h-4" /> },
    { id: "Éducation", name: "Éducation", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "Social", name: "Social", icon: <Users className="w-4 h-4" /> },
    { id: "Entrepreneuriat", name: "Business", icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const filteredProjects = selectedCategory 
    ? initialProjects.filter(p => p.category.includes(selectedCategory))
    : initialProjects;

  return (
    <section id="projets" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1.5 bg-primary rounded-full"></div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Projets <span className="text-primary">à la Une</span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Soutenez les initiatives locales qui créent un impact réel. Chaque don, petit ou grand, contribue à changer des vies.
          </p>
        </div>

        {/* Filtres Visuels */}
        <div className="flex flex-wrap gap-2">
           <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all border ${!selectedCategory ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all border ${selectedCategory === cat.id ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[40px] border border-slate-200 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <LayoutGrid className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-2xl text-slate-400 font-black mb-4">Aucun projet dans cette catégorie.</p>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-primary font-black uppercase tracking-widest text-xs hover:opacity-80 transition-opacity"
          >
            Voir tous les projets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
