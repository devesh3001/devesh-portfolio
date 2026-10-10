// Verified project descriptions and recorded experiment results.
// Browser demonstrations use separate synthetic data.
export const projects = [
  {
    "id": "mars",
    "name": "MarsSenitel",
    "number": "01",
    "categories": [
      "ml"
    ],
    "category": "Computer vision",
    "context": "NSSC 2026 · Data Analytics · IIT Kharagpur",
    "description": "An unsupervised pipeline for screening Mars HiRISE imagery. A convolutional autoencoder learns image representations; Isolation Forest scores novelty, and held-out source observations calibrate the selection threshold.",
    "tags": [
      "PyTorch",
      "ConvAE",
      "Isolation Forest",
      "GMM"
    ],
    "repository": "https://github.com/devesh3001/MarsSenitel",
    "website": null,
    "metrics": [
      {
        "value": "10,422",
        "label": "image crops screened"
      },
      {
        "value": "256-D",
        "label": "learned representation"
      },
      {
        "value": "17",
        "label": "screening candidates"
      }
    ],
    "question": "Screening 10,422 unlabeled image crops from 172 source observations to identify candidates for closer inspection.",
    "pipeline": [
      "Keep each source observation in one split: 120 training sources, 25 validation sources, and 27 calibration sources.",
      "Train a convolutional autoencoder from scratch. A 256-dimensional bottleneck carries the information needed to reconstruct each crop.",
      "Fit Isolation Forest to training-source representations and produce continuous novelty scores.",
      "Fit Gaussian mixtures on held-out calibration scores. Select a model with BIC, apply the fixed component-envelope rule, and inspect selected crops using reconstruction evidence and source context."
    ],
    "decision": "Splits are made by source observation to avoid placing similar crops from one image in multiple splits. Reconstruction error and latent-space novelty are both reviewed when inspecting selected crops.",
    "evidence": "The v3 run selected 17 crops from eight source observations at a threshold of 0.542471. Validation reconstruction MSE was 0.002599, with SSIM of 0.6738. A source-level bootstrap gave a threshold interval of 0.5352–0.5505. Awarded second place in the NSSC 2026 Data Analytics event at IIT Kharagpur.",
    "limitation": "The selected crops are screening candidates, not confirmed geological anomalies. Brightness, borders, and acquisition conditions can affect scores, and retraining can change selections. Without anomaly labels, detection accuracy cannot be established; the bootstrap interval describes threshold uncertainty.",
    "provenance": "Evaluation: October 2026 Mars HiRISE final presentation. Award: supplied NSSC certificate. The method demo uses synthetic scores.",
    "lab": "anomaly",
    "award": {
      "title": "2nd place · NSSC 2026",
      "detail": "Data Analytics · IIT Kharagpur · 2–4 October 2026",
      "certificate": "./assets/NSSC_2026_Certificate_Crop.svg"
    },
    "features": [
      "Source-level training, validation, and calibration splits",
      "256-D ConvAE embeddings with Isolation Forest novelty scoring",
      "GMM threshold calibration and source-level bootstrap analysis"
    ]
  },
  {
    "id": "pharma",
    "name": "PharmaDash",
    "number": "02",
    "categories": [
      "software"
    ],
    "category": "Full-stack development",
    "context": "Solo project · March–June 2026",
    "description": "A full-stack pharmacy delivery platform I built as a solo project. It includes expiry-aware inventory allocation, prescription verification, role-based access, Razorpay payments, and real-time rider tracking.",
    "tags": [
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma"
    ],
    "repository": "https://github.com/devesh3001/PharmaDash",
    "website": "https://pharmadash-app.onrender.com",
    "metrics": [
      {
        "value": "47+",
        "label": "integration tests"
      },
      {
        "value": "FEFO",
        "label": "expiry-aware allocation"
      },
      {
        "value": "5 roles",
        "label": "workflow permissions"
      }
    ],
    "question": "A TypeScript pharmacy delivery application covering inventory, prescriptions, payment, dispatch, and delivery verification.",
    "pipeline": [
      "Build TypeScript / Node.js / Express workflows around PostgreSQL and Prisma.",
      "Use expiry-aware FEFO inventory allocation and serializable transactions to protect concurrent stock updates.",
      "Model distinct permissions for customers, riders, pharmacists, pharmacy administrators, and administrators.",
      "Protect prescription files with private S3 storage and presigned URLs, and use JWT / RBAC authorization with object-level access checks.",
      "Integrate Razorpay payments with verified webhooks and idempotency so repeated payment events do not repeat business actions.",
      "Add Socket.IO rider GPS tracking and OTP delivery verification with brute-force protection; package deployment with Docker and Render."
    ],
    "decision": "Stock checks and updates use serializable database transactions to protect concurrent orders. Payment webhooks are verified and processed idempotently to handle repeated events.",
    "evidence": "The implementation has 47+ integration tests, as recorded in the resume. Five roles cover administrators, pharmacy administrators, pharmacists, customers, and riders. Inventory is allocated using first-expiry-first-out (FEFO) rules.",
    "limitation": "Prescription OCR output requires verification. This is a project implementation; production usage and performance metrics are not available.",
    "provenance": "Implementation details and test count: resume and project documentation. Website link: repository README.",
    "lab": "inventory",
    "features": [
      "FEFO inventory allocation with serializable stock transactions",
      "Role-based access, private prescriptions, and verified payment webhooks",
      "Socket.IO rider tracking and OTP delivery verification"
    ]
  },
  {
    "id": "optigreen",
    "name": "OptiGreen-Chem",
    "number": "03",
    "categories": [
      "ml",
      "optimization"
    ],
    "category": "Machine learning / Optimization",
    "context": "Team course project · My focus: ML + optimization",
    "description": "A petroleum supply-chain planning system built on public EIA data. I worked on demand forecasting, refinery risk models, and a rolling MILP that plans production, inventory, and transport.",
    "tags": [
      "Python",
      "XGBoost",
      "Pyomo",
      "HiGHS"
    ],
    "repository": "https://github.com/devesh3001/OptiGreen-Chem",
    "website": "https://optigreen-chem.streamlit.app/",
    "metrics": [
      {
        "value": "4.40%",
        "label": "WAPE · 2018–19 evaluation"
      },
      {
        "value": "229",
        "label": "state × product series"
      },
      {
        "value": "288",
        "label": "plans solved to optimality"
      }
    ],
    "question": "Demand forecasts and refinery risk estimates feed a three-month production and distribution plan, subject to capacity, storage, and transport constraints.",
    "pipeline": [
      "Use public EIA petroleum time series to describe refining districts, storage hubs, regional demand, and transport lanes.",
      "Predict P10 / P50 / P90 demand with quantile XGBoost, using rolling origins and past data only.",
      "Estimate refinery shortage risk with XGBoost and graph attention models, evaluated with chronological splits.",
      "Feed forecasts and risk-adjusted capacity to a three-month rolling Pyomo MILP, solved with HiGHS. Production, flows, inventories, imports, and whole cargoes must fit the network."
    ],
    "decision": "Marine shipments use integer cargo counts. The objective combines operating cost and a carbon price, with constraints for material balance, production capacity, and storage.",
    "evidence": "P50 demand forecasts achieved WAPE of 4.40% in 2018–19 and 9.41% in 2020–21. The 2018–19 error was 23.7% below the seasonal-naive-plus-growth baseline. All 288 recorded plans solved with optimality gaps below 0.01%.",
    "limitation": "Forecast interval coverage was 76% and 68% against an 80% target. Aggregate network flows correlated well with reference flows, but some individual lanes were poorly matched. Results are from the recorded historical evaluations.",
    "provenance": "Evaluation source: October 2026 OptiGreen-Chem progress review. The method demo is a separate synthetic model.",
    "lab": "supply",
    "features": [
      "P10 / P50 / P90 demand forecasts across 229 state-product series",
      "Refinery shortage-risk models evaluated with chronological splits",
      "Rolling Pyomo MILP with integer cargoes and network-flow constraints"
    ]
  },
  {
    "id": "audio",
    "name": "Audio Notes",
    "categories": [
      "software",
      "ai"
    ],
    "category": "AI application / Backend engineering",
    "context": "Full-stack transcription and summarization application",
    "description": "An audio-to-notes application with a Next.js interface and FastAPI backend. Recordings are transcribed in segments, summarized into structured notes, and processed through a resumable background queue.",
    "tags": [
      "Next.js",
      "FastAPI",
      "PostgreSQL",
      "Docker"
    ],
    "repository": "https://github.com/devesh3001/gnani_audio_notes_ps",
    "website": "https://gnani-audio-notes-ps.vercel.app/",
    "features": [
      "Silence-aware audio segmentation and Gnani speech recognition",
      "Resumable Postgres jobs with retries and worker heartbeats",
      "Structured LLM notes, recording history, and progress tracking"
    ],
    "metrics": [
      {
        "value": "≤30 s",
        "label": "silence-aware audio chunks"
      },
      {
        "value": "Resumable",
        "label": "background processing"
      },
      {
        "value": "ASR + LLM",
        "label": "transcription and notes"
      }
    ],
    "question": "Upload a recording, follow transcription progress, and reopen its transcript, key points, and action items.",
    "pipeline": [
      "Upload audio directly to private S3-compatible storage using a presigned URL, then confirm the recording with the FastAPI backend.",
      "Validate and normalize audio with ffmpeg, and split it into chunks of at most 30 seconds, favoring quiet points between words.",
      "Send segments to Gnani ASR and persist chunk-level progress so completed work can be reused after a retry.",
      "Claim background jobs with Postgres FOR UPDATE SKIP LOCKED. Heartbeats and ownership checks protect retries and recover jobs abandoned by a worker.",
      "Generate structured title, summary, key points, and action items through an LLM. Long transcripts use section-level notes followed by a merged summary.",
      "Display recording history, segment status, and processing progress in a Next.js interface."
    ],
    "decision": "Recording state and queued work share a database transaction. Per-chunk progress lets transcription resume after interruption, while job ownership checks prevent late updates from a replaced worker.",
    "evidenceTitle": "Implementation & validation",
    "evidence": "The repository includes the frontend, API, worker, audio pipeline, and tests for queue concurrency, delayed retries, stale-job recovery, and pipeline transitions. These components were reviewed in source; no fresh service benchmark or end-to-end upload test was run for this portfolio.",
    "limitation": "Transcription and summaries depend on external ASR and LLM services. The documented deployment accepts files up to 50 MB, and free-tier backend startup can delay processing.",
    "provenance": "Sources: repository README, queue implementation, audio planner, summarizer, and queue tests. Website URL is documented in the repository.",
    "lab": null,
    "number": "04"
  },
  {
    "id": "solar",
    "name": "Solar Filament & VLM Study",
    "categories": [
      "ml",
      "ai"
    ],
    "category": "Computer vision / Experimental evaluation",
    "context": "Reproducible research study · Measured CPU subsets",
    "description": "A PyTorch study of solar-filament segmentation and object hallucination in a vision-language model. It includes grouped data splits, controlled ablations, per-example outputs, and documented failures.",
    "tags": [
      "PyTorch",
      "U-Net",
      "SmolVLM",
      "POPE"
    ],
    "repository": "https://github.com/devesh3001/Solar_filament",
    "website": null,
    "features": [
      "U-Net segmentation with boundary and skeleton-aware losses",
      "Splits grouped by observation, date, and identical pixels",
      "SmolVLM / POPE evaluation with ablations and parser diagnostics"
    ],
    "metrics": [
      {
        "value": "26",
        "label": "tests passed in recorded run"
      },
      {
        "value": "A0–A6",
        "label": "segmentation ablations"
      },
      {
        "value": "64 / 8",
        "label": "solar / POPE images in study"
      }
    ],
    "question": "Compare segmentation losses for thin solar structures, and test whether visual-evidence prompting changes object hallucination in a frozen vision-language model.",
    "pipeline": [
      "Decode MAGFiLO COCO polygons at native resolution, merge annotation masks, and group observations by physical filename, date, and decoded-pixel hash before splitting.",
      "Run a classical segmentation baseline and compact U-Net ablations using weighted BCE, Dice, boundary, and soft-skeleton losses.",
      "Evaluate pixel overlap and explicitly labeled skeleton and connected-component proxies; retain predictions, checkpoints, and failure grids.",
      "Evaluate frozen SmolVLM-256M on the original POPE Random, Popular, and Adversarial questions using baseline, grounded, and two-stage verification prompts.",
      "Save raw answers and compare strict Yes/No parsing with the upstream POPE parser, alongside accuracy, recall, false positives, and answer bias."
    ],
    "decision": "Related solar observations are grouped before augmentation to reduce leakage. Per-question outputs and both parsing rules are retained so a lower false-positive rate can be checked against lost recall and answer bias.",
    "evidenceTitle": "Recorded subset results",
    "evidence": "The A6 run recorded validation IoU of 0.2526 and Dice of 0.4034 on 13 solar images. The test artifact records 26 tests with zero failures or errors. In the 144-question POPE subset, two-stage verification reduced false positives but sharply reduced recall and accuracy, so it was not recommended over the baseline.",
    "limitation": "Results use one seed, 64 solar observations, and eight independent POPE images. Validation was used for checkpoint selection. Full-scale experiments and an untouched test evaluation were not executed; the reported proxies are not official competition metrics.",
    "provenance": "Sources: repository report, measured A6 metrics, run-status file, tests.xml, grouping implementation, and prompt definitions.",
    "lab": null,
    "number": "05"
  },
  {
    "id": "chrono",
    "name": "ChronoMesh",
    "categories": [
      "software",
      "ai"
    ],
    "category": "Agent workflows / Temporal data",
    "context": "Inter IIT Tech Meet 15.0 Prepathon · Scenario prototype",
    "description": "An event-processing prototype that combines transaction and support evidence into a customer state. LangGraph coordinates evidence extraction, state synthesis, a cost-benefit decision, and a checkpointed approval step.",
    "tags": [
      "Python",
      "LangGraph",
      "SQLite",
      "SQLAlchemy"
    ],
    "repository": "https://github.com/devesh3001/ChronoMesh",
    "website": null,
    "features": [
      "Timestamped transaction and support evidence with as-of queries",
      "LangGraph checkpoints with a pause-and-resume approval flow",
      "Heuristic cost-benefit scoring and structured JSON traces"
    ],
    "metrics": [
      {
        "value": "As-of",
        "label": "timestamped evidence queries"
      },
      {
        "value": "Checkpointed",
        "label": "approval workflow"
      },
      {
        "value": "JSON",
        "label": "exported decision traces"
      }
    ],
    "question": "Track changing customer evidence and route a proposed retention action through a reproducible decision and approval workflow.",
    "pipeline": [
      "Read an ordered stream of customer events and extract evidence from transaction and support signals.",
      "Persist evidence with validity timestamps in SQLite and query records available at the event time.",
      "Combine signals using rule-based synthesis to assign a customer state and confidence band.",
      "Score candidate interventions with a heuristic expected-value calculation, then route escalated decisions to an approval step.",
      "Persist LangGraph state with SqliteSaver, pause before approval, resume the graph, and export structured checkpoints."
    ],
    "decision": "The workflow persists its state before an escalated action proceeds. Temporal evidence storage and graph checkpoints are separate, so the event evidence and the paused decision can both be inspected.",
    "evidenceTitle": "Prototype scope",
    "evidence": "The entry point implements the scenario_03 churn-risk example with a durable LangGraph breakpoint and JSON checkpoint export. The code demonstrates state update and resume by simulating human approval.",
    "limitation": "This is a scenario prototype. State synthesis is rule-based; LLM integration is a placeholder, approval is simulated, and evidence supersession handling is simplified. There is no hosted application or measured customer-outcome claim.",
    "provenance": "Sources: repository README, main.py, LangGraph workflow, evidence repository, synthesis agent, and decision engine.",
    "lab": null,
    "number": "06"
  }
];

