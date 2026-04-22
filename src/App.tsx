/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Globe, Clock, Calendar, Trophy, Medal, X, Palette, Layout, Type as TypeIcon, Zap } from 'lucide-react';

// --- Theme & Layout Definitions ---

type ThemeId = 'eclipse' | 'sleek' | 'retro' | 'minimal' | 'dreamMachine';

interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string;
  ink: string;
  accent: string;
  accentSecondary: string;
  glow: string;
  pattern?: string;
  fontSans: string;
  fontMono: string;
  fontDisplay: string;
  borderWidth: string;
  glassOpacity: number;
  rounded: boolean;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  eclipse: {
    id: 'eclipse',
    name: 'Eclipse Precision',
    bg: '#050505',
    ink: '#ffffff',
    accent: '#ffffff',
    accentSecondary: '#ffffff',
    glow: 'rgba(255,255,255,0.1)',
    fontSans: 'Inter',
    fontMono: 'JetBrains Mono',
    fontDisplay: 'Playfair Display',
    borderWidth: '1px',
    glassOpacity: 0.02,
    rounded: true
  },
  sleek: {
    id: 'sleek',
    name: 'Sleek Interface',
    bg: '#05070A',
    ink: '#e2e8f0',
    accent: '#0ea5e9',
    accentSecondary: '#111827',
    glow: 'rgba(56, 189, 248, 0.3)',
    fontSans: 'Inter',
    fontMono: 'JetBrains Mono',
    fontDisplay: 'Inter',
    borderWidth: '1px',
    glassOpacity: 0.03,
    rounded: true
  },
  retro: {
    id: 'retro',
    name: 'Moscow 80',
    bg: '#F4F1EA',
    ink: '#1A1A1A',
    accent: '#DA0000',
    accentSecondary: '#004F9E',
    glow: 'transparent',
    fontSans: 'Space Grotesk',
    fontMono: 'JetBrains Mono',
    fontDisplay: 'Space Grotesk',
    borderWidth: '8px',
    glassOpacity: 0,
    rounded: false
  },
  dreamMachine: {
    id: 'dreamMachine',
    name: 'Dream Machine',
    bg: '#121212',
    ink: '#00ff41',
    accent: '#00ff41',
    accentSecondary: '#1a1a1a',
    glow: 'rgba(0, 255, 65, 0.4)',
    fontSans: 'Inter',
    fontMono: 'Orbitron',
    fontDisplay: 'Orbitron',
    borderWidth: '0px',
    glassOpacity: 0,
    rounded: false
  },
  minimal: {
    id: 'minimal',
    name: 'Paper Minimal',
    bg: '#ffffff',
    ink: '#000000',
    accent: '#000000',
    accentSecondary: '#f0f0f0',
    glow: 'transparent',
    fontSans: 'Inter',
    fontMono: 'JetBrains Mono',
    fontDisplay: 'Playfair Display',
    borderWidth: '1px',
    glassOpacity: 0.05,
    rounded: true
  }
};

// --- Components ---

