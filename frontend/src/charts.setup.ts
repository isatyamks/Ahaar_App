import { Chart as ChartJS, Plugin } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
// matrix and gauge register themselves when imported by their components

// Safe-register plugins once
const plugins: Plugin[] = [annotationPlugin as any, ChartDataLabels as any, zoomPlugin as any];
for (const p of plugins) {
  try {
    ChartJS.register(p);
  } catch {}
}

// Global clean defaults
try {
  // Hide datalabels everywhere by default (opt-in per chart)
  // @ts-ignore – plugin key path
  ChartJS.defaults.plugins.datalabels = { display: false };
  ChartJS.defaults.font = { family: 'Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Noto Sans, Helvetica, Arial', size: 12 } as any;
  ChartJS.defaults.color = '#374151'; // gray-700
} catch {}

export {};