export const skills = {
  "ml": {
    "tools": [
      "Python",
      "PyTorch",
      "XGBoost",
      "Scikit-Learn",
      "Pandas",
      "NumPy",
      "U-Net",
      "Isolation Forest"
    ],
    "note": "Used for forecasting, unsupervised image screening, and segmentation experiments."
  },
  "software": {
    "tools": [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "FastAPI",
      "PostgreSQL",
      "Prisma",
      "Socket.IO",
      "Docker",
      "C/C++",
      "Java",
      "SQL"
    ],
    "note": "Application tools and languages. Fundamentals include data structures, algorithms, operating systems, OOP, and DBMS."
  },
  "optimization": {
    "tools": [
      "Pyomo",
      "HiGHS",
      "MILP",
      "Quantile forecasting",
      "Network flows",
      "Scenario analysis"
    ],
    "note": "Used in OptiGreen-Chem to connect forecasts with production, inventory, and transport decisions."
  },
  "ai": {
    "tools": [
      "LangGraph",
      "SQLite checkpoints",
      "Gnani ASR",
      "LLM summarization",
      "SmolVLM",
      "POPE evaluation"
    ],
    "note": "Audio Notes uses ASR and LLM services. ChronoMesh demonstrates checkpointed agent workflows. Solar Filament includes vision-language evaluation."
  }
};

