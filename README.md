# Neural Network Curve Fitter

**https://ci-jy.github.io/curve-fitter/**

Fit a neural network to any (x, y) dataset — entirely in your browser. No backend, no data leaves your machine.

---

## Features

- **CSV upload or paste** — drag-and-drop a `.csv` with `x, y` columns, or type pairs directly into the paste tab
- **Configurable architecture** — hidden layers (1–6), neurons per layer, activation function, optimizer, learning rate, batch size, and epoch count
- **Live training** — the fitted curve and loss chart update in real time each epoch as the network trains
- **Stop / retrain** — halt training at any point and retrain with different settings
- **Export** — download the trained model as TensorFlow.js JSON + weights, or the predicted curve as a CSV

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (static export) |
| UI | shadcn/ui + Tailwind CSS v4 |
| ML | TensorFlow.js (in-browser) |
| Charts | Recharts |
| CSV parsing | PapaParse |

## Layout

The UI is a two-pane app shell:

- **Left sidebar** — Dataset input, network architecture controls, training controls, and export (appears after training)
- **Right canvas** — Curve fit chart (scatter + predicted curve overlay) above, training loss chart below

## Running locally

**Prerequisites:** Node.js ≥ 18. If you don't have it, install via [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts
```

```bash
git clone https://github.com/ci-jy/curve-fitter.git
cd curve-fitter
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Load data** — upload a `.csv` (needs `x` and `y` column headers) or paste `x, y` pairs one per line and click **Apply**
2. **Configure** — adjust layers, neurons, activation, optimizer, learning rate, batch size, and epochs in the Architecture section
3. **Train** — click **Start Training**; the curve and loss chart update live each epoch
4. **Export** — download the model weights or predicted curve CSV from the Export section that appears when training finishes

### CSV format

```
x,y
0,0
1,1.1
2,3.9
3,9.2
```

Column names are case-insensitive. Extra columns are ignored.

## Project structure

```
app/
  page.tsx          — two-pane shell, shared state
  layout.tsx        — root layout, dark mode wiring
  globals.css       — shadcn CSS variables (preset buG04wc)
components/
  DataInputPanel    — CSV upload + paste tabs
  NetworkConfig     — architecture sliders and selects
  TrainingPanel     — start/stop button, progress bar, epoch/loss counters
  FitChart          — scatter plot with fitted curve overlay (Recharts)
  LossChart         — epoch vs. loss line chart (Recharts)
  ExportPanel       — model weights + predictions download
lib/
  nn.ts             — TensorFlow.js model builder, trainer, predictor
  data.ts           — CSV/manual parsing, min-max normalisation
  types.ts          — shared TypeScript types
.github/workflows/
  deploy.yml        — builds and deploys to GitHub Pages on push to main
```

## License

MIT
