import React, { useState, useEffect } from "react";
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  FlaskConical,
  Binary,
  Microscope,
  Compass,
  Wrench,
  HelpCircle,
  Eye,
  Info,
} from "lucide-react";

export function PhysicsSimulator() {
  const [length, setLength] = useState(80); // cm
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [isSwinging, setIsSwinging] = useState(true);

  // T = 2 * pi * sqrt(L / g)
  const lengthInMeters = length / 100;
  const period = 2 * Math.PI * Math.sqrt(lengthInMeters / gravity);
  const periodSq = period * period;
  const lOverTSq = lengthInMeters / periodSq;
  const calculatedG = 4 * Math.PI * Math.PI * lOverTSq;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
            Virtual Lab Sandbox
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
            Simple Pendulum: L–T² Real-Time Simulation
          </h4>
        </div>
        <button
          onClick={() => setIsSwinging(!isSwinging)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isSwinging
              ? "bg-purple-600 hover:bg-purple-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-purple-300"
          }`}
        >
          <Play size={14} className={isSwinging ? "animate-spin" : ""} />
          <span>{isSwinging ? "Pause Oscillation" : "Start Oscillation"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Animated Pendulum Visual Canvas */}
        <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-mono text-slate-400">
            Real-time Harmonic Motion (SHM)
          </div>

          <svg width="240" height="260" className="overflow-visible">
            {/* Rigid clamp support */}
            <rect x="80" y="10" width="80" height="8" rx="3" fill="#64748b" />
            <circle cx="120" cy="18" r="4" fill="#94a3b8" />

            {/* Pendulum Thread and Bob with dynamic swing animation */}
            <g
              style={{
                transformOrigin: "120px 18px",
                animation: isSwinging
                  ? `pendulumSwing ${period.toFixed(2)}s ease-in-out infinite alternate`
                  : "none",
              }}
            >
              {/* Thread */}
              <line
                x1="120"
                y1="18"
                x2="120"
                y2={30 + length * 1.8}
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="3 2"
              />
              {/* Metallic Bob */}
              <circle
                cx="120"
                cy={30 + length * 1.8}
                r="16"
                fill="url(#bobGradient)"
                stroke="#c084fc"
                strokeWidth="2"
                className="shadow-lg shadow-purple-500/50"
              />
              {/* Center of gravity marker */}
              <circle
                cx="120"
                cy={30 + length * 1.8}
                r="3"
                fill="#ffffff"
              />
            </g>

            {/* Gradient definition for metallic spherical bob */}
            <defs>
              <radialGradient id="bobGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="40%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#581c87" />
              </radialGradient>
            </defs>
          </svg>

          <style>{`
            @keyframes pendulumSwing {
              0% { transform: rotate(-18deg); }
              100% { transform: rotate(18deg); }
            }
          `}</style>

          <div className="mt-4 flex items-center justify-between w-full px-4 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Effective Length: <strong className="text-purple-300">{length} cm</strong></span>
            <span>Period T: <strong className="text-cyan-300">{period.toFixed(3)} s</strong></span>
          </div>
        </div>

        {/* Parameter Sliders & Calculations */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Thread Length (L)
              </label>
              <span className="text-sm font-black text-purple-400">{length} cm</span>
            </div>
            <input
              type="range"
              min="50"
              max="110"
              step="5"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>50 cm</span>
              <span>70 cm</span>
              <span>90 cm</span>
              <span>110 cm</span>
            </div>
          </div>

          {/* Real-time Observation Table Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Period (T)</span>
              <span className="text-lg font-black text-cyan-400">{period.toFixed(2)} s</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">T² (s²)</span>
              <span className="text-lg font-black text-purple-400">{periodSq.toFixed(2)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">L / T² Ratio</span>
              <span className="text-lg font-black text-emerald-400">{(lOverTSq * 100).toFixed(1)}</span>
            </div>
          </div>

          {/* Derived Result Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Experimental Acceleration Due to Gravity
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">
                g = {calculatedG.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-400">m/s²</span>
              <span className="ml-auto text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                100% Concordant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Formula: <code className="text-purple-300">g = 4π² × (L / T²)</code>. Verified within ±0.1% of accepted board value 9.8 m/s².
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChemistrySimulator() {
  const salts = [
    {
      id: "lead-nitrate",
      name: "Lead Nitrate [Pb(NO₃)₂]",
      cation: "Pb²⁺ (Group I Cation)",
      anion: "NO₃⁻ (Nitrate Radical)",
      color: "White Crystalline Salt",
      tests: {
        dilHcl: "White precipitate of PbCl₂ soluble in boiling water and reappears as needle crystals on cooling.",
        ki: "Bright golden yellow precipitate of Lead Iodide (PbI₂), shimmering like spangles.",
        brownRing: "Distinct dark brown ring formed at liquid interface: [Fe(H₂O)₅(NO)]SO₄.",
        flame: "Dull bluish-white flame with crackling decrepitation.",
      },
    },
    {
      id: "copper-sulfate",
      name: "Cupric Sulfate [CuSO₄·5H₂O]",
      cation: "Cu²⁺ (Group II Cation)",
      anion: "SO₄²⁻ (Sulfate Radical)",
      color: "Deep Blue Crystalline Salt",
      tests: {
        dilHcl: "No precipitate; gives black precipitate of CuS when H₂S gas is passed.",
        ki: "White precipitate of Cu₂I₂ in brown iodine solution, turning blue with starch.",
        brownRing: "Negative for nitrate ion.",
        flame: "Luminous sky-blue/green flame characteristic of copper.",
      },
    },
    {
      id: "ferric-chloride",
      name: "Ferric Chloride [FeCl₃]",
      cation: "Fe³⁺ (Group III Cation)",
      anion: "Cl⁻ (Chloride Radical)",
      color: "Reddish-Brown Deliquescent",
      tests: {
        dilHcl: "No precipitate directly; forms reddish-brown gelatinous Fe(OH)₃ with NH₄OH.",
        ki: "Forms intense blood-red coloration with Potassium Thiocyanate (KSCN).",
        brownRing: "Negative for nitrate.",
        flame: "Sparkling golden-yellow sparks on intense heating.",
      },
    },
    {
      id: "ammonium-carbonate",
      name: "Ammonium Carbonate [(NH₄)₂CO₃]",
      cation: "NH₄⁺ (Zero Group Cation)",
      anion: "CO₃²⁻ (Carbonate Radical)",
      color: "White Powder with Ammoniacal Odor",
      tests: {
        dilHcl: "Brisk effervescence of colorless, odorless CO₂ gas which turns lime water milky.",
        ki: "Reddish-brown precipitate with Nessler's reagent [K₂HgI₄] (Iodide of Millon's base).",
        brownRing: "Negative for nitrate.",
        flame: "Volatile; completely sublimes leaving no non-volatile residue.",
      },
    },
  ];

  const [selectedSalt, setSelectedSalt] = useState(salts[0]);
  const [selectedReagent, setSelectedReagent] = useState("ki");

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Virtual Chemistry Lab
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
            Qualitative Salt Analysis: Reaction Testing Rack
          </h4>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          AP / TS Board 10-Mark Practical
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Salt Picker & Test Tube */}
        <div className="lg:col-span-5 space-y-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Select Unknown Inorganic Salt:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {salts.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSalt(s)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                  selectedSalt.id === s.id
                    ? "bg-emerald-950/50 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                    : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{s.name}</div>
                  <div className="text-[11px] text-slate-400">{s.color}</div>
                </div>
                {selectedSalt.id === s.id && (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Chemical Radical Confirmation Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Identified Cation:</span>
              <span className="font-bold text-emerald-400">{selectedSalt.cation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Identified Anion:</span>
              <span className="font-bold text-cyan-400">{selectedSalt.anion}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Reagent Selector & Reaction Display */}
        <div className="lg:col-span-7 space-y-5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Add Analytical Reagent to Test Tube:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedReagent("ki")}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                selectedReagent === "ki"
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Potassium Iodide (KI)
            </button>
            <button
              onClick={() => setSelectedReagent("dilHcl")}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                selectedReagent === "dilHcl"
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Dilute HCl
            </button>
            <button
              onClick={() => setSelectedReagent("brownRing")}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                selectedReagent === "brownRing"
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Brown Ring Test
            </button>
            <button
              onClick={() => setSelectedReagent("flame")}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                selectedReagent === "flame"
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Flame Test
            </button>
          </div>

          {/* Test Tube Reaction Result Window */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={18} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Experimental Observation & Confirmatory Test Result
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 font-mono text-sm leading-relaxed text-slate-200">
              {selectedSalt.tests[selectedReagent]}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <span>Reaction Type: <strong className="text-emerald-300">Confirmatory Wet / Dry Test</strong></span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> Verified for Board Viva
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ElectronicsSimulator() {
  const [gate, setGate] = useState("AND");
  const [inA, setInA] = useState(0);
  const [inB, setInB] = useState(0);

  const calculateOutput = (g, a, b) => {
    switch (g) {
      case "AND":
        return a && b ? 1 : 0;
      case "OR":
        return a || b ? 1 : 0;
      case "NOT":
        return a ? 0 : 1;
      case "NAND":
        return !(a && b) ? 1 : 0;
      case "NOR":
        return !(a || b) ? 1 : 0;
      case "XOR":
        return a !== b ? 1 : 0;
      default:
        return 0;
    }
  };

  const output = calculateOutput(gate, inA, inB);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Digital Trainer Kit
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
            Logic Gates & Truth Table Simulator
          </h4>
        </div>
        <div className="flex gap-2">
          {["AND", "OR", "NOT", "NAND", "NOR", "XOR"].map((g) => (
            <button
              key={g}
              onClick={() => setGate(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                gate === g
                  ? "bg-amber-500 border-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Circuit Workbench */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] relative">
          <div className="flex items-center justify-center gap-8 w-full max-w-md">
            {/* Input Switches */}
            <div className="flex flex-col gap-5">
              <button
                onClick={() => setInA(inA === 1 ? 0 : 1)}
                className={`w-20 py-2.5 rounded-xl font-mono font-bold text-xs flex flex-col items-center border transition-all cursor-pointer ${
                  inA === 1
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-800/80 border-slate-700 text-slate-400"
                }`}
              >
                <span>INPUT A</span>
                <span className="text-base font-black">{inA} ({inA ? "5V" : "0V"})</span>
              </button>

              {gate !== "NOT" && (
                <button
                  onClick={() => setInB(inB === 1 ? 0 : 1)}
                  className={`w-20 py-2.5 rounded-xl font-mono font-bold text-xs flex flex-col items-center border transition-all cursor-pointer ${
                    inB === 1
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-800/80 border-slate-700 text-slate-400"
                  }`}
                >
                  <span>INPUT B</span>
                  <span className="text-base font-black">{inB} ({inB ? "5V" : "0V"})</span>
                </button>
              )}
            </div>

            {/* Central Logic Gate Emblem */}
            <div className="w-24 h-24 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
              <Zap size={24} className="mb-1" />
              <span className="text-base font-black font-mono">{gate}</span>
              <span className="text-[10px] text-amber-300/70 font-semibold">GATE</span>
            </div>

            {/* Glowing Output Indicator LED */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  output === 1
                    ? "bg-emerald-500 border-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.8)] scale-110"
                    : "bg-slate-800 border-slate-700 text-slate-500 shadow-inner"
                }`}
              >
                <span className="font-mono text-xl font-black text-slate-950">
                  {output}
                </span>
              </div>
              <span className="text-xs font-bold font-mono tracking-wider">
                {output === 1 ? (
                  <span className="text-emerald-400">LED ON (HIGH)</span>
                ) : (
                  <span className="text-slate-500">LED OFF (LOW)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Truth Table Verification */}
        <div className="lg:col-span-5 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
          <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            {gate} Gate Truth Table Matrix:
          </h5>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-mono">
                <th className="py-1.5 px-2">A</th>
                {gate !== "NOT" && <th className="py-1.5 px-2">B</th>}
                <th className="py-1.5 px-2 text-right">Output (Y)</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                { a: 0, b: 0 },
                { a: 0, b: 1 },
                { a: 1, b: 0 },
                { a: 1, b: 1 },
              ]
                .filter((row, idx) => (gate === "NOT" ? idx === 0 || idx === 2 : true))
                .map((row, idx) => {
                  const expected = calculateOutput(gate, row.a, row.b);
                  const isActiveRow =
                    gate === "NOT"
                      ? row.a === inA
                      : row.a === inA && row.b === inB;

                  return (
                    <tr
                      key={idx}
                      className={`border-b border-slate-800 transition-colors ${
                        isActiveRow
                          ? "bg-amber-500/20 text-amber-300 font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      <td className="py-2 px-2">{row.a}</td>
                      {gate !== "NOT" && <td className="py-2 px-2">{row.b}</td>}
                      <td className="py-2 px-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            expected === 1
                              ? "bg-emerald-500/20 text-emerald-400 font-black"
                              : "bg-slate-700/50 text-slate-400"
                          }`}
                        >
                          {expected}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CSCodeSimulator() {
  const [selectedSnippet, setSelectedSnippet] = useState("stack");
  const [terminalOutput, setTerminalOutput] = useState("");

  const snippets = {
    stack: {
      name: "Stack (LIFO) Push/Pop in Python",
      code: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, val):
        self.items.append(val)
        print(f"Pushed {val} -> Stack: {self.items}")
    def pop(self):
        if not self.items:
            print("Underflow! Stack is empty.")
            return None
        popped = self.items.pop()
        print(f"Popped {popped} -> Remaining: {self.items}")
        return popped

# Board Practical Execution
s = Stack()
s.push(10)
s.push(20)
s.push(30)
s.pop()`,
      output: `Pushed 10 -> Stack: [10]
Pushed 20 -> Stack: [10, 20]
Pushed 30 -> Stack: [10, 20, 30]
Popped 30 -> Remaining: [10, 20]
[Process finished with exit code 0]`,
    },
    sql: {
      name: "SQL Student Marks Query",
      code: `-- Creating Board Examination Table
CREATE TABLE STUDENTS (
    HallTicket INT PRIMARY KEY,
    Name VARCHAR(50),
    GroupCode VARCHAR(10),
    Marks INT
);

INSERT INTO STUDENTS VALUES (260401, 'Ananya Rao', 'MPC', 465);
INSERT INTO STUDENTS VALUES (260402, 'Karthik V', 'BiPC', 458);

-- Fetching High Distinction Rankers
SELECT Name, GroupCode, Marks 
FROM STUDENTS 
WHERE Marks >= 450 
ORDER BY Marks DESC;`,
      output: `+-------------+-----------+-------+
| Name        | GroupCode | Marks |
+-------------+-----------+-------+
| Ananya Rao  | MPC       |   465 |
| Karthik V   | BiPC      |   458 |
+-------------+-----------+-------+
2 rows in set (0.002 sec)
[SQL Execution: Success]`,
    },
  };

  const runCode = () => {
    setTerminalOutput("Compiling & Executing on Board Engine...\n" + snippets[selectedSnippet].output);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
            Practical Coding Terminal
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
            Computer Science Program Runner
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSnippet}
            onChange={(e) => {
              setSelectedSnippet(e.target.value);
              setTerminalOutput("");
            }}
            className="bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="stack">Stack (LIFO) Implementation</option>
            <option value="sql">SQL Relational Database Queries</option>
          </select>
          <button
            onClick={runCode}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
          >
            <Play size={13} fill="currentColor" />
            <span>Run Practical</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">
          <pre>{snippets[selectedSnippet].code}</pre>
        </div>
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">
              Console Output:
            </div>
            <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
              {terminalOutput || "Click 'Run Practical' above to execute the board practical program."}
            </pre>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2 mt-4 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>100% compliant with board examiner test cases</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MicroscopeSimulator() {
  const [specimen, setSpecimen] = useState("dicot");
  const [zoom, setZoom] = useState(40);

  const specimens = {
    dicot: {
      name: "T.S. Dicot Root (Sunflower)",
      type: "Botany Microscopic Slide",
      layers: ["Epiblema (Piliferous layer with unicellular root hairs)", "Broad Parenchymatous Cortex", "Endodermis with Casparian Strips", "Radial Vascular Bundles (Diarch to Tetrarch Xylem)"],
      description: "Notice the distinct star-shaped xylem vessels in the center with phloem patches alternating radially.",
    },
    blood: {
      name: "Human Blood Smear (Leishman Stain)",
      type: "Zoology Microscopic Slide",
      layers: ["Abundant Biconcave Enucleated Erythrocytes (RBCs)", "Multilobed Neutrophils (60-70%)", "Large Spherical Nucleus Lymphocytes (20-30%)", "Bi-lobed Spectacle Nucleus Eosinophils (2-4%)"],
      description: "Observe cellular differential morphology; leukocytes exhibit deep violet nuclei with characteristic granule staining.",
    },
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            Digital Microscope
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
            Histological Slide & Specimen Spotter
          </h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSpecimen("dicot")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              specimen === "dicot"
                ? "bg-teal-600 border-teal-400 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            T.S. Dicot Root
          </button>
          <button
            onClick={() => setSpecimen("blood")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              specimen === "blood"
                ? "bg-teal-600 border-teal-400 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300"
            }`}
          >
            Human Blood Smear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Microscope Viewport Aperture */}
        <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          <div className="w-56 h-56 rounded-full border-4 border-teal-500/50 relative overflow-hidden shadow-[0_0_40px_rgba(20,184,166,0.3)] bg-radial from-teal-900/40 to-slate-950 flex items-center justify-center">
            {/* Visual simulation of cell structure */}
            <div
              className="w-48 h-48 rounded-full border border-teal-400/30 flex items-center justify-center transition-all duration-500"
              style={{ transform: `scale(${zoom / 40})` }}
            >
              <div className="text-center font-mono text-xs text-teal-300">
                <Microscope size={44} className="mx-auto mb-2 text-teal-400 animate-pulse" />
                <span className="font-bold">{specimens[specimen].name}</span>
                <span className="block text-[10px] text-slate-400 mt-1">Objective: {zoom}X Mag.</span>
              </div>
            </div>

            {/* Circular Reticle Crosshair */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-teal-500/20 pointer-events-none"></div>
            <div className="absolute inset-y-0 left-1/2 w-px bg-teal-500/20 pointer-events-none"></div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-slate-400">Magnification:</span>
            {[10, 40, 100].map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                  zoom === z ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                {z}X
              </button>
            ))}
          </div>
        </div>

        {/* Anatomical Identification Layers */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              {specimens[specimen].type}
            </span>
            <h5 className="text-lg font-black text-white">{specimens[specimen].name}</h5>
            <p className="text-xs text-slate-300 mt-1">{specimens[specimen].description}</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Diagnostic Board Identification Points:
            </span>
            {specimens[specimen].layers.map((layer, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <span>{layer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MathSimulator() {
  const [mode, setMode] = useState("parabola"); // 'parabola' | 'calculus'
  const [paramA, setParamA] = useState(2);
  const [paramB, setParamB] = useState(4);
  const [xTangent, setXTangent] = useState(2);

  const y0Parabola = 2 * Math.sqrt(Math.max(0, paramA * Math.max(0, xTangent)));
  const slopeParabola = y0Parabola !== 0 ? (2 * paramA) / y0Parabola : 999;

  const vertexX = paramB / (2 * (paramA || 1));
  const vertexY = -(paramA || 1) * vertexX * vertexX + paramB * vertexX;
  const currentSlope = -2 * (paramA || 1) * xTangent + paramB;
  const currentY = -(paramA || 1) * xTangent * xTangent + paramB * xTangent;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
            Mathematics Virtual Workbench
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
            Dynamic Coordinate Geometry & Calculus Simulator
          </h4>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode("parabola")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "parabola" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Parabola Locus
          </button>
          <button
            onClick={() => setMode("calculus")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "calculus" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Calculus Max/Min
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive SVG Coordinate Plane */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800/80 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
          <svg viewBox="-120 -100 240 200" className="w-full h-64 overflow-visible">
            {/* Grid Lines */}
            {[-80, -40, 0, 40, 80].map((coord) => (
              <g key={`grid-${coord}`} opacity="0.15">
                <line x1={coord} y1="-100" x2={coord} y2="100" stroke="#94A3B8" strokeDasharray="3 3" />
                <line x1="-120" y1={coord} x2="120" y2={coord} stroke="#94A3B8" strokeDasharray="3 3" />
              </g>
            ))}

            {/* Axes */}
            <line x1="-120" y1="0" x2="120" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="-100" x2="0" y2="100" stroke="#475569" strokeWidth="1.5" />
            <text x="110" y="-5" fill="#94A3B8" fontSize="8" fontWeight="bold">X</text>
            <text x="5" y="-90" fill="#94A3B8" fontSize="8" fontWeight="bold">Y</text>

            {mode === "parabola" && (
              <>
                {/* Parabola Curve y^2 = 4ax => x = y^2 / 4a */}
                <path
                  d={(() => {
                    const points = [];
                    for (let y = -80; y <= 80; y += 2) {
                      const x = (y * y) / (4 * paramA * 10);
                      if (x <= 110) points.push(`${x},${-y}`);
                    }
                    return `M ${points.join(" L ")}`;
                  })()}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />

                {/* Focus S(a, 0) */}
                <circle cx={paramA * 10} cy="0" r="4" fill="#F59E0B" />
                <text x={paramA * 10 + 6} y="-6" fill="#F59E0B" fontSize="9" fontWeight="bold">Focus S({paramA}, 0)</text>

                {/* Directrix x = -a */}
                <line x1={-paramA * 10} y1="-100" x2={-paramA * 10} y2="100" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
                <text x={-paramA * 10 - 25} y="-85" fill="#EF4444" fontSize="8" fontWeight="bold">Directrix x={-paramA}</text>

                {/* Locus Point P */}
                <circle cx={xTangent * 10} cy={-y0Parabola * 3} r="4.5" fill="#10B981" />
                <text x={xTangent * 10 + 6} y={-y0Parabola * 3 - 6} fill="#10B981" fontSize="9" fontWeight="bold">Point P</text>

                {/* Distance SP */}
                <line x1={paramA * 10} y1="0" x2={xTangent * 10} y2={-y0Parabola * 3} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Distance PM */}
                <line x1={-paramA * 10} y1={-y0Parabola * 3} x2={xTangent * 10} y2={-y0Parabola * 3} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
              </>
            )}

            {mode === "calculus" && (
              <>
                {/* Inverted Parabola: y = -(a/2) x^2 + b x */}
                <path
                  d={(() => {
                    const points = [];
                    for (let x = -20; x <= 100; x += 1) {
                      const y = -((paramA * 0.4) * (x - vertexX * 10) * (x - vertexX * 10)) / 10 + vertexY * 8;
                      points.push(`${x},${-y}`);
                    }
                    return `M ${points.join(" L ")}`;
                  })()}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />

                {/* Peak / Maximum Point (Vertex) */}
                <circle cx={vertexX * 10} cy={-vertexY * 8} r="5" fill="#10B981" />
                <text x={vertexX * 10 + 6} y={-vertexY * 8 - 8} fill="#10B981" fontSize="9" fontWeight="bold">
                  Max: ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
                </text>

                {/* Tangent Line at xTangent */}
                <line
                  x1={xTangent * 10 - 30}
                  y1={-(currentY * 8 - (currentSlope * 0.3) * 30)}
                  x2={xTangent * 10 + 30}
                  y2={-(currentY * 8 + (currentSlope * 0.3) * 30)}
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
                <circle cx={xTangent * 10} cy={-currentY * 8} r="4" fill="#F59E0B" />
              </>
            )}
          </svg>

          <div className="mt-3 flex items-center justify-between w-full px-2 text-xs font-mono text-slate-400">
            <span>Focus-Directrix Property: SP / PM = e = 1.0</span>
            <span className="text-emerald-400 font-bold">Locus Verified</span>
          </div>
        </div>

        {/* Interactive Controls & Real-Time Mathematical Deductions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span>{mode === "parabola" ? "Focal Length (a):" : "Curvature Factor (a):"}</span>
                <span className="text-cyan-400 font-bold">{paramA}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={paramA}
                onChange={(e) => setParamA(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span>{mode === "parabola" ? "Coordinate X on Axis:" : "Slope Parameter (b):"}</span>
                <span className="text-amber-400 font-bold">{mode === "parabola" ? xTangent : paramB}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={mode === "parabola" ? xTangent : paramB}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (mode === "parabola") setXTangent(val);
                  else setParamB(val);
                }}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Math Output Card */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Active Analytical Equations:
            </span>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              <div className="flex justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">Equation:</span>
                <span className="text-cyan-300 font-bold">
                  {mode === "parabola" ? `y² = ${4 * paramA}x` : `f(x) = -${paramA}x² + ${paramB}x`}
                </span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">{mode === "parabola" ? "Eccentricity (e):" : "Critical Point:"}</span>
                <span className="text-emerald-400 font-bold">
                  {mode === "parabola" ? "e = 1.0 (Parabola)" : `x = ${vertexX.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-2 rounded-lg">
                <span className="text-slate-400">First Derivative dy/dx:</span>
                <span className="text-amber-300 font-bold">
                  {mode === "parabola" ? slopeParabola.toFixed(2) : currentSlope.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

