'use client'
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const WhySnipix: React.FC = () => {
  const [hoveredProblem, setHoveredProblem] = useState<number | null>(null);
  const [hoveredSolution, setHoveredSolution] = useState<number | null>(null);

  const problems = [
    "Useful code spread across five projects and three folders",
    "Code that only exists in projects you no longer open",
    "Stack Overflow tabs never revisited",
    "Copy-pasted code you don&apos;t fully remember writing",
    "No single place for reusable logic"
  ];

  const solutions = [
    "Keep your snippets where you can actually find them again",
    "Reuse code without hunting through old projects",
    "Put your best code in one place you trust",
    "Share exactly what you want — nothing more",
    "Stop solving the same problem twice"
  ];

  return (
    <section className="relative bg-neutral-950 py-32 px-6 md:px-12 border-t border-neutral-900 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-50" />
      <div className="absolute -left-40 top-1/4 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute -right-40 bottom-1/4 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Why Snipix?
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Built because folders and browsers are bad at remembering code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* THE PROBLEM CARD */}
          <div 
            className="group relative p-8 md:p-10 rounded-3xl bg-neutral-900/40 border border-neutral-800/50 hover:border-red-900/30 transition-all duration-500 overflow-hidden"
            onMouseLeave={() => setHoveredProblem(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-800/50">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                   <X className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">The Struggle</h3>
              </div>
              
              <ul className="space-y-5" role="list">
                {problems.map((item, idx) => (
                  <li 
                    key={idx}
                    onMouseEnter={() => setHoveredProblem(idx)}
                    className={`flex items-start gap-4 transition-all duration-300 ${
                      hoveredProblem !== null && hoveredProblem !== idx 
                        ? 'opacity-30 blur-[0.5px]' 
                        : 'opacity-100 translate-x-0'
                    }`}
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${
                       hoveredProblem === idx ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-neutral-700'
                    }`} />
                    <span className={`text-neutral-300 transition-colors duration-300 ${
                      hoveredProblem === idx ? 'text-white' : ''
                    }`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* THE SOLUTION CARD */}
          <div 
            className="group relative p-8 md:p-10 rounded-3xl bg-neutral-900/40 border border-neutral-800/50 hover:border-emerald-900/30 transition-all duration-500 overflow-hidden"
            onMouseLeave={() => setHoveredSolution(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-800/50">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                   <Check className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">The Snipix Way</h3>
              </div>

              <ul className="space-y-5" role="list">
                {solutions.map((item, idx) => (
                  <li 
                    key={idx}
                    onMouseEnter={() => setHoveredSolution(idx)}
                    className={`flex items-start gap-4 transition-all duration-300 ${
                      hoveredSolution !== null && hoveredSolution !== idx 
                        ? 'opacity-30 blur-[0.5px]' 
                        : 'opacity-100'
                    }`}
                  >
                    <div className={`mt-0.5 p-0.5 rounded-full transition-colors duration-300 ${
                        hoveredSolution === idx ? 'text-emerald-400 bg-emerald-400/10' : 'text-neutral-600'
                    }`}>
                       <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-neutral-300 transition-colors duration-300 ${
                      hoveredSolution === idx ? 'text-white font-medium' : ''
                    }`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
            {/* <div className="relative group cursor-default">
                <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative px-8 py-3 bg-neutral-950 rounded-full border border-neutral-800 ring-1 ring-white/5 leading-none flex items-center">
                    <span className="text-neutral-400 text-sm tracking-wider uppercase font-medium">
                        No buzzwords. No hype. Just better memory.
                    </span>
                </div>
            </div> */}
            <p className="text-neutral-500 text-lg font-light text-center max-w-xl mx-auto leading-relaxed opacity-80 hover:opacity-100 transition-opacity">
                “I built Snipix because I kept losing good code faster than I was writing it.”
             </p>
        </div>
      </div>
    </section>
  );
};

export default WhySnipix;