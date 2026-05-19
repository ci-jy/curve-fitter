# Neural Network Curve Fitter

Fit a neural network to any (x, y) dataset — entirely in your browser. No backend, no data leaves your machine.

## Features

- **CSV upload or manual paste** — drag-and-drop a `.csv` with `x,y` columns, or type/paste pairs directly
- **Configurable architecture** — set the number of hidden layers (1–6), neurons per layer, activation function, optimizer, learning rate, and epoch count
- **Live training** — watch the fitted curve update and the loss chart animate in real time as the network trains
- **Stop / retrain** — halt training at any point and retrain with new settings
- **Export** — download the trained model as TensorFlow.js JSON + weights, or download the predicted curve as a CSV

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| ML | TensorFlow.js (in-browser) |
| Charts | Recharts |
| CSV parsing | PapaParse |

## Getting Started

**Prerequisites:** Node.js (installed via nvm below, or bring your own ≥18).

```bash
# 1. Install nvm + Node if you don't have them
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts

# 2. Clone and install
git clone https://github.com/ci-jy/curve-fitter.git
cd curve-fitter
npm install

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Load data** — upload a CSV (`x,y` column headers) or paste `x, y` pairs (one per line) into the Paste tab and click **Apply**.
2. **Configure the network** — adjust layers, neurons, activation function, optimizer, learning rate, and epoch count in the Network Architecture panel.
3. **Train** — click **Start Training**. The fitted curve and loss chart update live each epoch.
4. **Export** — once training finishes, download the model weights or the predicted curve CSV from the Export panel.

### CSV format

```
x,y
0,0
1,1.1
2,3.9
3,9.2
```

Column names are case-insensitive. Extra columns are ignored.

## Project Structure

```
app/
  page.tsx          — main layout, shared state
  layout.tsx        — root layout + dark mode wiring
  globals.css       — shadcn CSS variables (preset buG04wc)
components/
  DataInputPanel    — CSV upload + paste tabs
  NetworkConfig     — architecture sliders and selects
  TrainingPanel     — start/stop, progress bar, live loss display
  FitChart          — scatter plot + fitted curve overlay
  LossChart         — epoch vs. loss line chart
  ExportPanel       — model + predictions download
lib/
  nn.ts             — TensorFlow.js model builder, trainer, predictor
  data.ts           — CSV / manual parsing, min-max normalisation
  types.ts          — shared TypeScript types
```

## License

MIT
