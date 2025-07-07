
import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex-grow bg-black bg-opacity-40 rounded-lg p-4 border border-gray-700 h-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
        className="w-full h-full bg-transparent text-gray-200 resize-none focus:outline-none p-2 font-fira leading-relaxed"
      />
      <div className="absolute bottom-4 right-4 text-cyan-400 opacity-70 editor-caret glow-cyan">|</div>
    </div>
  );
};
