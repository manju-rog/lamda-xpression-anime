export enum AnimationStep {
  INITIAL,
  FADE_CONTEXT,
  ISOLATE_BOILERPLATE,
  SHATTER_BOILERPLATE,
  PREPARE_ARROW_MORPH,
  EXECUTE_ARROW_MORPH,
  SCAN_TYPES,
  FADE_OUT_TYPES,
  PREPARE_IMPLOSION,
  EXECUTE_IMPLOSION,
  PREPARE_LAMBDA_ASSEMBLY,
  ASSEMBLE_FINAL_LAMBDA,
  FINAL_GLOW,
  DONE,
}

export interface CodeParts {
  type: 'Comparator' | 'Runnable' | 'Predicate' | 'Function' | 'Consumer' | 'Supplier' | 'Unknown';
  description: string;
  full: string;
  contextBefore: string;
  contextAfter: string;
  boilerplate: {
    start: string;
    end: string;
  };
  core: {
    params: string;
    paramTypes: string[];
    paramNames: string[];
    body: string;
  };
  final: {
    lambda: string;
    canBeExpression: boolean;
  };
}