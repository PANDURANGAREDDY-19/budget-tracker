import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_SCRIPTS = ROOT / "Database" / " scripts"


def run(cmd):
    print("Running:", cmd)
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(res.stdout)
    if res.returncode != 0:
        print(res.stderr, file=sys.stderr)
        raise SystemExit(res.returncode)


def main():
    # 1) generate synthetic data
    gen = f"{sys.executable} \"{DB_SCRIPTS / 'generate_synthetic.py'}\" --rows 200"
    run(gen)

    # 2) run cleaner using Database script
    cleaner = f"{sys.executable} \"{DB_SCRIPTS / 'data_cleaning.py'}\" --raw-dir Database/raw_data --out-dir Database/cleaned_data"
    run(cleaner)

    # 3) verify outputs
    out_files = [ROOT / "Database" / "cleaned_data" / f for f in ["clean_projects.csv", "clean_complaints.csv", "clean_audit.csv"]]
    for f in out_files:
        if not f.exists():
            print("Missing output:", f)
            raise SystemExit(3)
        print("Found:", f, "size", f.stat().st_size)

    print("Cleaning run test passed")


if __name__ == '__main__':
    main()
