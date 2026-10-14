import json, os, sys, time
from youtube_transcript_api import YouTubeTranscriptApi

OUT = os.path.join(os.path.dirname(__file__), "transcripts")
MANIFEST = os.path.join(OUT, "manifest.json")

videos = [
    (1, "QtWCmO_KIlg", "Introduction"),
    (2, "m77_muSPrs0", "Classical Probability Theory"),
    (3, "Y5WRv_9757A", "Quantum States"),
    (4, "bNCC0YMLHuk", "Multiple Qubits"),
    (5, "aVFe08G0uYk", "Measurements"),
    (6, "BE8RxAESx5I", "Mixed States"),
    (7, "P-mGqiKcEKE", "Evolution in Closed Quantum Systems"),
    (8, "_fmBNpDEen4", "Open Quantum Systems"),
    (9, "Wy9YoEYv-fA", "Classical Ising Model"),
    (10, "egli0tC1tRo", "Transverse Field Ising Model"),
    (11, "MmpOva4-XPg", "Quantum Many-Body Physics (Roger Melko)"),
    (12, "7HayIq9OR2E", "Many-Body Behavior of Spins (Roger Melko)"),
    (13, "uTCeQHzQMdc", "Strategies to Solve the Many-Body Problem (Roger Melko)"),
    (14, "92uqxeofPak", "Gate-Model Quantum Computing"),
    (15, "csgEVurrBpU", "Adiabatic Quantum Computing"),
    (16, "7btX7OuR2QM", "Quantum Annealing"),
    (17, "l06HATJAbdI", "Implementations"),
    (18, "N8e5nAk6KBQ", "Quantum Approximate Optimization Algorithm (QAOA)"),
    (19, "VW43u8RM2qI", "Sampling a Thermal State"),
    (20, "bVymBcvE7BA", "Variational Circuits and Quantum Simulation 1 (Alan Aspuru-Guzik)"),
    (21, "abB2zwLCmW4", "Variational Circuits and Quantum Simulation 2 (Alan Aspuru-Guzik)"),
    (22, "qN0UdJda1a4", "Variational Circuits and Quantum Simulation 3 (Alan Aspuru-Guzik)"),
    (23, "Rm-wkvXkniw", "Variational Circuits and Quantum Simulation 4 (Alan Aspuru-Guzik)"),
    (24, "LHzWAyT5rMI", "Encoding Classical Information"),
    (25, "TjVEfusNfVg", "Ensemble Learning"),
    (26, "5Y3slnSx0wI", "QBoost"),
    (27, "7MDwycGSiy0", "Clustering by Quantum Optimization"),
    (28, "HILVRvDaQsE", "Kernel Methods"),
    (29, "YHkfAC5Iu9I", "An Interference Circuit"),
    (30, "DdWH2j6P8f0", "Probabilistic Graphical Models"),
    (31, "wk6zmGnJ3mw", "Optimization and Sampling in PGMs"),
    (32, "uDAAi5aQbMU", "Quantum-Enhanced Kernel Methods 1 (Maria Schuld)"),
    (33, "pfGHJivyzHA", "Quantum-Enhanced Kernel Methods 2 (Maria Schuld)"),
    (34, "YWfAxmwOCjM", "Quantum-Enhanced Kernel Methods 3 (Maria Schuld)"),
    (35, "rtDC-j4Uw0A", "Quantum Fourier Transform"),
    (36, "tFQS9QvK-tE", "Quantum Phase Estimation"),
    (37, "hQpdPM-6wtU", "Overview of the HHL Algorithm"),
    (38, "24gxm-DhH2E", "Quantum Matrix Inversion"),
    (39, "fgJ1pUbks4M", "Using Quantum Linear Algebra for Learning"),
    (40, "A78Ez6dSWvA", "Quantum-Assisted Gaussian Processes"),
    (41, "OstyW7c0v48", "Guest lecture by Seth Lloyd"),
]

ytt = YouTubeTranscriptApi()

def fetch_one(idx, vid, title):
    fname = os.path.join(OUT, f"{idx:02d}_{vid}.txt")
    if os.path.exists(fname) and os.path.getsize(fname) > 500:
        return "cached"
    try:
        t = ytt.fetch(vid, languages=["en"])
    except Exception:
        try:
            tl = ytt.list(vid)
            t = None
            for cand in tl:
                try:
                    t = cand.fetch()
                    break
                except Exception:
                    continue
            if t is None:
                return "no-transcript"
        except Exception as e:
            return f"error:{e}"
    lines = []
    for snip in t:
        txt = snip.text.replace("\n", " ").strip()
        if txt:
            lines.append(txt)
    with open(fname, "w", encoding="utf-8") as f:
        f.write(f"# {idx:02d} - {title} ({vid})\n\n")
        f.write(" ".join(lines))
    return "ok"

results = {}
only = [int(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else None
for idx, vid, title in videos:
    if only and idx not in only:
        continue
    r = fetch_one(idx, vid, title)
    results[vid] = r
    print(f"{idx:02d} {vid} {r}", flush=True)
    if r.startswith("error") or r == "no-transcript":
        pass
    time.sleep(0.4)

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)
print("DONE")
