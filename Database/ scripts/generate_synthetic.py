from pathlib import Path
import argparse
import random
import pandas as pd
import numpy as np


def expand_df(df: pd.DataFrame, target_rows: int) -> pd.DataFrame:
    if len(df) == 0:
        return df
    parts = []
    while sum(len(p) for p in parts) < target_rows:
        p = df.sample(frac=1, replace=True)
        # apply small random perturbations to numeric columns
        for col in p.select_dtypes(include=[np.number]).columns:
            noise = np.random.normal(scale=0.01, size=len(p))
            p[col] = p[col].astype(float) * (1 + noise)
        parts.append(p)
    out = pd.concat(parts, ignore_index=True).head(target_rows)
    # introduce some NaNs randomly to simulate missing data
    for col in out.columns:
        mask = np.random.rand(len(out)) < 0.02
        out.loc[mask, col] = np.nan
    return out


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic raw CSVs from sample data")
    parser.add_argument("--sample-dir", default="sample_data", help="Directory with demo CSVs (relative to Database)")
    parser.add_argument("--out-dir", default="raw_data", help="Directory to write synthetic raw CSVs (relative to Database)")
    parser.add_argument("--rows", type=int, default=1000, help="Target number of rows per file")
    args = parser.parse_args()

    base = Path(__file__).resolve().parents[1]
    sample_dir = base / args.sample_dir
    out_dir = base / args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    mapping = {
        "demo_projects.csv": "projects.csv",
        "demo_complaints.csv": "complaints.csv",
        "demo_audit.csv": "audit.csv",
    }

    for demo, dest in mapping.items():
        src = sample_dir / demo
        dst = out_dir / dest
        if not src.exists():
            print(f"Skipping missing sample file: {src}")
            continue
        try:
            if src.stat().st_size == 0:
                print(f"Skipping empty sample file: {src}")
                continue
            df = pd.read_csv(src)
        except pd.errors.EmptyDataError:
            print(f"Skipping empty or invalid CSV: {src}")
            continue
        except Exception as e:
            print(f"Error reading sample {src}: {e}")
            continue
        df_out = expand_df(df, args.rows)
        df_out.to_csv(dst, index=False)
        print(f"Wrote {dst} rows={len(df_out)}")


if __name__ == "__main__":
    main()
