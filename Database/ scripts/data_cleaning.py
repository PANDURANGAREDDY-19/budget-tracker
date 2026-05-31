from pathlib import Path
import argparse
import sys
import pandas as pd


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
	df = df.drop_duplicates()
	for col in df.columns:
		if pd.api.types.is_numeric_dtype(df[col]):
			median = df[col].median()
			df[col] = df[col].fillna(median)
		else:
			df[col] = df[col].fillna("Not Available")
	return df


def process_files(raw_dir: Path, out_dir: Path) -> None:
	mapping = {
		"projects.csv": "clean_projects.csv",
		"complaints.csv": "clean_complaints.csv",
		"audit.csv": "clean_audit.csv",
	}

	out_dir.mkdir(parents=True, exist_ok=True)

	for src_name, dest_name in mapping.items():
		src = raw_dir / src_name
		dest = out_dir / dest_name

		if not src.exists():
			print(f"Warning: source file not found: {src}", file=sys.stderr)
			continue

		try:
			df = pd.read_csv(src)
		except Exception as e:
			print(f"Error reading {src}: {e}", file=sys.stderr)
			continue

		df_clean = clean_dataframe(df)

		try:
			df_clean.to_csv(dest, index=False)
		except Exception as e:
			print(f"Error writing {dest}: {e}", file=sys.stderr)


def main():
	parser = argparse.ArgumentParser(description="Clean raw CSV datasets and write cleaned versions.")
	parser.add_argument("--raw-dir", default="../raw_data", help="Path to raw data directory")
	parser.add_argument("--out-dir", default="../cleaned_data", help="Path to write cleaned data files")

	args = parser.parse_args()

	raw_dir = Path(args.raw_dir)
	out_dir = Path(args.out_dir)

	if not raw_dir.exists():
		print(f"Raw data directory does not exist: {raw_dir}", file=sys.stderr)
		sys.exit(2)

	process_files(raw_dir, out_dir)
	print("Cleaning completed successfully.")


if __name__ == "__main__":
	main()