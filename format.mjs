import {
    writeFile
} from 'node:fs';
import {
    readFile
} from 'node:fs/promises'
import crypto from 'node:crypto'


let fileName = String(process.argv[2])


const csvParser = async function () {
    try {
        if (!fileName) {
            console.log('Ensure that your fileName has no spaces')
            console.log('Ensure you run this file in the directory containing your CSV')
            return
        }


        //Read the CSV and splits it at new lines into an array, each array contains info from each line
        let readCSVArr = (await readFile(`./${fileName}`, {
            encoding: 'utf-8'
        })).split(/\r?\n/);

        //Splits the individual arrays at each comman and returns a new better arranged array
        let splitCSV = readCSVArr.map((eachLine) => eachLine.split(','))

        //Count the number of entries
        let count = 0
        for (let eachNFT of splitCSV) {
            if (eachNFT[0].includes('TEAM') || !Number(eachNFT[0])) {
                //Skips counting
            } else {
                count++
            }
        }



        let jsonFilesArr = splitCSV.forEach((eachNFT, index) => {
            let minter = ''
            if (index === 0) {
                //Pushes the has heading into the final output
                eachNFT.push('HASH')
            }
            if (eachNFT[0].includes('TEAM')) {
                minter = eachNFT[0]
            } else if (!Number(eachNFT[0])) {
                //Handles empty lines or invalid lines by doing nothing - returns line as is in the final csv output.
            } else {
                //Formats according to the CHIP-0007 format
                let obj = {
                    "format": "CHIP-0007",
                    "name": eachNFT[2],
                    "description": eachNFT[3],
                    "gender": eachNFT[4],
                    "minting_tool": minter,
                    "sensitive_content": false,
                    "series_number": eachNFT[0],
                    "series_total": count,
                    "attributes": [],
                    "collection": {
                        "name": "Zuri NFT Tickets for Free Lunch",
                        "id": eachNFT[eachNFT.length - 1],
                        "attributes": [{
                            "type": "description",
                            "value": "NFT for free lucnh in HNG9"
                        }]
                    },
                }
                for (let i of eachNFT) {
                    //This block ensures that attributes are formatted into the json correctly
                    if (i.includes(':')) {
                        let attr = i
                        let traitType = attr.slice(0, attr.indexOf(':'))
                        let traitVal = attr.slice(attr.indexOf(':') + 2)
                        let eachAttr = {
                            "trait_type": traitType,
                            "trait_value": traitVal
                        }
                        obj.attributes.push(eachAttr)
                    }
                }
                let hash = crypto.createHash('sha256').update(JSON.stringify(eachNFT)).digest('hex')
                //Creates json files with metadata for each NFT
                writeFile(`${eachNFT[2]}.json`, JSON.stringify(obj), 'utf-8', () => {})
                //Includes the generated hash in the array that will be used to construct the final csv
                eachNFT.push(hash)
            }
        })

        //Creates final CSV
        writeFile('./filename.output.csv', splitCSV.join('\r\n'), 'utf-8', () => {
            console.log('Your new CSV and JSON files are ready')
        })
    } catch (err) {
        console.log('Probably an incorrect file name or an incorrectly formatted CSV')
        console.log('The error message is printed below')
        console.log(err.message)
        return
    }
}


csvParser()