import React, { useState } from 'react';
import { useScenarioSimulations } from '@/hooks/useDecisionData';
import { runSimulation } from '@/services/decisionService';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Beaker, Play, Clock, AlertTriangle, BarChart3 } from 'lucide-react';

const PRESET_SCENARIOS = [
  { name: 'Geopolitical Crisis - Gulf Disruption', duration: 30, shortage: 15000000, priceIncrease: 25 },
  { name: 'Supply Chain - Port Shutdown', duration: 14, shortage: 5000000, priceIncrease: 12 },
  { name: 'Demand Shock - Winter Surge', duration: 45, shortage: 8000000, priceIncrease: 18 },
  { name: 'Combined - Crisis + Demand Spike', duration: 60, shortage: 25000000, priceIncrease: 40 },
];

export const ScenarioSimulator: React.FC = () => {
  const { data: simulations } = useScenarioSimulations();
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  const handleRunSimulation = async (idx: number) => {
    const scenario = PRESET_SCENARIOS[idx];
    if (!scenario) return;

    setIsRunning(true);
    setSelectedScenario(idx);

    await runSimulation({
      scenario_name: scenario.name,
      duration_days: scenario.duration,
      estimated_shortage: scenario.shortage,
      expected_price_increase: scenario.priceIncrease,
      affected_refineries: ['Mumbai Refinery', 'Paradip Refinery', 'Jamnagar Refinery', 'Vadinar Refinery'],
      expected_loss: scenario.shortage * 75,
      recommended_actions: getRecommendation(scenario.name),
    });

    setIsRunning(false);
    queryClient.invalidateQueries({ queryKey: ['scenario_simulations'] });
  };

  const getRecommendation = (name: string): string => {
    if (name.includes('Gulf')) return 'Activate SPR release protocol. Diversify to Russian and US suppliers. Implement 15% demand rationing.';
    if (name.includes('Port')) return 'Reroute shipments to Paradip and Sikka. Activate emergency berth allocation.';
    if (name.includes('Winter')) return 'Increase refinery output by 12%. Draw from strategic reserves. Implement import acceleration.';
    return 'Activate full emergency protocol. Coordinate with international partners for emergency supplies.';
  };

  const latestSim = simulations && simulations.length > 0 ? simulations[0] : null;

  return (
    <div className="rounded border border-brand-border bg-brand-card p-6 shadow-lg h-full">
      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <Beaker className="w-5 h-5 text-brand-teal" />
        Scenario Simulator
      </h3>

      <div className="space-y-3 mb-6">
        {PRESET_SCENARIOS.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-3 rounded border cursor-pointer transition-all ${
              selectedScenario === idx
                ? 'bg-brand-primary/10 border-brand-primary'
                : 'bg-[#1a2130] border-brand-border/50 hover:border-brand-primary/50'
            }`}
            onClick={() => setSelectedScenario(idx)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs font-bold text-white">{s.name}</div>
                <div className="flex items-center gap-4 text-[10px] text-brand-muted mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}d</span>
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {(s.shortage / 1e6).toFixed(0)}M BBL shortage</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> +{s.priceIncrease}% price</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRunSimulation(idx); }}
                disabled={isRunning && selectedScenario === idx}
                className="flex items-center gap-1 bg-brand-primary text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-brand-primary/80 transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                {isRunning && selectedScenario === idx ? 'Running...' : 'Run'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {latestSim && (
        <div className="p-4 bg-[#1a2130] border border-brand-border/50 rounded">
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3">Latest Simulation Result</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-muted">Scenario:</span>
              <span className="font-bold text-white">{latestSim.scenario_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Duration:</span>
              <span className="font-bold text-white">{latestSim.duration_days} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Est. Shortage:</span>
              <span className="font-bold text-red-400">{(latestSim.estimated_shortage / 1e6).toFixed(1)}M BBL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Price Increase:</span>
              <span className="font-bold text-yellow-400">+{latestSim.expected_price_increase}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Est. Loss:</span>
              <span className="font-bold text-red-400">${(latestSim.expected_loss / 1e9).toFixed(1)}B</span>
            </div>
            {latestSim.recommended_actions && (
              <div className="pt-2 border-t border-brand-border/40">
                <span className="text-brand-muted block mb-1">Recommended Actions:</span>
                <p className="text-brand-teal text-[11px] leading-relaxed">{latestSim.recommended_actions}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
