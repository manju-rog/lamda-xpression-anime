import type { CodeParts } from '../types';

const PARSERS: ((code: string) => CodeParts | null)[] = [
    parseComparator,
    parseRunnable,
];

export function parseCode(code: string): CodeParts | null {
  for (const parser of PARSERS) {
    const result = parser(code);
    if (result) {
      return result;
    }
  }
  return null;
}

function parseComparator(code: string): CodeParts | null {
  const regex = /(.*?)new Comparator<.*?>\(\) {\s*(@Override\s*)?public int compare\s*(\((.*?)\))\s*({[^}]*})[^}]*};(.*)/s;
  const match = code.match(regex);

  if (!match) return null;

  const [, contextBefore,, paramsWithTypes, paramContent, body, contextAfter] = match;

  const paramPairs = paramContent.split(',').map(p => p.trim().split(/\s+/));
  const paramTypes = paramPairs.map(p => p[0] + ' ');
  const paramNames = paramPairs.map(p => p[1]);
  
  const canBeExpression = body.split(';').length <= 2 && body.includes('return');
  const finalLambdaBody = canBeExpression 
      ? body.replace(/return\s*|;|\s*|\{|\}/g, '') 
      : `{\n        ${body.trim().slice(1, -1).trim()}\n    }`;

  const finalLambda = `(${paramNames.join(', ')}) -> ${finalLambdaBody}`;

  return {
    type: 'Comparator',
    description: 'Custom comparator logic',
    full: code,
    contextBefore: contextBefore.trim() + " ",
    contextAfter: contextAfter.trim(),
    boilerplate: {
      start: `new Comparator<...>() {\n    @Override\n    public int compare`,
      end: `\n    }\n}`
    },
    core: {
      params: paramsWithTypes.trim(),
      paramTypes,
      paramNames,
      body: body.trim()
    },
    final: {
      lambda: finalLambda,
      canBeExpression,
    }
  };
}

function parseRunnable(code: string): CodeParts | null {
  const regex = /(.*?)new Runnable\(\) {\s*(@Override\s*)?public void run\(\)\s*({[^}]*})[^}]*};(.*)/s;
  const match = code.match(regex);

  if (!match) return null;

  const [, contextBefore, , body, contextAfter] = match;
  
  const innerBody = body.trim().slice(1, -1).trim();
  const statementCount = innerBody.split(';').filter(s => s.trim().length > 0).length;
  const canBeExpression = statementCount === 1;

  const finalBody = canBeExpression 
    ? (innerBody.endsWith(';') ? innerBody.slice(0, -1) : innerBody)
    : `{\n        ${innerBody}\n    }`;

  return {
    type: 'Runnable',
    description: 'Custom runnable task',
    full: code,
    contextBefore: contextBefore.trim() + " ",
    contextAfter: contextAfter.trim(),
    boilerplate: {
      start: `new Runnable() {\n    @Override\n    public void run`,
      end: `\n    }\n}`
    },
    core: {
      params: `()`,
      paramTypes: [],
      paramNames: [],
      body: body.trim(),
    },
    final: {
      lambda: `() -> ${finalBody}`,
      canBeExpression
    }
  };
}
