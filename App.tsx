
import React, { useState, useCallback, useEffect } from 'react';
import { MorphAnimator } from './components/MorphAnimator';
import { Editor } from './components/Editor';
import { ALL_EXAMPLES, JAVA_RUNNABLE_EXAMPLE_RAW } from './constants';
import { parseCode } from './services/javaParser';
import type { CodeParts } from './types';

type Mode = 'welcome' | 'random' | 'workbench';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('welcome');
  const [workbenchCode, setWorkbenchCode] = useState<string>(JAVA_RUNNABLE_EXAMPLE_RAW);
  const [morphedData, setMorphedData] = useState<CodeParts | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the MorphAnimator
  const [lastExampleIndex, setLastExampleIndex] = useState<number>(-1);

  const handleMorphExample = useCallback(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * ALL_EXAMPLES.length);
    } while (ALL_EXAMPLES.length > 1 && nextIndex === lastExampleIndex);
    
    setLastExampleIndex(nextIndex);
    setIsMorphing(true);
    setMorphedData(ALL_EXAMPLES[nextIndex]);
    setMode('random');
    setKey(prev => prev + 1);
  }, [lastExampleIndex]);

  useEffect(() => {
    if (mode === 'workbench') {
      const parsed = parseCode(workbenchCode);
      if (parsed) {
        setMorphedData(parsed);
        setIsMorphing(true);
        setKey(prev => prev + 1);
      } else {
        setMorphedData(null);
        setIsMorphing(false);
      }
    }
  }, [workbenchCode, mode]);

  const renderContent = () => {
    switch (mode) {
      case 'workbench':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full p-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-cyan-300 mb-2 glow-cyan">Your Code (Input)</h2>
              <Editor value={workbenchCode} onChange={setWorkbenchCode} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-magenta-300 mb-2" style={{textShadow: '0 0 5px #f0f'}}>λ-Morpher Output (Live)</h2>
              <div className="bg-black bg-opacity-40 rounded-lg p-6 flex-grow border border-gray-700 h-full">
                {morphedData ? (
                  <MorphAnimator key={key} codeParts={morphedData} onAnimationComplete={() => setIsMorphing(false)} />
                ) : (
                  <div className="text-gray-500 h-full flex items-center justify-center">[ awaiting valid functional interface ]</div>
                )}
              </div>
            </div>
          </div>
        );
      case 'random':
      case 'welcome':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="max-w-4xl w-full">
              {mode === 'welcome' && (
                <>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
                    <span className="text-cyan-400 glow-cyan">λ</span>-Morpher
                  </h1>
                  <p className="text-gray-300 text-lg mb-8">Feel the power of lambda expressions.</p>
                </>
              )}
               <button
                onClick={handleMorphExample}
                className="bg-cyan-500 text-black font-bold text-xl py-4 px-8 rounded-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.5)]"
              >
                [ MORPH EXAMPLE ]
              </button>
              {mode === 'random' && morphedData && (
                 <div className="w-full mt-8">
                  <div 
                    className="desc-tooltip inline-block mb-4 text-indigo-300 border border-indigo-400 rounded-full px-4 py-1"
                  >
                    ℹ️ {morphedData.description}
                    <span className="desc-tooltip-text">This example shows how to use a {morphedData.type} to achieve its goal. Watch how the boilerplate code transforms into a concise lambda.</span>
                  </div>
                  <div className="bg-black bg-opacity-40 rounded-lg p-6 border border-gray-700">
                    <MorphAnimator key={key} codeParts={morphedData} onAnimationComplete={() => setIsMorphing(false)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-white font-fira grid-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#101021]"></div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="p-4 flex justify-center space-x-6 bg-black bg-opacity-20 backdrop-blur-sm">
          {['welcome', 'workbench'].map((m) => (
             <button
                key={m}
                onClick={() => {
                  setMode(m as Mode);
                  if (m !== 'random') {
                    setMorphedData(null);
                  }
                  setIsMorphing(false); 
                }}
                className={`px-4 py-2 text-lg font-bold rounded-md transition-all duration-300 ${mode === m ? 'text-cyan-400 glow-cyan' : 'text-gray-400 hover:text-white'}`}
              >
                {m === 'welcome' ? 'Home' : 'Workbench'}
              </button>
          ))}
        </nav>
        <main className="flex-grow flex flex-col">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;