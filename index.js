const { text } = require('express');
const express = require('express')
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cron = require('node-cron');
const { v3, v1 } = require('uuid');

// ...
app.use(express.json())

cron.schedule("*/2 * * * * *", async function() {
    console.log("hey");
    time = new Date().getTime()
    const status = await (await fetch('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne')).text()
    console.log(status);
    if(status === "true")
    {

        console.log("LanGuard Connected");
        console.log("fetching..."); 
        fetch('https://blr1.blynk.cloud/external/api/get?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne&v0&v1&v2&v3')
            .then(result => result.json())
            .then((text,res) => {
               res.status(200).json({
                text:text
               })
            });
    }
    else {
        console.log("Languard is offline");
    }

});

app.get('/',async(req,res)=>{
    const status = await (await fetch('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne')).text()
    console.log(status);
    if(status === "true")
    {

        console.log("LanGuard Connected");
        console.log("fetching..."); 
        fetch('https://blr1.blynk.cloud/external/api/get?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne&v0&v1&v2&v3')
            .then(result => result.json())
            .then((text,res) => {
               res.status(200).json({
                text:text
               })
            });
    }
    else {
        error = {message : "Languard is offline"}
        res.json({message:error});
    }
});

const calculateRisk = (data) => {
    if(v0 < 12 && v1 > 25 && V2 > 50) 
    {
        console.log("ALERT ALERT ! LANDSLIDE POSSIBILITY!")
    }
}
console.log("this is sample"+v3);



app.listen(process.env.PORT || 3002);