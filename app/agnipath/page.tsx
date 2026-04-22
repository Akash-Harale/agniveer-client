'use client';

import LandingLayout from "@/components/Landing/LandingLayout";

const Feature = ({ title, description }: { title: string; description: string }) => (
  <div className="flex gap-4 p-6 bg-slate-100 rounded-xl border border-slate-200">
    <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
      ✦
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </div>
);

export default function AgnipathPage() {
  return (
    <LandingLayout>
      <div className="bg-white py-16 px-8 sm:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="border-l-8 border-blue-700 pl-8 space-y-4">
            <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tight uppercase">
              Agnipath Scheme <br /> <span className="text-blue-700 italic underline tracking-wide">Official Details</span>
            </h1>
            <p className="max-w-3xl text-xl text-slate-600 font-medium">
              A transformative policy to revitalize the armed forces by integrating youthful 
              energy with veteran-grade discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Program Highlights</h2>
              <p className="text-slate-700 leading-relaxed font-medium">
                The Agnipath scheme allows patriotic and motivated youth to serve in the 
                Armed Forces for a period of four years. The program is designed to build 
                a high-impact human resource with diverse skill sets.
              </p>
              <div className="space-y-4">
                <Feature 
                  title="Four-Year Service"
                  description="A dedicated tenure of disciplined military service with the title of 'Agniveer'."
                />
                <Feature 
                  title="Seva Nidhi Package"
                  description="Comprehensive financial corpus of approximately ₹11.71 Lakh at the end of service."
                />
                <Feature 
                  title="Skill Mapping"
                  description="Detailed certification of skills acquired during the service period."
                />
              </div>
            </div>
            <div className="bg-slate-950 rounded-3xl p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
               {/* 🔹 Background Decor */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-3xl -mr-16 -mt-16"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 opacity-20 blur-3xl -ml-16 -mb-16"></div>

               <h2 className="text-2xl font-black border-b border-slate-800 pb-4 tracking-wider uppercase">Scheme Enrollment</h2>
               <div className="space-y-6">
                 <div className="flex gap-4 items-start border-l-2 border-slate-700 pl-6">
                   <div className="font-bold text-blue-400">01</div>
                   <p className="text-sm text-slate-300">Recruitment open for all citizens between 17.5 to 21 years of age.</p>
                 </div>
                 <div className="flex gap-4 items-start border-l-2 border-slate-700 pl-6">
                   <div className="font-bold text-blue-400">02</div>
                   <p className="text-sm text-slate-300">Selection based on rigorous physical and medical standards.</p>
                 </div>
                 <div className="flex gap-4 items-start border-l-2 border-slate-700 pl-6">
                   <div className="font-bold text-blue-400">03</div>
                   <p className="text-sm text-slate-300">Intensive training at major regimental centers across India.</p>
                 </div>
               </div>
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mt-6 group hover:cursor-pointer transition-all hover:bg-slate-700">
                  <p className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">Start Your Journey Today</p>
                  <p className="text-xs text-slate-400 font-medium">Click to visit the official Indian Army recruitment site.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
