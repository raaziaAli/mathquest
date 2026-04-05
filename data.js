// ── ISLAND DATA ──
const ISLANDS = [
  { id:'ratios', name:'Ratio Reef', realm:'The Proportion Archipelago',
    desc:'Master rates, unit rates & proportional relationships on coral shores.',
    col:'#0EA5E9', dark:'#0C4A6E', glow:'rgba(14,165,233,0.45)',
    lvs:['done','curr','lock'], xp:62, xplbl:'620 / 1,000 XP', icon:'📐',
    x:0.20, y:0.35, rx:0.12, ry:0.065, live:true },
  { id:'numbers', name:'Number Peaks', realm:'The Numerical Highlands',
    desc:'Conquer fractions, decimals, scientific notation & rational numbers.',
    col:'#A855F7', dark:'#3B0764', glow:'rgba(168,85,247,0.45)',
    lvs:['done','done','curr'], xp:85, xplbl:'850 / 1,000 XP', icon:'🔢',
    x:0.70, y:0.22, rx:0.11, ry:0.060, live:false },
  { id:'expressions', name:'Equation Volcano', realm:'The Algebraic Badlands',
    desc:'Survive eruptions of variables & inequalities, solve equations under pressure.',
    col:'#EF4444', dark:'#450A0A', glow:'rgba(239,68,68,0.45)',
    lvs:['done','curr','lock'], xp:40, xplbl:'400 / 1,000 XP', icon:'🧮',
    x:0.78, y:0.60, rx:0.11, ry:0.060, live:false },
  { id:'geometry', name:'Geometry Grove', realm:'The Sacred Forest',
    desc:'Discover area, circles, angles & transformations in ancient woodland.',
    col:'#22C55E', dark:'#14532D', glow:'rgba(34,197,94,0.45)',
    lvs:['done','curr','lock'], xp:30, xplbl:'300 / 1,000 XP', icon:'📏',
    x:0.33, y:0.68, rx:0.115, ry:0.062, live:false },
  { id:'stats', name:'Data Desert', realm:'The Probability Wastes',
    desc:'Chart distributions, probability & sampling across shimmering dunes.',
    col:'#F59E0B', dark:'#451A03', glow:'rgba(245,158,11,0.45)',
    lvs:['curr','lock','lock'], xp:20, xplbl:'200 / 1,000 XP', icon:'📊',
    x:0.57, y:0.75, rx:0.10, ry:0.055, live:false },
  { id:'enrichment', name:'Enrichment Isle', realm:'The Real World Reach',
    desc:'Apply every power to engineering, finance, ecology & space missions.',
    col:'#EC4899', dark:'#500724', glow:'rgba(236,72,153,0.45)',
    lvs:['lock','lock','lock'], xp:5, xplbl:'Unlocks at mastery', icon:'🌍',
    x:0.14, y:0.70, rx:0.085, ry:0.050, live:false }
];

