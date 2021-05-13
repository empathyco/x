# Manage Translations JSON to CSV and CSV to JSON

This project converts a JSON file with translations to a CSV and in the other way around.

## How to use it

### Params

It receives two parameters, the first one should be the path of file to be converted (it is mandatory), and the second one is the target path where
the translations are going to be exported (it is not mandatory, a default folder will be created if the param is not sent)

- **sourcePath**: path of file to be converted. 
- **targetPath**: destination path to export the file converted.

### Run it as script

Run the following command to translate from a JSON to a CSV:

```
ts-node ./src/json-to-csv.ts ./tests/json/en_translations.json
ts-node ./src/json-to-csv.ts ./tests/json/en_translations.json ./TargetPath
```

### Run it as a dependency

1. `npm install`
2. `npm run build`
3. `npm install -g nameOfTgzGenerated.tgz` 
   - `npm install -g empathy-x-translations-0.1.0.tgz`
4. run the command 
   - `json-csv ./tests/json/en_translations.json`
   - `json-csv ./tests/json/en_translations.json ./TargetPath`

