import Link from "next/link";

export interface ProjectType {
  id: string;
  title: string;
  category: string;
  raised: number;
  goal: number;
  image: string;
  daysLeft: number;
  donorsCount: number;
}

export default function ProjectCard({ project }: { project: ProjectType }) {
  const progress = Math.min(Math.round((project.raised / project.goal) * 100), 100);

  return (
    <Link href={`/project/${project.id}`}>
      <div className="group bg-white rounded-[20px] shadow-sm hover:shadow-xl border border-slate-100 transition-smooth h-full flex flex-col overflow-hidden">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-smooth duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-primary shadow-sm backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          {/* Progress Bar Container */}
          <div className="space-y-2 mt-auto">
            <div className="flex justify-between items-end mb-1">
              <span className="text-2xl font-black text-primary">
                {new Intl.NumberFormat('fr-FR').format(project.raised)} <span className="text-sm font-bold text-slate-500">XOF</span>
              </span>
              <span className="text-slate-500 font-bold text-sm bg-slate-100 px-2 py-0.5 rounded-md">{progress}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-5">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium mb-1">Objectif</span>
              <span className="text-slate-800 font-bold">{new Intl.NumberFormat('fr-FR').format(project.goal)} XOF</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-500 font-medium mb-1">Contributeurs</span>
              <span className="text-slate-800 font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                {project.donorsCount}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom Action Hint */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
          <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            J-{project.daysLeft}
          </span>
          <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Soutenir 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