/**
 * Exact enumeration of a synthetic, single-period mixed-integer planning model.
 * Marine shipments come in whole cargoes of 20 units; backup capacity is 60.
 * Two backup transport options offer different operating-cost/emission tradeoffs.
 * The scalar carbon input is a price per synthetic emission unit.
 */
export function solveSupply({ demand = 120, outage = 15, carbon = 40 } = {}) {
  if (![demand, outage, carbon].every(Number.isFinite) || demand <= 0 || demand > 10000 || outage < 0 || outage > 100 || carbon < 0 || carbon > 100) {
    throw new RangeError('Scenario inputs must be finite and within the demo bounds.');
  }
  const capacity = 120 * (1 - outage / 100);
  const maxCargoes = Math.floor((capacity + 1e-9) / 20);
  let best;
  for (let cargoes = 0; cargoes <= maxCargoes; cargoes++) {
    const produced = cargoes * 20;
    const marine = Math.min(produced, demand);
    const backup = Math.min(60, Math.max(0, demand - marine));
    const shortage = Math.max(0, demand - marine - backup);
    const surplus = Math.max(0, produced - demand);
    for (const route of [{ name: 'standard express', price: 9, factor: .95 }, { name: 'lower-emission express', price: 12, factor: .25 }]) {
      const cost = produced * 6 + backup * route.price + surplus * .5;
      const emissions = produced * .28 + backup * route.factor;
      const objective = cost + carbon * emissions + 500 * shortage;
      const plan = { demand, capacity, maxCargoes, cargoes, marine, backup, shortage, surplus, cost, emissions, objective, route: route.name, delivered: marine + backup, coverage: 100 * (marine + backup) / demand };
      if (!best || objective < best.objective - 1e-9 || (Math.abs(objective - best.objective) <= 1e-9 && cost < best.cost)) best = plan;
    }
  }
  return best;
}

