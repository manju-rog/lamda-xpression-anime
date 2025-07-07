import { AnimationStep } from './types';
import type { CodeParts } from './types';

export const JAVA_RUNNABLE_EXAMPLE_RAW = `Runnable myTask = new Runnable() {
    @Override
    public void run() {
        System.out.println("Executing a background task...");
    }
};`;

export const STEP_DESCRIPTIONS: Record<AnimationStep, string> = {
  [AnimationStep.INITIAL]: "Initializing morph sequence...",
  [AnimationStep.FADE_CONTEXT]: "Fading out surrounding code to focus on the core logic.",
  [AnimationStep.ISOLATE_BOILERPLATE]: "Highlighting the verbose boilerplate syntax.",
  [AnimationStep.SHATTER_BOILERPLATE]: "Shattering the unnecessary ceremony code.",
  [AnimationStep.PREPARE_ARROW_MORPH]: "Preparing to forge the lambda arrow '->'.",
  [AnimationStep.EXECUTE_ARROW_MORPH]: "The lambda arrow is born from the old syntax.",
  [AnimationStep.SCAN_TYPES]: "Scanning for redundant type definitions.",
  [AnimationStep.FADE_OUT_TYPES]: "Compiler inference makes explicit types unnecessary.",
  [AnimationStep.PREPARE_IMPLOSION]: "Identifying single-line return that can be simplified.",
  [AnimationStep.EXECUTE_IMPLOSION]: "Imploding brackets, return statement, and semicolon.",
  [AnimationStep.PREPARE_LAMBDA_ASSEMBLY]: "The essential components are all that remain.",
  [AnimationStep.ASSEMBLE_FINAL_LAMBDA]: "Assembling the final, elegant lambda expression.",
  [AnimationStep.FINAL_GLOW]: "Morph complete. Behold the power of lambdas.",
  [AnimationStep.DONE]: "Ready for the next transformation.",
};


