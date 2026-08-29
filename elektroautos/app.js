(function () {
  "use strict";

  var LS = "elektroautos_";
  var MAX_PINS = 4;
  var SEARCH_KEYS = [
    "marke", "modell", "autotyp", "plattform", "modelljahr", "id",
    "antrieb.konzept", "batterie.chemie", "produktionsland", "bemerkung", "hinweis", "status"
  ];

  var FALLBACK = {
    letzte_aktualisierung: null,
    daten_stand: "eingebettet",
    fahrzeuge: [
      {
        id: "fb1", modell: "BMW iX1 eDrive20", marke: "BMW", autotyp: "Kompakt-SUV",
        status: "aktuell", modelljahr: "2022-2026", plattform: "FAAR",
        user_wish: null, produktionsland: "Deutschland",
        antrieb: { konzept: "Frontantrieb (FWD)" },
        leistung: { systemleistung_kw: 150, systemleistung_ps: 204, drehmoment_nm: 250, beschleunigung_0_100_s: 8.6 },
        batterie: { netto_kwh: 65.2, chemie: "NMC", systemspannung_v: 400 },
        laden: { ac_serie_kw: 11, ac_optional_kw: 22, dc_max_kw: 130, dc_10_80_min: 29, v2l: false, plug_and_charge: true, vorkonditionierung: true },
        verbrauch: { wltp_reichweite_km: { min: 458, max: 514 }, realreichweite_winter_km: null, realreichweite_autobahn_130_km: 363 },
        abmessungen: { laenge_mm: 4500, kofferraum_liter: 490, sitze: 5, frunk: false },
        fahrwerk: { waermepumpe: true },
        preis: { basispreis_eur: 49400 },
        euro_ncap: { sterne: 5 }, adac_note: 2.1, produkt_url: "https://www.bmw.de",
        bemerkung: null, hinweis: "Eingebetteter Notdatensatz, falls data.json nicht geladen werden konnte."
      },
      {
        id: "fb2", modell: "Tesla Model 3 Long Range", marke: "Tesla", autotyp: "Limousine",
        status: "aktuell", modelljahr: "2024-2026", plattform: "Tesla 3/Y Platform (Highland)",
        user_wish: null, produktionsland: "Deutschland / China",
        antrieb: { konzept: "Allrad (AWD)" },
        leistung: { systemleistung_kw: 324, systemleistung_ps: 441, drehmoment_nm: 550, beschleunigung_0_100_s: 4.4 },
        batterie: { netto_kwh: 75, chemie: "NMC", systemspannung_v: 400 },
        laden: { ac_serie_kw: 11, ac_optional_kw: null, dc_max_kw: 250, dc_10_80_min: 27, v2l: false, plug_and_charge: true, vorkonditionierung: true },
        verbrauch: { wltp_reichweite_km: { min: 554, max: 629 }, realreichweite_winter_km: null, realreichweite_autobahn_130_km: 420 },
        abmessungen: { laenge_mm: 4720, kofferraum_liter: 561, sitze: 5, frunk: true },
        fahrwerk: { waermepumpe: true },
        preis: { basispreis_eur: 46990 },
        euro_ncap: { sterne: 5 }, adac_note: 1.8, produkt_url: "https://www.tesla.com/de_de",
        bemerkung: null, hinweis: "Eingebetteter Notdatensatz, falls data.json nicht geladen werden konnte."
      }
    ]
  };

  var RANGE_DEFS = [
    { key: "preis", label: "Preis", unit: "€", path: "preis.basispreis_eur", pick: "min", step: 100 },
    { key: "wltp", label: "WLTP-Reichweite", unit: "km", path: "verbrauch.wltp_reichweite_km", pick: "max", step: 5 },
    { key: "accel", label: "0–100", unit: "s", path: "leistung.beschleunigung_0_100_s", pick: "val", step: 0.1 },
    { key: "dc", label: "DC-Laden", unit: "kW", path: "laden.dc_max_kw", pick: "val", step: 5 },
    { key: "kwh", label: "Netto-Batterie", unit: "kWh", path: "batterie.netto_kwh", pick: "val", step: 1 }
  ];

  var TOGGLES = [
    { key: "awd", label: "Allrad" },
    { key: "wp", label: "Wärmepumpe" },
    { key: "ac22", label: "AC 22 kW" },
    { key: "v2l", label: "V2L" },
    { key: "pnc", label: "Plug & Charge" },
    { key: "frunk", label: "Frunk" },
    { key: "pref", label: "Präferenz gesetzt" }
  ];

  var COLUMNS = [
    { key: "_pin", label: "", kind: "pin", identity: true, sticky: 0 },
    { key: "user_wish", label: "Pref", kind: "wish", identity: true, sticky: 1 },
    { key: "modell", label: "Modell", identity: true, sticky: 2 },
    { key: "marke", label: "Marke", identity: true, sticky: 3 },
    { key: "autotyp", label: "Segment", identity: true },
    { key: "preis.basispreis_eur", label: "Preis", kind: "eur", group: "Kosten" },
    { key: "verbrauch.wltp_reichweite_km.min", label: "WLTP min", kind: "num", group: "Reichweite", path: "verbrauch.wltp_reichweite_km", end: "min" },
    { key: "verbrauch.wltp_reichweite_km.max", label: "WLTP max", kind: "num", group: "Reichweite", path: "verbrauch.wltp_reichweite_km", end: "max" },
    { key: "leistung.beschleunigung_0_100_s", label: "0-100 s", kind: "num", group: "Motor" },
    { key: "leistung.systemleistung_kw", label: "kW", kind: "num", group: "Motor" },
    { key: "batterie.netto_kwh", label: "kWh", kind: "num", group: "Batterie" },
    { key: "laden.dc_max_kw", label: "DC kW", kind: "num", group: "Laden" },
    { key: "antrieb.konzept", label: "Antrieb", group: "Motor" },
    { key: "fahrwerk.waermepumpe", label: "WP", kind: "bool", group: "Specs" },
    { key: "status", label: "Status", kind: "status", group: "Specs" },
    { key: "eingestellt_grund", label: "Einstellgrund", whenAlt: true, group: "Specs" },
    { key: "adac_note", label: "ADAC", kind: "num", group: "Sicherheit" },
    { key: "euro_ncap.sterne", label: "NCAP", kind: "num", group: "Sicherheit" },
    { key: "euro_ncap.erwachsene", label: "Erw. %", kind: "num", group: "Sicherheit" },
    { key: "euro_ncap.kinder", label: "Kind %", kind: "num", group: "Sicherheit" },
    { key: "euro_ncap.fussgaenger", label: "Fuß %", kind: "num", group: "Sicherheit" },
    { key: "euro_ncap.assistenten", label: "Assi %", kind: "num", group: "Sicherheit" },
    { key: "leistung.systemleistung_ps", label: "PS", kind: "num", group: "Motor" },
    { key: "leistung.drehmoment_nm", label: "Nm", kind: "num", group: "Motor" },
    { key: "leistung.hoechstgeschwindigkeit_kmh", label: "Vmax", kind: "num", group: "Motor" },
    { key: "antrieb.anzahl_motoren", label: "Motoren", kind: "num", group: "Motor" },
    { key: "antrieb.motortyp", label: "Motortyp", group: "Motor" },
    { key: "batterie.brutto_kwh", label: "kWh brutto", kind: "num", group: "Batterie" },
    { key: "batterie.systemspannung_v", label: "Volt", kind: "num", group: "Batterie" },
    { key: "batterie.chemie", label: "Chemie", group: "Batterie" },
    { key: "batterie.zelltyp", label: "Zelltyp", group: "Batterie" },
    { key: "laden.dc_10_80_min", label: "10-80 min", kind: "num", group: "Laden" },
    { key: "laden.ac_serie_kw", label: "AC kW", kind: "num", group: "Laden" },
    { key: "laden.ac_optional_kw", label: "AC opt.", kind: "num", group: "Laden" },
    { key: "laden.v2l", label: "V2L", kind: "bool", group: "Laden" },
    { key: "laden.plug_and_charge", label: "P&C", kind: "bool", group: "Laden" },
    { key: "laden.vorkonditionierung", label: "Vorkond.", kind: "bool", group: "Laden" },
    { key: "verbrauch.wltp_kwh_100km", label: "WLTP kWh", kind: "range", group: "Reichweite" },
    { key: "verbrauch.realreichweite_winter_km", label: "Winter km", kind: "num", group: "Reichweite" },
    { key: "verbrauch.realreichweite_autobahn_130_km", label: "Autobahn km", kind: "num", group: "Reichweite" },
    { key: "abmessungen.laenge_mm", label: "Länge mm", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.breite_mm", label: "Breite mm", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.hoehe_mm", label: "Höhe mm", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.radstand_mm", label: "Radst. mm", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.sitze", label: "Sitze", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.wendekreis_m", label: "Wendk. m", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.cw_wert", label: "cw", kind: "num", group: "Abmessungen" },
    { key: "abmessungen.leergewicht_kg", label: "Gew. kg", kind: "num", group: "Specs" },
    { key: "abmessungen.kofferraum_liter", label: "Kofferr. L", kind: "num", group: "Specs" },
    { key: "abmessungen.kofferraum_umgeklappt_liter", label: "Koff. max L", kind: "num", group: "Specs" },
    { key: "abmessungen.frunk", label: "Frunk", kind: "bool", group: "Specs" },
    { key: "abmessungen.frunk_liter", label: "Frunk L", kind: "num", group: "Specs" },
    { key: "abmessungen.ahk_verfuegbar", label: "AHK", kind: "bool", group: "Specs" },
    { key: "ota_updates", label: "OTA", kind: "bool", group: "Specs" },
    { key: "preis.versicherung_eur_jahr", label: "Vers. €/J", kind: "range", group: "Kosten" },
    { key: "service.wartungsintervall", label: "Wartung", group: "Kosten" },
    { key: "service.wartungskosten_eur", label: "Wartung €", kind: "range", group: "Kosten" },
    { key: "service.garantie_relevant", label: "Wartung relevant für Garantie", kind: "bool", group: "Kosten" },
    { key: "abmessungen.nutzlast_kg", label: "Nutzlast kg", kind: "num", group: "LKW" },
    { key: "abmessungen.anzahl_achsen", label: "Achsen", kind: "num", group: "LKW" },
    { key: "antrieb.achskonfiguration", label: "Achskonf.", group: "LKW" },
    { key: "abmessungen.laderaum_m3", label: "Laderaum m3", kind: "num", group: "LKW" },
    { key: "abmessungen.fuehrerhaus", label: "Führerhaus", group: "LKW" },
    { key: "produktionsland", label: "Prod.land", group: "Specs" },
    { key: "modelljahr", label: "Modelljahr", group: "Specs" },
    { key: "produkt_url", label: "Link zur Internetseite", kind: "link", group: "Specs" },
    { key: "bild_url", label: "Link zum Bild des Fahrzeuges", kind: "link", group: "Specs" }
  ];

  var GROUPS = ["Sicherheit", "Motor", "Batterie", "Laden", "Reichweite", "Abmessungen", "Specs", "Kosten", "LKW"];
  var COMPARE_KEYS = [
    "preis.basispreis_eur", "verbrauch.wltp_reichweite_km", "leistung.beschleunigung_0_100_s",
    "leistung.systemleistung_kw", "batterie.netto_kwh", "laden.dc_max_kw", "antrieb.konzept",
    "fahrwerk.waermepumpe", "laden.v2l", "laden.ac_serie_kw", "laden.plug_and_charge",
    "abmessungen.frunk", "abmessungen.kofferraum_liter", "abmessungen.sitze",
    "euro_ncap.sterne", "batterie.chemie", "verbrauch.realreichweite_winter_km",
    "verbrauch.realreichweite_autobahn_130_km", "status"
  ];

  var data = [];
  var meta = { letzte_aktualisierung: null, daten_stand: "", source: "json" };
  var extents = {};
  var filtered = [];
  var hitsById = {};
  var pendingImport = null;
  var searchTimer = null;
  var persistTimer = null;
  var lastFocus = null;
  var state = defaultState();

  function defaultState() {
    return {
      q: "",
      classes: { pkw: true, camper: false, nutz: false },
      status: { aktuell: true, alt: false },
      range: {},
      marken: [], segments: [], drives: [], chemie: [],
      tog: { awd: false, wp: false, ac22: false, v2l: false, pnc: false, frunk: false, pref: false },
      hiddenGroups: ["Sicherheit", "Motor", "Batterie", "Laden", "Reichweite", "Abmessungen", "Specs", "Kosten", "LKW"],
      pins: [],
      sortCol: "marke",
      sortDir: "asc",
      colFilters: {},
      showColFilters: false,
      compareDiffOnly: true,
      openId: null
    };
  }

  function $(id) { return document.getElementById(id); }
  function getVal(obj, path) {
    if (!path) return null;
    var parts = path.split(".");
    var o = obj;
    for (var i = 0; i < parts.length; i++) {
      if (o == null) return null;
      o = o[parts[i]];
    }
    return o === undefined ? null : o;
  }
  function isRange(v) { return v && typeof v === "object" && !Array.isArray(v) && ("min" in v || "max" in v); }
  function asNum(v) {
    if (v == null || v === "") return null;
    if (typeof v === "boolean") return v ? 1 : 0;
    if (typeof v === "number" && !isNaN(v)) return v;
    var n = parseFloat(String(v).replace(",", "."));
    return isNaN(n) ? null : n;
  }
  function pickNum(v, mode) {
    if (isRange(v)) {
      if (mode === "min") return asNum(v.min != null ? v.min : v.max);
      if (mode === "max") return asNum(v.max != null ? v.max : v.min);
      return asNum(v.min != null ? v.min : v.max);
    }
    return asNum(v);
  }
  function colValue(item, col) {
    if (col.end) {
      var r = getVal(item, col.path || col.key.replace(/\.(min|max)$/, ""));
      if (isRange(r)) return r[col.end];
      return col.end === "min" ? r : null;
    }
    return getVal(item, col.key);
  }
  function fold(s) {
    return String(s).toLowerCase()
      .replace(/ae/g, "ae")
      .replace(/\u00e4/g, "ae").replace(/\u00f6/g, "oe").replace(/\u00fc/g, "ue").replace(/\u00df/g, "ss")
      .replace(/\u00c4/g, "ae").replace(/\u00d6/g, "oe").replace(/\u00dc/g, "ue");
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isSafeUrl(url) {
    try {
      var u = new URL(url, location.href);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch (e) { return false; }
  }
  function fmtNum(n, d) {
    if (n == null || n === "") return "";
    var x = Number(n);
    if (isNaN(x)) return String(n);
    return x.toLocaleString("de-DE", { maximumFractionDigits: d == null ? 1 : d });
  }
  function vehicleClass(d) {
    var t = ((d.autotyp || "") + " " + (d.marke || "") + " " + (d.modell || "")).toLowerCase();
    if (/sattelzug|\btrucks\b|elektro-transporter/.test(t)) return "nutz";
    if (/camper/.test(t)) return "camper";
    return "pkw";
  }
  function driveKind(d) {
    var k = String(getVal(d, "antrieb.konzept") || "").toUpperCase();
    if (/ALLRAD|AWD|4WD|4MATIC|QUATTRO/.test(k)) return "AWD";
    if (/FWD|FRONT/.test(k)) return "FWD";
    if (/RWD|HECK|HINTERRAD/.test(k)) return "RWD";
    return "";
  }
  function isCurrent(d) { return !d.status || d.status === "aktuell"; }
  function truthy(v) { return v === true || v === "Option" || v === "Ja" || v === "ja"; }
  function hasAC22(d) {
    var a = asNum(getVal(d, "laden.ac_serie_kw"));
    var b = asNum(getVal(d, "laden.ac_optional_kw"));
    return (a != null && a >= 22) || (b != null && b >= 22);
  }
  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(LS + k);
      return v == null ? fb : JSON.parse(v);
    } catch (e) { return fb; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {}
  }

  function parseNumericToken(raw) {
    var t = String(raw).trim().replace(/\s+/g, "");
    var m = t.match(/^(<=|>=|<|>|=)?(\d+(?:[.,]\d+)?)(kwh|kw|km|k|s|eur)?$/i);
    if (!m || !m[3]) return null;
    var op = m[1] || "";
    var num = parseFloat(m[2].replace(",", "."));
    var unit = m[3].toLowerCase();
    if (unit === "k") { num *= 1000; unit = "eur"; }
    if (!op) {
      if (unit === "eur" || unit === "s") op = "<=";
      else op = ">=";
    }
    return { op: op, num: num, unit: unit };
  }
  function cmp(val, op, num) {
    if (val == null || typeof val !== "number" || isNaN(val)) return false;
    if (op === ">") return val > num;
    if (op === ">=") return val >= num;
    if (op === "<") return val < num;
    if (op === "<=") return val <= num;
    if (op === "=") return val === num;
    return val >= num;
  }
  function numericHits(d, tok) {
    var op = tok.op, n = tok.num, keys = [];
    function add(path, mode) {
      var v = getVal(d, path);
      var use = mode;
      if (isRange(v)) use = (op === "<" || op === "<=") ? "min" : "max";
      if (cmp(pickNum(v, use || "val"), op, n)) keys.push(path);
    }
    if (tok.unit === "km") add("verbrauch.wltp_reichweite_km", "max");
    else if (tok.unit === "kw") { add("laden.dc_max_kw", "val"); add("leistung.systemleistung_kw", "val"); }
    else if (tok.unit === "kwh") add("batterie.netto_kwh", "val");
    else if (tok.unit === "s") add("leistung.beschleunigung_0_100_s", "val");
    else if (tok.unit === "eur") add("preis.basispreis_eur", "min");
    return keys.length ? keys : null;
  }
  function searchMatch(d, tokens) {
    if (!tokens.length) return [];
    var hits = [];
    for (var i = 0; i < tokens.length; i++) {
      var tok = tokens[i];
      var num = parseNumericToken(tok);
      if (num) {
        var nk = numericHits(d, num);
        if (!nk) return null;
        hits = hits.concat(nk);
        continue;
      }
      var ntok = fold(tok);
      if (!ntok) continue;
      var found = false;
      for (var j = 0; j < SEARCH_KEYS.length; j++) {
        var k = SEARCH_KEYS[j];
        var v = getVal(d, k);
        if (v == null) continue;
        var s = Array.isArray(v) ? v.join(" ") : String(v);
        if (fold(s).indexOf(ntok) !== -1) { hits.push(k); found = true; }
      }
      if (!found) return null;
    }
    return hits;
  }

  function classPool() {
    return data.filter(function (d) { return state.classes[vehicleClass(d)]; });
  }
  function computeExtents() {
    var pool = classPool();
    if (!pool.length) pool = data;
    RANGE_DEFS.forEach(function (def) {
      var vals = [];
      pool.forEach(function (d) {
        var n = pickNum(getVal(d, def.path), def.pick);
        if (n != null) vals.push(n);
      });
      if (!vals.length) { extents[def.key] = { min: 0, max: 1 }; return; }
      var mn = Math.min.apply(null, vals);
      var mx = Math.max.apply(null, vals);
      if (mn === mx) mx = mn + def.step;
      extents[def.key] = { min: mn, max: mx };
    });
  }
  function rangeAtFull(key) {
    var e = extents[key], r = state.range[key];
    if (!e || !r) return true;
    return r[0] <= e.min && r[1] >= e.max;
  }
  function ensureRanges(resetIfFull) {
    RANGE_DEFS.forEach(function (def) {
      var e = extents[def.key], r = state.range[def.key];
      var wasFull = !r || (resetIfFull && rangeAtFull(def.key));
      if (wasFull || !r) state.range[def.key] = [e.min, e.max];
      else {
        state.range[def.key] = [
          Math.min(e.max, Math.max(e.min, r[0])),
          Math.min(e.max, Math.max(e.min, r[1]))
        ];
      }
    });
  }
  function parseTokens(q) { return String(q || "").trim().split(/\s+/).filter(Boolean); }

  function applyFilters() {
    var tokens = parseTokens(state.q);
    var out = [];
    hitsById = {};
    data.forEach(function (d) {
      if (!state.classes[vehicleClass(d)]) return;
      var cur = isCurrent(d);
      if (cur && !state.status.aktuell) return;
      if (!cur && !state.status.alt) return;
      for (var i = 0; i < RANGE_DEFS.length; i++) {
        var def = RANGE_DEFS[i];
        if (rangeAtFull(def.key)) continue;
        var r = state.range[def.key];
        var n = pickNum(getVal(d, def.path), def.pick);
        if (n == null) continue;
        if (n < r[0] || n > r[1]) return;
      }
      if (state.marken.length && state.marken.indexOf(d.marke || "") === -1) return;
      if (state.segments.length && state.segments.indexOf(d.autotyp || "") === -1) return;
      if (state.drives.length && state.drives.indexOf(driveKind(d)) === -1) return;
      if (state.chemie.length) {
        var ch = getVal(d, "batterie.chemie") || "";
        if (state.chemie.indexOf(ch) === -1) return;
      }
      if (state.tog.awd && driveKind(d) !== "AWD") return;
      if (state.tog.wp && !truthy(getVal(d, "fahrwerk.waermepumpe"))) return;
      if (state.tog.ac22 && !hasAC22(d)) return;
      if (state.tog.v2l && !truthy(getVal(d, "laden.v2l"))) return;
      if (state.tog.pnc && !truthy(getVal(d, "laden.plug_and_charge"))) return;
      if (state.tog.frunk && !truthy(getVal(d, "abmessungen.frunk"))) return;
      if (state.tog.pref && (d.user_wish == null || d.user_wish === "")) return;
      var hits = searchMatch(d, tokens);
      if (hits == null) return;
      if (!matchColFilters(d)) return;
      hitsById[d.id] = hits;
      out.push(d);
    });
    if (state.sortCol) {
      var col = state.sortCol;
      var dir = state.sortDir === "desc" ? -1 : 1;
      out.sort(function (a, b) {
        var va = sortVal(a, col), vb = sortVal(b, col);
        var na = va === "" || va == null, nb = vb === "" || vb == null;
        if (na && nb) return 0;
        if (na) return 1;
        if (nb) return -1;
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
        return String(va).localeCompare(String(vb), "de") * dir;
      });
    }
    filtered = out;
  }
  function sortVal(item, key) {
    var col = COLUMNS.filter(function (c) { return c.key === key; })[0];
    var v = col ? colValue(item, col) : getVal(item, key);
    if (isRange(v)) return asNum(v.min);
    var n = asNum(v);
    if (n != null && (typeof v === "number" || (col && (col.kind === "num" || col.kind === "eur")))) return n;
    if (v == null) return "";
    if (typeof v === "boolean") return v ? 1 : 0;
    return String(v).toLowerCase();
  }
  function matchColFilters(item) {
    var keys = Object.keys(state.colFilters);
    for (var i = 0; i < keys.length; i++) {
      var f = String(state.colFilters[keys[i]] || "").trim();
      if (!f) continue;
      var col = COLUMNS.filter(function (c) { return c.key === keys[i]; })[0];
      var v = col ? colValue(item, col) : getVal(item, keys[i]);
      var sv = sortVal(item, keys[i]);
      var fl = f.toLowerCase();
      if (fl.charAt(0) === ">" || fl.charAt(0) === "<" || fl.charAt(0) === "=") {
        var m = fl.match(/^(<=|>=|<|>|=)\s*(\d+(?:[.,]\d+)?)/);
        if (m) {
          var num = parseFloat(m[2].replace(",", "."));
          if (typeof sv !== "number" || !cmp(sv, m[1], num)) return false;
          continue;
        }
      }
      var shown = v == null ? "" : (isRange(v) ? (v.min + " " + v.max) : String(v));
      if (fold(shown).indexOf(fold(f)) === -1) return false;
    }
    return true;
  }
  function visibleCols() {
    var alt = state.status.alt;
    var hidden = {};
    (state.hiddenGroups || []).forEach(function (g) { hidden[g] = true; });
    return COLUMNS.filter(function (c) {
      if (c.whenAlt && !alt) return false;
      if (c.identity) return true;
      if (!c.group) return true;
      return !hidden[c.group];
    });
  }

  function displayCell(col, item) {
    if (col.kind === "pin") {
      var on = state.pins.indexOf(item.id) !== -1;
      return '<input type="checkbox" data-pin="' + esc(item.id) + '" ' + (on ? "checked" : "") + ' aria-label="Merken: ' + esc(item.modell) + '">';
    }
    if (col.kind === "wish") {
      var w = item.user_wish == null ? "" : item.user_wish;
      return '<input class="wish" type="number" min="1" max="10" inputmode="numeric" data-wish="' + esc(item.id) + '" value="' + esc(w) + '" aria-label="Präferenz 1 bis 10">';
    }
    var v = colValue(item, col);
    if (col.kind === "status") {
      var st = item.status || "aktuell";
      return '<span class="badge' + (st === "aktuell" ? "" : " alt") + '">' + esc(st) + "</span>";
    }
    if (col.kind === "bool") {
      if (v == null || v === "") return '<span class="muted">-</span>';
      if (v === "Option") return "Option";
      return truthy(v) ? '<span class="bool-y">Ja</span>' : '<span class="bool-n">Nein</span>';
    }
    if (col.kind === "link") {
      if (v == null || v === "" || !isSafeUrl(v)) return '<span class="muted">-</span>';
      var safe = esc(v);
      var txt = col.key === "bild_url" ? "Bild" : "Seite";
      return '<a class="cell-link" href="' + safe + '" target="_blank" rel="noopener noreferrer" title="' + safe + '">' + txt + '</a>';
    }
    if (col.kind === "eur") {
      var n = pickNum(v, "min");
      return n == null ? '<span class="muted">-</span>' : fmtNum(n, 0) + " €";
    }
    if (col.kind === "range") {
      if (isRange(v)) return fmtNum(v.min) + "-" + fmtNum(v.max);
      if (v == null || v === "") return '<span class="muted">-</span>';
      return esc(String(v));
    }
    if (v == null || v === "") return '<span class="muted">-</span>';
    if (typeof v === "number") return fmtNum(v, Math.abs(v) >= 100 ? 0 : 1);
    if (Array.isArray(v)) return esc(v.join(", "));
    return esc(String(v));
  }
  function hitClass(item, col) {
    var hits = hitsById[item.id] || [];
    if (!hits.length) return "";
    var keys = [col.key, col.path];
    if (col.key.indexOf("verbrauch.wltp_reichweite_km") === 0) keys.push("verbrauch.wltp_reichweite_km");
    for (var i = 0; i < hits.length; i++) {
      if (keys.indexOf(hits[i]) !== -1) return " hit";
      if (col.key === hits[i] || (hits[i] && col.key.indexOf(hits[i]) === 0)) return " hit";
    }
    return "";
  }
  function renderHeader() {
    var cols = visibleCols();
    var html = "<tr>";
    cols.forEach(function (c) {
      var sticky = c.sticky != null ? " s" + c.sticky : "";
      var sorted = state.sortCol === c.key ? " sorted" : "";
      var arrow = state.sortCol === c.key ? (state.sortDir === "desc" ? "▾" : "▴") : "▴";
      html += '<th class="' + sticky + sorted + '" data-sort="' + esc(c.key) + '" scope="col">';
      html += esc(c.label);
      if (c.kind !== "pin") html += '<span class="sort">' + arrow + "</span>";
      if (c.kind !== "pin" && c.kind !== "wish") {
        var fv = state.colFilters[c.key] || "";
        html += '<input class="col-filter" data-cf="' + esc(c.key) + '" placeholder="Spaltenfilter" value="' + esc(fv) + '" aria-label="Spaltenfilter ' + esc(c.label) + '">';
      }
      html += "</th>";
    });
    html += "</tr>";
    $("grid").tHead.innerHTML = html;
    $("grid").classList.toggle("show-cf", !!state.showColFilters);
  }
  function renderBody() {
    var cols = visibleCols();
    var tb = $("grid").tBodies[0];
    if (!filtered.length) {
      tb.innerHTML = "";
      $("empty").hidden = false;
      return;
    }
    $("empty").hidden = true;
    var html = "";
    filtered.forEach(function (item) {
      var cls = [];
      if (state.pins.indexOf(item.id) !== -1) cls.push("pinned");
      if (state.openId === item.id) cls.push("open");
      if (!isCurrent(item)) cls.push("alt");
      html += '<tr class="' + cls.join(" ") + '" data-id="' + esc(item.id) + '" tabindex="0">';
      cols.forEach(function (c) {
        var sticky = c.sticky != null ? " s" + c.sticky : "";
        var extra = c.key === "modell" ? " modell" : "";
        if (c.kind === "pin") extra += " pin";
        extra += hitClass(item, c);
        html += '<td class="' + (sticky + extra).trim() + '">' + displayCell(c, item) + "</td>";
      });
      html += "</tr>";
    });
    tb.innerHTML = html;
  }
  function filtersActive() {
    if (state.q && state.q.trim()) return true;
    if (!state.classes.pkw || !state.classes.camper || !state.classes.nutz) return true;
    if (!state.status.aktuell || !state.status.alt) return true;
    if (RANGE_DEFS.some(function (d) { return !rangeAtFull(d.key); })) return true;
    if ((state.marken && state.marken.length) || (state.segments && state.segments.length) ||
        (state.drives && state.drives.length) || (state.chemie && state.chemie.length)) return true;
    var tog = state.tog || {};
    for (var k in tog) { if (tog[k]) return true; }
    var cf = state.colFilters || {};
    for (var c in cf) { if (String(cf[c] || "").trim()) return true; }
    return false;
  }
  function renderCount() {
    var txt = "<strong>" + filtered.length + "</strong> von " + data.length;
    if (filtersActive()) txt += " (gefiltert)";
    $("matchCount").innerHTML = txt;
  }
  function renderFoot() {
    var stand = meta.daten_stand || "";
    var akt = meta.letzte_aktualisierung;
    var aktTxt = "";
    if (akt) {
      var dt = new Date(akt + (String(akt).indexOf("T") === -1 ? "T00:00:00" : ""));
      if (!isNaN(dt.getTime())) aktTxt = dt.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
      else aktTxt = String(akt);
    }
    var extra = "";
    if (meta.source === "fallback") extra = " Eingebettete Notdaten - data.json wurde nicht geladen.";
    else if (meta.source === "import") extra = " Angezeigte Daten stammen aus einem lokalen Import (nur in diesem Browser).";
    $("foot").textContent =
      "Eigenständige Vergleichsansicht, unabhängig aufgebaut. Datenstand: " +
      (stand || "unbekannt") +
      (aktTxt ? " (aktualisiert " + aktTxt + ")" : "") +
      ". Datenstruktur angelehnt an eine öffentliche Tabelle." + extra;
  }
  function renderToolbar() {
    var html = '<span class="lab">Rubriken</span>';
    var allOn = (state.hiddenGroups || []).length === 0;
    html += '<button type="button" class="gchip' + (allOn ? " active" : "") + '" data-group="__all__" aria-pressed="' + allOn + '">Alle</button>';
    GROUPS.forEach(function (g) {
      var on = (state.hiddenGroups || []).indexOf(g) === -1;
      html += '<button type="button" class="gchip' + (on ? " active" : "") + '" data-group="' + esc(g) + '" aria-pressed="' + on + '">' + esc(g) + "</button>";
    });
    html += '<span class="spacer"></span>';
    html += '<button type="button" class="ghost" id="btnColF" aria-pressed="' + !!state.showColFilters + '">Spaltenfilter</button>';
    html += '<button type="button" class="ghost" id="btnCsv">CSV</button>';
    html += '<button type="button" class="ghost" id="btnJson">JSON</button>';
    html += '<label class="ghost" style="display:inline-flex;align-items:center;cursor:pointer;">Import<input type="file" id="fileIn" accept="application/json,.json" hidden></label>';
    $("toolbar").innerHTML = html;
  }

  function uniqueSorted(arr) {
    return arr.filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort(function (a, b) { return String(a).localeCompare(String(b), "de"); });
  }
  function countsFor(fn) {
    var c = {};
    classPool().forEach(function (d) {
      var k = fn(d);
      if (!k) return;
      c[k] = (c[k] || 0) + 1;
    });
    return c;
  }
  function renderPicks() {
    var specs = [
      { key: "marken", label: "Marke", counts: countsFor(function (d) { return d.marke; }) },
      { key: "segments", label: "Segment", counts: countsFor(function (d) { return d.autotyp; }) },
      { key: "drives", label: "Antrieb", counts: countsFor(function (d) { return driveKind(d); }) },
      { key: "chemie", label: "Batteriechemie", counts: countsFor(function (d) { return getVal(d, "batterie.chemie"); }) }
    ];
    var open = {};
    $("picks").querySelectorAll(".pick.open").forEach(function (el) { open[el.getAttribute("data-pick")] = true; });
    var html = "";
    specs.forEach(function (sp) {
      var sel = state[sp.key] || [];
      var n = sel.length;
      html += '<div class="pick' + (open[sp.key] ? " open" : "") + '" data-pick="' + sp.key + '">';
      html += '<button type="button" class="pick-toggle" aria-expanded="' + !!open[sp.key] + '"><span>' + esc(sp.label) + '</span><span class="n">' + (n ? n + " gewählt" : "alle") + "</span></button>";
      html += '<div class="pick-body">';
      html += '<input type="search" placeholder="' + esc(sp.label) + ' suchen" data-pick-q="' + sp.key + '" aria-label="' + esc(sp.label) + ' suchen">';
      html += '<div class="pick-list">';
      uniqueSorted(Object.keys(sp.counts)).forEach(function (val) {
        var ck = sel.length && sel.indexOf(val) !== -1;
        html += '<label><input type="checkbox" data-pick-val="' + esc(sp.key) + '" value="' + esc(val) + '"' + (ck ? " checked" : "") + "><span>" + esc(val) + '</span><span class="cnt">' + sp.counts[val] + "</span></label>";
      });
      html += "</div>";
      html += '<div class="pick-actions"><button type="button" class="ms-action" data-pick-all="' + sp.key + '">Alle</button><button type="button" class="ms-action" data-pick-none="' + sp.key + '">Keine</button></div>';
      html += "</div></div>";
    });
    $("picks").innerHTML = html;
  }
  function renderToggles() {
    $("toggles").innerHTML = TOGGLES.map(function (t) {
      return '<label class="toggle"><input type="checkbox" data-tog="' + t.key + '"' + (state.tog[t.key] ? " checked" : "") + "> " + esc(t.label) + "</label>";
    }).join("");
  }
  function renderClassStatus() {
    document.querySelectorAll("[data-class]").forEach(function (b) {
      b.setAttribute("aria-pressed", !!state.classes[b.getAttribute("data-class")]);
    });
    document.querySelectorAll("[data-st]").forEach(function (b) {
      b.setAttribute("aria-pressed", !!state.status[b.getAttribute("data-st")]);
    });
  }
  function sliderPct(key, val) {
    var e = extents[key];
    if (!e || e.max === e.min) return 0;
    return ((val - e.min) / (e.max - e.min)) * 100;
  }
  function renderRanges() {
    var html = "";
    RANGE_DEFS.forEach(function (def) {
      var e = extents[def.key];
      var r = state.range[def.key] || [e.min, e.max];
      var step = def.step;
      html += '<div class="range" data-range="' + def.key + '">';
      html += '<div class="range-head"><span class="label">' + esc(def.label) + '</span><span class="range-nums">';
      html += '<input type="number" data-rn="min" step="' + step + '" min="' + e.min + '" max="' + e.max + '" value="' + r[0] + '" aria-label="' + esc(def.label) + ' von">';
      html += "<span>-</span>";
      html += '<input type="number" data-rn="max" step="' + step + '" min="' + e.min + '" max="' + e.max + '" value="' + r[1] + '" aria-label="' + esc(def.label) + ' bis">';
      html += "<span>" + esc(def.unit) + "</span></span></div>";
      html += '<div class="dual">';
      html += '<div class="track"></div><div class="fill" style="left:' + sliderPct(def.key, r[0]) + "%;width:" + (sliderPct(def.key, r[1]) - sliderPct(def.key, r[0])) + '%"></div>';
      html += '<input type="range" data-rs="min" min="' + e.min + '" max="' + e.max + '" step="' + step + '" value="' + r[0] + '" aria-label="' + esc(def.label) + ' untere Grenze">';
      html += '<input type="range" data-rs="max" min="' + e.min + '" max="' + e.max + '" step="' + step + '" value="' + r[1] + '" aria-label="' + esc(def.label) + ' obere Grenze">';
      html += "</div></div>";
    });
    $("ranges").innerHTML = html;
  }
  function updateRangeFill(el) {
    var key = el.getAttribute("data-range");
    var r = state.range[key];
    var fill = el.querySelector(".fill");
    if (!fill || !r) return;
    var a = sliderPct(key, r[0]), b = sliderPct(key, r[1]);
    fill.style.left = a + "%";
    fill.style.width = Math.max(0, b - a) + "%";
  }
  function setRange(key, lo, hi, fromSlider) {
    var e = extents[key];
    lo = Number(lo); hi = Number(hi);
    if (isNaN(lo)) lo = e.min;
    if (isNaN(hi)) hi = e.max;
    if (lo > hi) { var t = lo; lo = hi; hi = t; }
    lo = Math.max(e.min, Math.min(e.max, lo));
    hi = Math.max(e.min, Math.min(e.max, hi));
    state.range[key] = [lo, hi];
    var box = document.querySelector('.range[data-range="' + key + '"]');
    if (box) {
      box.querySelector('[data-rn="min"]').value = lo;
      box.querySelector('[data-rn="max"]').value = hi;
      if (!fromSlider) {
        box.querySelector('[data-rs="min"]').value = lo;
        box.querySelector('[data-rs="max"]').value = hi;
      }
      updateRangeFill(box);
    }
    applyAll({ skipChrome: true });
  }

  function renderCompare() {
    var box = $("compare");
    var pins = state.pins.map(function (id) { return data.filter(function (d) { return d.id === id; })[0]; }).filter(Boolean);
    if (!pins.length) { box.hidden = true; box.innerHTML = ""; return; }
    box.hidden = false;
    var head = '<div class="compare-head"><h3>' + pins.length + (pins.length === 1 ? " gemerkt" : " im Vergleich") + "</h3>";
    head += '<label class="toggle" style="border:0;padding:0;"><input type="checkbox" id="diffOnly"' + (state.compareDiffOnly ? " checked" : "") + "> nur Unterschiede</label></div>";
    if (pins.length === 1) {
      box.innerHTML = head + '<p class="muted" style="margin:0.2rem 0 0;font-size:0.8rem">Noch ein bis drei weitere merken, dann stehen die Felder nebeneinander.</p>';
      return;
    }
    var cols = visibleCols().concat(COMPARE_KEYS.map(function (k) {
      return COLUMNS.filter(function (c) { return c.key === k; })[0] || { key: k, label: k };
    }));
    var seen = {}, fields = [];
    cols.forEach(function (c) {
      if (!c || c.kind === "pin" || c.kind === "wish" || seen[c.key]) return;
      seen[c.key] = true;
      fields.push(c);
    });
    function canon(c, item) {
      var v = colValue(item, c);
      if (isRange(v)) return String(v.min) + ".." + String(v.max);
      if (v == null) return "";
      return String(v);
    }
    var html = head + "<table><thead><tr><th>Feld</th>";
    pins.forEach(function (car) {
      html += "<th>" + esc(car.marke) + "<br>" + esc(car.modell) + ' <button type="button" class="unpin" data-unpin="' + esc(car.id) + '">lösen</button></th>';
    });
    html += "</tr></thead><tbody>";
    fields.forEach(function (c) {
      var vals = pins.map(function (car) { return canon(c, car); });
      var differ = vals.some(function (v) { return v !== vals[0]; });
      if (state.compareDiffOnly && !differ) return;
      html += '<tr class="' + (differ ? "diff" : "same") + '"><th scope="row">' + esc(c.label || c.key) + "</th>";
      pins.forEach(function (car) {
        html += '<td class="' + (differ ? "diff" : "same") + '">' + displayCell(c, car) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    box.innerHTML = html;
  }

  function fmtDetailVal(v) {
    if (v == null || v === "") return "-";
    if (typeof v === "boolean") return v ? "Ja" : "Nein";
    if (isRange(v)) return fmtNum(v.min) + " - " + fmtNum(v.max);
    if (typeof v === "number") return fmtNum(v, Math.abs(v) >= 100 ? 0 : 1);
    if (Array.isArray(v)) return v.join(", ");
    return String(v);
  }
  function openDetail(id) {
    var item = data.filter(function (d) { return d.id === id; })[0];
    if (!item) return;
    lastFocus = document.activeElement;
    state.openId = id;
    var groups = [
      { t: "Überblick", rows: [
        ["Marke", item.marke], ["Modell", item.modell], ["Segment", item.autotyp],
        ["Status", item.status || "aktuell"], ["Modelljahr", item.modelljahr], ["Plattform", item.plattform],
        ["Preis", item.preis && item.preis.basispreis_eur != null ? fmtNum(item.preis.basispreis_eur, 0) + " €" : null],
        ["Produktionsland", item.produktionsland]
      ]},
      { t: "Antrieb und Leistung", rows: [
        ["Antrieb", getVal(item, "antrieb.konzept")],
        ["Leistung", getVal(item, "leistung.systemleistung_kw") != null ? fmtNum(getVal(item, "leistung.systemleistung_kw"), 0) + " kW / " + fmtNum(getVal(item, "leistung.systemleistung_ps"), 0) + " PS" : null],
        ["Drehmoment", getVal(item, "leistung.drehmoment_nm") != null ? fmtNum(getVal(item, "leistung.drehmoment_nm"), 0) + " Nm" : null],
        ["0-100", getVal(item, "leistung.beschleunigung_0_100_s") != null ? fmtNum(getVal(item, "leistung.beschleunigung_0_100_s")) + " s" : null],
        ["Vmax", getVal(item, "leistung.hoechstgeschwindigkeit_kmh")]
      ]},
      { t: "Batterie und Laden", rows: [
        ["Netto", getVal(item, "batterie.netto_kwh") != null ? fmtNum(getVal(item, "batterie.netto_kwh")) + " kWh" : null],
        ["Chemie", getVal(item, "batterie.chemie")],
        ["Spannung", getVal(item, "batterie.systemspannung_v") != null ? fmtNum(getVal(item, "batterie.systemspannung_v"), 0) + " V" : null],
        ["DC max", getVal(item, "laden.dc_max_kw") != null ? fmtNum(getVal(item, "laden.dc_max_kw"), 0) + " kW" : null],
        ["10-80 %", getVal(item, "laden.dc_10_80_min") != null ? fmtNum(getVal(item, "laden.dc_10_80_min"), 0) + " min" : null],
        ["AC Serie", getVal(item, "laden.ac_serie_kw") != null ? fmtNum(getVal(item, "laden.ac_serie_kw")) + " kW" : null],
        ["AC optional", getVal(item, "laden.ac_optional_kw")],
        ["V2L", fmtDetailVal(getVal(item, "laden.v2l"))],
        ["Plug & Charge", fmtDetailVal(getVal(item, "laden.plug_and_charge"))],
        ["Wärmepumpe", fmtDetailVal(getVal(item, "fahrwerk.waermepumpe"))]
      ]},
      { t: "Reichweite", rows: [
        ["WLTP", fmtDetailVal(getVal(item, "verbrauch.wltp_reichweite_km")) + " km"],
        ["Winter", getVal(item, "verbrauch.realreichweite_winter_km")],
        ["Autobahn 130", getVal(item, "verbrauch.realreichweite_autobahn_130_km")]
      ]},
      { t: "Maße und Sicherheit", rows: [
        ["Länge", getVal(item, "abmessungen.laenge_mm")],
        ["Sitze", getVal(item, "abmessungen.sitze")],
        ["Kofferraum", getVal(item, "abmessungen.kofferraum_liter")],
        ["Frunk", fmtDetailVal(getVal(item, "abmessungen.frunk"))],
        ["Euro NCAP", getVal(item, "euro_ncap.sterne") != null ? getVal(item, "euro_ncap.sterne") + " Sterne" : null],
        ["ADAC", getVal(item, "adac_note")]
      ]}
    ];
    var html = '<header><div><p class="kicker">Steckbrief</p><h2 id="sheetTitle">' + esc(item.modell) + '</h2><p class="sub">' + esc(item.marke) + " · " + esc(item.autotyp || "") + "</p></div>";
    html += '<button type="button" class="iconbtn" id="sheetClose">Schließen</button></header>';
    groups.forEach(function (g) {
      html += "<h3>" + esc(g.t) + "</h3><dl>";
      g.rows.forEach(function (row) {
        if (row[1] == null || row[1] === "" || row[1] === "-") return;
        html += "<dt>" + esc(row[0]) + "</dt><dd>" + esc(String(row[1])) + "</dd>";
      });
      html += "</dl>";
    });
    if (item.bemerkung) html += "<h3>Bemerkung</h3><p>" + esc(item.bemerkung) + "</p>";
    if (item.hinweis) html += "<h3>Hinweis</h3><p>" + esc(item.hinweis) + "</p>";
    if (item.eingestellt_grund) html += "<h3>Einstellgrund</h3><p>" + esc(item.eingestellt_grund) + "</p>";
    if (item.produkt_url && isSafeUrl(item.produkt_url)) {
      html += '<p><a href="' + esc(item.produkt_url) + '" target="_blank" rel="noopener noreferrer">Herstellerseite</a></p>';
    }
    var sheet = $("sheet");
    sheet.innerHTML = html;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add("open"); });
    $("scrim").hidden = false;
    $("scrim").classList.add("show");
    var btn = $("sheetClose");
    if (btn) btn.focus();
    renderBody();
  }
  function closeDetail() {
    var sheet = $("sheet");
    sheet.classList.remove("open");
    $("scrim").classList.remove("show");
    setTimeout(function () {
      if (!sheet.classList.contains("open")) {
        sheet.hidden = true;
        if (!$("rail").classList.contains("open")) $("scrim").hidden = true;
      }
    }, 220);
    state.openId = null;
    renderBody();
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }
  function isNarrow() {
    return window.matchMedia && window.matchMedia("(max-width: 860px)").matches;
  }
  function setRail(on) {
    $("rail").classList.toggle("open", !!on);
    $("work").classList.toggle("filters-off", !on);
    $("filterBtn").setAttribute("aria-expanded", on ? "true" : "false");
    if (on && isNarrow()) {
      $("scrim").hidden = false;
      $("scrim").classList.add("show");
    } else if (!$("sheet").classList.contains("open")) {
      $("scrim").classList.remove("show");
      $("scrim").hidden = true;
    }
    try { localStorage.setItem(LS + "filters", on ? "on" : "off"); } catch (e) {}
  }
  function openRail() { setRail(true); }
  function closeRail() { setRail(false); }
  function initFilters() {
    var v = null;
    try { v = localStorage.getItem(LS + "filters"); } catch (e) {}
    if (v === "on") setRail(true);
    else if (v === "off") setRail(false);
    else setRail(!isNarrow());
  }

  function applyAll(opts) {
    applyFilters();
    renderHeader();
    renderBody();
    renderCount();
    renderCompare();
    if (!opts || !opts.skipChrome) renderClassStatus();
    if (!opts || opts.hash !== false) writeHash();
    schedulePersist();
  }
  function serialState() {
    return {
      q: state.q, classes: state.classes, status: state.status, range: state.range,
      marken: state.marken, segments: state.segments, drives: state.drives, chemie: state.chemie,
      tog: state.tog, hiddenGroups: state.hiddenGroups, pins: state.pins,
      sortCol: state.sortCol, sortDir: state.sortDir, colFilters: state.colFilters,
      showColFilters: state.showColFilters, compareDiffOnly: state.compareDiffOnly,
      dataStamp: meta.letzte_aktualisierung
    };
  }
  function schedulePersist() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(function () {
      lsSet("state", serialState());
      var wish = {};
      data.forEach(function (d) {
        if (d.user_wish != null && d.user_wish !== "") wish[d.id] = d.user_wish;
      });
      lsSet("wish", wish);
    }, 120);
  }
  function writeHash() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    var cls = Object.keys(state.classes).filter(function (k) { return state.classes[k]; });
    if (!(cls.length === 1 && cls[0] === "pkw")) p.set("cls", cls.join(","));
    var st = [];
    if (state.status.aktuell) st.push("aktuell");
    if (state.status.alt) st.push("alt");
    if (!(st.length === 1 && st[0] === "aktuell")) p.set("st", st.join(","));
    RANGE_DEFS.forEach(function (d) {
      if (!rangeAtFull(d.key)) p.set(d.key, state.range[d.key][0] + "-" + state.range[d.key][1]);
    });
    if (state.marken.length) p.set("mk", state.marken.join("|"));
    if (state.segments.length) p.set("sg", state.segments.join("|"));
    if (state.drives.length) p.set("dr", state.drives.join(","));
    if (state.chemie.length) p.set("ch", state.chemie.join("|"));
    var t = Object.keys(state.tog).filter(function (k) { return state.tog[k]; });
    if (t.length) p.set("t", t.join(","));
    var s = p.toString();
    var cur = location.hash.replace(/^#/, "");
    if (cur !== s) {
      if (s) history.replaceState(null, "", location.pathname + location.search + "#" + s);
      else if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    }
  }
  function readHash() {
    var raw = location.hash.replace(/^#/, "");
    if (!raw) return false;
    var p = new URLSearchParams(raw);
    if (p.has("q")) state.q = p.get("q");
    if (p.has("cls")) {
      var set = (p.get("cls") || "").split(",").filter(Boolean);
      state.classes = { pkw: set.indexOf("pkw") !== -1, camper: set.indexOf("camper") !== -1, nutz: set.indexOf("nutz") !== -1 };
    }
    if (p.has("st")) {
      var st = (p.get("st") || "").split(",");
      state.status = { aktuell: st.indexOf("aktuell") !== -1, alt: st.indexOf("alt") !== -1 };
    }
    RANGE_DEFS.forEach(function (d) {
      if (!p.has(d.key)) return;
      var parts = String(p.get(d.key)).split("-");
      if (parts.length >= 2) state.range[d.key] = [parseFloat(parts[0]), parseFloat(parts[1])];
    });
    if (p.has("mk")) state.marken = p.get("mk").split("|").filter(Boolean);
    if (p.has("sg")) state.segments = p.get("sg").split("|").filter(Boolean);
    if (p.has("dr")) state.drives = p.get("dr").split(",").filter(Boolean);
    if (p.has("ch")) state.chemie = p.get("ch").split("|").filter(Boolean);
    if (p.has("t")) {
      var tog = p.get("t").split(",");
      Object.keys(state.tog).forEach(function (k) { state.tog[k] = tog.indexOf(k) !== -1; });
    }
    return true;
  }
  function restoreLS() {
    var saved = lsGet("state", null);
    if (!saved) return;
    ["q", "classes", "status", "range", "marken", "segments", "drives", "chemie", "tog", "pins", "sortCol", "sortDir", "colFilters", "showColFilters", "compareDiffOnly"].forEach(function (k) {
      if (saved[k] != null) state[k] = saved[k];
    });
    if (saved.hiddenGroups) state.hiddenGroups = saved.hiddenGroups;
    if (saved.dataStamp !== meta.letzte_aktualisierung) {
      state.range = {};
      state.colFilters = {};
    }
  }
  function applyWish() {
    var wish = lsGet("wish", {});
    data.forEach(function (d) {
      if (wish && wish[d.id] != null) d.user_wish = wish[d.id];
    });
  }
  function resetFilters() {
    var pins = state.pins.slice();
    var groups = state.hiddenGroups.slice();
    state = defaultState();
    state.pins = pins;
    state.hiddenGroups = groups;
    computeExtents();
    ensureRanges(true);
    $("search").value = "";
    renderPicks();
    renderToggles();
    renderRanges();
    renderToolbar();
    applyAll();
  }
  function togglePin(id, on) {
    var i = state.pins.indexOf(id);
    if (on) {
      if (i === -1) {
        if (state.pins.length >= MAX_PINS) state.pins.shift();
        state.pins.push(id);
      }
    } else if (i !== -1) state.pins.splice(i, 1);
    applyAll();
  }
  function setWish(id, val) {
    var item = data.filter(function (d) { return d.id === id; })[0];
    if (!item) return;
    if (val === "" || val == null) item.user_wish = null;
    else {
      var n = parseInt(val, 10);
      item.user_wish = isNaN(n) ? null : Math.max(1, Math.min(10, n));
    }
    schedulePersist();
    if (state.tog.pref) applyAll();
  }

  function exportCSV() {
    var cols = visibleCols().filter(function (c) { return c.kind !== "pin"; });
    var headers = cols.map(function (c) { return c.label || c.key; });
    var rows = [headers.join(";")];
    filtered.forEach(function (d) {
      var cells = cols.map(function (c) {
        var v = colValue(d, c);
        if (c.kind === "bool") return truthy(v) ? "Ja" : (v == null ? "" : "Nein");
        if (c.kind === "eur") {
          var n = pickNum(v, "min");
          return n == null ? "" : String(n).replace(".", ",");
        }
        if (isRange(v)) return String(v.min).replace(".", ",") + "-" + String(v.max).replace(".", ",");
        if (v == null) return "";
        if (typeof v === "number") return String(v).replace(".", ",");
        var s = Array.isArray(v) ? v.join(", ") : String(v);
        if (/[;"\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
        return s;
      });
      rows.push(cells.join(";"));
    });
    downloadBlob("elektroautos.csv", "\uFEFF" + rows.join("\n"), "text/csv;charset=utf-8");
  }
  function exportJSON() {
    var blob = {
      letzte_aktualisierung: meta.letzte_aktualisierung,
      daten_stand: meta.daten_stand,
      fahrzeuge: filtered
    };
    downloadBlob("elektroautos.json", JSON.stringify(blob, null, 2), "application/json;charset=utf-8");
  }
  function downloadBlob(name, text, type) {
    var blob = new Blob([text], { type: type });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }
  function showImport(json) {
    pendingImport = json;
    var n = (json.fahrzeuge || []).length;
    $("importBar").classList.add("show");
    $("importBar").innerHTML = "<span>" + n + " Fahrzeuge in der Datei.</span>" +
      '<button type="button" class="ghost" id="impMerge">Zusammenführen</button>' +
      '<button type="button" class="ghost" id="impReplace">Ersetzen</button>' +
      '<button type="button" class="ghost" id="impCancel">Abbrechen</button>';
  }
  function doImport(mode) {
    if (!pendingImport || !Array.isArray(pendingImport.fahrzeuge)) return;
    var incoming = pendingImport.fahrzeuge;
    if (mode === "replace") data = incoming.slice();
    else {
      var map = {};
      data.forEach(function (d) { map[d.id] = d; });
      incoming.forEach(function (d) { if (d && d.id) map[d.id] = d; });
      data = Object.keys(map).map(function (k) { return map[k]; });
    }
    pendingImport = null;
    $("importBar").classList.remove("show");
    $("importBar").innerHTML = "";
    meta.source = "import";
    applyWish();
    computeExtents();
    ensureRanges(true);
    renderPicks();
    renderRanges();
    renderToggles();
    renderFoot();
    applyAll();
    $("notice").hidden = false;
    $("notice").textContent = "Import nur in diesem Browser - data.json auf der Seite bleibt unverändert.";
  }

  function bind() {
    $("search").addEventListener("input", function () {
      var v = $("search").value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { state.q = v; applyAll(); }, 80);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== $("search") && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        $("search").focus();
      }
      if (e.key === "Escape") {
        if ($("sheet").classList.contains("open")) closeDetail();
        else if ($("rail").classList.contains("open")) closeRail();
      }
    });
    $("themeBtn").addEventListener("click", function () {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
    $("filterBtn").addEventListener("click", function () {
      if ($("rail").classList.contains("open")) closeRail(); else openRail();
    });
    $("closeRail").addEventListener("click", closeRail);
    $("scrim").addEventListener("click", function () {
      if ($("sheet").classList.contains("open")) closeDetail();
      else closeRail();
    });
    $("resetBtn").addEventListener("click", resetFilters);
    $("classChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-class]");
      if (!b) return;
      var k = b.getAttribute("data-class");
      state.classes[k] = !state.classes[k];
      computeExtents();
      ensureRanges(true);
      renderRanges();
      renderPicks();
      applyAll();
    });
    $("statusChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-st]");
      if (!b) return;
      state.status[b.getAttribute("data-st")] = !state.status[b.getAttribute("data-st")];
      applyAll();
    });
    $("ranges").addEventListener("input", function (e) {
      var box = e.target.closest(".range");
      if (!box || !e.target.dataset.rs) return;
      setRange(box.getAttribute("data-range"), box.querySelector('[data-rs="min"]').value, box.querySelector('[data-rs="max"]').value, true);
    });
    $("ranges").addEventListener("change", function (e) {
      var box = e.target.closest(".range");
      if (!box || !e.target.dataset.rn) return;
      setRange(box.getAttribute("data-range"), box.querySelector('[data-rn="min"]').value, box.querySelector('[data-rn="max"]').value, false);
    });
    $("picks").addEventListener("click", function (e) {
      var tog = e.target.closest(".pick-toggle");
      if (tog) {
        var pick = tog.closest(".pick");
        pick.classList.toggle("open");
        tog.setAttribute("aria-expanded", pick.classList.contains("open"));
        return;
      }
      if (e.target.dataset.pickAll) { state[e.target.dataset.pickAll] = []; renderPicks(); applyAll(); return; }
      if (e.target.dataset.pickNone) {
        var key = e.target.dataset.pickNone, vals = [];
        e.target.closest(".pick").querySelectorAll("[data-pick-val]").forEach(function (cb) { vals.push(cb.value); });
        state[key] = vals;
        renderPicks();
        applyAll();
      }
    });
    $("picks").addEventListener("change", function (e) {
      if (!e.target.dataset.pickVal) return;
      var key = e.target.dataset.pickVal, val = e.target.value, arr = state[key].slice();
      var i = arr.indexOf(val);
      if (e.target.checked && i === -1) arr.push(val);
      if (!e.target.checked && i !== -1) arr.splice(i, 1);
      state[key] = arr;
      var btn = e.target.closest(".pick").querySelector(".n");
      if (btn) btn.textContent = arr.length ? arr.length + " gewählt" : "alle";
      applyAll();
    });
    $("picks").addEventListener("input", function (e) {
      if (!e.target.dataset.pickQ) return;
      var q = fold(e.target.value);
      e.target.closest(".pick").querySelectorAll(".pick-list label").forEach(function (lab) {
        lab.style.display = !q || fold(lab.textContent).indexOf(q) !== -1 ? "" : "none";
      });
    });
    $("toggles").addEventListener("change", function (e) {
      if (!e.target.dataset.tog) return;
      state.tog[e.target.dataset.tog] = e.target.checked;
      applyAll();
    });
    $("toolbar").addEventListener("click", function (e) {
      var g = e.target.closest("[data-group]");
      if (g) {
        var name = g.getAttribute("data-group");
        if (name === "__all__") {
          if ((state.hiddenGroups || []).length === 0) state.hiddenGroups = GROUPS.slice();
          else state.hiddenGroups = [];
        } else {
          var i = state.hiddenGroups.indexOf(name);
          if (i === -1) state.hiddenGroups.push(name);
          else state.hiddenGroups.splice(i, 1);
        }
        renderToolbar();
        applyAll();
        return;
      }
      if (e.target.id === "btnColF") {
        state.showColFilters = !state.showColFilters;
        renderToolbar();
        $("grid").classList.toggle("show-cf", state.showColFilters);
        schedulePersist();
        return;
      }
      if (e.target.id === "btnCsv") exportCSV();
      if (e.target.id === "btnJson") exportJSON();
    });
    $("toolbar").addEventListener("change", function (e) {
      if (e.target.id !== "fileIn") return;
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        try {
          var json = JSON.parse(ev.target.result);
          if (!json.fahrzeuge || !Array.isArray(json.fahrzeuge)) {
            $("notice").hidden = false;
            $("notice").textContent = "Ungültige Datei: Array fahrzeuge fehlt.";
            return;
          }
          showImport(json);
        } catch (err) {
          $("notice").hidden = false;
          $("notice").textContent = "JSON ließ sich nicht lesen.";
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    });
    $("importBar").addEventListener("click", function (e) {
      if (e.target.id === "impMerge") doImport("merge");
      if (e.target.id === "impReplace") doImport("replace");
      if (e.target.id === "impCancel") {
        pendingImport = null;
        $("importBar").classList.remove("show");
        $("importBar").innerHTML = "";
      }
    });
    $("grid").tHead.addEventListener("click", function (e) {
      if (e.target.classList.contains("col-filter")) return;
      var th = e.target.closest("th[data-sort]");
      if (!th) return;
      var k = th.getAttribute("data-sort");
      if (k === "_pin") return;
      if (state.sortCol === k) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      else { state.sortCol = k; state.sortDir = "asc"; }
      applyAll();
    });
    $("grid").tHead.addEventListener("input", function (e) {
      if (!e.target.dataset.cf) return;
      state.colFilters[e.target.dataset.cf] = e.target.value;
      applyAll({ skipChrome: true });
    });
    $("scroller").addEventListener("change", function (e) {
      if (e.target.dataset.pin) togglePin(e.target.dataset.pin, e.target.checked);
      if (e.target.dataset.wish) setWish(e.target.dataset.wish, e.target.value);
    });
    $("scroller").addEventListener("click", function (e) {
      if (e.target.closest("input,button,a,label")) return;
      var tr = e.target.closest("tbody tr[data-id]");
      if (tr) openDetail(tr.getAttribute("data-id"));
    });
    $("scroller").addEventListener("keydown", function (e) {
      var tr = e.target.closest("tbody tr[data-id]");
      if (tr && e.key === "Enter") openDetail(tr.getAttribute("data-id"));
    });
    $("compare").addEventListener("change", function (e) {
      if (e.target.id === "diffOnly") {
        state.compareDiffOnly = e.target.checked;
        renderCompare();
        schedulePersist();
      }
    });
    $("compare").addEventListener("click", function (e) {
      if (e.target.dataset.unpin) togglePin(e.target.dataset.unpin, false);
    });
    $("sheet").addEventListener("click", function (e) {
      if (e.target.id === "sheetClose") closeDetail();
    });
  }

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("themeBtn").textContent = t === "dark" ? "Hell" : "Dunkel";
    $("themeBtn").setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#060c1a" : "#f0f4ff");
    lsSet("theme", t);
  }
  function initTheme() {
    var t = null;
    try {
      var raw = localStorage.getItem(LS + "theme");
      if (raw) {
        if (raw === "dark" || raw === "light") t = raw;
        else t = JSON.parse(raw);
      }
    } catch (e) {}
    if (t !== "dark" && t !== "light") {
      t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
    }
    applyTheme(t);
  }
  function afterData() {
    applyWish();
    restoreLS();
    var hadHash = readHash();
    $("search").value = state.q;
    computeExtents();
    ensureRanges(!hadHash);
    renderRanges();
    renderPicks();
    renderToggles();
    renderToolbar();
    renderFoot();
    applyAll({ hash: true });
  }
  function boot() {
    initTheme();
    initFilters();
    bind();
    fetch("./data.json")
      .then(function (r) {
        if (!r.ok) throw new Error("status " + r.status);
        return r.json();
      })
      .then(function (json) {
        data = (json.fahrzeuge || []).slice();
        meta.letzte_aktualisierung = json.letzte_aktualisierung || null;
        meta.daten_stand = json.daten_stand || "";
        meta.source = "json";
        afterData();
      })
      .catch(function () {
        data = JSON.parse(JSON.stringify(FALLBACK.fahrzeuge));
        meta.letzte_aktualisierung = FALLBACK.letzte_aktualisierung;
        meta.daten_stand = FALLBACK.daten_stand;
        meta.source = "fallback";
        $("notice").hidden = false;
        $("notice").textContent = "data.json war nicht erreichbar. Zwei Notdatensätze sind eingebettet — bitte über einen lokalen Server öffnen.";
        afterData();
      });
  }
  boot();
})();
