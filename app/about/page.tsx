'use client';

import LandingLayout from "@/components/Landing/LandingLayout";

export default function AboutPage() {
  return (
    <LandingLayout>
      <div className="bg-slate-50 min-h-[60vh] py-16 px-8 sm:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 border-b-4 border-blue-600 pb-4 mb-8">
            About AVRP
          </h1>
          
          <div className="prose prose-slate lg:prose-lg text-slate-700 leading-relaxed space-y-6">
            <p className="text-xl font-medium text-slate-800">
              The Agniveer Rehabilitation and Verification Portal (AVRP) is an integrated platform 
              designed to bridge the gap between dedicated military service and successful civilian careers.
            </p>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Our Mission</h2>
              <p>
                To provide a seamless transition framework for Agniveers by leveraging their disciplined 
                background, specialized skills, and leadership potential. We aim to empower every 
                transitioning soldier with the tools, verification services, and placement opportunities 
                needed to thrive in the corporate and public sectors.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Service Excellence</h3>
                <p className="text-sm">We honor the commitment of Agniveers by providing world-class career assistance and certification mapping.</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-emerald-900 mb-2">Corporate Integration</h3>
                <p className="text-sm">Partnering with leading industries to create a pipeline for highly-skilled and disciplined talent.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Official Framework</h2>
            <p>
              Established under the guidance of the Ministry of Home Affairs, AVRP serves as the central 
              authority for the verification and rehabilitation of Agniveers across various Central 
              Armed Police Forces (CAPFs) and related entities.
            </p>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
