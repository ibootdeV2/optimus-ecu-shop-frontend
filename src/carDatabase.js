// ═══════════════════════════════════════════════════════════════════════════
// BASE DE DONNÉES COMPLÈTE — Marques / Modèles / Motorisations / Types ECU
// L'admin n'a qu'à uploader le fichier .bin/.zip — tout est déjà catalogué
// ═══════════════════════════════════════════════════════════════════════════

export const ECU_TYPES = [
  "ECU Moteur (Injection)",
  "ECU Boîte automatique",
  "ECU ABS / ESP",
  "ECU Airbag / SRS",
  "ECU Tableau de bord (Compteur)",
  "ECU Climatisation",
  "ECU Direction assistée",
  "ECU Suspension active",
  "ECU Démarrage sans clé (BSI/BCM)",
  "ECU Phares adaptatifs",
];

// ── Référence ECU par type de calculateur et motorisation ─────────────────
// Format: { diesel: [...refs], essence: [...refs] }
const ECU_REFS = {
  "Bosch": {
    diesel:  ["Bosch EDC15C2","Bosch EDC15C3","Bosch EDC16C3","Bosch EDC16C34","Bosch EDC16CP34","Bosch EDC17C10","Bosch EDC17CP14","Bosch EDC17C42","Bosch EDC17CP20","Bosch EDC17CP44"],
    essence: ["Bosch ME7.4.5","Bosch ME7.4.6","Bosch ME7.9.5","Bosch MEV17.4","Bosch MEV17.4.2","Bosch MED17.1","Bosch MED17.5","Bosch MED17.7.2","Bosch MG1CS001","Bosch MG1CS111"],
  },
  "Siemens": {
    diesel:  ["Siemens SID201","Siemens SID204","Siemens SID206","Siemens SID301","Siemens SID303","Siemens SID305","Siemens SID803","Siemens SID806","Siemens SID807"],
    essence: ["Siemens EMS2101","Siemens EMS3110","Siemens EMS3120","Siemens SIM271","Siemens SIM271DE","Siemens SIM32","Siemens PPD1.1"],
  },
  "Delphi": {
    diesel:  ["Delphi DCM1.2","Delphi DCM3.4","Delphi DCM3.5","Delphi DCM3.7","Delphi DCM6.2","Delphi CRD2.xx","Delphi MT92"],
    essence: ["Delphi MT35E","Delphi MT80","Delphi MT86","Delphi MT92","Delphi DDCR"],
  },
  "Denso": {
    diesel:  ["Denso 275700","Denso 89661","Denso SH7055","Denso CRD","Denso M32R"],
    essence: ["Denso 275700-E","Denso 89661-E","Denso D4","Denso SH7058"],
  },
  "Continental": {
    diesel:  ["Continental SID208","Continental SID209","Continental CJ2_10","Continental TEMIC"],
    essence: ["Continental EMS3125","Continental EMS3155","Continental SIM32k","Continental EMS2.4"],
  },
  "Marelli": {
    diesel:  ["Marelli MJD6F3","Marelli MJD8F2","Marelli MJD8DF","Marelli 8F2.M1"],
    essence: ["Marelli IAW5NF","Marelli IAW6LP","Marelli IAW7GF","Marelli IAW4CFW","Marelli 48P2"],
  },
};

// ── Helper: générer les entrées moteur ────────────────────────────────────
function eng(displacement, fuel, power, ecuBrand) {
  const refs = ECU_REFS[ecuBrand]?.[fuel.toLowerCase()] || ECU_REFS["Bosch"][fuel.toLowerCase()];
  return { displacement, fuel, power, ecuBrand, refs };
}

// ═══════════════════════════════════════════════════════════════════════════
// CATALOGUE COMPLET
// Structure: BRANDS[marque].models[modele] = { years, engines[] }
// ═══════════════════════════════════════════════════════════════════════════

