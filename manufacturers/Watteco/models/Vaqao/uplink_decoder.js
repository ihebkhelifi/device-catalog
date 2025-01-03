let watteco = require("../../decode.js")
let ngsild = require("../../ngsi-ld.js")

let batch_param = [3, [{taglbl: 0, resol: 1, sampletype: 4, lblname: "occupancy", divide: 1, unit: ""},
    {taglbl: 1, resol: 10, sampletype: 7, lblname: "temperature", divide: 100, unit: "CEL"},
    {taglbl: 2, resol: 100, sampletype: 6, lblname: "humidity", divide: 100, unit: "P1"},
    {taglbl: 3, resol: 10, sampletype: 6, lblname: "co2", divide: 1, unit: "59"},
    {taglbl: 4, resol: 10, sampletype: 6, lblname: "tvoc", divide: 1, unit: ""}]];

// Merged temperature_1 and temperature_2 under the same temperature property as it seems to only be a variation  of accuracy depending on the temperature range 
let endpointCorresponder = {
    concentration: ["tvoc", "co2"],
    temperature: ["temperature", "temperature"],
    humidity: ["humidity", "humidity"],
    pin_state:["violation_detection"]
}

function main() {
    var payload = process.argv[3];
    var time = process.argv[4];
    var entity_id = "urn:ngsi-ld:Device:" + process.argv[5];
    // ********* Test pattern (uncomment to test behaviour) ********************
        // Pattern batch
        // payload = "424500000111008FC85EC128B4872088AD060442001E3322118A98782B";
        // Pattern "uplink standard report containing firmware version"
        // payload = "110100000002000D0305020015E2"
        // Pattern "uplink standard report containing humidity value"
        // payload = "110A04050000210E89"
        // Pattern "uplink standard report containing dataup info" (IGNORED) 
        // payload = "110180040000000800"
        // entity_id = "entityID"
        // time=Date.now();
    // ********* End test pattern ***********************

    var decoded = watteco.Decode(payload,time,batch_param,endpointCorresponder);
    var ngsild_payload = ngsild.ngsildWrapper(decoded, time, entity_id);
    if (Object.keys(ngsild_payload)[0] !== 'message_type'){
        process.stdout.write(JSON.stringify(ngsild_payload));
    }
    // console.log(ngsild_payload)
}

if (require.main === module) {
    main();
}
