/* ============================================================
   QML_PRACTICAL_LABS — guided, browser-friendly project work.
   Each lab has instructions, a self-check acceptance checklist,
   and a points rubric. Route prerequisites use app hash routes.
   The browser is for simulation, planning, and checklists only;
   these labs do not execute production quantum workloads.
   ============================================================ */
window.QML_PRACTICAL_LABS = [
  {
    id: 'lab-practical-hypothesis',
    phase: 'Foundations',
    title: 'Frame a QML problem before choosing a model',
    level: 'Foundational',
    estimatedTime: '25–35 min',
    estimatedMinutes: 30,
    track: 'standalone',
    prerequisites: ['#/course/c-foundations', '#/eval/mini-math', '#/course/c-mlmethods'],
    summary: 'Turn a vague application idea into a falsifiable, decision-aware comparison plan. This is a paper-design lab; it deliberately does not assume a quantum advantage.',
    instructions: [
      'Choose a concrete binary or multiclass task (for example, rare sensor-fault triage). State who uses the prediction, what action follows, and the cost of false positives versus false negatives.',
      'Specify the prediction unit, target label, prediction time, and what information is legitimately available then. Define a simple, measurable success metric that reflects the decision costs.',
      'Write one testable hypothesis for a quantum model and one plausible reason it may fail. Separate a scientific claim (better held-out utility under a matched budget) from a technology claim (quantum advantage).',
      'Name at least two classical comparators, including a simple baseline. Set a minimum improvement that would justify extra complexity, and name a result that would make you stop.',
      'Draft a one-paragraph experiment preregistration: dataset source or synthetic-data recipe, split strategy, primary metric, seed plan, and what result would count as inconclusive.'
    ],
    deliverable: 'A one-page problem brief with a decision, falsifiable hypothesis, classical comparators, primary metric, and predeclared stop rule.',
    acceptanceChecklist: [
      { id: 'decision-defined', label: 'Prediction-time decision and asymmetric error costs are explicit.', required: true, points: 2 },
      { id: 'estimand-defined', label: 'Prediction unit, target, and eligible-at-prediction features are defined.', required: true, points: 2 },
      { id: 'falsifiable', label: 'The quantum hypothesis can be rejected by a stated outcome; advantage is not presumed.', required: true, points: 2 },
      { id: 'comparators', label: 'At least two classical comparators include a simple baseline.', required: true, points: 2 },
      { id: 'success-stop', label: 'Primary metric, practical threshold, and stop/inconclusive rule are predeclared.', required: true, points: 2 }
    ],
    scoring: {
      maxPoints: 10,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'decision', label: 'Decision context and error costs are operational', points: 2 },
        { id: 'target', label: 'Target and prediction-time information boundary are unambiguous', points: 2 },
        { id: 'hypothesis', label: 'Hypothesis and falsifying outcome are explicit', points: 2 },
        { id: 'comparators', label: 'Classical comparators and fair-comparison threshold are credible', points: 2 },
        { id: 'protocol', label: 'Metric and stop rule are preregistered', points: 2 }
      ]
    }
  },
  {
    id: 'lab-practical-circuit-budget',
    phase: 'Foundations',
    title: 'Make an encoding and circuit resource budget',
    level: 'Foundational',
    estimatedTime: '30–40 min',
    estimatedMinutes: 35,
    track: 'standalone',
    prerequisites: ['#/course/c-bloch-gates', '#/course/c-encoding', '#/eval/mini-encoding', '#/course/c-vqa', '#/eval/mini-vqa'],
    summary: 'Compare plausible data encodings and ansatz budgets on paper, including the limits imposed by simulation and hardware.',
    instructions: [
      'Take a feature vector with 12 real-valued inputs. Propose angle encoding on a selected subset, amplitude encoding, and a compact learned projection followed by angle encoding. State the preprocessing each needs.',
      'For each proposal, estimate qubits, feature-access cost, circuit depth, entangling-gate count, and the number of shots needed for the planned observables. Mark assumptions rather than inventing exact hardware timings.',
      'Sketch a shallow parameterized circuit: state preparation / data map, trainable layers, entanglers, and measured observables. Explain which symmetries or interactions the entanglers are meant to represent.',
      'Identify one trainability risk (such as an overly deep random circuit) and one hardware risk (such as noise or connectivity). Give a smaller fallback architecture.',
      'Choose one design for a simulation-sized pilot and one design that could be mapped to a stated device budget. Note that this browser can help plan and reason about these circuits, not run production quantum jobs.'
    ],
    deliverable: 'An encoding decision table and a resource-bounded circuit sketch with a fallback.',
    acceptanceChecklist: [
      { id: 'encoding-tradeoffs', label: 'At least three encoding choices are compared with concrete tradeoffs.', required: true, points: 2 },
      { id: 'resources', label: 'Qubits, depth, entanglers, feature access, and shots are budgeted or explicitly bounded.', required: true, points: 2 },
      { id: 'ansatz', label: 'Circuit blocks and measured observables are named and motivated.', required: true, points: 2 },
      { id: 'risk-fallback', label: 'Trainability/hardware risks and a smaller fallback are documented.', required: true, points: 2 },
      { id: 'execution-honesty', label: 'Simulation/planning is distinguished from production QPU execution.', required: true, points: 2 }
    ],
    scoring: {
      maxPoints: 10,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'alternatives', label: 'Encoding alternatives are technically distinct and compared', points: 2 },
        { id: 'budget', label: 'Resource estimates state assumptions and avoid false precision', points: 2 },
        { id: 'circuit', label: 'Ansatz and observables connect to the task', points: 2 },
        { id: 'risk', label: 'A credible risk and fallback are included', points: 2 },
        { id: 'scope', label: 'Execution claims respect the browser-only environment', points: 2 }
      ]
    }
  },
  {
    id: 'capstone-qml-frame',
    phase: 'Capstone · Stage 1 of 6',
    title: 'Define the end-to-end rare-event prediction project',
    level: 'Intermediate',
    estimatedTime: '35–50 min',
    estimatedMinutes: 45,
    track: 'capstone',
    capstone: 'capstone-rare-event-qml',
    stage: 1,
    prerequisites: ['#/course/c-mlmethods', '#/eval/mini-mlmethods', '#/course/c-foundations'],
    summary: 'Create the project contract for a rare-event sensor triage task. Use a public tabular dataset or a documented, seeded synthetic generator; neither is bundled or executed here.',
    instructions: [
      'Write the intended user and decision (for example, which sensor alerts receive human inspection). Fix the prediction unit and prediction time so repeated readings from one asset cannot silently cross the evaluation boundary.',
      'Define the label and its time window. List candidate features and exclude any recorded after the decision or derived from the label, maintenance action, or future outcome.',
      'State the primary metric (often PR-AUC for rare positives), a thresholded operational metric, and a calibration or workload measure. Explain why accuracy alone would mislead.',
      'Preregister the hypothesis, simple classical comparator, meaningful improvement threshold, compute budget, and stop/inconclusive rule. Make the quantum model a candidate, not the premise.',
      'Record data provenance, license/privacy constraints, and whether the source is public, synthetic, or otherwise permitted. Keep identifiers out of model inputs.'
    ],
    deliverable: 'A versioned project brief and experiment contract for the rare-event task.',
    acceptanceChecklist: [
      { id: 'use-case', label: 'User, action, prediction unit, and prediction time are specified.', required: true, points: 3 },
      { id: 'label-boundary', label: 'Label horizon and prohibited post-outcome features are documented.', required: true, points: 2 },
      { id: 'metrics', label: 'Primary and operational metrics suit an imbalanced decision.', required: true, points: 2 },
      { id: 'comparator', label: 'Classical comparator, improvement threshold, and stop rule are preregistered.', required: true, points: 3 },
      { id: 'provenance', label: 'Dataset provenance, permissions, and identifier handling are recorded.', required: true, points: 2 }
    ],
    scoring: {
      maxPoints: 12,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'decision-contract', label: 'Decision, unit, and information timing form a coherent estimand', points: 3 },
        { id: 'leakage-boundary', label: 'Label horizon and leakage exclusions are explicit', points: 2 },
        { id: 'metrics', label: 'Metrics reflect rare-event utility and workload', points: 2 },
        { id: 'falsifiability', label: 'Comparator, threshold, and stop rule can falsify the QML idea', points: 3 },
        { id: 'data-rights', label: 'Source and data-use constraints are responsibly handled', points: 2 }
      ]
    }
  },
  {
    id: 'capstone-qml-data-baseline',
    phase: 'Capstone · Stage 2 of 6',
    title: 'Audit data, lock splits, preprocess, and establish baselines',
    level: 'Intermediate',
    estimatedTime: '60–90 min',
    estimatedMinutes: 75,
    track: 'capstone',
    capstone: 'capstone-rare-event-qml',
    stage: 2,
    requiresStage: 'capstone-qml-frame',
    prerequisites: ['#/course/c-mlmethods', '#/eval/mini-mlmethods'],
    summary: 'Build a leakage-resistant data protocol before fitting any model, then measure how hard the task is classically.',
    instructions: [
      'Audit schema, row/asset counts, missingness, duplicate records, label prevalence, timestamp ranges, group structure, units, and suspicious near-identifiers. Save a compact audit table and checksums/version for the raw input.',
      'Choose a split that matches deployment: group by asset/person when repeated entities exist, or use a forward-time split when predicting the future. Keep a final test set untouched; use train/validation (or nested/grouped CV) for decisions.',
      'Fit imputation, scaling, feature selection, dimensionality reduction, and any class rebalancing using training data only. Apply fitted transforms to validation/test without refitting. Handle resampling inside training folds only.',
      'Report majority/stratified dummy performance and at least one suitable classical model (for example regularized logistic regression or gradient-boosted trees) using the same split and metrics intended for the QML model.',
      'Inspect class-specific errors, calibration, and threshold tradeoffs. Record the pipeline, split indices or deterministic split recipe, seed, and every preprocessing choice.'
    ],
    deliverable: 'A data audit, split manifest, train-fitted preprocessing pipeline, and baseline results table.',
    acceptanceChecklist: [
      { id: 'audit', label: 'Schema, missingness, duplicates, prevalence, groups/time, and leakage risks are audited.', required: true, points: 3 },
      { id: 'split', label: 'Split strategy matches deployment and protects the final test set.', required: true, points: 3 },
      { id: 'fit-boundary', label: 'All learned preprocessing and resampling are confined to training folds.', required: true, points: 3 },
      { id: 'baseline', label: 'Dummy and meaningful classical baselines use the shared protocol.', required: true, points: 3 },
      { id: 'manifest', label: 'Data/version, split recipe, seeds, metrics, and pipeline are reproducible.', required: true, points: 3 }
    ],
    scoring: {
      maxPoints: 15,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'audit', label: 'Audit finds consequential data and leakage risks', points: 3 },
        { id: 'split', label: 'Split is entity/time-aware and test data stays untouched', points: 3 },
        { id: 'preprocess', label: 'Transform and resampling fit boundaries prevent leakage', points: 3 },
        { id: 'baseline', label: 'Baselines are suitable, matched, and meaningfully reported', points: 3 },
        { id: 'repro', label: 'Audit artifacts and split/pipeline recipe can be recreated', points: 3 }
      ]
    }
  },
  {
    id: 'capstone-qml-model-design',
    phase: 'Capstone · Stage 3 of 6',
    title: 'Choose the feature map and design a resource-bounded circuit model',
    level: 'Advanced',
    estimatedTime: '60–90 min',
    estimatedMinutes: 75,
    track: 'capstone',
    capstone: 'capstone-rare-event-qml',
    stage: 3,
    requiresStage: 'capstone-qml-data-baseline',
    prerequisites: ['#/course/c-bloch-gates', '#/course/c-encoding', '#/eval/mini-encoding', '#/course/c-vqa', '#/eval/mini-vqa'],
    summary: 'Design and justify a compact feature map and variational model against the measured data budget and classical baseline.',
    instructions: [
      'Start from the audited training-only feature pipeline. Compare a small selected feature subset with a train-fitted projection; freeze the feature count and report how information is retained or discarded.',
      'Choose an encoding (for example angle encoding with data re-uploading or amplitude encoding) and explain normalization, scaling range, periodicity, and the cost of preparing a data-dependent state.',
      'Specify qubit count, data-map gates, trainable blocks, entanglement pattern, measured observables/readout, and number of trainable parameters. Explain how the circuit inductive bias could suit the task rather than merely looking quantum.',
      'Constrain depth and connectivity to an explicit simulator/device target. Plan a shallow baseline and one ablation (such as entanglers off or alternate feature map) before adding model complexity.',
      'Write down shot/noise assumptions, expected measurement uncertainty, and trainability checks (gradient scale, parameter sensitivity, and repeat initialization). This lab specifies a design; this browser does not run a QPU.'
    ],
    deliverable: 'A model card draft with encoding rationale, circuit diagram/specification, budget, readout, and preplanned ablation.',
    acceptanceChecklist: [
      { id: 'train-only-features', label: 'Feature selection/projection is fitted on training data only and feature count is justified.', required: true, points: 3 },
      { id: 'encoding', label: 'Encoding map, scaling, state-preparation cost, and limitations are explained.', required: true, points: 3 },
      { id: 'circuit-spec', label: 'Qubits, layers, entanglers, parameters, observables, and readout are specified.', required: true, points: 3 },
      { id: 'budget', label: 'Depth/connectivity/shot assumptions match a named target budget.', required: true, points: 3 },
      { id: 'controls', label: 'Ablation, shallow control, and trainability checks are preregistered.', required: true, points: 3 }
    ],
    scoring: {
      maxPoints: 15,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'feature-choice', label: 'Feature bottleneck is justified without validation/test leakage', points: 3 },
        { id: 'encoding-choice', label: 'Encoding tradeoffs and data-loading cost are understood', points: 3 },
        { id: 'circuit-design', label: 'Circuit structure and readout connect to a task hypothesis', points: 3 },
        { id: 'resource-plan', label: 'Resource and measurement assumptions are credible', points: 3 },
        { id: 'controls', label: 'Ablation and trainability diagnostics isolate likely failure modes', points: 3 }
      ]
    }
  },
  {
    id: 'capstone-qml-training',
    phase: 'Capstone · Stage 4 of 6',
    title: 'Train, validate, and diagnose optimizers fairly',
    level: 'Advanced',
    estimatedTime: '60–100 min',
    estimatedMinutes: 80,
    track: 'capstone',
    capstone: 'capstone-rare-event-qml',
    stage: 4,
    requiresStage: 'capstone-qml-model-design',
    prerequisites: ['#/course/c-vqa', '#/eval/mini-vqa', '#/course/c-mlmethods'],
    summary: 'Set a validation-only model-selection protocol and diagnose optimization, sampling, and initialization rather than reporting a lucky run.',
    instructions: [
      'Freeze a training protocol before examining test outcomes: objective/loss, minibatch policy, validation metric, early-stopping rule, max updates, shot budget, and hardware/noise assumptions.',
      'Compare at least two appropriate optimizers or schedules (for example Adam and SPSA where objective evaluations are noisy). Match tuning effort and resource budgets across quantum and classical candidates.',
      'Run multiple initialization seeds. Track training and validation curves, gradient/parameter diagnostics, optimizer steps, wall-clock or circuit evaluations, and shot counts. For stochastic estimates, record uncertainty or repeated measurement summaries.',
      'Tune hyperparameters using training/validation data only (or nested CV). Select the checkpoint and decision threshold by the preregistered rule; never select seeds or thresholds by final-test score.',
      'Log failed, unstable, and non-converged runs as well as successful ones. If using only a browser worksheet, fill in an explicitly simulated/planned run log and label it as such.'
    ],
    deliverable: 'A multi-seed training log, validation selection rule, optimizer comparison, and failure diagnosis.',
    acceptanceChecklist: [
      { id: 'protocol', label: 'Objective, budget, validation metric, and stopping/checkpoint rules are fixed.', required: true, points: 3 },
      { id: 'optimizer-comparison', label: 'Optimizers receive comparable tuning and compute/shot budgets.', required: true, points: 3 },
      { id: 'multiple-seeds', label: 'Multiple initializations and stochastic measurement uncertainty are tracked.', required: true, points: 3 },
      { id: 'validation-only', label: 'All model, hyperparameter, checkpoint, and threshold choices avoid the test set.', required: true, points: 3 },
      { id: 'failures', label: 'Unstable and failed runs are retained and honestly labeled.', required: true, points: 3 }
    ],
    scoring: {
      maxPoints: 15,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'protocol', label: 'Protocol is specified before test evaluation', points: 3 },
        { id: 'fairness', label: 'Optimizer and model comparisons use fair resource/tuning budgets', points: 3 },
        { id: 'seeds', label: 'Seed variation and sampling uncertainty are assessed', points: 3 },
        { id: 'selection', label: 'Validation-only selection prevents test-set overfitting', points: 3 },
        { id: 'diagnosis', label: 'Failures, costs, and convergence diagnostics are reported', points: 3 }
      ]
    }
  },
  {
    id: 'capstone-qml-evaluation',
    phase: 'Capstone · Stage 5 of 6',
    title: 'Evaluate once on held-out data and quantify uncertainty',
    level: 'Advanced',
    estimatedTime: '45–70 min',
    estimatedMinutes: 60,
    track: 'capstone',
    capstone: 'capstone-rare-event-qml',
    stage: 5,
    requiresStage: 'capstone-qml-training',
    prerequisites: ['#/course/c-mlmethods', '#/eval/mini-mlmethods', '#/course/c-measure'],
    summary: 'Make a locked final comparison, quantify uncertainty at the correct sampling unit, and state what this evidence cannot establish.',
    instructions: [
      'Lock the selected model, preprocessing, threshold, and analysis before opening the test labels. Run the final test evaluation once and retain the untouched split manifest.',
      'Report the preregistered primary metric, relevant class-specific and thresholded metrics, calibration/workload outcomes, confusion matrix, and the metric uncertainty. Include the comparator on exactly the same held-out examples.',
      'Choose an uncertainty procedure that respects dependence and rarity (for example bootstrap by entity rather than row). Distinguish uncertainty from finite test examples, random initialization, and finite measurement shots; do not treat correlated rows as independent.',
      'If comparing two classifiers on the same cases, use a paired comparison or paired resampling and state its assumptions. Avoid claiming significance from overlapping/non-overlapping confidence intervals alone.',
      'Discuss negative and inconclusive results, dataset shift, subgroup performance, multiplicity/model-selection bias, classical alternatives, measurement noise, and the difference between predictive quality and quantum computational advantage.'
    ],
    deliverable: 'A held-out evaluation report with matched comparator, uncertainty intervals, paired analysis where appropriate, and a limitations section.',
    acceptanceChecklist: [
      { id: 'locked-test', label: 'Model and analysis were locked before one final held-out test evaluation.', required: true, points: 3 },
      { id: 'matched-metrics', label: 'Preregistered metrics and classical comparator are reported on identical cases.', required: true, points: 3 },
      { id: 'uncertainty', label: 'Intervals/statistics respect entity dependence, rarity, and sampling sources.', required: true, points: 3 },
      { id: 'paired', label: 'Paired model comparisons account for the shared test examples and state assumptions.', required: true, points: 2 },
      { id: 'limitations', label: 'Limitations distinguish prediction evidence from claims of quantum advantage.', required: true, points: 4 }
    ],
    scoring: {
      maxPoints: 15,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'test-integrity', label: 'Held-out set remains independent of model selection', points: 3 },
        { id: 'reporting', label: 'Metrics and comparator answer the preregistered question', points: 3 },
        { id: 'statistics', label: 'Uncertainty and dependence are handled correctly', points: 3 },
        { id: 'paired-analysis', label: 'Paired comparison is appropriate and interpreted cautiously', points: 2 },
        { id: 'claims', label: 'Limitations and quantum-advantage claims are calibrated to evidence', points: 4 }
      ]
    }
  },
  {
    id: 'capstone-qml-package',
    phase: 'Capstone · Stage 6 of 6',
    title: 'Package, serve, and reproduce the result responsibly',
    level: 'Advanced',
    estimatedTime: '45–75 min',
    estimatedMinutes: 60,
    track: 'capstone',
    isCapstone: true,
    type: 'Evaluation',
    capstone: 'capstone-rare-event-qml',
    stage: 6,
    requiresStage: 'capstone-qml-evaluation',
    prerequisites: ['#/course/c-encoding', '#/course/c-vqa', '#/eval/mini-vqa'],
    summary: 'Deliver an auditable artifact and a serving plan with safe fallbacks. The browser provides planning/checklists; it does not deploy a production service or submit quantum jobs.',
    instructions: [
      'Create a manifest for source/data version and license, split recipe, preprocessing parameters, model/circuit specification, package versions, code revision, seeds, shot/noise settings, and evaluation protocol. Never bundle private raw records or secrets.',
      'Define a prediction interface: input schema/units, validation and missing-value behavior, output score/probability and uncertainty, selected threshold, and a clear abstain/escalate path for malformed or low-confidence cases.',
      'Describe where the model runs (classical simulator, remote quantum service, or classical fallback), latency/cost limits, access controls, monitoring, and behavior when the quantum backend is unavailable. Treat simulation results as simulation.',
      'Specify reproducibility checks: deterministic preprocessing, a smoke test on synthetic inputs, artifact checksums, expected tolerances for stochastic outputs, and a rerun recipe that does not touch the final test labels during tuning.',
      'Write a concise model card with intended use, out-of-scope use, known subgroup/data-shift limitations, resource costs, and a rollback/retirement trigger. State plainly that this project has no production quantum execution in the browser.'
    ],
    deliverable: 'A model-card draft, artifact manifest, prediction/serving contract, reproducibility smoke-test plan, and rollback policy.',
    acceptanceChecklist: [
      { id: 'manifest', label: 'Data, code, dependencies, model/circuit, seeds, and evaluation provenance are versioned.', required: true, points: 3 },
      { id: 'interface', label: 'Input/output, threshold, error handling, and abstain behavior are defined.', required: true, points: 2 },
      { id: 'fallback', label: 'Backend unavailability, classical fallback, latency, and cost behavior are specified.', required: true, points: 2 },
      { id: 'repro-tests', label: 'Synthetic smoke test, checksums, tolerances, and rerun instructions are included.', required: true, points: 2 },
      { id: 'responsible-release', label: 'Model card includes limitations, monitoring, and rollback triggers.', required: true, points: 3 },
      { id: 'scope-honesty', label: 'No browser simulation or planning artifact is represented as production QPU execution.', required: true, points: 3 }
    ],
    scoring: {
      maxPoints: 15,
      passingScore: 70,
      scoreMode: 'self-check',
      criteria: [
        { id: 'provenance', label: 'Artifact manifest is sufficient to audit the experiment', points: 3 },
        { id: 'serving', label: 'Interface, failure handling, and operational fallback are usable', points: 3 },
        { id: 'repro', label: 'Smoke test and rerun protocol are realistic and safe', points: 3 },
        { id: 'governance', label: 'Intended use, monitoring, and rollback are explicit', points: 3 },
        { id: 'honesty', label: 'Deployment and quantum execution claims are accurate', points: 3 }
      ]
    }
  }
];

