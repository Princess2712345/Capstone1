# Valencia Care Ops

Prototype of an **AI-driven integrated health platform** for the Local Government Unit of Valencia City, Bukidnon: specialty routing, hybrid patient scheduling, and e-prescription supply-chain control across RHUs and Barangay Health Stations.

This is an operational demo with in-memory data. It is not a certified clinical system and does not call a live NLP or PhilHealth service.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Surfaces

| Route | Module |
| --- | --- |
| `/` | Public landing |
| `/login` · `/signup` | Staff access (demo `cho@valencia.gov.ph` / `careops`) |
| `/ops` | City Health command floor |
| `/triage` | Symptom extraction (English + Cebuano cues), ICD-10 mapping, ESI 1–5, specialist vs GP overflow, prerequisite labs |
| `/schedule` | 15-minute online vs walk-in board, buffer hard cap, satellite reroute, no-show release |
| `/pharmacy` | Konsulta e-Rx, interaction/allergy alerts, PRC signature + QR, FEFO dispense and transfer vouchers |
| `/supply` | Multi-site FEFO inventory, peer rebalancing, seasonal forecast, automated purchase requisition |

## Demo cues

- Chest pain in Cebuano (`sakit sa dughan`, `lisod pagginhawa`) → Cardiology / ESI 2 / ER bypass.
- Register walk-ins at **RHU 1** until the buffer rejects and offers Mailag or RHU 2.
- Dispense `RX-VLC-7K2M` from RHU 1 to see a Metformin partial fill.
- Draft a CHO purchase requisition from rainy-season / enteric projections.
