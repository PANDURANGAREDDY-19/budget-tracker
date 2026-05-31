Database folder
----------------

This folder contains raw, cleaned, and sample datasets for the Public Budget Tracker project, plus a small data cleaning helper script.

Structure
- raw_data/: original CSV exports (`projects.csv`, `complaints.csv`, `audit.csv`)
- cleaned_data/: output produced by the cleaning script
- sample_data/: small demo CSVs used for testing and documentation
- `scripts/data_cleaning.py`: script that reads raw CSVs and writes cleaned CSVs

Usage

From the repository root run (note the space in the `scripts` directory name; quoting the path may be required):

```bash
python "Database/ scripts/data_cleaning.py" --raw-dir Database/raw_data --out-dir Database/cleaned_data
```

The script will:
- drop duplicate rows
- for numeric columns: fill missing values with the column median
- for non-numeric columns: fill missing values with `Not Available`

If a source file is missing the script will warn and skip it.

Next steps
- Add simple unit tests for the cleaning logic
- Add a `requirements.txt` and/or convert to a small package entrypoint
- Consider more advanced imputations or data validation checks
