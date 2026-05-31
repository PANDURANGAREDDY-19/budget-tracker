Database Test Cases
-------------------

1) Data Cleaning - Integration
- Description: Run the cleaning pipeline on raw datasets and verify outputs exist and basic invariants hold.
- Steps:
  - Generate or provide raw CSVs in `Database/raw_data`.
  - Run `python "Database/ scripts/data_cleaning.py" --raw-dir Database/raw_data --out-dir Database/cleaned_data`.
  - Verify output files: `clean_projects.csv`, `clean_complaints.csv`, `clean_audit.csv`.
  - Verify no duplicate rows and no completely-empty columns.

2) Data Imputation
- Description: Ensure numeric columns have no missing values after cleaning and non-numeric contain `Not Available`.
- Steps:
  - Inspect cleaned CSVs for NA counts per column.
  - Confirm numeric columns: NA count == 0.
  - Confirm object columns: NA values replaced with `Not Available`.

3) Error handling
- Description: Verify the scripts warn and continue when sample files are missing or invalid.
- Steps:
  - Remove one raw file and run the cleaner; confirm warning printed and other files processed.
  - Provide an empty CSV in `sample_data` and run generator; confirm it is skipped with a warning.

4) Smoke test for Demo
- Description: Run `Testing/test_cleaning_run.py` to generate synthetic data, run cleaner, and validate outputs.

5) Recommended automation
- Add a CI job that installs `requirements.txt` and runs `python Testing/test_cleaning_run.py`.
