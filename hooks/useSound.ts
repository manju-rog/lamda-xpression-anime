
import { useCallback, useRef } from 'react';

type SoundType = 'hum' | 'crack' | 'swoosh' | 'fizz' | 'merge';

export const useSound = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const playSound = useCallback((type: SoundType) => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch (type) {
            case 'hum':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(80, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
                break;
            case 'crack':
                oscillator.type = 'sawtooth';
                 // A noise burst for a crack sound
                for(let i=0; i<10; i++){
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = 'sawtooth';
                    o.frequency.value = 500 + Math.random() * 2000;
                    o.connect(g);
                    g.connect(ctx.destination);
                    g.gain.setValueAtTime(0.2, ctx.currentTime + i*0.01);
                    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i*0.01 + 0.05);
                    o.start(ctx.currentTime + i*0.01);
                    o.stop(ctx.currentTime + i*0.01 + 0.05);
                }
                return; // Return early because we created our own oscillators
            case 'swoosh':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(2000, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
                break;
            case 'fizz':
                 oscillator.type = 'square';
                 oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
                 gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                 gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
                 break;
            case 'merge':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, ctx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
                break;
        }

        oscillator.start();
        oscillator.stop(ctx.currentTime + 1);
    }, []);

    return playSound;
};
