import React, { useState, useEffect, useRef } from 'react';
import { Brain, ShieldCheck, TrendingUp, Sparkles, BookOpen, GraduationCap, CheckCircle2, ArrowRight, Play, Upload, FileText, Lock, Mail, User, Award, Clock, Compass, BarChart2, ChevronRight, Zap, RefreshCw, HelpCircle, Check, Search, Bell, Settings, LogOut, Globe, Bookmark, ExternalLink, Layers, Eye, Shield, Activity, Lightbulb } from 'lucide-react';

function HomePage({ setActiveTab }) {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-16 pt-12 lg:pt-20 overflow-hidden">
        {/* Background ambient glow shapes */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#5636D9]/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#18B8AD]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5636D9]/10 border border-[#5636D9]/20 text-[#5636D9] text-xs font-bold tracking-wide">
              <Sparkles size={14} className="text-[#E5C158]" />
              <span>AI-POWERED LEARNING & ANSWER VERIFICATION PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#1E1B2E] tracking-tight leading-[1.1]">
              Learn Beyond Answers. <br />
              <span className="bg-gradient-to-r from-[#5636D9] to-[#18B8AD] bg-clip-text text-transparent">Understand Every Concept.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Stop memorizing solutions. Our neural scaffolding engine guides you through hint ladders, verifies your conceptual proofs, and scans complex homework with millimeter precision.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={() => setActiveTab('ladder')} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5636D9] to-[#18B8AD] text-white font-bold text-base shadow-xl shadow-[#5636D9]/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group">
                <span>Start Learning Now</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setActiveTab('verify')} className="px-8 py-4 rounded-2xl bg-white border-2 border-[#5636D9]/30 text-[#5636D9] font-bold text-base hover:bg-[#5636D9]/5 transition-all flex items-center gap-3">
                <Play size={18} className="text-[#18B8AD]" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-gray-200/80">
              <div>
                <h3 className="text-2xl font-black text-[#5636D9]">99.4%</h3>
                <p className="text-xs text-gray-500 font-medium">Verification Accuracy</p>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <h3 className="text-2xl font-black text-[#18B8AD]">1.2M+</h3>
                <p className="text-xs text-gray-500 font-medium">Concepts Scaffolded</p>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <h3 className="text-2xl font-black text-[#E5C158]">4.9/5</h3>
                <p className="text-xs text-gray-500 font-medium">Student Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Hero 3D Holographic Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center">
              {/* Rotating orbital rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5636D9]/30 animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-6 rounded-full border border-[#18B8AD]/40 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-12 rounded-full border border-[#E5C158]/50 animate-[spin_25s_linear_infinite]"></div>

              {/* Central Glowing 3D Sphere & Robot/Brain Artwork */}
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[#5636D9] via-[#18B8AD] to-[#E5C158] p-1 shadow-2xl shadow-[#5636D9]/50 animate-bounce duration-1000">
                <div className="w-full h-full rounded-full bg-[#1E1B2E] flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#5636D9]/40 via-transparent to-transparent"></div>
                  <Brain size={64} className="text-[#18B8AD] mb-3 animate-pulse" />
                  <div className="text-white font-black text-lg tracking-wider">UNDERSTANDX AI</div>
                  <div className="text-[10px] text-[#E5C158] uppercase font-bold tracking-widest mt-1">Neural Core Active</div>
                </div>
              </div>

              {/* Floating Badge 1: Verification Checkmark */}
              <div className="absolute top-4 left-0 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#18B8AD]/30 flex items-center gap-3 animate-bounce">
                <div className="w-8 h-8 rounded-full bg-[#18B8AD]/20 text-[#18B8AD] flex items-center justify-center font-bold">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1B2E]">Answer Verified</div>
                  <div className="text-[10px] text-gray-500">Confidence: 99.8%</div>
                </div>
              </div>

              {/* Floating Badge 2: Graduation Cap & Book */}
              <div className="absolute bottom-8 right-0 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-[#5636D9]/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5636D9]/20 text-[#5636D9] flex items-center justify-center font-bold">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1B2E]">Concept Mastered</div>
                  <div className="text-[10px] text-gray-500">+150 XP Earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Feature Cards Underneath */}
      <section className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-[#1E1B2E] tracking-tight">Engineered for Deep Comprehension</h2>
          <p className="text-gray-600 mt-2 text-sm">Four pillars designed to transform passive test-taking into active, bulletproof mastery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Lightbulb className="text-[#E5C158]" size={28} />}
            title="Smart Learning"
            description="Adaptive hint generation tailored to your exact cognitive gap without spoiling the final answer."
            badge="Scaffolding"
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-[#18B8AD]" size={28} />}
            title="Answer Verification"
            description="Upload handwritten or typed solutions for deep neural validation, error localization, and proof checks."
            badge="Precision"
          />
          <FeatureCard 
            icon={<TrendingUp className="text-[#5636D9]" size={28} />}
            title="Track Progress"
            description="Granular subject mastery charts, streak trackers, and skill trees that map your cognitive growth."
            badge="Analytics"
          />
          <FeatureCard 
            icon={<GraduationCap className="text-[#E5C158]" size={28} />}
            title="Personalized Learning"
            description="AI tutor persona adapts to your pacing, explaining complex theorems through analogies you love."
            badge="Adaptive"
          />
        </div>
      </section>

      {/* Interactive Showcase / Demo Banner */}
      <section className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#5636D9] to-[#18B8AD] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-4 max-w-xl z-10">
            <span className="bg-[#E5C158] text-[#1E1B2E] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Live AI Preview</span>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tight">Try the AI Learning Ladder Now</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Experience our signature 4-tier learning progression: Hint, Step-by-Step Breakdown, Full Solution, and Rigorous Verification.
            </p>
          </div>
          <button onClick={() => setActiveTab('ladder')} className="z-10 px-8 py-4 rounded-2xl bg-white text-[#5636D9] font-black text-sm shadow-xl hover:bg-[#FFF9F0] hover:scale-105 transition-all flex items-center gap-3">
            <span>Launch Learning Ladder</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-[#1E1B2E] tracking-tight">Loved by Students & Educators</h2>
          <p className="text-gray-600 mt-2 text-sm">See how UNDERSTANDX is changing academic performance worldwide.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard 
            quote="The learning ladder changed how I approach calculus. Instead of just seeing the answer, I finally understand why the integration parts work!"
            author="Sarah Jenkins"
            role="MIT Sophomore"
            rating={5}
          />
          <TestimonialCard 
            quote="Answer verification is a lifesaver for physics problem sets. It catches subtle algebraic errors before I submit my assignments."
            author="Dr. Marcus Vance"
            role="Physics Professor"
            rating={5}
          />
          <TestimonialCard 
            quote="The clean deep violet and teal design makes studying actually enjoyable. The streak tracker keeps me accountable every single day."
            author="Liam Chen"
            role="High School Senior"
            rating={5}
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, badge }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#5636D9]/10 shadow-lg shadow-[#5636D9]/5 hover:shadow-2xl hover:border-[#18B8AD]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5636D9]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#18B8AD]/10 text-[#18B8AD] uppercase tracking-wider">{badge}</span>
        </div>
        <h3 className="text-xl font-bold text-[#1E1B2E] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#5636D9] group-hover:text-[#18B8AD]">
        <span>Explore feature</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, rating }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#5636D9]/10 shadow-md flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex gap-1 text-[#E5C158]">
          {[...Array(rating)].map((_, i) => (
            <Sparkles key={i} size={16} fill="#E5C158" />
          ))}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed italic">"{quote}"</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5636D9] to-[#18B8AD] text-white font-bold flex items-center justify-center text-sm">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#1E1B2E]">{author}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
