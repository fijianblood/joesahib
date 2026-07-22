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
    starter: `// component double(n) { return n * 2 }\n\n// mount(double(21))\n`,
    expected: ['42'],
    hint: 'component double(n) {\n  return n * 2\n}\nmount(double(21))',
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
  {
    id: 'multiplication-table',
    title: 'Level 7 · Multiplication Table',
    brief: 'Loop over rows and cols (both [1,2,3]) with a loop inside a loop, and mount `${row} x ${col} = ${row * col}` for every pair.',
    starter: `state rows = [1, 2, 3]\nstate cols = [1, 2, 3]\n\n// for each row in rows {\n//   for each col in cols {\n//     mount(\`\${row} x \${col} = \${row * col}\`)\n//   }\n// }\n`,
    expected: ['1 x 1 = 1', '1 x 2 = 2', '1 x 3 = 3', '2 x 1 = 2', '2 x 2 = 4', '2 x 3 = 6', '3 x 1 = 3', '3 x 2 = 6', '3 x 3 = 9'],
    hint: 'for each row in rows {\n  for each col in cols {\n    mount(`${row} x ${col} = ${row * col}`)\n  }\n}',
  },
  {
    id: 'shopping-cart',
    title: 'Level 8 · Shopping Cart Total',
    brief: 'Declare hook total = 0. Loop over prices and add each price to total. Finally mount `Total: $${total}`.',
    starter: `state prices = [25, 40, 15, 20]\nhook total = 0\n\n// for each price in prices {\n//   total = total + price\n// }\n\n// mount(\`Total: $\${total}\`)\n`,
    expected: ['Total: $100'],
    hint: 'for each price in prices {\n  total = total + price\n}\nmount(`Total: $${total}`)',
  },
  {
    id: 'fastest-speed',
    title: 'Level 9 · Fastest Speed',
    brief: 'Loop over speeds and use route to update fastest whenever a speed beats it. Mount `Fastest: ${fastest} km/h`.',
    starter: `state speeds = [12, 45, 30, 45, 22]\nhook fastest = 0\n\n// for each speed in speeds {\n//   route (speed > fastest) {\n//     fastest = speed\n//   }\n// }\n\n// mount(\`Fastest: \${fastest} km/h\`)\n`,
    expected: ['Fastest: 45 km/h'],
    hint: 'for each speed in speeds {\n  route (speed > fastest) {\n    fastest = speed\n  }\n}\nmount(`Fastest: ${fastest} km/h`)',
  },
  {
    id: 'exam-pass-count',
    title: 'Level 10 · Exam Pass Count',
    brief: 'Loop over scores and count how many are 60 or above using route. Mount `Passed: ${passed} of 5`.',
    starter: `state scores = [55, 82, 91, 40, 76]\nhook passed = 0\n\n// for each score in scores {\n//   route (score >= 60) {\n//     passed = passed + 1\n//   }\n// }\n\n// mount(\`Passed: \${passed} of 5\`)\n`,
    expected: ['Passed: 3 of 5'],
    hint: 'for each score in scores {\n  route (score >= 60) {\n    passed = passed + 1\n  }\n}\nmount(`Passed: ${passed} of 5`)',
  },
  {
    id: 'running-receipt',
    title: 'Level 11 · Running Receipt',
    brief: 'Loop over cart, add each item to a running hook total, and mount a line per item showing the item price and the running total so far. No code is given this time — write the loop yourself using the cheatsheet below.',
    starter: `state cart = [10, 20, 5]\nhook running = 0\n\n// Write your own "for each" loop over cart here.\n// Inside it: add the item to running, then mount a line\n// showing the item price and the running total so far.\n`,
    expected: ['Item: $10 → Running total: $10', 'Item: $20 → Running total: $30', 'Item: $5 → Running total: $35'],
    hint: 'for each item in cart {\n  running = running + item\n  mount(`Item: $${item} → Running total: $${running}`)\n}',
  },
  {
    id: 'sum-to-n',
    title: 'Level 12 · Sum to N',
    brief: 'Write a recursive component sumTo(n): return 0 when n <= 0, otherwise n + sumTo(n - 1). Remove the // and fill in the ____ blank (the keyword for the "otherwise" branch of route). Mount `Sum 1 to 10: ${sumTo(10)}`.',
    starter: `// component sumTo(n) {\n//   route (n <= 0) {\n//     return 0\n//   } ____ {\n//     return n + sumTo(n - 1)\n//   }\n// }\n\n// mount(\`Sum 1 to 10: \${sumTo(10)}\`)\n`,
    expected: ['Sum 1 to 10: 55'],
    hint: 'component sumTo(n) {\n  route (n <= 0) {\n    return 0\n  } else {\n    return n + sumTo(n - 1)\n  }\n}\nmount(`Sum 1 to 10: ${sumTo(10)}`)',
  },
  {
    id: 'factorial',
    title: 'Level 13 · Factorial',
    brief: 'Write a recursive component factorial(n): return 1 when n <= 1, otherwise n * factorial(n - 1). Remove the // and fill in the ____ blank. Mount `5! = ${factorial(5)}`.',
    starter: `// component factorial(n) {\n//   route (n <= 1) {\n//     return 1\n//   } ____ {\n//     return n * factorial(n - 1)\n//   }\n// }\n\n// mount(\`5! = \${factorial(5)}\`)\n`,
    expected: ['5! = 120'],
    hint: 'component factorial(n) {\n  route (n <= 1) {\n    return 1\n  } else {\n    return n * factorial(n - 1)\n  }\n}\nmount(`5! = ${factorial(5)}`)',
  },
  {
    id: 'fibonacci',
    title: 'Level 14 · Fibonacci',
    brief: 'Write a recursive component fib(n): fib(0)=0, fib(1)=1, otherwise fib(n-1)+fib(n-2). Remove the // and fill in the ____ blank. Loop over [0,1,2,3,4,5,6] and mount `fib(${i}) = ${fib(i)}` for each.',
    starter: `// component fib(n) {\n//   route (n <= 1) {\n//     return n\n//   } ____ {\n//     return fib(n - 1) + fib(n - 2)\n//   }\n// }\n\n// for each i in [0, 1, 2, 3, 4, 5, 6] {\n//   mount(\`fib(\${i}) = \${fib(i)}\`)\n// }\n`,
    expected: ['fib(0) = 0', 'fib(1) = 1', 'fib(2) = 1', 'fib(3) = 2', 'fib(4) = 3', 'fib(5) = 5', 'fib(6) = 8'],
    hint: 'component fib(n) {\n  route (n <= 1) {\n    return n\n  } else {\n    return fib(n - 1) + fib(n - 2)\n  }\n}\nfor each i in [0, 1, 2, 3, 4, 5, 6] {\n  mount(`fib(${i}) = ${fib(i)}`)\n}',
  },
  {
    id: 'even-or-odd',
    title: 'Level 15 · Even or Odd (No % Allowed)',
    brief: 'Weave has no % operator. Remove the // and fill in the two ____ blanks (think: the keyword for the "otherwise" branch of route) to complete a recursive component isEven(n): "Even" when n == 0, "Odd" when n == 1, otherwise isEven(n - 2). Loop over [4,7,10,13] and mount `${n} is ${isEven(n)}`.',
    starter: `// component isEven(n) {\n//   route (n == 0) {\n//     return \"Even\"\n//   } ____ {\n//     route (n == 1) {\n//       return \"Odd\"\n//     } ____ {\n//       return isEven(n - 2)\n//     }\n//   }\n// }\n\n// for each n in [4, 7, 10, 13] {\n//   mount(\`\${n} is \${isEven(n)}\`)\n// }\n`,
    expected: ['4 is Even', '7 is Odd', '10 is Even', '13 is Odd'],
    hint: 'component isEven(n) {\n  route (n == 0) {\n    return "Even"\n  } else {\n    route (n == 1) {\n      return "Odd"\n    } else {\n      return isEven(n - 2)\n    }\n  }\n}\nfor each n in [4, 7, 10, 13] {\n  mount(`${n} is ${isEven(n)}`)\n}',
  },
  {
    id: 'fizzbuzz',
    title: 'Level 16 · FizzBuzz',
    brief: 'The classic — but still no %. The isDivisible(n, d) helper below (already written) returns 1 when divisible and 0 otherwise — Weave has no true/false, so route just treats 0 as falsy. Remove the // and fill in the three ____ blanks to loop over nums 1 to 15 and mount "FizzBuzz" (divisible by 15), "Fizz" (by 3), "Buzz" (by 5), or the number itself.',
    starter: `component isDivisible(n, d) {\n  route (n < d) {\n    route (n == 0) {\n      return 1\n    } else {\n      return 0\n    }\n  } else {\n    return isDivisible(n - d, d)\n  }\n}\n\nstate nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]\n\n// for each n in nums {\n//   route (isDivisible(n, 15)) {\n//     mount(\"FizzBuzz\")\n//   } ____ {\n//     route (isDivisible(n, 3)) {\n//       mount(\"Fizz\")\n//     } ____ {\n//       route (isDivisible(n, 5)) {\n//         mount(\"Buzz\")\n//       } ____ {\n//         mount(\`\${n}\`)\n//       }\n//     }\n//   }\n// }\n`,
    expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'],
    hint: 'for each n in nums {\n  route (isDivisible(n, 15)) {\n    mount("FizzBuzz")\n  } else {\n    route (isDivisible(n, 3)) {\n      mount("Fizz")\n    } else {\n      route (isDivisible(n, 5)) {\n        mount("Buzz")\n      } else {\n        mount(`${n}`)\n      }\n    }\n  }\n}',
  },
  {
    id: 'signal-bars',
    title: 'Level 17 · Signal Bars',
    brief: 'For each row in [1,2,3,4], build a hook string bar by looping the same list again and appending "█" whenever col <= row, then mount the finished bar for that row. No code is given this time — write it yourself using the cheatsheet below.',
    starter: `state rows = [1, 2, 3, 4]\n\n// Write your own nested loop here: for each row, build a\n// string (start it as "") by appending "█" once for every\n// col <= row, then mount the finished string for that row.\n`,
    expected: ['█', '██', '███', '████'],
    hint: 'for each row in rows {\n  hook bar = ""\n  for each col in rows {\n    route (col <= row) {\n      bar = bar + "█"\n    }\n  }\n  mount(bar)\n}',
  },
  {
    id: 'average-reading',
    title: 'Level 18 · Average Reading',
    brief: 'Loop over readings, accumulating both a total and a count in two hooks. Declare state average = total / count, then mount `Average: ${average}`. No code is given this time — write it yourself using the cheatsheet below.',
    starter: `state readings = [72, 68, 75, 65]\nhook total = 0\nhook count = 0\n\n// Write your own loop here: add each reading to total and\n// increment count. Afterward declare state average = total / count\n// and mount a line showing it.\n`,
    expected: ['Average: 70'],
    hint: 'for each r in readings {\n  total = total + r\n  count = count + 1\n}\nstate average = total / count\nmount(`Average: ${average}`)',
  },
  {
    id: 'grade-report',
    title: 'Level 19 · Grade Report',
    brief: 'Write a component grade(score) with nested route/else: 90+ returns "A", 75+ returns "B", 60+ returns "C", else "F". Remove the // and fill in the three ____ blanks. Loop over scores and mount `${score} → ${grade(score)}` for each.',
    starter: `// component grade(score) {\n//   route (score >= 90) {\n//     return \"A\"\n//   } ____ {\n//     route (score >= 75) {\n//       return \"B\"\n//     } ____ {\n//       route (score >= 60) {\n//         return \"C\"\n//       } ____ {\n//         return \"F\"\n//       }\n//     }\n//   }\n// }\n\nstate scores = [95, 82, 58, 71]\n\n// for each s in scores {\n//   mount(\`\${s} → \${grade(s)}\`)\n// }\n`,
    expected: ['95 → A', '82 → B', '58 → F', '71 → C'],
    hint: 'component grade(score) {\n  route (score >= 90) {\n    return "A"\n  } else {\n    route (score >= 75) {\n      return "B"\n    } else {\n      route (score >= 60) {\n        return "C"\n      } else {\n        return "F"\n      }\n    }\n  }\n}\nfor each s in scores {\n  mount(`${s} → ${grade(s)}`)\n}',
  },
  {
    id: 'signal-relay-network',
    title: 'Level 20 · Signal Relay Network (Final)',
    brief: 'The final challenge. Write a recursive component signalAt(hop): signalAt(0) = 100, and every further hop is signalAt(hop - 1) - 15. Remove the // and fill in the two ____ blanks. Loop over hops [0..5]; mount the strength at each hop, appending " — weak" and incrementing a hook when it drops below 50. Finish with mount(`Weak hops: ${weak}`).',
    starter: `// component signalAt(hop) {\n//   route (hop == 0) {\n//     return 100\n//   } ____ {\n//     return signalAt(hop - 1) - 15\n//   }\n// }\n\nstate hops = [0, 1, 2, 3, 4, 5]\nhook weak = 0\n\n// for each h in hops {\n//   state strength = signalAt(h)\n//   route (strength < 50) {\n//     mount(\`Hop \${h}: \${strength}% — weak\`)\n//     weak = weak + 1\n//   } ____ {\n//     mount(\`Hop \${h}: \${strength}%\`)\n//   }\n// }\n\n// mount(\`Weak hops: \${weak}\`)\n`,
    expected: ['Hop 0: 100%', 'Hop 1: 85%', 'Hop 2: 70%', 'Hop 3: 55%', 'Hop 4: 40% — weak', 'Hop 5: 25% — weak', 'Weak hops: 2'],
    hint: 'component signalAt(hop) {\n  route (hop == 0) {\n    return 100\n  } else {\n    return signalAt(hop - 1) - 15\n  }\n}\nfor each h in hops {\n  state strength = signalAt(h)\n  route (strength < 50) {\n    mount(`Hop ${h}: ${strength}% — weak`)\n    weak = weak + 1\n  } else {\n    mount(`Hop ${h}: ${strength}%`)\n  }\n}\nmount(`Weak hops: ${weak}`)',
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
