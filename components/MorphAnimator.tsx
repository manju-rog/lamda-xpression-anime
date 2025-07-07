import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimationStep } from '../types';
import type { CodeParts } from '../types';
import { useSound } from '../hooks/useSound';
import { Tooltip } from './Tooltip';
import { STEP_DESCRIPTIONS } from '../constants';

interface MorphAnimatorProps {
  codeParts: CodeParts;
  onAnimationComplete: () => void;
}

const DELAYS: Record<AnimationStep, number> = {
  [AnimationStep.INITIAL]: 100,
  [AnimationStep.FADE_CONTEXT]: 1000,
  [AnimationStep.ISOLATE_BOILERPLATE]: 1000,
  [AnimationStep.SHATTER_BOILERPLATE]: 1500,
  [AnimationStep.PREPARE_ARROW_MORPH]: 800,
  [AnimationStep.EXECUTE_ARROW_MORPH]: 800,
  [AnimationStep.SCAN_TYPES]: 1000,
  [AnimationStep.FADE_OUT_TYPES]: 800,
  [AnimationStep.PREPARE_IMPLOSION]: 800,
  [AnimationStep.EXECUTE_IMPLOSION]: 1000,
  [AnimationStep.PREPARE_LAMBDA_ASSEMBLY]: 800,
  [AnimationStep.ASSEMBLE_FINAL_LAMBDA]: 1200,
  [AnimationStep.FINAL_GLOW]: 1000,
  [AnimationStep.DONE]: 1500,
};