const Hand = ({ rotation, length, width, color, opacity = 1 }: any) => (
  <motion.div
    initial={false}
    animate={{ rotate: rotation }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    style={{
      position: "absolute",
      bottom: "50%",
      left: "50%",
      width,
      height: length,
      backgroundColor: color,
      opacity,
      transformOrigin: "bottom center",
      translateX: "-50%",
    }}
  />
);

export default function App() {
  const [time, setTime] = useState(new Date());
  const [themeId, setThemeId] = useState<ThemeId>('dreamMachine');
  const [showConfig, setShowConfig] = useState(false);
  const [showAnalog, setShowAnalog] = useState(false);

  // --- Feature Toggles ---
  const [showDate, setShowDate] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [is24Hour, setIs24Hour] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [smoothSeconds, setSmoothSeconds] = useState(false);

  // Custom Overrides
  const [customAccent, setCustomAccent] = useState<string | null>(null);

  const theme = THEMES[themeId];
  const accent = customAccent || theme.accent;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 / 60);
    return () => clearInterval(timer);
  }, []);

  // Update CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--ink', theme.ink);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-secondary', theme.accentSecondary);
    root.style.setProperty('--glow-color', theme.glow);
    root.style.setProperty('--f-sans', theme.fontSans);
    root.style.setProperty('--f-mono', theme.fontMono);
    root.style.setProperty('--f-display', theme.fontDisplay);
    root.style.setProperty('--border-width', theme.borderWidth);
    root.style.setProperty('--glass-opacity', theme.glassOpacity.toString());
  }, [theme, accent]);

  const timeData = useMemo(() => {
    const s = time.getSeconds();
    const ms = time.getMilliseconds();
    const m = time.getMinutes();
    const h = time.getHours();

    const smoothS = s + ms / 1000;
    const finalS = smoothSeconds ? smoothS : s;

    return {
      sDeg: (finalS / 60) * 360,
      mDeg: (m / 60) * 360 + (finalS / 60) * 6,
      hDeg: (h % 12 / 12) * 360 + (m / 60) * 30,
      hStr: (is24Hour ? h : (h % 12 || 12)).toString().padStart(2, '0'),
      mStr: m.toString().padStart(2, '0'),
      sStr: s.toString().padStart(2, '0'),
      ampm: h >= 12 ? 'PM' : 'AM',
      date: time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
    };
  }, [time, smoothSeconds, is24Hour]);

  return (
    <div className="h-screen pattern-bg flex flex-col font-sans relative overflow-hidden transition-all duration-500">
      
      {/* Sony Clock Specific Background Texture (Hardware Body) */}
      {themeId === 'dreamMachine' && (
        <>
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)', backgroundSize: '2px 2px' }} />
          {/* Top Edge / Snooze Bar Area */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-[#1a1a1a] border-b-2 border-black flex items-center justify-center">
            <div className="w-1/2 h-8 bg-[#252525] rounded-sm border border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">Dream Machine // Snooze / Sleep</span>
            </div>
          </div>
          {/* Speaker Grille Patterns at sides */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-64 opacity-20 hidden md:block" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-64 opacity-20 hidden md:block" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
        </>
      )}

      {/* Navigation Header */}
      <header className={`p-4 md:p-8 flex justify-between items-center relative z-20 shrink-0 ${themeId === 'dreamMachine' ? 'mt-12' : ''}`}>
        <div className="flex gap-4 items-center">
          {themeId === 'dreamMachine' ? (
            <div className="flex flex-col">
              <span className="text-[var(--accent)] font-bold text-2xl tracking-tighter italic font-tech uppercase">SONY</span>
              <span className="text-[10px] text-[var(--accent)] opacity-40 font-bold tracking-[0.3em] -mt-1 uppercase">Dream Machine ICF-C218</span>
            </div>
          ) : (
            <div className="px-3 py-1 bg-[var(--accent)] text-[var(--bg)] font-bold text-sm md:text-lg">MOD: {themeId.toUpperCase()}</div>
          )}
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setShowAnalog(!showAnalog)} className="px-4 py-2 dynamic-border hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all font-bold text-[10px] md:text-xs uppercase tracking-widest">
            {showAnalog ? 'Digital' : 'Analog'}
          </button>
          <button onClick={() => setShowConfig(true)} className="p-2 dynamic-glass rounded-full hover:scale-110 transition-transform">
            <Settings2 className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </header>

      {/* Main Clock Face */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden">
        
        {/* Radio Dial Decoration for Dream Machine */}
        {themeId === 'dreamMachine' && !showAnalog && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-8 mb-12 opacity-30">
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-[var(--accent)] uppercase mb-1">AM</span>
              <div className="w-1 h-32 bg-[var(--accent-secondary)] rounded-full relative">
                <div className="absolute top-1/2 left-0 w-4 h-1 bg-[var(--accent)] -translate-x-1/2" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold text-[var(--accent)] uppercase mb-1">FM</span>
              <div className="w-1 h-32 bg-[var(--accent-secondary)] rounded-full relative">
                <div className="absolute top-1/4 left-0 w-4 h-1 bg-[var(--accent)] -translate-x-1/2" />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showAnalog ? (
            <motion.div
              key="analog"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={`relative aspect-square w-full max-w-[min(70vh,450px)] bg-[var(--bg)] dynamic-border shadow-2xl flex items-center justify-center ${theme.rounded ? 'rounded-full' : ''}`}
            >
              {showNumbers && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                const angle = (num * 30) * (Math.PI / 180);
                const radius = 38; // Radius in percentage
                return (
                  <div 
                    key={num} 
                    className="absolute text-lg md:text-3xl font-bold font-mono opacity-20" 
                    style={{
                      top: `${50 - Math.cos(angle) * radius}%`,
                      left: `${50 + Math.sin(angle) * radius}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              <Hand rotation={timeData.hDeg} length="28%" width="max(4px, min(10px, 1.5vw))" color="var(--ink)" />
              <Hand rotation={timeData.mDeg} length="40%" width="max(3px, min(6px, 1vw))" color="var(--ink)" />
              {showSeconds && <Hand rotation={timeData.sDeg} length="46%" width="max(1px, min(2px, 0.5vw))" color="var(--accent)" />}
              <div className="w-3 h-3 md:w-4 md:h-4 bg-[var(--ink)] rounded-full z-20" />
            </motion.div>
          ) : (
            <motion.div
              key="digital"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center w-full"
            >
              <div className={`relative px-8 md:px-12 py-6 md:py-8 transition-all ${themeId === 'dreamMachine' ? 'bg-[#000] border-4 border-[#1a1a1a] shadow-[inset_0_0_40px_rgba(0,0,0,1)] rounded-md' : ''}`}>
                 {themeId === 'dreamMachine' && <div className="absolute top-2 left-4 text-[7px] font-bold text-[var(--accent)] opacity-40 uppercase tracking-widest font-tech">Dual Alarm / Quartz</div>}
                 
                 <div className={`text-[min(25vw,180px)] md:text-[240px] font-bold leading-none tracking-tight time-glow-dynamic flex items-baseline select-none ${themeId === 'dreamMachine' ? 'font-tech italic' : 'font-mono'}`}>
                  {timeData.hStr}<span className="animate-pulse opacity-80">{themeId === 'dreamMachine' ? '.' : ':'}</span>{timeData.mStr}
                  {!is24Hour && <span className={`text-xl md:text-3xl ml-4 opacity-40 font-tech tracking-widest ${themeId === 'dreamMachine' ? 'text-[var(--accent)]' : ''}`}>{timeData.ampm}</span>}
                </div>

                {showSeconds && themeId !== 'dreamMachine' && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className="h-[2px] w-8 md:w-12 bg-[var(--accent)]" />
                    <span className="text-2xl md:text-6xl font-mono text-[var(--accent)]">{timeData.sStr}</span>
                    <div className="h-[2px] w-8 md:w-12 bg-[var(--accent)]" />
                  </div>
                )}
              </div>

              {themeId === 'dreamMachine' && (
                <div className="mt-8 flex gap-3">
                   {[...Array(4)].map((_, i) => (
                     <div key={i} className="w-12 h-2 bg-[#222] rounded-full shadow-inner" />
                   ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {showDate && (
          <div className="mt-8 md:mt-12 text-[8px] md:text-xs font-bold tracking-[0.5em] opacity-40 uppercase text-center">
            {timeData.date}
          </div>
        )}
      </main>

      {/* Design System Panel */}
      <AnimatePresence>
        {showConfig && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfig(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[var(--bg)] border-l-4 border-[var(--accent)] z-[101] p-8 overflow-y-auto text-[var(--ink)]">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tighter italic">Studio Config</h2>
                <button onClick={() => setShowConfig(false)} className="p-2 hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors"><X/></button>
              </div>

              {/* Aesthetic Recipes */}
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Palette className="w-4 h-4"/>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Aesthetic Recipes</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(THEMES) as ThemeId[]).map(id => (
                    <button key={id} onClick={() => { setThemeId(id); setCustomAccent(null); }} className={`p-4 border-2 text-left transition-all ${themeId === id ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]' : 'border-[var(--ink)]/10 hover:border-[var(--accent)]/40'}`}>
                      <div className="font-bold text-sm">{THEMES[id].name}</div>
                      <div className="text-[9px] uppercase tracking-widest opacity-60 mt-1">{id} node</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Functional Features */}
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Layout className="w-4 h-4"/>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Functional Modules</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Show Date', state: showDate, setter: setShowDate },
                    { label: 'Show Seconds', state: showSeconds, setter: setShowSeconds },
                    { label: '24-Hour Format', state: is24Hour, setter: setIs24Hour },
                    { label: 'Show Face Numbers', state: showNumbers, setter: setShowNumbers },
                    { label: 'Smooth Second Hand', state: smoothSeconds, setter: setSmoothSeconds },
                  ].map(f => (
                    <button key={f.label} onClick={() => f.setter(!f.state)} className="w-full flex justify-between items-center p-3 border-2 border-[var(--ink)]/10 hover:border-[var(--accent)]/40 transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-widest">{f.label}</span>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${f.state ? 'bg-[var(--accent)]' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${f.state ? 'left-5' : 'left-1'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <Zap className="w-4 h-4"/>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Manual Modulation</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest font-bold block mb-2">Accent Frequency</label>
                    <div className="flex gap-2">
                      {['#DA0000', '#0ea5e9', '#FFC800', '#00FF00', '#ffffff', '#000000'].map(c => (
                        <button key={c} onClick={() => setCustomAccent(c)} className={`w-8 h-8 rounded-full border-2 ${accent === c ? 'border-white ring-2 ring-[var(--accent)]' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="p-4 md:p-8 flex justify-between items-end opacity-20 pointer-events-none shrink-0 border-t border-[var(--accent)]/5">
        <div className="text-[8px] font-bold uppercase tracking-[0.5em] writing-vertical-rl rotate-180">Sync Lock: ACTIVE</div>
        <div className="text-[8px] font-bold uppercase tracking-[0.5em]">TKR: {timeData.sStr}</div>
      </footer>
    </div>
  );
}
