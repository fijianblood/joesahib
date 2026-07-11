export interface WeaveChallenge {
  id: string;
  title: string;
  brief: string;
  starter: string;
  expected: string[];
  hint: string;
}

export const WEAVE_CHALLENGES: WeaveChallenge[] = [
  {
    id: 'hello',
    title: 'Level 1 · Say Bula',
    brief: 'Use mount() to print exactly: Bula, Weave!',
    starter: `// mount() prints text to the screen\n// Try: mount("Bula, Weave!")\n`,
    expected: ['Bula, Weave!'],
    hint: 'mount("Bula, Weave!")',
  },
  {
    id: 'variables',
    title: 'Level 2 · Variables',
    brief: 'Declare state island = "Fiji" then mount a template that prints: Greetings from Fiji!',
    starter: `state island = "Fiji"\n\n// mount a template string using \${island}\n`,
    expected: ['Greetings from Fiji!'],
    hint: 'mount(`Greetings from ${island}!`)',
  },
  {
    id: 'loops',
    title: 'Level 3 · Loops',
    brief: 'Loop over the services list and mount() each one, in order.',
    starter: `state services = ["Laptop Repair", "Web Dev", "Networking"]\n\n// for each service in services { mount(service) }\n`,
    expected: ['Laptop Repair', 'Web Dev', 'Networking'],
    hint: 'for each service in services {\n  mount(service)\n}',
  },
  {
    id: 'functions',
    title: 'Level 4 · Components',
    brief: 'Write a component called double that returns its input times 2, then mount(double(21)).',
    starter: `// component double(n) { return n * 2 }\n\nmount(double(21))\n`,
    expected: ['42'],
    hint: 'component double(n) {\n  return n * 2\n}',
  },
  {
    id: 'conditionals',
    title: 'Level 5 · Routing',
    brief: 'Use route/else to check if 2026 is greater than 2020. Mount "Future" if true, otherwise mount "Past".',
    starter: `route (2026 > 2020) {\n  // mount "Future"\n} else {\n  // mount "Past"\n}\n`,
    expected: ['Future'],
    hint: 'route (2026 > 2020) {\n  mount("Future")\n} else {\n  mount("Past")\n}',
  },
  {
    id: 'finale',
    title: 'Level 6 · Visitor Counter',
    brief: 'Declare hook counter = 0. Loop over ["Josese","Ana","Sam"], mount "Hi, X!" for each name and increment counter. Finally mount `Total visitors: ${counter}`.',
    starter: `state visitors = ["Josese", "Ana", "Sam"]\nhook counter = 0\n\n// for each name in visitors {\n//   mount(\`Hi, \${name}!\`)\n//   counter = counter + 1\n// }\n\n// mount(\`Total visitors: \${counter}\`)\n`,
    expected: ['Hi, Josese!', 'Hi, Ana!', 'Hi, Sam!', 'Total visitors: 3'],
    hint: 'for each name in visitors {\n  mount(`Hi, ${name}!`)\n  counter = counter + 1\n}\nmount(`Total visitors: ${counter}`)',
  },
];

export const SANDBOX_SAMPLE = `component greet(name) {
  return \`Hello, \${name}! Welcome to Weave.\`
}

state siteName = "LvTS Portfolio"
state visitors = ["Josese", "Ana", "Sam"]

mount(\`=== \${siteName} ===\`)

hook counter = 0

for each visitor in visitors {
  mount(greet(visitor))
  counter = counter + 1
}

mount(\`Visitors greeted: \${counter}\`)

route (counter > 2) {
  fetch(300)
  mount("Busy site! Data loaded after a short delay.")
} else {
  mount("Quiet day.")
}
`;

export const CHEATSHEET: { code: string; desc: string }[] = [
  { code: 'state x = v', desc: 'declare a variable' },
  { code: 'hook x = v', desc: 'variable that persists across loop iterations' },
  { code: 'component f(a) { }', desc: 'define a function' },
  { code: 'mount(x)', desc: 'output / print' },
  { code: 'route (c) { } else { }', desc: 'if / else' },
  { code: 'for each x in list { }', desc: 'loop over a list' },
  { code: 'return v', desc: 'return a value from a component' },
  { code: 'fetch(ms)', desc: 'fake async delay' },
  { code: '`text ${x}`', desc: 'string interpolation' },
];
