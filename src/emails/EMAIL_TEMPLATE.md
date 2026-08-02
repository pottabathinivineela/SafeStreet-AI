# EmailJS Template — SafeStreet AI Emergency Alert

The actual send logic lives in `src/services/emailService.ts` (kept in
`services/` alongside the other API-facing modules). This file documents
the EmailJS template you should create at https://www.emailjs.com/ so the
two stay in sync.

**Subject**

```
🚨 SafeStreet AI Emergency Alert
```

**Body variables** (map these into your EmailJS template design):

| Variable | Description |
|---|---|
| `{{threat_type}}` | e.g. "Weapon", "Fire", "Help" |
| `{{threat_source}}` | "camera", "image", or "audio" |
| `{{confidence}}` | e.g. "92%" |
| `{{location}}` | "lat, lng" string |
| `{{time}}` | Human-readable timestamp |
| `{{latitude}}` | Raw latitude |
| `{{longitude}}` | Raw longitude |
| `{{suggested_action}}` | e.g. "Dispatch emergency responders immediately." |
| `{{risk_level}}` | LOW / MODERATE / HIGH / CRITICAL |

**Sample body**

```
A threat has been detected by SafeStreet AI.

Threat Type: {{threat_type}}
Confidence: {{confidence}}
Risk Level: {{risk_level}}
Time: {{time}}
Location: {{location}} (lat: {{latitude}}, lng: {{longitude}})

Suggested Action: {{suggested_action}}
```

Once the template is created, copy your Service ID, Template ID, and
Public Key into `.env` (see `.env.example` at the project root).