// ── REALM: RATIO REEF ──
const RATIO_REEF = {
  id: 'ratios',
  name: 'Ratio Reef',
  realm: 'The Proportion Archipelago',
  color: '#0EA5E9',
  dark: '#0C4A6E',
  boss: {
    icon: '🐉', name: 'The Ratio Dragon',
    desc: 'A fearsome dragon that devours all who cannot reason with rates and proportions. Prove your mastery to deal damage!',
    hp: 72, fighters: 14
  },
  levels: [
    {
      grade: 6, label: 'Grade 6', status: 'done',
      standard: '6.RP.A — Understand ratio concepts',
      quests: [
        { id:'r6q1', title:'What IS a Ratio?', sub:'Understand part-to-part and part-to-whole ratios using real objects and tape diagrams.', xp:50, stars:3, status:'done', questions:[
          { q:'A fruit bowl has 4 apples and 6 oranges. What is the ratio of apples to total fruit?', opts:['4:6','4:10','6:4','10:4'], ans:1, explain:'Total fruit = 4+6 = 10. Apples to total = 4:10 (or 2:5).' },
          { q:'A class has 12 boys and 15 girls. What is the ratio of girls to boys?', opts:['12:15','15:12','15:27','12:27'], ans:1, explain:'Girls to boys means girls first: 15:12, which simplifies to 5:4.' },
          { q:'Write 3:7 as a fraction.', opts:['7/3','3/10','3/7','7/10'], ans:2, explain:'A ratio a:b can be written as the fraction a/b, so 3:7 = 3/7.' },
        ]},
        { id:'r6q2', title:'Unit Rate Quest', sub:'Find unit rates and use them to compare prices, speeds, and more.', xp:60, stars:3, status:'done', questions:[
          { q:'A car travels 150 miles in 3 hours. What is its unit rate (speed)?', opts:['45 mph','50 mph','53 mph','60 mph'], ans:1, explain:'Unit rate = 150 ÷ 3 = 50 miles per hour.' },
          { q:'3 notebooks cost $7.50. What is the cost per notebook?', opts:['$2.00','$2.25','$2.50','$3.00'], ans:2, explain:'Cost per notebook = $7.50 ÷ 3 = $2.50.' },
          { q:'Which is the better deal? A: 5 pens for $3.75 or B: 8 pens for $5.60?', opts:['A — $0.75 each','B — $0.70 each','They are equal','Not enough info'], ans:1, explain:'A = $3.75÷5 = $0.75 each. B = $5.60÷8 = $0.70 each. B is the better deal.' },
        ]},
        { id:'r6q3', title:'Equivalent Ratios', sub:'Use ratio tables and double number lines to find equivalent ratios.', xp:65, stars:2, status:'curr', questions:[
          { q:'Are 2:5 and 6:15 equivalent ratios?', opts:['Yes','No','Cannot determine','Only if simplified'], ans:0, explain:'6:15 = 6÷3 : 15÷3 = 2:5. Yes, they are equivalent!' },
          { q:'Complete the ratio table: 3:4 = ?:20', opts:['12','15','16','18'], ans:1, explain:'20 ÷ 4 = 5. So multiply both by 5: 3×5 = 15. Answer: 15:20.' },
          { q:'A recipe uses 2 cups flour for every 3 cups sugar. For 9 cups sugar, how much flour?', opts:['4 cups','5 cups','6 cups','8 cups'], ans:2, explain:'9 ÷ 3 = 3 (scale factor). 2 × 3 = 6 cups of flour.' },
        ]},
      ]
    },
    {
      grade: 7, label: 'Grade 7', status: 'curr',
      standard: '7.RP.A — Analyze proportional relationships',
      quests: [
        { id:'r7q1', title:'Proportional Relationships', sub:'Identify proportional relationships in tables, graphs, and equations.', xp:75, stars:3, status:'done', questions:[
          { q:'Is the table proportional? x: 2,4,6 | y: 6,12,18', opts:['Yes — ratio is 3:1','No — not constant','Yes — ratio is 1:3','Cannot determine'], ans:0, explain:'y/x = 6/2 = 12/4 = 18/6 = 3. Constant ratio → proportional.' },
          { q:'A graph of a proportional relationship always passes through:', opts:['(1,1)','The x-axis','The origin (0,0)','Any two points'], ans:2, explain:'Proportional relationships always pass through the origin (0,0) because when x=0, y=0.' },
          { q:'The equation y = 4.5x represents a proportional relationship. What is the constant of proportionality?', opts:['x','y','4.5','0'], ans:2, explain:'In y = kx, the constant of proportionality k = 4.5.' },
        ]},
        { id:'r7q2', title:'Percent Problems', sub:'Solve real-world percent problems including tax, tip, discounts, and markups.', xp:80, stars:2, status:'curr', questions:[
          { q:'A shirt costs $40. It is on sale for 25% off. What is the sale price?', opts:['$10','$28','$30','$32'], ans:2, explain:'25% of $40 = $10. Sale price = $40 − $10 = $30.' },
          { q:'A meal costs $56. With 15% tip, what is the total?', opts:['$8.40','$62.40','$64.40','$71.00'], ans:2, explain:'Tip = 15% × $56 = $8.40. Total = $56 + $8.40 = $64.40.' },
          { q:'A store buys an item for $80 and sells it for $120. What is the percent markup?', opts:['33%','40%','50%','67%'], ans:2, explain:'Markup = ($120−$80)/$80 = $40/$80 = 0.50 = 50%.' },
        ]},
        { id:'r7q3', title:'Scale & Proportion', sub:'Use proportional reasoning to solve scale drawing and map problems.', xp:85, stars:0, status:'lock', questions:[
          { q:'A map has scale 1 inch = 50 miles. Two cities are 3.5 inches apart. How far apart are they?', opts:['53.5 miles','150 miles','175 miles','200 miles'], ans:2, explain:'3.5 × 50 = 175 miles.' },
          { q:'A model car is 1:24 scale. The real car is 168 inches long. How long is the model?', opts:['5 inches','6 inches','7 inches','8 inches'], ans:2, explain:'168 ÷ 24 = 7 inches.' },
          { q:'If 5 workers finish a job in 12 days, how many days for 3 workers (same rate)?', opts:['7.2 days','15 days','20 days','25 days'], ans:2, explain:'5 × 12 = 60 worker-days. 60 ÷ 3 = 20 days.' },
        ]},
      ]
    },
    {
      grade: 8, label: 'Grade 8', status: 'lock',
      standard: '8.EE.B — Proportional linear relationships',
      quests: [
        { id:'r8q1', title:'Slope as Rate of Change', sub:'Connect proportional relationships to slope and linear equations.', xp:100, stars:0, status:'lock', questions:[
          { q:'A line passes through (0,0) and (4,10). What is the slope?', opts:['0.4','2','2.5','4'], ans:2, explain:'slope = rise/run = 10/4 = 2.5' },
          { q:'The slope of a proportional relationship equals:', opts:['The y-intercept','The x-intercept','The constant of proportionality','The origin'], ans:2, explain:'For y=kx, slope = k = constant of proportionality.' },
          { q:'A line has slope 3/4. For every 8 units right, how many units up?', opts:['4','5','6','8'], ans:2, explain:'(3/4) × 8 = 6 units up.' },
        ]},
      ]
    }
  ]
};

