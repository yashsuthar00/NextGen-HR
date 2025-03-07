import React from "react";
import ResumeUpload from "./components/ResumeUpload";
import { Sparkles, Rocket } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.02] hover:shadow-3xl duration-300">
        <div className="relative bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-8 overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Rocket className="mr-3 text-white/80" size={36} />
                Resume Boost
              </h1>
              <p className="text-white/80 text-lg">
                Elevate Your Professional Profile
              </p>
            </div>
            <Sparkles className="text-white/60" size={48} />
          </div>
        </div>

        <div className="p-8">
          <ResumeUpload />
        </div>
      </div>
    </div>
  );
}

export default App;