// Deliberately synthetic points for an explanatory score plot, not Mars results.
export const noveltyScores = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  score: i === 5 ? .67 : i === 14 ? .74 : i === 25 ? .81 : i === 31 ? .64 : .37 + ((i * 17 + 11) % 19) * .009
}));

export function screenNovelty(threshold) {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) throw new RangeError('Threshold must be between zero and one.');
  return noveltyScores.filter(point => point.score > threshold);
}

export function filterProjects(category = 'all') {
  return projects.filter(project => category === 'all' || project.categories.includes(category));
}

// Synthetic FEFO example. The function is pure: failed reservations return
// unchanged stock, and successful reservations never allocate beyond a batch.
export function sampleInventory() {
  return [
    { id: 'A', expiresIn: 7, quantity: 4, initial: 4 },
    { id: 'B', expiresIn: 21, quantity: 6, initial: 6 },
    { id: 'C', expiresIn: 45, quantity: 8, initial: 8 }
  ];
}

export function allocateFefo(batches, requested) {
  if (!Array.isArray(batches) || !Number.isSafeInteger(requested) || requested <= 0 ||
      batches.some(batch => !batch || typeof batch.id !== 'string' ||
        !Number.isSafeInteger(batch.quantity) || batch.quantity < 0 ||
        !Number.isFinite(batch.expiresIn) || batch.expiresIn <= 0) ||
      new Set(batches.map(batch => batch.id)).size !== batches.length) {
    throw new RangeError('Use unique, nonexpired batches and a positive whole quantity.');
  }
  const remaining = batches.map(batch => ({ ...batch }));
  const total = batches.reduce((sum, batch) => sum + batch.quantity, 0);
  if (requested > total) return { ok: false, remaining, allocations: [], total, requested };
  const ordered = [...remaining].sort((a, b) => a.expiresIn - b.expiresIn || a.id.localeCompare(b.id));
  const allocations = [];
  let needed = requested;
  for (const batch of ordered) {
    const quantity = Math.min(needed, batch.quantity);
    if (quantity) {
      allocations.push({ id: batch.id, quantity });
      batch.quantity -= quantity;
      needed -= quantity;
    }
    if (!needed) break;
  }
  return { ok: true, remaining, allocations, total: total - requested, requested };
}
