'use client';

import { useState } from 'react';
import LandingLayout from "@/components/Landing/LandingLayout";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-slate-200 py-6 last:border-b-0">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
          {question}
        </h3>
        <span className={`text-2xl transition-transform duration-300 font-bold ${isOpen ? 'rotate-45 text-blue-700' : 'rotate-0 text-slate-400'}`}>
          +
        </span>
      </button>
      <div className={`mt-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-600 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is the AVRP Portal?",
      answer: "The AVRP (Agniveer Rehabilitation & Verification Portal) is a specialized platform for the verification of Agniveers and their transition into civilian employment or CAPFs after their service tenure."
    },
    {
      question: "How do I register as an Agniveer?",
      answer: "Agniveers are automatically registered in the portal upon the completion of their induction. You can update your profile and skill certifications once you receive your service credentials."
    },
    {
      question: "What information is shared with corporate partners?",
      answer: "Only verified skill certifications, service duration, and general performance metrics are shared with registered corporate partners. Personal sensitive information is strictly protected and shared only with consent."
    },
    {
      question: "What is the 'Seva Nidhi' package?",
      answer: "The Seva Nidhi is a comprehensive financial package provided to Agniveers at the end of their 4-year tenure. It consists of the individual's contribution matched by the government, plus accrued interest."
    },
    {
      question: "Can I apply for multiple job notifications?",
      answer: "Yes, once your profile is verified, you can browse and apply for any number of public or corporate job notifications listed in the dashboard."
    }
  ];

  return (
    <LandingLayout>
      <div className="bg-slate-50 py-16 px-8 sm:px-16 lg:px-24 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 border-b-2 border-blue-600 inline-block pb-2 mb-4 uppercase tracking-tighter">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-500 font-medium">Find answers to common queries about the AVRP portal and the Agnipath scheme.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-700 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold italic tracking-wide lowercase underline">Still have questions?</h3>
              <p className="text-blue-100 font-medium text-sm">Our support team is available 24/7 to assist you with any technical or administrative issues.</p>
            </div>
            <button className="px-8 py-4 bg-white text-blue-700 rounded-xl font-black shadow-lg hover:bg-slate-100 transition-colors uppercase text-xs tracking-widest">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