// A library of pre-parsed examples for the "Morph Example" feature.
// This ensures high-quality, reliable animations for a curated set of code snippets.
export const ALL_EXAMPLES: CodeParts[] = [
  // 1. Player Score Comparator (Classic)
  {
    type: 'Comparator',
    description: "Sort players by score in descending order",
    full: ``, // full text not needed for pre-parsed
    contextBefore: `Collections.sort(players, `,
    contextAfter: `);`,
    boilerplate: {
      start: `new Comparator<Player>() {\n    @Override\n    public int compare`,
      end: `\n    }\n}`
    },
    core: {
      params: `(Player p1, Player p2)`,
      paramTypes: ['Player ', 'Player '],
      paramNames: ['p1', 'p2'],
      body: `{\n        return Integer.compare(p2.getScore(), p1.getScore());\n    }`
    },
    final: {
      lambda: `(p1, p2) -> Integer.compare(p2.getScore(), p1.getScore())`,
      canBeExpression: true
    }
  },
  // 2. Simple Runnable
  {
    type: 'Runnable',
    description: "Create a simple task to run on a new thread",
    full: ``,
    contextBefore: `Thread t = new Thread(`,
    contextAfter: `);`,
    boilerplate: {
      start: `new Runnable() {\n    @Override\n    public void run`,
      end: `\n    }\n}`
    },
    core: {
      params: `()`,
      paramTypes: [],
      paramNames: [],
      body: `{\n        System.out.println("Hello from another thread!");\n    }`
    },
    final: {
      lambda: `() -> System.out.println("Hello from another thread!")`,
      canBeExpression: true // Technically not a return, but a single statement
    }
  },
  // 3. String length comparator
  {
    type: 'Comparator',
    description: "Sort strings by their length",
    full: ``,
    contextBefore: `words.sort(`,
    contextAfter: `);`,
    boilerplate: {
      start: `new Comparator<String>() {\n    public int compare`,
      end: `\n    }\n}`
    },
    core: {
      params: `(String a, String b)`,
      paramTypes: ['String ', 'String '],
      paramNames: ['a', 'b'],
      body: `{\n        return a.length() - b.length();\n    }`
    },
    final: {
      lambda: `(a, b) -> a.length() - b.length()`,
      canBeExpression: true,
    }
  },
  // 4. Predicate to find short words
  {
    type: 'Predicate',
    description: "Filter a list to find all words shorter than 5 letters",
    full: ``,
    contextBefore: `shortWords = allWords.stream().filter(`,
    contextAfter: `).collect(Collectors.toList());`,
    boilerplate: {
      start: `new Predicate<String>() {\n    public boolean test`,
      end: `\n    }\n}`
    },
    core: {
      params: `(String s)`,
      paramTypes: ['String '],
      paramNames: ['s'],
      body: `{\n        return s.length() < 5;\n    }`
    },
    final: {
      lambda: `s -> s.length() < 5`,
      canBeExpression: true
    }
  },
  // 5. Function to get string lengths
  {
    type: 'Function',
    description: "Map a list of words to a list of their lengths",
    full: ``,
    contextBefore: `wordLengths = words.stream().map(`,
    contextAfter: `).collect(Collectors.toList());`,
    boilerplate: {
      start: `new Function<String, Integer>() {\n    public Integer apply`,
      end: `\n    }\n}`
    },
    core: {
      params: `(String s)`,
      paramTypes: ['String '],
      paramNames: ['s'],
      body: `{\n        return s.length();\n    }`
    },
    final: {
      lambda: `s -> s.length()`,
      canBeExpression: true
    }
  },
  // 6. Consumer to print items
  {
    type: 'Consumer',
    description: "Iterate over a list and print each item",
    full: ``,
    contextBefore: `numbers.forEach(`,
    contextAfter: `);`,
    boilerplate: {
      start: `new Consumer<Integer>() {\n    public void accept`,
      end: `\n    }\n}`
    },
    core: {
      params: `(Integer n)`,
      paramTypes: ['Integer '],
      paramNames: ['n'],
      body: `{\n        System.out.println(n);\n    }`
    },
    final: {
      lambda: `n -> System.out.println(n)`,
      canBeExpression: true // Single statement
    }
  },
  // 7. Multi-line runnable that does NOT simplify
  {
    type: 'Runnable',
    description: "A task with multiple steps that requires braces",
    full: ``,
    contextBefore: `executor.submit(`,
    contextAfter: `);`,
    boilerplate: {
      start: `new Runnable() {\n    public void run`,
      end: `\n    }\n}`
    },
    core: {
      params: `()`,
      paramTypes: [],
      paramNames: [],
      body: `{\n        System.out.println("Starting complex task...");\n        longRunningOperation();\n        System.out.println("Task finished.");\n    }`
    },
    final: {
      lambda: `() -> {\n        System.out.println("Starting complex task...");\n        longRunningOperation();\n        System.out.println("Task finished.");\n    }`,
      canBeExpression: false
    }
  },
  // 8. Predicate to find non-empty strings
  {
    type: 'Predicate',
    description: "Filter out empty strings from a list",
    full: ``,
    contextBefore: `nonEmpty = strings.stream().filter(`,
    contextAfter: `).collect(Collectors.toList());`,
    boilerplate: {
      start: `new Predicate<String>() {\n    public boolean test`,
      end: `\n    }\n}`
    },
    core: {
      params: `(String str)`,
      paramTypes: ['String '],
      paramNames: ['str'],
      body: `{\n        return !str.isEmpty();\n    }`
    },
    final: {
      lambda: `str -> !str.isEmpty()`,
      canBeExpression: true
    }
  },
   // 9. Function to square numbers
   {
    type: 'Function',
    description: "Map a list of numbers to their squares",
    full: ``,
    contextBefore: `squares = numbers.stream().map(`,
    contextAfter: `).collect(Collectors.toList());`,
    boilerplate: {
      start: `new Function<Integer, Integer>() {\n    public Integer apply`,
      end: `\n    }\n}`
    },
    core: {
      params: `(Integer x)`,
      paramTypes: ['Integer '],
      paramNames: ['x'],
      body: `{\n        return x * x;\n    }`
    },
    final: {
      lambda: `x -> x * x`,
      canBeExpression: true
    }
  },
  // 10. Comparator with multiple conditions
  {
    type: 'Comparator',
    description: "Sort users by role, then by name",
    full: ``,
    contextBefore: `users.sort(`,
    contextAfter: `);`,
    boilerplate: {
        start: `new Comparator<User>() {\n    @Override\n    public int compare`,
        end: `\n    }\n}`
    },
    core: {
        params: `(User u1, User u2)`,
        paramTypes: ['User ', 'User '],
        paramNames: ['u1', 'u2'],
        body: `{\n        int roleCompare = u1.getRole().compareTo(u2.getRole());\n        if (roleCompare != 0) {\n            return roleCompare;\n        }\n        return u1.getName().compareTo(u2.getName());\n    }`
    },
    final: {
        lambda: `(u1, u2) -> {\n        int roleCompare = u1.getRole().compareTo(u2.getRole());\n        if (roleCompare != 0) {\n            return roleCompare;\n        }\n        return u1.getName().compareTo(u2.getName());\n    }`,
        canBeExpression: false
    }
  }
];