/* Practical-bank schema follows the existing four-option MCQ format.
   This is a separate bank; it intentionally does not mutate QML_QUESTIONS. */
window.QML_PRACTICAL_BANK = [
  {
    id: 'practical-001', topic: 'practical', diff: 1, kind: 'mcq',
    prompt: 'A model is intended to flag equipment for inspection tomorrow. Which project framing most directly prevents an invalid prediction target?',
    options: ['Predict tomorrow’s failure using only records available before the inspection decision', 'Predict whether a failure was recorded using all columns in the final table', 'Use maintenance codes entered after tomorrow as features because they correlate with failure', 'Choose the target after seeing which label gives the best validation score'],
    answer: 0,
    explain: 'A prediction contract fixes the decision time and makes post-decision information ineligible, preventing target leakage and clarifying what the model could know at deployment.'
  },
  {
    id: 'practical-002', topic: 'practical', diff: 1, kind: 'mcq',
    prompt: 'A dataset has 0.7% positive failures. Which single headline metric is least informative by itself?',
    options: ['Recall at a predeclared inspection capacity', 'Precision-recall AUC', 'Accuracy', 'A calibration measure on held-out predictions'],
    answer: 2,
    explain: 'Predicting every case as negative yields about 99.3% accuracy while detecting no failures. Rare-event evaluation needs class-sensitive and decision-aware measures.'
  },
  {
    id: 'practical-003', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'Repeated measurements from each of 80 machines appear in a dataset. The intended use is on previously unseen machines. Which split is the best default?',
    options: ['Randomly split individual rows so each split has every machine', 'Group-split by machine, keeping all rows from each machine together', 'Sort labels and put the first half in train and the rest in test', 'Place duplicates in train and remove only exact copies from test'],
    answer: 1,
    explain: 'A group split estimates generalization to unseen machines. A row-random split can let machine-specific signatures leak across partitions and inflate performance.'
  },
  {
    id: 'practical-004', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'Which sequence correctly handles scaling and validation data?',
    options: ['Fit scaler on the full dataset, then split', 'Fit scaler on training data only, then transform validation and test with that fitted scaler', 'Fit a separate scaler on validation and test to remove their distribution shifts', 'Scale the label and features together before splitting'],
    answer: 1,
    explain: 'Learned preprocessing parameters belong to the training partition. Applying the fitted transform to later partitions avoids information leaking backward.'
  },
  {
    id: 'practical-005', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'You use SMOTE before a 5-fold cross-validation split. Why is this problematic?',
    options: ['SMOTE can create only categorical samples', 'Synthetic neighbors may be derived from examples later assigned to validation folds', 'Cross-validation requires perfectly balanced validation labels', 'SMOTE makes the model deterministic'],
    answer: 1,
    explain: 'Oversampling before fold assignment allows information from validation examples to influence synthetic training points. Resampling must be performed inside each training fold.'
  },
  {
    id: 'practical-006', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'A final test set is repeatedly checked while feature count, threshold, and optimizer settings are changed. What is the main consequence?',
    options: ['The test set becomes a de facto validation set and its score is optimistically selected', 'The test set becomes more representative as it is used more', 'Only training loss is affected, not the estimate of generalization', 'Repeated inspection removes sampling uncertainty'],
    answer: 0,
    explain: 'Every adaptive choice informed by test results creates selection bias. A fresh untouched test set or a properly nested evaluation is then needed for an unbiased final estimate.'
  },
  {
    id: 'practical-007', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'A 12-feature dataset is angle-encoded on 4 qubits. What must the report clarify before claiming the encoding uses only four features?',
    options: ['Whether features are selected, projected, or re-uploaded across repeated data-dependent gates', 'Only the number of trainable parameters', 'The Bloch-sphere color used in the circuit diagram', 'Whether the target is represented by a qubit'],
    answer: 0,
    explain: 'Qubit count does not specify how all classical input values enter. A map may select/project features or re-upload data; those choices and their costs must be stated.'
  },
  {
    id: 'practical-008', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'Why is amplitude encoding not automatically a cheap way to load d classical features into log₂(d) qubits?',
    options: ['It is forbidden by normalization', 'Preparing the state with amplitudes from arbitrary classical data can itself require substantial data-dependent work', 'Amplitude encoding always uses d qubits', 'It cannot represent real-valued features'],
    answer: 1,
    explain: 'The compact state dimension does not make arbitrary state preparation free. Loading cost, access assumptions, and classical preprocessing must be included in end-to-end resource comparisons.'
  },
  {
    id: 'practical-009', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'What is a defensible reason to include an entangling layer in a variational classifier?',
    options: ['Entanglement guarantees higher test accuracy', 'It supplies interactions/correlations motivated by the model hypothesis, which can be tested against a no-entangler ablation', 'It makes the optimizer convex', 'It removes shot noise from measurement'],
    answer: 1,
    explain: 'Entanglers are a modeling choice, not an accuracy guarantee. Their contribution should be justified and tested with a controlled ablation under the same budget.'
  },
  {
    id: 'practical-010', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'A deep, randomly initialized variational circuit shows near-zero gradients as qubit count increases. Which response is most diagnostic?',
    options: ['Increase depth until gradients return', 'Check gradient scale across depth/initializations and compare a shallower or structured ansatz', 'Tune only on the held-out test set', 'Report the best seed and omit the rest'],
    answer: 1,
    explain: 'Vanishing gradients can indicate trainability problems such as barren-plateau behavior. Depth, structure, initialization, and repeated seeds should be investigated rather than hidden.'
  },
  {
    id: 'practical-011', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'A measured Pauli expectation uses N independent shots and has outcomes ±1. Roughly how does its standard error scale with N?',
    options: ['As N', 'As 1/√N', 'As 1/N²', 'It is exactly zero for any N'],
    answer: 1,
    explain: 'For bounded independent outcomes the estimator’s standard error typically decreases on the order of 1/√N, so halving error requires about four times as many shots.'
  },
  {
    id: 'practical-012', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'Which optimizer comparison is most interpretable when one objective estimate is noisy because it uses finite shots?',
    options: ['Give one optimizer 100 times the circuit evaluations and compare its best run', 'Use matched tuning/evaluation budgets, multiple seeds, and report objective uncertainty and convergence behavior', 'Select each optimizer’s hyperparameters on the final test set', 'Compare training accuracy only after unequal stopping rules'],
    answer: 1,
    explain: 'Noise and unequal budgets can dominate optimizer differences. Matched resources, repeated initializations, validation-only selection, and uncertainty-aware logs support a fair comparison.'
  },
  {
    id: 'practical-013', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'When is SPSA often worth evaluating for a variational circuit?',
    options: ['When objective evaluations are noisy and parameter dimension makes coordinate-wise finite differences expensive', 'Only when the loss is an exact quadratic', 'When there are no trainable parameters', 'When labels are unavailable and no objective can be formed'],
    answer: 0,
    explain: 'SPSA estimates a gradient from a small number of perturbed objective evaluations independent of parameter dimension, which can be useful under noisy measurement, though it still needs validation.'
  },
  {
    id: 'practical-014', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'You report the mean score across 20 random initializations, but used one initialization to select architecture after inspecting validation results. What uncertainty remains most important to report?',
    options: ['Variation across seeds, and that architecture selection itself used validation data', 'Only the training-set standard deviation', 'No uncertainty, because 20 runs is enough', 'Only the number of qubits'],
    answer: 0,
    explain: 'Seed variation is a real source of instability, while architecture selection on validation introduces selection effects. Neither is erased by averaging a modest number of runs.'
  },
  {
    id: 'practical-015', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'A team chooses a probability threshold to maximize F1 on validation data. What should it do before final reporting?',
    options: ['Freeze the threshold and evaluate it once on the held-out test set', 'Retune the threshold on the test set for a better result', 'Use a different threshold for every test example based on its true label', 'Discard the validation set and choose the threshold from training accuracy'],
    answer: 0,
    explain: 'Threshold selection is model selection. It should use training/validation data under a predeclared rule; the frozen rule is then evaluated on untouched test data.'
  },
  {
    id: 'practical-016', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'Two classifiers are evaluated on the same 200 held-out entities. Which bootstrap is most appropriate if each entity contributes several correlated rows?',
    options: ['Resample individual rows independently', 'Resample entities as clusters, retaining each selected entity’s rows together', 'Resample only the positive predictions', 'Resample model parameters but keep labels fixed and call it a test-set interval'],
    answer: 1,
    explain: 'The resampling unit should match the independent sampling unit. Cluster bootstrap by entity preserves within-entity dependence and avoids overstating the effective sample size.'
  },
  {
    id: 'practical-017', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'Why is a paired comparison generally preferable for two models evaluated on the same held-out examples?',
    options: ['It uses the within-example relationship between predictions and can be more precise than treating scores as independent', 'It makes both models statistically independent', 'It guarantees a smaller p-value', 'It removes the need to predeclare a metric'],
    answer: 0,
    explain: 'Both predictions share test cases, so their outcomes are paired. Paired tests/resampling use that structure; they do not guarantee significance or remove analysis assumptions.'
  },
  {
    id: 'practical-018', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'A 95% confidence interval for a model’s PR-AUC is wide because there are only 14 positive test cases. What is the soundest interpretation?',
    options: ['The interval indicates substantial uncertainty; more independent positive cases or a better-powered study may be needed', 'The point estimate is certainly true because the interval is 95%', 'The model has 95% probability of beating every competitor', 'The interval can be narrowed by repeatedly checking the test set and selecting its best subset'],
    answer: 0,
    explain: 'Few positives make rare-event estimates unstable. A confidence interval describes uncertainty under its sampling assumptions; it does not prove superiority or become narrower through selective reporting.'
  },
  {
    id: 'practical-019', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'A QML classifier beats logistic regression in a browser-based ideal statevector simulator. What conclusion is justified?',
    options: ['The browser experiment proves quantum computational advantage on production hardware', 'The simulated result is evidence about that model and simulation protocol only; fair classical, noise, and resource comparisons remain necessary', 'The result proves quantum supremacy because the circuit is variational', 'No classical baseline is needed if the simulator is exact'],
    answer: 1,
    explain: 'Ideal simulation is not quantum execution and may be classically tractable. Advantage requires an end-to-end, resource-aware comparison against strong classical approaches and realistic hardware costs.'
  },
  {
    id: 'practical-020', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'Which report separates three major sources of variation in a finite-shot variational experiment?',
    options: ['One score from one run, rounded to three decimals', 'Repeated seeds, shot/measurement uncertainty, and finite held-out-sample uncertainty are tracked distinctly', 'Training accuracy and circuit depth only', 'Best validation score and the final test score without intervals'],
    answer: 1,
    explain: 'Initialization, finite measurements, and finite evaluation samples are different uncertainty sources. Repeated seeds, measurement estimates, and test-set intervals should not be conflated.'
  },
  {
    id: 'practical-021', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'Which artifact most helps reproduce a stochastic QML result without leaking test information?',
    options: ['A screenshot of the best run', 'Versioned data/split recipe, preprocessing fit, model/circuit config, package versions, seeds, shot settings, and locked evaluation script', 'The test labels copied into the training notebook', 'Only the final rounded metric'],
    answer: 1,
    explain: 'Reproduction needs the data and split provenance, fitted pipeline, model and runtime config, stochastic settings, and exact evaluation protocol—not just a selected result.'
  },
  {
    id: 'practical-022', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'A production service may lose access to its remote quantum backend. Which serving plan is safest?',
    options: ['Fail open and silently return a stale score as current', 'Define timeout/error behavior, a validated classical fallback or abstain/escalate path, and log backend provenance', 'Retry forever until a result arrives', 'Drop input validation because the circuit expects numeric features'],
    answer: 1,
    explain: 'A responsible service validates inputs and handles outages explicitly. A tested fallback or abstention preserves operational safety and makes the source of each prediction auditable.'
  },
  {
    id: 'practical-023', topic: 'practical', diff: 2, kind: 'mcq',
    prompt: 'Which statement belongs in a responsible model card for a small QML pilot?',
    options: ['The model is unbiased because quantum states are physical', 'Intended use, out-of-scope use, data-shift/subgroup limits, resource costs, uncertainty, and rollback criteria', 'A promise that the model will remain accurate under any future distribution', 'Only the circuit diagram, without data or evaluation context'],
    answer: 1,
    explain: 'A model card communicates use boundaries, evidence, limits, operational costs, and safeguards. Quantum hardware does not make a model inherently fair or robust.'
  },
  {
    id: 'practical-024', topic: 'practical', diff: 3, kind: 'mcq',
    prompt: 'You compare ten feature maps and publish only the one with the highest score on a single small test set. Which issue is most direct?',
    options: ['The test set has been adaptively reused for model selection, inflating the reported best score', 'The model has too few qubits by definition', 'A feature map cannot be selected using validation data', 'The number of comparisons has no effect if each metric is correct'],
    answer: 0,
    explain: 'Selecting among many candidates using the test score overfits the test set and creates winner’s-curse bias. Selection belongs on validation/nested CV; the final test is for one locked analysis.'
  }
];
