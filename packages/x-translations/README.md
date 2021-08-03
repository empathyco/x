# Manage Translations JSON to CSV and CSV to JSON

This project converts a JSON file with translations to a CSV and in the other way around.

## How to use it

### Params

It receives two parameters, the first one should be the path of file to be converted (it is
mandatory), and the second one is the target path where the translations are going to be exported
(it is not mandatory, a default folder will be created if the param is not sent)

- **sourcePath**: path of file to be converted.
- **targetPath**: destination path to export the file converted.

### Run it as script

Run the following command to translate from a JSON to a CSV:

```
ts-node ./src/json-to-csv.ts ./src/__tests__/json/en.messages.json
ts-node ./src/json-to-csv.ts ./src/__tests__/json/en_translations.json ./TargetPath
```

If you want to transform multiple files, you can use the path:

```
ts-node ./src/json-to-csv.ts ./src/__tests__/json
ts-node ./src/json-to-csv.ts ./src/__tests__/json ./TargetPath
```

Run the following command to translate from a CSV to a JSON:

```
ts-node ./src/csv-to-json.ts ./src/__tests__/csv/en.messages.csv
ts-node ./src/csv-to-json.ts ./src/__tests__/csv/en.messages.csv ./TargetPath
```

If you want to transform multiple files, you can use the path:

```
ts-node ./src/csv-to-json.ts ./src/__tests__/csv
ts-node ./src/csv-to-json.ts ./src/__tests__/csv ./TargetPath
```

### Run it as a dependency

1. `npm install`
2. `npm run build`
3. `npm install -g nameOfTgzGenerated.tgz`
   - `npm install -g empathy-x-translations-0.1.0.tgz`
4. run the command to transform a JSON to a CSV:

   - `json-csv ./src/__tests__/json/en.messages.json`
   - `json-csv ./src/__tests__/json/en.messages.json ./TargetPath`
   - To transform multiple files, use the path where the files are stored:
     - `json-csv ./src/__tests__/json`
     - `json-csv ./src/__tests__/json ./TargetPath`

5. run the command to transform a CSV to a JSON:
   - `csv-json ./src/__tests__/csv/en_translations.csv`
   - `csv-json ./src/__tests__/csv/en_translations.csv ./TargetPath`
   - To transform multiple files, use the path where the files are stored:
     - `csv-json ./src/__tests__/csv`
     - `csv-json ./src/__tests__/csv ./TargetPath`