// ── STUDENT DATA ──
const STUDENTS = [
  { name:'Aiden K.', avatar:'🦁', grade:'Gr.7', status:'adv', xp:2890, streak:12, last:'Today', domains:{ratio:95,numbers:90,expr:82,geo:75,stats:68}, current:'Enrichment Isle' },
  { name:'Sofia M.', avatar:'🐉', grade:'Gr.7', status:'adv', xp:2340, streak:8, last:'Today', domains:{ratio:92,numbers:88,expr:78,geo:80,stats:60}, current:'Number Peaks' },
  { name:'Zara P.', avatar:'🧙', grade:'Gr.7', status:'track', xp:1240, streak:5, last:'Today', domains:{ratio:62,numbers:85,expr:40,geo:30,stats:20}, current:'Ratio Reef' },
  { name:'Omar B.', avatar:'🦊', grade:'Gr.7', status:'adv', xp:2100, streak:9, last:'Today', domains:{ratio:88,numbers:91,expr:74,geo:70,stats:55}, current:'Geo Grove' },
  { name:'Rania S.', avatar:'🐺', grade:'Gr.7', status:'adv', xp:2050, streak:7, last:'Yesterday', domains:{ratio:85,numbers:82,expr:70,geo:65,stats:50}, current:'Number Peaks' },
  { name:'Marcus T.', avatar:'🦅', grade:'Gr.7', status:'help', xp:980, streak:1, last:'3 days ago', domains:{ratio:28,numbers:45,expr:22,geo:18,stats:10}, current:'Ratio Reef' },
  { name:'Priya R.', avatar:'🐸', grade:'Gr.7', status:'help', xp:1100, streak:2, last:'Yesterday', domains:{ratio:35,numbers:55,expr:30,geo:25,stats:15}, current:'Ratio Reef' },
  { name:'Lena K.', avatar:'🦋', grade:'Gr.7', status:'help', xp:890, streak:0, last:'4 days ago', domains:{ratio:22,numbers:38,expr:18,geo:15,stats:8}, current:'Ratio Reef' },
  { name:'Yasmine A.', avatar:'🦩', grade:'Gr.7', status:'adv', xp:1980, streak:6, last:'Today', domains:{ratio:80,numbers:85,expr:72,geo:68,stats:52}, current:'Data Desert' },
  { name:'Jake M.', avatar:'🐯', grade:'Gr.7', status:'track', xp:1350, streak:4, last:'Today', domains:{ratio:60,numbers:70,expr:50,geo:45,stats:30}, current:'Eqn Volcano' },
  { name:'Hana L.', avatar:'🦄', grade:'Gr.7', status:'track', xp:1420, streak:5, last:'Today', domains:{ratio:65,numbers:72,expr:55,geo:48,stats:35}, current:'Geo Grove' },
  { name:'Khalid R.', avatar:'🐻', grade:'Gr.7', status:'track', xp:1280, streak:3, last:'Today', domains:{ratio:58,numbers:68,expr:45,geo:40,stats:28}, current:'Ratio Reef' },
];

const DOMAIN_COLORS = { ratio:'#0EA5E9', numbers:'#A855F7', expr:'#EF4444', geo:'#22C55E', stats:'#F59E0B' };
const DOMAIN_LABELS = { ratio:'Ratios', numbers:'Numbers', expr:'Expressions', geo:'Geometry', stats:'Stats' };
const PATHS = [[0,1],[0,3],[1,2],[2,4],[3,4],[3,5]];
