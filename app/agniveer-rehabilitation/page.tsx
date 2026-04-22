'use client';

import LandingLayout from "@/components/Landing/LandingLayout";

const ServiceCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default function RehabilitationPage() {
  return (
    <LandingLayout>
      <div className="bg-slate-50 py-16 px-8 sm:px-16 lg:px-24 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
              Agniveer Rehabilitation Program
            </h1>
            <p className="max-w-2xl mx-auto text-slate-600 text-lg">
              Empowering our heroes with structured transition support, new-age skill mapping, 
              and world-class placement opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <ServiceCard 
              icon="🏢"
              title="Corporate Placement"
              description="Direct recruitment drives with top-tier multi-national corporations and domestic industry leaders."
            />
            <ServiceCard 
              icon="🎓"
              title="Skill Certification"
              description="Mapping military expertise to industry-recognized certifications for global competency."
            />
            <ServiceCard 
              icon="🤝"
              title="Career Counseling"
              description="Professional mentorship to help Agniveers identify and pursue their long-term professional goals."
            />
          </div>

          <section className="bg-white p-10 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Post-Service Transition</h2>
              <p className="text-slate-700 leading-relaxed">
                The rehabilitation framework focus on four key pillars: **Validation**, **Vocational Training**, 
                **Verification**, and **Vanguard Placements**. Every Agniveer leaving the service carries 
                not just a legacy of honor, but a digital portfolio that speaks to the corporate world 
                in their language.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-800 font-medium">
                  <span className="text-emerald-500">✔</span> Priority in CAPF recruitment
                </li>
                <li className="flex items-center gap-2 text-slate-800 font-medium">
                  <span className="text-emerald-500">✔</span> Customized entrepreneurship workshops
                </li>
                <li className="flex items-center gap-2 text-slate-800 font-medium">
                  <span className="text-emerald-500">✔</span> Industry-specific bridge courses
                </li>
              </ul>
            </div>
            <div className="w-full md:w-80 bg-slate-900 rounded-xl p-8 text-white space-y-4 shadow-2xl">
              <div className="text-blue-400 font-bold text-sm tracking-widest uppercase">Quick Statistics</div>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-black">75%</div>
                  <div className="text-xs text-slate-400 font-medium opacity-80 uppercase">Corporate Ready</div>
                </div>
                <div>
                  <div className="text-3xl font-black">120+</div>
                  <div className="text-xs text-slate-400 font-medium opacity-80 uppercase">Industry Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-xs text-slate-400 font-medium opacity-80 uppercase">Portal Support</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </LandingLayout>
  );
}
