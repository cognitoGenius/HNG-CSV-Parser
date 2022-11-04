# HNG-CSV-Parser

This is a CSV parser for the HNG internship

The purpose of this simple script is to take in a CSV file which follows a specified format and output a CHIP---0007 compatible json for each entry.

it also creates a new CSV file named 'final.output.csv'. This new files contains a new column which contains a sha256 hash of the json of each entry

# HOW TO USE THIS SCRIPT

1. Ensure that you have node installed
2. Ensure the script is in the directory of the source csv
3. Ensure the source csv has no spaces in its name

4. Enter 'node format.mjs [filename.csv]' on your CLI and wait for the job to be done.
   Time to completion depends on number of entries in source file
   N/B : filename above refers to the name of your csv file.
   An example entry on the CLI would be 'node format.mjs hng.csv' -- LETTERCASE matters for the filename

Final Notes: THE NEW JSON FILES AND THE OUTPUT CSV ARE GOING TO BE CREATED IN THE DIRECTORY WHERE THIS SCRIPT IS RUN.

Goodluck!
