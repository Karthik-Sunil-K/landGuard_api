const { text } = require('express');
const express = require('express')
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cron = require('node-cron');
const { v3, v1 } = require('uuid');
const Vonage = require('@vonage/server-sdk')
const cors = require('cors');


// ...
app.use(express.json())

const whitelist = [
    "http://localhost",
    "http://127.0.0.1:5500",
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));


cron.schedule("*/2 * * * * *", async function() {
    console.log("hey");
    time = new Date().getTime()
    const status = await (await fetch('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne')).text()
    console.log(status);
    if(status==="true")
    {

        console.log("LanGuard Connected");
        console.log("fetching..."); 
        fetch('https://blr1.blynk.cloud/external/api/get?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne&v0&v1&v2&v3')
            .then(result => result.json())
            .then((text,res) => {
               console.log("muiz");
               
            });
    }
    else {
        console.log("Languard is offline");
    }

});

app.get('/',async(req,res)=>{
    const status = await (await fetch('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne')).text()
    console.log(status);
    if(status==="true")
    {
        console.log("LanGuard Connected");
        console.log("fetching..."); 
        fetch('https://blr1.blynk.cloud/external/api/get?token=IVVXZWTMfbZL3hjpxkeZO1OLyWrBQTne&v0&v1&v2&v3')
            .then(result => result.json())
            .then((text) => {
                risk= calculateRisk(text);
               res.status(200).json({
                text:text,
                risk:risk
               })
            });
    }
    else {
        error = {message : "Languard is offline"}
        res.json({message:error});
    }
});

const calculateRisk = (data) => {
    if(data.v0 < 12 && data.v1 > 25 && data.v2 ) 
    {
        return 90;
    }
}

app.get('/sendalertmessage', (req,res)=> {
  const vonage = new Vonage({
    apiKey: "99c184e6",
    apiSecret: "1Vy5Vs5ZTqETgdjb"
  })
const from = "LandGuard"
const to = "918606683287"
const text = 'ALERT ! ALERT ! LANDSLIDE !'

vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})

res.send("Message sent") ;
})

app.listen(process.env.PORT || 3002);