export const MorphAnimator: React.FC<MorphAnimatorProps> = ({ codeParts, onAnimationComplete }) => {
  const [step, setStep] = useState<AnimationStep>(AnimationStep.INITIAL);
  const [description, setDescription] = useState(STEP_DESCRIPTIONS[AnimationStep.INITIAL]);
  const playSound = useSound();

  const memoizedOnAnimationComplete = useCallback(onAnimationComplete, []);

  useEffect(() => {
    let timer: number;
    if (step < AnimationStep.DONE) {
      timer = window.setTimeout(() => {
        setStep(current => current + 1);
      }, DELAYS[step]);
    } else {
       timer = window.setTimeout(memoizedOnAnimationComplete, DELAYS[step]);
    }
    return () => clearTimeout(timer);
  }, [step, memoizedOnAnimationComplete]);
  
  useEffect(() => {
    setDescription(STEP_DESCRIPTIONS[step]);
    switch(step) {
      case AnimationStep.ISOLATE_BOILERPLATE: playSound('hum'); break;
      case AnimationStep.SHATTER_BOILERPLATE: playSound('crack'); break;
      case AnimationStep.EXECUTE_ARROW_MORPH: playSound('merge'); break;
      case AnimationStep.FADE_OUT_TYPES: playSound('fizz'); break;
      case AnimationStep.EXECUTE_IMPLOSION: playSound('swoosh'); break;
      case AnimationStep.FINAL_GLOW: playSound('hum'); break;
    }
  }, [step, playSound]);

  const shatteredChars = useMemo(() => {
    const fullBoilerplate = codeParts.boilerplate.start + codeParts.boilerplate.end;
    return fullBoilerplate.split('').map((char, index) => (
      <span
        key={index}
        className="character-shatter"
        style={{
          transitionDelay: `${index * 2}ms`,
          transform: `translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 150}px) rotate(${(Math.random() - 0.5) * 180}deg)`,
          opacity: 0,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [codeParts.boilerplate]);

  const renderCode = () => {
    const currentStep = step;
    
    const contextClass = `transition-opacity duration-700 ${currentStep >= AnimationStep.FADE_CONTEXT ? 'opacity-20' : 'opacity-100'}`;
    const coreLogicClass = `transition-all duration-700 ${currentStep >= AnimationStep.ISOLATE_BOILERPLATE ? 'text-cyan-400 glow-cyan scale-105' : ''}`;
    const boilerplateClass = `transition-opacity duration-500 ${currentStep >= AnimationStep.ISOLATE_BOILERPLATE ? 'opacity-20' : ''} ${currentStep >= AnimationStep.SHATTER_BOILERPLATE ? 'opacity-0' : 'opacity-100'}`;
    
    const paramTypeClass = `inline-block transition-all duration-500 ease-in-out ${currentStep >= AnimationStep.FADE_OUT_TYPES ? 'opacity-0 -translate-x-2' : ''} ${currentStep >= AnimationStep.SCAN_TYPES ? 'glow-red' : ''}`;
    const paramPunctuationClass = `transition-opacity duration-300 ${currentStep >= AnimationStep.FADE_OUT_TYPES ? 'opacity-0' : ''}`;
    
    const arrowPartClass = `transition-opacity duration-300 ${currentStep >= AnimationStep.EXECUTE_ARROW_MORPH ? 'opacity-0' : 'opacity-100'}`;
    const arrowClass = `transition-opacity duration-300 ${currentStep >= AnimationStep.EXECUTE_ARROW_MORPH ? 'opacity-100 delay-300' : 'opacity-0'}`;

    const canImplode = codeParts.final.canBeExpression;
    const implosionClass = `inline-block transition-all duration-500 ${currentStep >= AnimationStep.EXECUTE_IMPLOSION && canImplode ? 'opacity-0 scale-0 -rotate-90' : ''}`;
    
    const finalAssemblyClass = `transition-all duration-700 ease-in-out ${currentStep >= AnimationStep.ASSEMBLE_FINAL_LAMBDA ? 'space-x-1' : 'space-x-0'}`;

    if (currentStep >= AnimationStep.PREPARE_LAMBDA_ASSEMBLY) {
        const finalContainerClass = `transition-opacity duration-1000 ${currentStep >= AnimationStep.PREPARE_LAMBDA_ASSEMBLY ? 'opacity-100' : 'opacity-0'}`;
        const finalGlowClass = `${currentStep >= AnimationStep.FINAL_GLOW ? 'final-glow' : ''}`;
        return (
            <div className={`whitespace-pre-wrap text-left text-lg ${finalContainerClass}`}>
                <span className="text-gray-400">{codeParts.contextBefore}</span>
                <span className={`${finalGlowClass} ${finalAssemblyClass}`}>
                    {codeParts.final.canBeExpression
                        ? <span>{codeParts.final.lambda}</span>
                        : (
                            <span>
                                <span>{`(${codeParts.core.paramNames.join(', ')}) -> `}</span>
                                <span className="text-green-300">{codeParts.core.body}</span>
                            </span>
                        )
                    }
                </span>
                <span className="text-gray-400">{codeParts.contextAfter}</span>
            </div>
        );
    }

    return (
      <div className="whitespace-pre-wrap text-left text-lg text-gray-300 relative">
        <span className={contextClass}>{codeParts.contextBefore}</span>
        
        {currentStep >= AnimationStep.SHATTER_BOILERPLATE && (
          <span className="absolute opacity-0 -z-10">{shatteredChars}</span>
        )}
        <span className={boilerplateClass}>{codeParts.boilerplate.start}</span>

        <span className={coreLogicClass}>
            {/* Parameters */}
            <span className="relative">
                <span className={arrowPartClass}>
                    {'('}
                </span>
                {codeParts.core.paramNames.map((name, i) => (
                    <React.Fragment key={i}>
                        <span className="relative inline-block">
                             <span className={paramTypeClass}>
                                {codeParts.core.paramTypes[i]}
                                {currentStep === AnimationStep.SCAN_TYPES && <div className="scanline"></div>}
                            </span>
                        </span>
                        <span>{name}</span>
                        {i < codeParts.core.paramNames.length - 1 && <span className={paramPunctuationClass}>{', '}</span>}
                    </React.Fragment>
                ))}
                <span className={arrowPartClass}>
                    {')'}
                </span>
            </span>

          {/* Arrow */}
          <span className="inline-block relative w-16 text-center">
              <span className={`absolute left-1/2 -translate-x-1/2 ${arrowClass}`}>
                <Tooltip text="A lambda provides the implementation for a Functional Interface.">
                    -&gt;
                </Tooltip>
              </span>
           </span>
           
          {/* Body */}
           <span className={`${arrowPartClass} ${implosionClass}`}>{` {`}</span>
            <div className={`inline-block transition-all duration-700 ${currentStep >= AnimationStep.EXECUTE_IMPLOSION && canImplode ? 'pl-0' : 'pl-4'}`}>
                 {canImplode && (
                     <span className={`${implosionClass} text-magenta-400 glow-magenta`}>{`return `}</span>
                 )}
                 <span>{codeParts.core.body.replace(/{|}|return|;/g, '').trim()}</span>
                 {canImplode && (
                     <span className={`${implosionClass} text-magenta-400 glow-magenta`}>{`;`}</span>
                 )}
            </div>
           <span className={`${arrowPartClass} ${implosionClass}`}>{`}`}</span>
        </span>

        <span className={boilerplateClass}>{codeParts.boilerplate.end}</span>
        <span className={contextClass}>{codeParts.contextAfter}</span>
      </div>
    );
  }
  
  return (
    <div className="p-4 flex flex-col items-center justify-between h-full min-h-[200px]">
      <div className="flex-grow w-full flex items-center justify-center">
        {renderCode()}
      </div>
      <div className="h-10 text-center text-indigo-300 transition-opacity duration-500 mt-4">
        {step < AnimationStep.DONE && <p key={step} className="animate-fade-in">{description}</p>}
      </div>
    </div>
  );
};