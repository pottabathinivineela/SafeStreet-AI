import nodemailer from "nodemailer";

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
console.log("EMAIL_TO =", process.env.EMAIL_TO);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendAlertEmail(alert) {
    

    console.log("🔥 sendAlertEmail() CALLED");

    

    const mapLink = alert.location
    ? `https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`
    : "#";

const mailOptions = {

    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `🚨 SafeStreet AI | ${alert.rawRiskLevel || alert.riskLevel} Threat Detected (${alert.label})`,
    html: `

<div style="
font-family:Arial, Helvetica, sans-serif;
background:#f4f6f8;
padding:40px;
">

<div style="
background:white;
max-width:700px;
margin:auto;
border-radius:15px;
padding:30px;
box-shadow:0px 10px 30px rgba(0,0,0,.15);
">

<div style="
background:#d32f2f;
color:white;
padding:20px;
border-radius:10px;
text-align:center;
">

<h1 style="margin:0;">
🚨 SafeStreet AI
</h1>

<p style="margin-top:10px;">
Emergency Alert Notification
</p>

</div>

<h2 style="color:#d32f2f;">
⚠️ Threat Detected
</h2>

<hr>

<h3>🔪 Weapon</h3>

<p>${alert.label}</p>

<h3>⚠️ Risk Level</h3>

<div style="
display:inline-block;
padding:8px 20px;
background:#ff4d4f;
color:white;
border-radius:20px;
font-weight:bold;
">

${alert.rawRiskLevel || alert.riskLevel}

</div>

<h3>🎯 Confidence</h3>

<div style="
width:300px;
background:#ddd;
border-radius:20px;
overflow:hidden;
">

<div style="
width:${alert.confidence}%;
background:#2196F3;
height:18px;
">

</div>

</div>

<p>

${alert.confidence}%

</p>
${
alert.location
? `${alert.location.lat}, ${alert.location.lng}`
: "Location unavailable"
}

</p>

<p>

<a href="${mapLink}"
style="background:#2196f3;
color:white;
padding:12px 18px;
text-decoration:none;
border-radius:8px;">

🗺️ View Live Incident Location

</a>

</p>

<h3>🎤 Audio Transcript</h3>

<div style="
background:#f9f9f9;
padding:15px;
border-left:5px solid #d32f2f;
font-style:italic;
">

"${alert.transcript || "No transcript available"}"

</div>

${
alert.imagePath
? `
<h3>📷 Captured Image</h3>

<img src="cid:capturedImage" width="500"/>
`
: ""
}
<hr style="margin-top:30px;">

<div style="
text-align:center;
color:#777;
font-size:14px;
">

<b>SafeStreet AI</b>

<br><br>

Transforming Street Lights into Lifelines

<br><br>

This email was generated automatically by SafeStreet AI.

</div>
</div>


`,
attachments: alert.imagePath
    ? [
        {
            filename: "captured.jpg",
            path: alert.imagePath,
            cid: "capturedImage",
        },
    ]
    : [],
};
   try {
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent!");
    console.log(info);

} catch (err) {

    console.error("❌ Email failed:");
    console.error(err);

}
}