export const BRANDS = {

  // ─────────────────────────────────────────────────────────────────────────
  "Peugeot": {
    logo: "🇫🇷",
    models: {
      "106": { years:"1991-2003", engines:[
        eng("1.1","Essence","60ch","Bosch"), eng("1.4","Essence","75ch","Bosch"),
        eng("1.6","Essence","90ch","Bosch"), eng("1.5D","Diesel","55ch","Bosch"),
      ]},
      "206": { years:"1998-2012", engines:[
        eng("1.1","Essence","60ch","Bosch"), eng("1.4","Essence","75ch","Bosch"),
        eng("1.6","Essence","110ch","Bosch"), eng("2.0 RC","Essence","177ch","Siemens"),
        eng("1.4 HDi","Diesel","70ch","Siemens"), eng("1.6 HDi","Diesel","90ch","Siemens"),
        eng("2.0 HDi","Diesel","90ch","Bosch"),
      ]},
      "207": { years:"2006-2014", engines:[
        eng("1.4","Essence","75ch","Bosch"), eng("1.6 VTi","Essence","120ch","Bosch"),
        eng("1.6 THP","Essence","150ch","Bosch"), eng("1.6 THP","Essence","175ch","Bosch"),
        eng("1.4 HDi","Diesel","70ch","Siemens"), eng("1.6 HDi","Diesel","90ch","Siemens"),
        eng("1.6 HDi","Diesel","110ch","Siemens"),
      ]},
      "208": { years:"2012-present", engines:[
        eng("1.2 PureTech","Essence","82ch","Continental"), eng("1.2 PureTech","Essence","110ch","Continental"),
        eng("1.6 THP","Essence","156ch","Bosch"), eng("1.6 GTi","Essence","208ch","Bosch"),
        eng("1.4 e-HDi","Diesel","68ch","Siemens"), eng("1.6 BlueHDi","Diesel","75ch","Bosch"),
        eng("1.6 BlueHDi","Diesel","100ch","Bosch"), eng("1.6 BlueHDi","Diesel","120ch","Bosch"),
      ]},
      "306": { years:"1993-2002", engines:[
        eng("1.4","Essence","75ch","Bosch"), eng("1.6","Essence","89ch","Bosch"),
        eng("1.8","Essence","101ch","Bosch"), eng("2.0 S16","Essence","150ch","Bosch"),
        eng("1.9D","Diesel","69ch","Bosch"), eng("1.9 TD","Diesel","90ch","Bosch"),
        eng("2.0 HDi","Diesel","90ch","Bosch"),
      ]},
      "307": { years:"2001-2007", engines:[
        eng("1.4","Essence","75ch","Bosch"), eng("1.6","Essence","109ch","Bosch"),
        eng("2.0","Essence","136ch","Bosch"), eng("2.0 RC","Essence","177ch","Siemens"),
        eng("1.6 HDi","Diesel","90ch","Siemens"), eng("1.6 HDi","Diesel","110ch","Siemens"),
        eng("2.0 HDi","Diesel","90ch","Bosch"), eng("2.0 HDi","Diesel","136ch","Bosch"),
      ]},
      "308": { years:"2007-present", engines:[
        eng("1.4 VTi","Essence","95ch","Bosch"), eng("1.6 VTi","Essence","120ch","Bosch"),
        eng("1.6 THP","Essence","150ch","Bosch"), eng("1.6 THP","Essence","200ch","Bosch"),
        eng("2.0 GTi","Essence","270ch","Bosch"),
        eng("1.6 HDi","Diesel","90ch","Siemens"), eng("1.6 HDi","Diesel","112ch","Siemens"),
        eng("2.0 HDi","Diesel","136ch","Bosch"), eng("2.0 HDi","Diesel","150ch","Bosch"),
        eng("1.5 BlueHDi","Diesel","130ch","Bosch"), eng("2.0 BlueHDi","Diesel","180ch","Bosch"),
      ]},
      "3008": { years:"2009-present", engines:[
        eng("1.6 VTi","Essence","120ch","Bosch"), eng("1.6 THP","Essence","156ch","Bosch"),
        eng("1.2 PureTech","Essence","130ch","Continental"),
        eng("1.6 HDi","Diesel","112ch","Siemens"), eng("2.0 HDi","Diesel","150ch","Bosch"),
        eng("2.0 BlueHDi","Diesel","150ch","Bosch"), eng("2.0 BlueHDi","Diesel","180ch","Bosch"),
      ]},
      "407": { years:"2004-2011", engines:[
        eng("1.8","Essence","116ch","Bosch"), eng("2.0","Essence","136ch","Bosch"),
        eng("2.2","Essence","160ch","Bosch"), eng("3.0 V6","Essence","211ch","Bosch"),
        eng("1.6 HDi","Diesel","109ch","Siemens"), eng("2.0 HDi","Diesel","136ch","Bosch"),
        eng("2.0 HDi","Diesel","163ch","Bosch"), eng("2.7 HDi V6","Diesel","204ch","Siemens"),
      ]},
      "508": { years:"2011-present", engines:[
        eng("1.6 THP","Essence","156ch","Bosch"), eng("2.0 THP","Essence","240ch","Bosch"),
        eng("1.6 BlueHDi","Diesel","120ch","Bosch"), eng("2.0 HDi","Diesel","140ch","Bosch"),
        eng("2.0 BlueHDi","Diesel","150ch","Bosch"), eng("2.0 BlueHDi","Diesel","180ch","Bosch"),
      ]},
      "5008": { years:"2009-present", engines:[
        eng("1.6 THP","Essence","156ch","Bosch"), eng("1.2 PureTech","Essence","130ch","Continental"),
        eng("1.6 HDi","Diesel","110ch","Siemens"), eng("2.0 HDi","Diesel","150ch","Bosch"),
        eng("2.0 BlueHDi","Diesel","150ch","Bosch"), eng("2.0 BlueHDi","Diesel","180ch","Bosch"),
      ]},
      "Partner": { years:"1996-present", engines:[
        eng("1.4","Essence","75ch","Bosch"), eng("1.6","Essence","109ch","Bosch"),
        eng("1.6 HDi","Diesel","75ch","Siemens"), eng("1.6 HDi","Diesel","90ch","Siemens"),
        eng("2.0 HDi","Diesel","90ch","Bosch"),
      ]},
      "Expert": { years:"1995-present", engines:[
        eng("1.6 HDi","Diesel","90ch","Siemens"), eng("2.0 HDi","Diesel","120ch","Bosch"),
        eng("2.0 HDi","Diesel","163ch","Bosch"),
      ]},
      "Boxer": { years:"1994-present", engines:[
        eng("2.0 HDi","Diesel","110ch","Bosch"), eng("2.2 HDi","Diesel","120ch","Siemens"),
        eng("3.0 HDi","Diesel","160ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Citroën": {
    logo: "🇫🇷",
    models: {
      "Saxo": { years:"1996-2004", engines:[
        eng("1.1","Essence","60ch","Bosch"), eng("1.4","Essence","75ch","Bosch"),
        eng("1.6 VTS","Essence","120ch","Bosch"), eng("1.5D","Diesel","55ch","Bosch"),
      ]},
      "C2": { years:"2003-2009", engines:[
        eng("1.1","Essence","60ch","Bosch"), eng("1.4","Essence","75ch","Bosch"),
        eng("1.6 VTR","Essence","110ch","Bosch"), eng("1.4 HDi","Diesel","70ch","Siemens"),
      ]},
      "C3": { years:"2002-present", engines:[
        eng("1.1","Essence","60ch","Bosch"), eng("1.4","Essence","75ch","Bosch"),
        eng("1.6 VTi","Essence","120ch","Bosch"), eng("1.2 PureTech","Essence","82ch","Continental"),
        eng("1.4 HDi","Diesel","70ch","Siemens"), eng("1.6 HDi","Diesel","90ch","Siemens"),
        eng("1.6 BlueHDi","Diesel","100ch","Bosch"),
      ]},
      "C4": { years:"2004-present", engines:[
        eng("1.4","Essence","88ch","Bosch"), eng("1.6","Essence","110ch","Bosch"),
        eng("1.6 THP","Essence","150ch","Bosch"), eng("2.0","Essence","143ch","Bosch"),
        eng("1.6 HDi","Diesel","90ch","Siemens"), eng("1.6 HDi","Diesel","110ch","Siemens"),
        eng("2.0 HDi","Diesel","136ch","Bosch"), eng("1.5 BlueHDi","Diesel","130ch","Bosch"),
      ]},
      "C4 Picasso": { years:"2006-present", engines:[
        eng("1.6 VTi","Essence","120ch","Bosch"), eng("1.6 THP","Essence","156ch","Bosch"),
        eng("2.0","Essence","140ch","Bosch"),
        eng("1.6 HDi","Diesel","110ch","Siemens"), eng("2.0 HDi","Diesel","136ch","Bosch"),
        eng("1.6 BlueHDi","Diesel","120ch","Bosch"),
      ]},
      "C5": { years:"2001-2017", engines:[
        eng("1.8","Essence","116ch","Bosch"), eng("2.0","Essence","143ch","Bosch"),
        eng("2.0 T","Essence","170ch","Bosch"), eng("3.0 V6","Essence","211ch","Bosch"),
        eng("1.6 HDi","Diesel","110ch","Siemens"), eng("2.0 HDi","Diesel","136ch","Bosch"),
        eng("2.0 HDi","Diesel","163ch","Bosch"), eng("2.7 HDi V6","Diesel","204ch","Siemens"),
        eng("3.0 HDi V6","Diesel","240ch","Siemens"),
      ]},
      "C8": { years:"2002-2014", engines:[
        eng("2.0","Essence","143ch","Bosch"), eng("2.0 T","Essence","170ch","Bosch"),
        eng("2.0 HDi","Diesel","120ch","Bosch"), eng("2.2 HDi","Diesel","170ch","Siemens"),
      ]},
      "Berlingo": { years:"1996-present", engines:[
        eng("1.4","Essence","75ch","Bosch"), eng("1.6","Essence","109ch","Bosch"),
        eng("1.6 HDi","Diesel","75ch","Siemens"), eng("1.6 HDi","Diesel","90ch","Siemens"),
        eng("1.6 BlueHDi","Diesel","100ch","Bosch"),
      ]},
      "DS3": { years:"2009-2019", engines:[
        eng("1.2 PureTech","Essence","82ch","Continental"), eng("1.6 VTi","Essence","120ch","Bosch"),
        eng("1.6 THP","Essence","156ch","Bosch"), eng("1.6 THP","Essence","207ch","Bosch"),
        eng("1.4 HDi","Diesel","70ch","Siemens"), eng("1.6 HDi","Diesel","90ch","Siemens"),
        eng("1.6 BlueHDi","Diesel","120ch","Bosch"),
      ]},
      "DS4": { years:"2011-2018", engines:[
        eng("1.6 VTi","Essence","120ch","Bosch"), eng("1.6 THP","Essence","200ch","Bosch"),
        eng("2.0 THP","Essence","200ch","Bosch"),
        eng("1.6 HDi","Diesel","115ch","Siemens"), eng("2.0 HDi","Diesel","163ch","Bosch"),
      ]},
      "DS5": { years:"2012-2018", engines:[
        eng("1.6 THP","Essence","165ch","Bosch"), eng("2.0 THP","Essence","200ch","Bosch"),
        eng("2.0 HDi","Diesel","160ch","Bosch"), eng("2.0 HDi","Diesel","180ch","Bosch"),
      ]},
      "Jumpy": { years:"1995-present", engines:[
        eng("1.6 HDi","Diesel","90ch","Siemens"), eng("2.0 HDi","Diesel","120ch","Bosch"),
        eng("2.0 HDi","Diesel","163ch","Bosch"),
      ]},
      "Jumper": { years:"1994-present", engines:[
        eng("2.2 HDi","Diesel","120ch","Siemens"), eng("3.0 HDi","Diesel","160ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Renault": {
    logo: "🇫🇷",
    models: {
      "Twingo": { years:"1993-present", engines:[
        eng("1.2","Essence","58ch","Bosch"), eng("1.2 TCe","Essence","100ch","Continental"),
        eng("1.5 dCi","Diesel","65ch","Siemens"),
      ]},
      "Clio": { years:"1990-present", engines:[
        eng("1.2","Essence","58ch","Bosch"), eng("1.2 TCe","Essence","75ch","Continental"),
        eng("1.4","Essence","98ch","Bosch"), eng("1.6","Essence","107ch","Bosch"),
        eng("2.0 RS","Essence","200ch","Siemens"), eng("2.0 RS Trophy","Essence","220ch","Siemens"),
        eng("1.5 dCi","Diesel","65ch","Siemens"), eng("1.5 dCi","Diesel","75ch","Siemens"),
        eng("1.5 dCi","Diesel","85ch","Siemens"), eng("1.5 dCi","Diesel","90ch","Siemens"),
      ]},
      "Mégane": { years:"1995-present", engines:[
        eng("1.4","Essence","98ch","Bosch"), eng("1.6","Essence","115ch","Bosch"),
        eng("1.8","Essence","116ch","Bosch"), eng("2.0","Essence","135ch","Siemens"),
        eng("2.0 RS","Essence","250ch","Bosch"), eng("2.0 RS Trophy","Essence","275ch","Bosch"),
        eng("1.5 dCi","Diesel","85ch","Siemens"), eng("1.5 dCi","Diesel","95ch","Siemens"),
        eng("1.5 dCi","Diesel","110ch","Siemens"), eng("1.9 dCi","Diesel","130ch","Siemens"),
        eng("2.0 dCi","Diesel","150ch","Siemens"), eng("2.0 dCi","Diesel","175ch","Siemens"),
      ]},
      "Laguna": { years:"1993-2015", engines:[
        eng("1.6","Essence","107ch","Bosch"), eng("1.8","Essence","120ch","Bosch"),
        eng("2.0","Essence","140ch","Siemens"), eng("2.0 T","Essence","170ch","Siemens"),
        eng("3.5 V6","Essence","241ch","Bosch"),
        eng("1.9 dCi","Diesel","120ch","Siemens"), eng("2.0 dCi","Diesel","130ch","Siemens"),
        eng("2.0 dCi","Diesel","150ch","Siemens"), eng("2.0 dCi","Diesel","175ch","Siemens"),
        eng("3.0 dCi V6","Diesel","175ch","Siemens"),
      ]},
      "Scenic": { years:"1996-present", engines:[
        eng("1.4","Essence","98ch","Bosch"), eng("1.6","Essence","115ch","Bosch"),
        eng("2.0","Essence","140ch","Siemens"),
        eng("1.5 dCi","Diesel","85ch","Siemens"), eng("1.5 dCi","Diesel","110ch","Siemens"),
        eng("1.9 dCi","Diesel","120ch","Siemens"), eng("2.0 dCi","Diesel","150ch","Siemens"),
      ]},
      "Kangoo": { years:"1997-present", engines:[
        eng("1.2","Essence","58ch","Bosch"), eng("1.4","Essence","75ch","Bosch"),
        eng("1.6","Essence","105ch","Bosch"),
        eng("1.5 dCi","Diesel","70ch","Siemens"), eng("1.5 dCi","Diesel","85ch","Siemens"),
        eng("1.5 dCi","Diesel","110ch","Siemens"),
      ]},
      "Trafic": { years:"1980-present", engines:[
        eng("2.0","Essence","120ch","Bosch"),
        eng("1.9 dCi","Diesel","100ch","Siemens"), eng("2.0 dCi","Diesel","114ch","Siemens"),
        eng("2.0 dCi","Diesel","115ch","Siemens"),
      ]},
      "Master": { years:"1980-present", engines:[
        eng("2.3 dCi","Diesel","100ch","Bosch"), eng("2.3 dCi","Diesel","125ch","Bosch"),
        eng("2.3 dCi","Diesel","150ch","Bosch"), eng("2.3 dCi","Diesel","170ch","Bosch"),
      ]},
      "Espace": { years:"1984-present", engines:[
        eng("2.0","Essence","140ch","Siemens"), eng("2.0 T","Essence","170ch","Siemens"),
        eng("1.9 dCi","Diesel","130ch","Siemens"), eng("2.0 dCi","Diesel","150ch","Siemens"),
        eng("2.0 dCi","Diesel","175ch","Siemens"), eng("3.0 dCi V6","Diesel","180ch","Siemens"),
      ]},
      "Vel Satis": { years:"2001-2009", engines:[
        eng("2.0 T","Essence","170ch","Siemens"), eng("3.5 V6","Essence","245ch","Bosch"),
        eng("2.0 dCi","Diesel","150ch","Siemens"), eng("3.0 dCi V6","Diesel","180ch","Siemens"),
      ]},
      "Duster": { years:"2010-present", engines:[
        eng("1.6","Essence","105ch","Bosch"), eng("1.3 TCe","Essence","130ch","Bosch"),
        eng("1.5 dCi","Diesel","85ch","Siemens"), eng("1.5 dCi","Diesel","110ch","Siemens"),
        eng("1.6 dCi","Diesel","130ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Volkswagen": {
    logo: "🇩🇪",
    models: {
      "Polo": { years:"1975-present", engines:[
        eng("1.0 MPI","Essence","65ch","Bosch"), eng("1.2 TSI","Essence","90ch","Bosch"),
        eng("1.4 TSI","Essence","150ch","Bosch"), eng("2.0 GTI","Essence","207ch","Bosch"),
        eng("1.4 TDI","Diesel","75ch","Bosch"), eng("1.6 TDI","Diesel","90ch","Bosch"),
      ]},
      "Golf": { years:"1974-present", engines:[
        eng("1.2 TSI","Essence","85ch","Bosch"), eng("1.4 TSI","Essence","122ch","Bosch"),
        eng("1.8 TSI","Essence","180ch","Bosch"), eng("2.0 TSI GTI","Essence","245ch","Bosch"),
        eng("2.0 TSI R","Essence","320ch","Bosch"),
        eng("1.6 TDI","Diesel","90ch","Bosch"), eng("1.6 TDI","Diesel","105ch","Bosch"),
        eng("2.0 TDI","Diesel","136ch","Bosch"), eng("2.0 TDI","Diesel","150ch","Bosch"),
        eng("2.0 TDI GTD","Diesel","184ch","Bosch"),
      ]},
      "Passat": { years:"1973-present", engines:[
        eng("1.4 TSI","Essence","122ch","Bosch"), eng("1.8 TSI","Essence","160ch","Bosch"),
        eng("2.0 TSI","Essence","220ch","Bosch"), eng("3.6 FSI V6","Essence","300ch","Bosch"),
        eng("1.6 TDI","Diesel","105ch","Bosch"), eng("2.0 TDI","Diesel","140ch","Bosch"),
        eng("2.0 TDI","Diesel","170ch","Bosch"), eng("2.0 BiTDI","Diesel","240ch","Bosch"),
      ]},
      "Tiguan": { years:"2007-present", engines:[
        eng("1.4 TSI","Essence","122ch","Bosch"), eng("2.0 TSI","Essence","200ch","Bosch"),
        eng("2.0 TSI 4Motion","Essence","220ch","Bosch"),
        eng("2.0 TDI","Diesel","110ch","Bosch"), eng("2.0 TDI","Diesel","140ch","Bosch"),
        eng("2.0 TDI","Diesel","150ch","Bosch"), eng("2.0 TDI","Diesel","190ch","Bosch"),
      ]},
      "Touareg": { years:"2002-present", engines:[
        eng("3.2 V6","Essence","220ch","Bosch"), eng("4.2 V8","Essence","310ch","Bosch"),
        eng("5.0 V10 TDI","Diesel","313ch","Bosch"), eng("3.0 TDI V6","Diesel","245ch","Bosch"),
        eng("4.2 TDI V8","Diesel","340ch","Bosch"),
      ]},
      "T4": { years:"1990-2003", engines:[
        eng("2.0","Essence","84ch","Bosch"), eng("2.5","Essence","115ch","Bosch"),
        eng("1.9 TD","Diesel","68ch","Bosch"), eng("2.4D","Diesel","78ch","Bosch"),
        eng("2.5 TDI","Diesel","88ch","Bosch"), eng("2.5 TDI","Diesel","102ch","Bosch"),
      ]},
      "T5": { years:"2003-2015", engines:[
        eng("2.0","Essence","115ch","Bosch"), eng("3.2 V6","Essence","235ch","Bosch"),
        eng("1.9 TDI","Diesel","84ch","Bosch"), eng("2.0 TDI","Diesel","102ch","Bosch"),
        eng("2.0 BiTDI","Diesel","140ch","Bosch"), eng("2.0 BiTDI","Diesel","180ch","Bosch"),
        eng("2.5 TDI","Diesel","130ch","Bosch"),
      ]},
      "T6": { years:"2015-present", engines:[
        eng("2.0 TSI","Essence","150ch","Bosch"), eng("2.0 TSI","Essence","204ch","Bosch"),
        eng("2.0 TDI","Diesel","102ch","Bosch"), eng("2.0 TDI","Diesel","150ch","Bosch"),
        eng("2.0 BiTDI","Diesel","199ch","Bosch"),
      ]},
      "Caddy": { years:"1983-present", engines:[
        eng("1.2 TSI","Essence","84ch","Bosch"), eng("2.0 TSI","Essence","122ch","Bosch"),
        eng("1.6 TDI","Diesel","75ch","Bosch"), eng("2.0 TDI","Diesel","102ch","Bosch"),
        eng("2.0 TDI","Diesel","122ch","Bosch"),
      ]},
      "Sharan": { years:"1995-present", engines:[
        eng("1.4 TSI","Essence","150ch","Bosch"), eng("2.0 TSI","Essence","200ch","Bosch"),
        eng("1.9 TDI","Diesel","115ch","Bosch"), eng("2.0 TDI","Diesel","140ch","Bosch"),
        eng("2.0 TDI","Diesel","177ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "BMW": {
    logo: "🇩🇪",
    models: {
      "Série 1": { years:"2004-present", engines:[
        eng("1.6i","Essence","122ch","Siemens"), eng("2.0i","Essence","150ch","Siemens"),
        eng("2.0i","Essence","170ch","Siemens"), eng("2.0 M135i","Essence","320ch","Bosch"),
        eng("1.6d","Diesel","116ch","Bosch"), eng("2.0d","Diesel","143ch","Bosch"),
        eng("2.0d","Diesel","177ch","Bosch"), eng("3.0d M140d","Diesel","340ch","Bosch"),
      ]},
      "Série 3": { years:"1975-present", engines:[
        eng("1.6i","Essence","122ch","Siemens"), eng("2.0i","Essence","150ch","Siemens"),
        eng("2.0i","Essence","170ch","Siemens"), eng("3.0i","Essence","231ch","Siemens"),
        eng("3.0 M3","Essence","450ch","Bosch"),
        eng("2.0d","Diesel","136ch","Bosch"), eng("2.0d","Diesel","143ch","Bosch"),
        eng("2.0d","Diesel","177ch","Bosch"), eng("3.0d","Diesel","218ch","Bosch"),
        eng("3.0d M3 Diesel","Diesel","286ch","Bosch"),
      ]},
      "Série 5": { years:"1972-present", engines:[
        eng("2.0i","Essence","150ch","Siemens"), eng("2.5i","Essence","192ch","Siemens"),
        eng("3.0i","Essence","231ch","Siemens"), eng("4.8i","Essence","360ch","Bosch"),
        eng("2.0d","Diesel","163ch","Bosch"), eng("2.5d","Diesel","177ch","Bosch"),
        eng("3.0d","Diesel","218ch","Bosch"), eng("3.0d","Diesel","245ch","Bosch"),
        eng("3.0d BiTurbo","Diesel","286ch","Bosch"),
      ]},
      "Série 7": { years:"1977-present", engines:[
        eng("3.0i","Essence","231ch","Siemens"), eng("4.4i","Essence","333ch","Bosch"),
        eng("4.8i","Essence","367ch","Bosch"),
        eng("3.0d","Diesel","218ch","Bosch"), eng("3.0d","Diesel","245ch","Bosch"),
        eng("4.0d","Diesel","306ch","Bosch"),
      ]},
      "X1": { years:"2009-present", engines:[
        eng("2.0i","Essence","150ch","Siemens"), eng("2.8i","Essence","258ch","Bosch"),
        eng("1.6d","Diesel","116ch","Bosch"), eng("2.0d","Diesel","143ch","Bosch"),
        eng("2.0d","Diesel","177ch","Bosch"),
      ]},
      "X3": { years:"2003-present", engines:[
        eng("2.0i","Essence","150ch","Siemens"), eng("2.5i","Essence","192ch","Siemens"),
        eng("3.0i","Essence","231ch","Siemens"),
        eng("2.0d","Diesel","143ch","Bosch"), eng("2.0d","Diesel","177ch","Bosch"),
        eng("3.0d","Diesel","218ch","Bosch"),
      ]},
      "X5": { years:"1999-present", engines:[
        eng("3.0i","Essence","231ch","Siemens"), eng("4.4i","Essence","320ch","Bosch"),
        eng("4.8i","Essence","360ch","Bosch"),
        eng("3.0d","Diesel","218ch","Bosch"), eng("3.0d","Diesel","245ch","Bosch"),
        eng("3.0d M57","Diesel","265ch","Bosch"),
      ]},
      "X6": { years:"2008-present", engines:[
        eng("3.0i xDrive30i","Essence","258ch","Bosch"), eng("4.4i xDrive50i","Essence","408ch","Bosch"),
        eng("3.0d xDrive30d","Diesel","245ch","Bosch"), eng("3.0d xDrive35d","Diesel","286ch","Bosch"),
        eng("4.0d xDrive40d","Diesel","306ch","Bosch"),
      ]},
      "Z4": { years:"2002-present", engines:[
        eng("2.0i","Essence","150ch","Siemens"), eng("2.5i","Essence","192ch","Siemens"),
        eng("3.0i","Essence","231ch","Siemens"), eng("3.0si","Essence","265ch","Siemens"),
        eng("2.0d","Diesel","136ch","Bosch"),
      ]},
      "M3 / M4": { years:"1985-present", engines:[
        eng("3.0 S55","Essence","431ch","Bosch"), eng("3.0 S58","Essence","480ch","Bosch"),
        eng("4.0 S65 V8","Essence","420ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Mercedes-Benz": {
    logo: "🇩🇪",
    models: {
      "Classe A": { years:"1997-present", engines:[
        eng("1.5","Essence","102ch","Bosch"), eng("1.6 CGI","Essence","156ch","Bosch"),
        eng("2.0 AMG A45","Essence","381ch","Bosch"),
        eng("1.5 CDI","Diesel","82ch","Bosch"), eng("2.0 CDI","Diesel","109ch","Bosch"),
        eng("2.0 CDI","Diesel","136ch","Bosch"),
      ]},
      "Classe B": { years:"2005-present", engines:[
        eng("1.5","Essence","102ch","Bosch"), eng("1.6 CGI","Essence","156ch","Bosch"),
        eng("2.0","Essence","184ch","Bosch"),
        eng("1.5 CDI","Diesel","82ch","Bosch"), eng("2.0 CDI","Diesel","109ch","Bosch"),
        eng("2.0 CDI","Diesel","136ch","Bosch"),
      ]},
      "Classe C": { years:"1993-present", engines:[
        eng("1.6","Essence","129ch","Siemens"), eng("1.8 CGI","Essence","156ch","Siemens"),
        eng("2.5 V6","Essence","204ch","Bosch"), eng("3.0 V6","Essence","231ch","Bosch"),
        eng("6.2 AMG","Essence","457ch","Bosch"),
        eng("2.0 CDI","Diesel","122ch","Bosch"), eng("2.2 CDI","Diesel","136ch","Bosch"),
        eng("2.2 CDI","Diesel","170ch","Bosch"), eng("3.0 CDI V6","Diesel","224ch","Bosch"),
      ]},
      "Classe E": { years:"1984-present", engines:[
        eng("1.8 CGI","Essence","156ch","Siemens"), eng("2.0 CGI","Essence","184ch","Siemens"),
        eng("3.5 V6","Essence","272ch","Bosch"), eng("5.0 V8","Essence","388ch","Bosch"),
        eng("6.2 AMG","Essence","525ch","Bosch"),
        eng("2.2 CDI","Diesel","136ch","Bosch"), eng("2.2 CDI","Diesel","177ch","Bosch"),
        eng("3.0 CDI V6","Diesel","211ch","Bosch"), eng("3.0 CDI V6","Diesel","265ch","Bosch"),
      ]},
      "Classe S": { years:"1972-present", engines:[
        eng("3.5 V6","Essence","272ch","Bosch"), eng("4.7 V8","Essence","435ch","Bosch"),
        eng("5.5 AMG","Essence","585ch","Bosch"),
        eng("2.2 CDI","Diesel","150ch","Bosch"), eng("3.0 CDI V6","Diesel","231ch","Bosch"),
        eng("4.0 CDI V8","Diesel","265ch","Bosch"),
      ]},
      "GLA": { years:"2013-present", engines:[
        eng("1.6 CGI","Essence","122ch","Bosch"), eng("2.0 AMG","Essence","381ch","Bosch"),
        eng("2.0 CDI","Diesel","122ch","Bosch"), eng("2.0 CDI","Diesel","170ch","Bosch"),
      ]},
      "GLC": { years:"2015-present", engines:[
        eng("2.0 CGI","Essence","184ch","Bosch"), eng("2.0 AMG 43","Essence","390ch","Bosch"),
        eng("2.2 CDI","Diesel","170ch","Bosch"), eng("2.2 CDI","Diesel","204ch","Bosch"),
        eng("3.0 CDI V6 AMG","Diesel","258ch","Bosch"),
      ]},
      "ML / GLE": { years:"1997-present", engines:[
        eng("3.5 V6","Essence","272ch","Bosch"), eng("5.5 AMG","Essence","585ch","Bosch"),
        eng("2.2 CDI","Diesel","136ch","Bosch"), eng("3.0 CDI V6","Diesel","190ch","Bosch"),
        eng("3.0 CDI V6","Diesel","231ch","Bosch"), eng("4.0 CDI V8","Diesel","306ch","Bosch"),
      ]},
      "Vito": { years:"1996-present", engines:[
        eng("2.0","Essence","120ch","Bosch"),
        eng("2.0 CDI","Diesel","88ch","Bosch"), eng("2.2 CDI","Diesel","102ch","Bosch"),
        eng("2.2 CDI","Diesel","136ch","Bosch"), eng("2.2 CDI","Diesel","163ch","Bosch"),
      ]},
      "Sprinter": { years:"1995-present", engines:[
        eng("2.1 CDI","Diesel","109ch","Bosch"), eng("2.1 CDI","Diesel","129ch","Bosch"),
        eng("2.1 CDI","Diesel","163ch","Bosch"), eng("2.1 CDI","Diesel","190ch","Bosch"),
        eng("3.0 CDI V6","Diesel","211ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Audi": {
    logo: "🇩🇪",
    models: {
      "A1": { years:"2010-present", engines:[
        eng("1.0 TFSI","Essence","95ch","Bosch"), eng("1.2 TFSI","Essence","86ch","Bosch"),
        eng("1.4 TFSI","Essence","125ch","Bosch"), eng("1.8 TFSI S1","Essence","231ch","Bosch"),
        eng("1.4 TDI","Diesel","90ch","Bosch"), eng("1.6 TDI","Diesel","105ch","Bosch"),
      ]},
      "A3": { years:"1996-present", engines:[
        eng("1.2 TFSI","Essence","105ch","Bosch"), eng("1.4 TFSI","Essence","122ch","Bosch"),
        eng("1.8 TFSI","Essence","180ch","Bosch"), eng("2.0 TFSI S3","Essence","310ch","Bosch"),
        eng("1.6 TDI","Diesel","90ch","Bosch"), eng("2.0 TDI","Diesel","110ch","Bosch"),
        eng("2.0 TDI","Diesel","150ch","Bosch"), eng("2.0 TDI","Diesel","184ch","Bosch"),
      ]},
      "A4": { years:"1994-present", engines:[
        eng("1.4 TFSI","Essence","150ch","Bosch"), eng("1.8 TFSI","Essence","160ch","Bosch"),
        eng("2.0 TFSI","Essence","211ch","Bosch"), eng("2.0 TFSI S4","Essence","333ch","Bosch"),
        eng("3.0 TFSI V6","Essence","272ch","Bosch"),
        eng("1.6 TDI","Diesel","105ch","Bosch"), eng("2.0 TDI","Diesel","120ch","Bosch"),
        eng("2.0 TDI","Diesel","143ch","Bosch"), eng("2.0 TDI","Diesel","177ch","Bosch"),
        eng("3.0 TDI V6","Diesel","218ch","Bosch"), eng("3.0 TDI V6","Diesel","245ch","Bosch"),
      ]},
      "A5": { years:"2007-present", engines:[
        eng("1.8 TFSI","Essence","170ch","Bosch"), eng("2.0 TFSI","Essence","211ch","Bosch"),
        eng("3.0 TFSI V6","Essence","272ch","Bosch"), eng("4.2 FSI V8 RS5","Essence","450ch","Bosch"),
        eng("2.0 TDI","Diesel","143ch","Bosch"), eng("2.0 TDI","Diesel","177ch","Bosch"),
        eng("3.0 TDI V6","Diesel","218ch","Bosch"), eng("3.0 TDI V6","Diesel","245ch","Bosch"),
      ]},
      "A6": { years:"1994-present", engines:[
        eng("1.8 TFSI","Essence","170ch","Bosch"), eng("2.0 TFSI","Essence","211ch","Bosch"),
        eng("3.0 TFSI V6","Essence","300ch","Bosch"), eng("4.0 TFSI V8 S6","Essence","420ch","Bosch"),
        eng("2.0 TDI","Diesel","177ch","Bosch"), eng("2.0 TDI","Diesel","190ch","Bosch"),
        eng("3.0 TDI V6","Diesel","218ch","Bosch"), eng("3.0 TDI V6","Diesel","272ch","Bosch"),
        eng("3.0 BiTDI V6","Diesel","313ch","Bosch"),
      ]},
      "A8": { years:"1994-present", engines:[
        eng("3.0 TFSI","Essence","310ch","Bosch"), eng("4.0 TFSI V8","Essence","420ch","Bosch"),
        eng("6.3 W12","Essence","500ch","Bosch"),
        eng("3.0 TDI","Diesel","250ch","Bosch"), eng("4.2 TDI V8","Diesel","350ch","Bosch"),
        eng("6.0 TDI W12","Diesel","500ch","Bosch"),
      ]},
      "Q3": { years:"2011-present", engines:[
        eng("1.4 TFSI","Essence","150ch","Bosch"), eng("2.0 TFSI","Essence","211ch","Bosch"),
        eng("2.0 TFSI RS Q3","Essence","340ch","Bosch"),
        eng("1.6 TDI","Diesel","120ch","Bosch"), eng("2.0 TDI","Diesel","140ch","Bosch"),
        eng("2.0 TDI","Diesel","177ch","Bosch"),
      ]},
      "Q5": { years:"2008-present", engines:[
        eng("2.0 TFSI","Essence","211ch","Bosch"), eng("3.0 TFSI V6","Essence","272ch","Bosch"),
        eng("2.0 TDI","Diesel","143ch","Bosch"), eng("2.0 TDI","Diesel","177ch","Bosch"),
        eng("3.0 TDI V6","Diesel","240ch","Bosch"), eng("3.0 BiTDI V6","Diesel","313ch","Bosch"),
      ]},
      "Q7": { years:"2005-present", engines:[
        eng("3.0 TFSI V6","Essence","272ch","Bosch"), eng("4.2 FSI V8","Essence","350ch","Bosch"),
        eng("3.0 TDI V6","Diesel","245ch","Bosch"), eng("4.2 TDI V8","Diesel","340ch","Bosch"),
        eng("6.0 TDI W12","Diesel","500ch","Bosch"),
      ]},
      "TT": { years:"1998-present", engines:[
        eng("1.8 TFSI","Essence","180ch","Bosch"), eng("2.0 TFSI","Essence","200ch","Bosch"),
        eng("2.0 TFSI S","Essence","272ch","Bosch"), eng("2.5 TFSI TT RS","Essence","400ch","Bosch"),
        eng("2.0 TDI","Diesel","170ch","Bosch"),
      ]},
      "RS4 / RS6": { years:"1999-present", engines:[
        eng("2.9 TFSI V6 RS4","Essence","450ch","Bosch"),
        eng("4.0 TFSI V8 RS6","Essence","600ch","Bosch"),
        eng("2.5 TFSI 5cyl RS3","Essence","400ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Toyota": {
    logo: "🇯🇵",
    models: {
      "Yaris": { years:"1999-present", engines:[
        eng("1.0 VVT-i","Essence","69ch","Denso"), eng("1.3 VVT-i","Essence","87ch","Denso"),
        eng("1.5 Hybrid","Essence","101ch","Denso"),
        eng("1.4 D-4D","Diesel","75ch","Denso"), eng("1.4 D-4D","Diesel","90ch","Denso"),
      ]},
      "Corolla": { years:"1966-present", engines:[
        eng("1.4 VVT-i","Essence","97ch","Denso"), eng("1.6 VVT-i","Essence","132ch","Denso"),
        eng("1.8 Hybrid","Essence","122ch","Denso"),
        eng("2.0 D-4D","Diesel","90ch","Denso"), eng("2.0 D-4D","Diesel","116ch","Denso"),
      ]},
      "Avensis": { years:"1997-2018", engines:[
        eng("1.6 VVT-i","Essence","110ch","Denso"), eng("1.8 VVT-i","Essence","129ch","Denso"),
        eng("2.0 VVT-i","Essence","147ch","Denso"),
        eng("2.0 D-4D","Diesel","126ch","Denso"), eng("2.2 D-4D","Diesel","150ch","Denso"),
        eng("2.2 D-CAT","Diesel","177ch","Denso"),
      ]},
      "RAV4": { years:"1994-present", engines:[
        eng("2.0 VVT-i","Essence","152ch","Denso"), eng("2.5 Hybrid","Essence","218ch","Denso"),
        eng("2.0 D-4D","Diesel","116ch","Denso"), eng("2.2 D-4D","Diesel","136ch","Denso"),
        eng("2.2 D-CAT","Diesel","177ch","Denso"),
      ]},
      "Land Cruiser": { years:"1951-present", engines:[
        eng("3.0 D-4D","Diesel","163ch","Denso"), eng("3.0 D-4D","Diesel","190ch","Denso"),
        eng("4.5 D-4D V8","Diesel","235ch","Denso"),
        eng("4.0 VVT-i V6","Essence","278ch","Denso"),
      ]},
      "Hilux": { years:"1968-present", engines:[
        eng("2.5 D-4D","Diesel","102ch","Denso"), eng("2.5 D-4D","Diesel","144ch","Denso"),
        eng("3.0 D-4D","Diesel","163ch","Denso"),
      ]},
      "Auris": { years:"2006-2018", engines:[
        eng("1.3 VVT-i","Essence","99ch","Denso"), eng("1.6 VVT-i","Essence","132ch","Denso"),
        eng("1.8 Hybrid","Essence","136ch","Denso"),
        eng("1.4 D-4D","Diesel","90ch","Denso"), eng("2.0 D-4D","Diesel","126ch","Denso"),
      ]},
      "Prius": { years:"1997-present", engines:[
        eng("1.8 Hybrid","Essence","136ch","Denso"), eng("1.8 Hybrid+","Essence","122ch","Denso"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Ford": {
    logo: "🇺🇸",
    models: {
      "Fiesta": { years:"1976-present", engines:[
        eng("1.0 EcoBoost","Essence","100ch","Bosch"), eng("1.0 EcoBoost","Essence","125ch","Bosch"),
        eng("1.5 ST","Essence","200ch","Bosch"),
        eng("1.4 TDCi","Diesel","68ch","Delphi"), eng("1.5 TDCi","Diesel","75ch","Delphi"),
        eng("1.5 TDCi","Diesel","85ch","Delphi"),
      ]},
      "Focus": { years:"1998-present", engines:[
        eng("1.0 EcoBoost","Essence","100ch","Bosch"), eng("1.5 EcoBoost","Essence","150ch","Bosch"),
        eng("1.6 EcoBoost","Essence","150ch","Bosch"), eng("2.0 ST","Essence","250ch","Bosch"),
        eng("2.3 RS","Essence","350ch","Bosch"),
        eng("1.5 TDCi","Diesel","95ch","Delphi"), eng("1.5 TDCi","Diesel","120ch","Delphi"),
        eng("1.6 TDCi","Diesel","95ch","Bosch"), eng("2.0 TDCi","Diesel","136ch","Bosch"),
        eng("2.0 TDCi","Diesel","163ch","Bosch"),
      ]},
      "Mondeo": { years:"1993-present", engines:[
        eng("1.5 EcoBoost","Essence","160ch","Bosch"), eng("2.0 EcoBoost","Essence","240ch","Bosch"),
        eng("2.5 ST","Essence","220ch","Bosch"),
        eng("1.5 TDCi","Diesel","115ch","Delphi"), eng("1.6 TDCi","Diesel","115ch","Delphi"),
        eng("2.0 TDCi","Diesel","115ch","Bosch"), eng("2.0 TDCi","Diesel","163ch","Bosch"),
        eng("2.0 TDCi","Diesel","200ch","Bosch"),
      ]},
      "Kuga": { years:"2008-present", engines:[
        eng("1.5 EcoBoost","Essence","150ch","Bosch"), eng("2.0 EcoBoost ST-Line","Essence","250ch","Bosch"),
        eng("1.5 TDCi","Diesel","120ch","Delphi"), eng("2.0 TDCi","Diesel","136ch","Bosch"),
        eng("2.0 TDCi","Diesel","150ch","Bosch"), eng("2.0 TDCi","Diesel","180ch","Bosch"),
      ]},
      "Transit": { years:"1965-present", engines:[
        eng("2.0 EcoBlue","Diesel","105ch","Bosch"), eng("2.0 EcoBlue","Diesel","130ch","Bosch"),
        eng("2.0 EcoBlue","Diesel","170ch","Bosch"), eng("2.0 EcoBlue","Diesel","185ch","Bosch"),
      ]},
      "Transit Connect": { years:"2002-present", engines:[
        eng("1.0 EcoBoost","Essence","100ch","Bosch"),
        eng("1.5 TDCi","Diesel","75ch","Delphi"), eng("1.5 TDCi","Diesel","100ch","Delphi"),
        eng("1.6 TDCi","Diesel","95ch","Bosch"),
      ]},
      "S-Max": { years:"2006-present", engines:[
        eng("1.5 EcoBoost","Essence","165ch","Bosch"), eng("2.0 EcoBoost","Essence","203ch","Bosch"),
        eng("2.0 TDCi","Diesel","136ch","Bosch"), eng("2.0 TDCi","Diesel","163ch","Bosch"),
        eng("2.0 TDCi","Diesel","210ch","Bosch"),
      ]},
      "EcoSport": { years:"2012-present", engines:[
        eng("1.0 EcoBoost","Essence","125ch","Bosch"), eng("1.5 Ti-VCT","Essence","112ch","Bosch"),
        eng("1.5 TDCi","Diesel","95ch","Delphi"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Opel / Vauxhall": {
    logo: "🇩🇪",
    models: {
      "Corsa": { years:"1982-present", engines:[
        eng("1.0","Essence","65ch","Bosch"), eng("1.2","Essence","85ch","Bosch"),
        eng("1.4","Essence","90ch","Bosch"), eng("1.4 Turbo OPC","Essence","152ch","Bosch"),
        eng("1.2 CDTi","Diesel","70ch","Continental"), eng("1.3 CDTi","Diesel","75ch","Continental"),
        eng("1.7 CDTi","Diesel","100ch","Bosch"),
      ]},
      "Astra": { years:"1991-present", engines:[
        eng("1.2 Turbo","Essence","110ch","Continental"), eng("1.4 Turbo","Essence","140ch","Continental"),
        eng("1.6 Turbo","Essence","180ch","Continental"), eng("2.0 OPC","Essence","280ch","Bosch"),
        eng("1.3 CDTi","Diesel","75ch","Continental"), eng("1.6 CDTi","Diesel","110ch","Continental"),
        eng("1.7 CDTi","Diesel","100ch","Bosch"), eng("2.0 CDTi","Diesel","130ch","Bosch"),
        eng("2.0 CDTi","Diesel","160ch","Bosch"),
      ]},
      "Zafira": { years:"1999-present", engines:[
        eng("1.4 Turbo","Essence","140ch","Continental"), eng("1.6 Turbo","Essence","170ch","Continental"),
        eng("2.0 OPC","Essence","280ch","Bosch"),
        eng("1.6 CDTi","Diesel","110ch","Continental"), eng("2.0 CDTi","Diesel","130ch","Bosch"),
        eng("2.0 CDTi","Diesel","165ch","Bosch"),
      ]},
      "Insignia": { years:"2008-present", engines:[
        eng("1.4 Turbo","Essence","140ch","Continental"), eng("1.6 Turbo","Essence","170ch","Continental"),
        eng("2.0 Turbo OPC","Essence","325ch","Bosch"),
        eng("1.6 CDTi","Diesel","110ch","Continental"), eng("2.0 CDTi","Diesel","130ch","Bosch"),
        eng("2.0 CDTi","Diesel","163ch","Bosch"), eng("2.0 BiTurbo CDTi","Diesel","195ch","Bosch"),
      ]},
      "Meriva": { years:"2002-2017", engines:[
        eng("1.4","Essence","100ch","Bosch"), eng("1.4 Turbo","Essence","120ch","Continental"),
        eng("1.3 CDTi","Diesel","75ch","Continental"), eng("1.6 CDTi","Diesel","100ch","Continental"),
      ]},
      "Mokka": { years:"2012-present", engines:[
        eng("1.4 Turbo","Essence","140ch","Continental"), eng("1.6","Essence","115ch","Bosch"),
        eng("1.6 CDTi","Diesel","110ch","Continental"), eng("1.7 CDTi","Diesel","130ch","Bosch"),
      ]},
      "Vivaro": { years:"2001-present", engines:[
        eng("1.6 CDTI","Diesel","95ch","Continental"), eng("1.6 CDTI","Diesel","120ch","Continental"),
        eng("1.6 BiTurbo CDTI","Diesel","145ch","Continental"),
      ]},
      "Movano": { years:"1998-present", engines:[
        eng("2.3 CDTi","Diesel","100ch","Bosch"), eng("2.3 CDTi","Diesel","125ch","Bosch"),
        eng("2.3 CDTi","Diesel","145ch","Bosch"), eng("2.3 CDTi","Diesel","165ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Fiat": {
    logo: "🇮🇹",
    models: {
      "Punto": { years:"1993-2018", engines:[
        eng("1.2","Essence","65ch","Marelli"), eng("1.4","Essence","77ch","Marelli"),
        eng("1.4 Abarth","Essence","130ch","Marelli"),
        eng("1.3 Multijet","Diesel","75ch","Marelli"), eng("1.3 Multijet","Diesel","85ch","Marelli"),
        eng("1.6 Multijet","Diesel","120ch","Bosch"),
      ]},
      "500": { years:"2007-present", engines:[
        eng("0.9 TwinAir","Essence","85ch","Continental"), eng("1.2","Essence","69ch","Marelli"),
        eng("1.4","Essence","100ch","Marelli"), eng("1.4 Abarth","Essence","145ch","Marelli"),
        eng("1.3 Multijet","Diesel","75ch","Marelli"), eng("1.3 Multijet","Diesel","95ch","Marelli"),
      ]},
      "Bravo": { years:"2007-2014", engines:[
        eng("1.4 T-Jet","Essence","120ch","Marelli"), eng("1.4 T-Jet","Essence","150ch","Marelli"),
        eng("1.6 Multijet","Diesel","105ch","Bosch"), eng("2.0 Multijet","Diesel","165ch","Bosch"),
      ]},
      "Tipo": { years:"1988-present", engines:[
        eng("1.4","Essence","95ch","Marelli"), eng("1.6","Essence","110ch","Marelli"),
        eng("1.3 Multijet","Diesel","95ch","Marelli"), eng("1.6 Multijet","Diesel","120ch","Bosch"),
      ]},
      "Ducato": { years:"1981-present", engines:[
        eng("2.0 Multijet","Diesel","115ch","Marelli"), eng("2.3 Multijet","Diesel","120ch","Bosch"),
        eng("2.3 Multijet","Diesel","130ch","Bosch"), eng("2.3 Multijet","Diesel","150ch","Bosch"),
        eng("3.0 Multijet","Diesel","160ch","Bosch"),
      ]},
      "Doblo": { years:"2000-present", engines:[
        eng("1.4","Essence","95ch","Marelli"), eng("1.6 Multijet","Essence","90ch","Bosch"),
        eng("1.3 Multijet","Diesel","75ch","Marelli"), eng("1.6 Multijet","Diesel","105ch","Bosch"),
        eng("2.0 Multijet","Diesel","135ch","Bosch"),
      ]},
      "Panda": { years:"1980-present", engines:[
        eng("0.9 TwinAir","Essence","65ch","Continental"), eng("1.0 Firefly","Essence","70ch","Marelli"),
        eng("1.2","Essence","69ch","Marelli"), eng("1.3 Multijet","Diesel","75ch","Marelli"),
        eng("1.3 Multijet","Diesel","80ch","Marelli"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Nissan": {
    logo: "🇯🇵",
    models: {
      "Micra": { years:"1982-present", engines:[
        eng("1.0","Essence","65ch","Bosch"), eng("1.2","Essence","80ch","Continental"),
        eng("1.2 DIG-S","Essence","98ch","Continental"),
        eng("1.5 dCi","Diesel","65ch","Continental"), eng("1.5 dCi","Diesel","90ch","Continental"),
      ]},
      "Juke": { years:"2010-present", engines:[
        eng("1.0 DIG-T","Essence","116ch","Continental"), eng("1.2 DIG-T","Essence","115ch","Continental"),
        eng("1.6 Nismo","Essence","214ch","Continental"),
        eng("1.5 dCi","Diesel","90ch","Continental"), eng("1.5 dCi","Diesel","110ch","Continental"),
      ]},
      "Qashqai": { years:"2006-present", engines:[
        eng("1.2 DIG-T","Essence","115ch","Continental"), eng("1.3 DIG-T","Essence","140ch","Continental"),
        eng("1.6 DIG-T","Essence","163ch","Continental"),
        eng("1.5 dCi","Diesel","110ch","Continental"), eng("1.6 dCi","Diesel","130ch","Continental"),
        eng("2.0 dCi","Diesel","150ch","Continental"),
      ]},
      "X-Trail": { years:"2001-present", engines:[
        eng("1.6 DIG-T","Essence","163ch","Continental"), eng("2.0 DIG-T","Essence","177ch","Continental"),
        eng("1.6 dCi","Diesel","130ch","Continental"), eng("2.0 dCi","Diesel","150ch","Continental"),
        eng("2.0 dCi","Diesel","177ch","Continental"),
      ]},
      "Navara": { years:"1986-present", engines:[
        eng("2.3 dCi","Diesel","160ch","Bosch"), eng("2.3 dCi","Diesel","190ch","Bosch"),
        eng("2.5 dCi","Diesel","174ch","Bosch"),
      ]},
      "Pathfinder": { years:"1986-present", engines:[
        eng("2.5 dCi V6","Diesel","174ch","Bosch"), eng("3.0 dCi V6","Diesel","231ch","Bosch"),
      ]},
      "Note": { years:"2004-present", engines:[
        eng("1.2","Essence","80ch","Continental"), eng("0.9 DIG-T","Essence","90ch","Continental"),
        eng("1.5 dCi","Diesel","90ch","Continental"),
      ]},
      "350Z / 370Z": { years:"2002-present", engines:[
        eng("3.5 V6","Essence","300ch","Bosch"), eng("3.7 V6","Essence","328ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Hyundai": {
    logo: "🇰🇷",
    models: {
      "i10": { years:"2007-present", engines:[
        eng("1.0","Essence","65ch","Bosch"), eng("1.2","Essence","84ch","Bosch"),
        eng("1.0 T-GDI","Essence","100ch","Bosch"),
      ]},
      "i20": { years:"2008-present", engines:[
        eng("1.0 T-GDI","Essence","100ch","Bosch"), eng("1.2","Essence","84ch","Bosch"),
        eng("1.4","Essence","100ch","Bosch"), eng("1.6 N","Essence","204ch","Bosch"),
        eng("1.1 CRDi","Diesel","75ch","Bosch"), eng("1.4 CRDi","Diesel","90ch","Bosch"),
        eng("1.6 CRDi","Diesel","110ch","Bosch"),
      ]},
      "i30": { years:"2007-present", engines:[
        eng("1.0 T-GDI","Essence","120ch","Bosch"), eng("1.4 T-GDI","Essence","140ch","Bosch"),
        eng("2.0 N","Essence","275ch","Bosch"),
        eng("1.4 CRDi","Diesel","90ch","Bosch"), eng("1.6 CRDi","Diesel","110ch","Bosch"),
        eng("2.0 CRDi","Diesel","136ch","Bosch"),
      ]},
      "Tucson": { years:"2004-present", engines:[
        eng("1.6 T-GDI","Essence","150ch","Bosch"), eng("2.0 GDI","Essence","163ch","Bosch"),
        eng("1.6 CRDi","Diesel","115ch","Bosch"), eng("1.6 CRDi","Diesel","136ch","Bosch"),
        eng("2.0 CRDi","Diesel","136ch","Bosch"), eng("2.0 CRDi","Diesel","185ch","Bosch"),
      ]},
      "Santa Fe": { years:"2000-present", engines:[
        eng("2.0 T-GDI","Essence","235ch","Bosch"), eng("2.5 GDI","Essence","190ch","Bosch"),
        eng("2.0 CRDi","Diesel","150ch","Bosch"), eng("2.2 CRDi","Diesel","200ch","Bosch"),
      ]},
      "Kona": { years:"2017-present", engines:[
        eng("1.0 T-GDI","Essence","120ch","Bosch"), eng("1.6 T-GDI","Essence","177ch","Bosch"),
        eng("1.6 CRDi","Diesel","115ch","Bosch"), eng("1.6 CRDi","Diesel","136ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Kia": {
    logo: "🇰🇷",
    models: {
      "Picanto": { years:"2004-present", engines:[
        eng("1.0","Essence","67ch","Bosch"), eng("1.2","Essence","85ch","Bosch"),
        eng("1.0 T-GDI GT Line","Essence","100ch","Bosch"),
      ]},
      "Rio": { years:"2000-present", engines:[
        eng("1.2","Essence","84ch","Bosch"), eng("1.4","Essence","100ch","Bosch"),
        eng("1.0 T-GDI","Essence","100ch","Bosch"),
        eng("1.1 CRDi","Diesel","75ch","Bosch"), eng("1.4 CRDi","Diesel","90ch","Bosch"),
      ]},
      "Ceed": { years:"2006-present", engines:[
        eng("1.0 T-GDI","Essence","120ch","Bosch"), eng("1.4 T-GDI","Essence","140ch","Bosch"),
        eng("1.6 T-GDI GT","Essence","204ch","Bosch"),
        eng("1.4 CRDi","Diesel","90ch","Bosch"), eng("1.6 CRDi","Diesel","115ch","Bosch"),
        eng("1.6 CRDi","Diesel","136ch","Bosch"),
      ]},
      "Sportage": { years:"1993-present", engines:[
        eng("1.6 T-GDI","Essence","150ch","Bosch"), eng("1.6 T-GDI","Essence","177ch","Bosch"),
        eng("2.0 GDI","Essence","163ch","Bosch"),
        eng("1.6 CRDi","Diesel","115ch","Bosch"), eng("1.6 CRDi","Diesel","136ch","Bosch"),
        eng("2.0 CRDi","Diesel","136ch","Bosch"), eng("2.0 CRDi","Diesel","185ch","Bosch"),
      ]},
      "Sorento": { years:"2002-present", engines:[
        eng("2.0 T-GDI","Essence","235ch","Bosch"),
        eng("2.0 CRDi","Diesel","150ch","Bosch"), eng("2.2 CRDi","Diesel","200ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Seat": {
    logo: "🇪🇸",
    models: {
      "Ibiza": { years:"1984-present", engines:[
        eng("1.0 MPI","Essence","75ch","Bosch"), eng("1.0 TSI","Essence","95ch","Bosch"),
        eng("1.5 TSI","Essence","150ch","Bosch"), eng("2.0 Cupra","Essence","300ch","Bosch"),
        eng("1.4 TDI","Diesel","90ch","Bosch"), eng("1.6 TDI","Diesel","90ch","Bosch"),
      ]},
      "Leon": { years:"1999-present", engines:[
        eng("1.0 TSI","Essence","116ch","Bosch"), eng("1.4 TSI","Essence","125ch","Bosch"),
        eng("1.8 TSI","Essence","180ch","Bosch"), eng("2.0 TSI Cupra","Essence","300ch","Bosch"),
        eng("2.0 Cupra R","Essence","370ch","Bosch"),
        eng("1.6 TDI","Diesel","105ch","Bosch"), eng("2.0 TDI","Diesel","150ch","Bosch"),
        eng("2.0 TDI","Diesel","184ch","Bosch"),
      ]},
      "Ateca": { years:"2016-present", engines:[
        eng("1.0 TSI","Essence","115ch","Bosch"), eng("1.5 TSI","Essence","150ch","Bosch"),
        eng("2.0 TSI Cupra","Essence","300ch","Bosch"),
        eng("1.6 TDI","Diesel","115ch","Bosch"), eng("2.0 TDI","Diesel","150ch","Bosch"),
        eng("2.0 TDI","Diesel","190ch","Bosch"),
      ]},
      "Alhambra": { years:"1996-present", engines:[
        eng("1.4 TSI","Essence","150ch","Bosch"), eng("2.0 TSI","Essence","220ch","Bosch"),
        eng("2.0 TDI","Diesel","115ch","Bosch"), eng("2.0 TDI","Diesel","150ch","Bosch"),
        eng("2.0 TDI","Diesel","177ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Skoda": {
    logo: "🇨🇿",
    models: {
      "Fabia": { years:"1999-present", engines:[
        eng("1.0 MPI","Essence","75ch","Bosch"), eng("1.2 TSI","Essence","90ch","Bosch"),
        eng("1.4 TSI RS","Essence","180ch","Bosch"),
        eng("1.2 TDI","Diesel","75ch","Bosch"), eng("1.4 TDI","Diesel","90ch","Bosch"),
      ]},
      "Octavia": { years:"1996-present", engines:[
        eng("1.0 TSI","Essence","115ch","Bosch"), eng("1.4 TSI","Essence","150ch","Bosch"),
        eng("1.8 TSI","Essence","180ch","Bosch"), eng("2.0 TSI RS","Essence","245ch","Bosch"),
        eng("1.6 TDI","Diesel","115ch","Bosch"), eng("2.0 TDI","Diesel","115ch","Bosch"),
        eng("2.0 TDI","Diesel","150ch","Bosch"), eng("2.0 TDI RS","Diesel","184ch","Bosch"),
      ]},
      "Superb": { years:"2001-present", engines:[
        eng("1.4 TSI","Essence","150ch","Bosch"), eng("1.8 TSI","Essence","180ch","Bosch"),
        eng("2.0 TSI","Essence","220ch","Bosch"),
        eng("1.6 TDI","Diesel","120ch","Bosch"), eng("2.0 TDI","Diesel","150ch","Bosch"),
        eng("2.0 TDI","Diesel","190ch","Bosch"), eng("2.0 BiTDI","Diesel","240ch","Bosch"),
      ]},
      "Kodiaq": { years:"2016-present", engines:[
        eng("1.4 TSI","Essence","125ch","Bosch"), eng("2.0 TSI","Essence","190ch","Bosch"),
        eng("2.0 TDI","Diesel","150ch","Bosch"), eng("2.0 TDI","Diesel","190ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Alfa Romeo": {
    logo: "🇮🇹",
    models: {
      "147": { years:"2000-2010", engines:[
        eng("1.4 TS","Essence","90ch","Marelli"), eng("1.6 TS","Essence","105ch","Marelli"),
        eng("2.0 JTS","Essence","150ch","Marelli"), eng("3.2 GTA","Essence","250ch","Marelli"),
        eng("1.9 JTD","Diesel","100ch","Marelli"), eng("1.9 JTD","Diesel","120ch","Marelli"),
        eng("1.9 JTD","Diesel","150ch","Marelli"),
      ]},
      "156": { years:"1997-2007", engines:[
        eng("1.6 TS","Essence","120ch","Marelli"), eng("1.8 TS","Essence","144ch","Marelli"),
        eng("2.0 JTS","Essence","165ch","Marelli"), eng("2.5 V6","Essence","190ch","Marelli"),
        eng("3.2 GTA","Essence","250ch","Marelli"),
        eng("1.9 JTD","Diesel","116ch","Marelli"), eng("2.4 JTD","Diesel","175ch","Marelli"),
      ]},
      "159": { years:"2005-2011", engines:[
        eng("1.8 MPI","Essence","140ch","Marelli"), eng("1.9 JTS","Essence","160ch","Marelli"),
        eng("2.2 JTS","Essence","185ch","Marelli"), eng("3.2 JTS V6","Essence","260ch","Marelli"),
        eng("1.9 JTD M","Diesel","120ch","Marelli"), eng("1.9 JTD M","Diesel","150ch","Marelli"),
        eng("2.4 JTD M","Diesel","210ch","Marelli"),
      ]},
      "Giulietta": { years:"2010-present", engines:[
        eng("1.4 MA Turbo","Essence","120ch","Marelli"), eng("1.4 MA Turbo","Essence","170ch","Marelli"),
        eng("1.75 TBI QV","Essence","240ch","Marelli"),
        eng("1.6 JTDm","Diesel","105ch","Marelli"), eng("2.0 JTDm","Diesel","140ch","Bosch"),
        eng("2.0 JTDm","Diesel","175ch","Bosch"),
      ]},
      "Giulia": { years:"2015-present", engines:[
        eng("2.0 TB","Essence","200ch","Bosch"), eng("2.0 TB","Essence","280ch","Bosch"),
        eng("2.9 V6 Biturbo QV","Essence","510ch","Bosch"),
        eng("2.2 JTD","Diesel","150ch","Bosch"), eng("2.2 JTD","Diesel","180ch","Bosch"),
        eng("2.2 JTD","Diesel","210ch","Bosch"),
      ]},
      "Stelvio": { years:"2017-present", engines:[
        eng("2.0 TB","Essence","200ch","Bosch"), eng("2.0 TB","Essence","280ch","Bosch"),
        eng("2.9 V6 Biturbo QV","Essence","510ch","Bosch"),
        eng("2.2 JTD","Diesel","150ch","Bosch"), eng("2.2 JTD","Diesel","180ch","Bosch"),
        eng("2.2 JTD","Diesel","210ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Land Rover": {
    logo: "🇬🇧",
    models: {
      "Discovery": { years:"1989-present", engines:[
        eng("3.0 Si6","Essence","340ch","Bosch"), eng("5.0 V8","Essence","525ch","Bosch"),
        eng("2.0 SD4","Diesel","240ch","Bosch"), eng("3.0 SDV6","Diesel","306ch","Bosch"),
        eng("3.0 SDV6","Diesel","258ch","Bosch"),
      ]},
      "Freelander": { years:"1997-2014", engines:[
        eng("1.8i","Essence","117ch","Siemens"), eng("2.5 V6","Essence","177ch","Siemens"),
        eng("2.2 TD4","Diesel","150ch","Siemens"), eng("2.2 SD4","Diesel","190ch","Siemens"),
      ]},
      "Range Rover": { years:"1970-present", engines:[
        eng("3.0 Si6","Essence","340ch","Bosch"), eng("5.0 V8 Supercharged","Essence","525ch","Bosch"),
        eng("2.0 SD4","Diesel","240ch","Bosch"), eng("3.0 SDV6","Diesel","258ch","Bosch"),
        eng("4.4 SDV8","Diesel","340ch","Bosch"),
      ]},
      "Range Rover Sport": { years:"2005-present", engines:[
        eng("3.0 Si6","Essence","340ch","Bosch"), eng("5.0 V8","Essence","525ch","Bosch"),
        eng("2.0 SD4","Diesel","240ch","Bosch"), eng("3.0 SDV6","Diesel","306ch","Bosch"),
      ]},
      "Defender": { years:"1983-present", engines:[
        eng("2.0 P300","Essence","300ch","Bosch"), eng("5.0 V8","Essence","525ch","Bosch"),
        eng("2.0 D200","Diesel","200ch","Bosch"), eng("3.0 D300","Diesel","300ch","Bosch"),
      ]},
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  "Porsche": {
    logo: "🇩🇪",
    models: {
      "Cayenne": { years:"2002-present", engines:[
        eng("3.0 V6","Essence","340ch","Bosch"), eng("3.6 V6 S","Essence","440ch","Bosch"),
        eng("4.8 V8 Turbo","Essence","550ch","Bosch"),
        eng("3.0 TDI V6","Diesel","245ch","Bosch"), eng("4.2 TDI V8","Diesel","385ch","Bosch"),
      ]},
      "Macan": { years:"2014-present", engines:[
        eng("2.0 PDK","Essence","245ch","Bosch"), eng("2.0 S PDK","Essence","265ch","Bosch"),
        eng("3.0 GTS","Essence","380ch","Bosch"),
        eng("2.2 TDI","Diesel","160ch","Bosch"), eng("3.0 TDI","Diesel","258ch","Bosch"),
      ]},
      "Panamera": { years:"2009-present", engines:[
        eng("2.9 V6","Essence","330ch","Bosch"), eng("4.0 V8 Turbo","Essence","550ch","Bosch"),
        eng("2.9 V6 Sport Turismo","Essence","440ch","Bosch"),
        eng("4.0 TDI V8","Diesel","422ch","Bosch"),
      ]},
      "911": { years:"1963-present", engines:[
        eng("3.0 Carrera","Essence","385ch","Bosch"), eng("3.8 Carrera S","Essence","450ch","Bosch"),
        eng("3.8 Turbo","Essence","580ch","Bosch"),
      ]},
      "Boxster / Cayman": { years:"1996-present", engines:[
        eng("2.5","Essence","300ch","Bosch"), eng("2.7","Essence","350ch","Bosch"),
        eng("4.0 GTS","Essence","420ch","Bosch"),
      ]},
    }
  },

};

// ── Helper functions pour le frontend ────────────────────────────────────────

export function getBrandList() {
  return Object.keys(BRANDS).sort();
}

export function getModelList(brand) {
  return brand && BRANDS[brand] ? Object.keys(BRANDS[brand].models).sort() : [];
}

export function getEngineList(brand, model) {
  if (!brand || !model || !BRANDS[brand]?.models[model]) return [];
  return BRANDS[brand].models[model].engines;
}

export function getUniqueEngineLabels(brand, model) {
  return getEngineList(brand, model).map(e => `${e.displacement} — ${e.fuel} ${e.power}`);
}

export function getECURefSuggestions(brand, model, engineLabel) {
  const engines = getEngineList(brand, model);
  const engine = engines.find(e => `${e.displacement} — ${e.fuel} ${e.power}` === engineLabel);
  if (!engine) return [];
  return engine.refs || [];
}

// Génère la clé S3 automatiquement — l'admin n'a qu'à uploader le fichier
export function generateS3Key(brand, model, engineLabel, ecuRef, calcType) {
  const sanitize = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/,"");
  const b = sanitize(brand);
  const m = sanitize(model);
  const e = sanitize(engineLabel);
  const r = sanitize(ecuRef);
  const c = sanitize(calcType);
  return `${b}/${m}/${e}_${r}_${c}.zip`;
}

// Statistiques du catalogue
export const CATALOG_STATS = {
  totalBrands:  Object.keys(BRANDS).length,
  totalModels:  Object.values(BRANDS).reduce((acc, b) => acc + Object.keys(b.models).length, 0),
  totalEngines: Object.values(BRANDS).reduce((acc, b) =>
    acc + Object.values(b.models).reduce((a, m) => a + m.engines.length, 0), 0),
};
