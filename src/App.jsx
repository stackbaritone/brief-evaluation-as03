import { useState } from "react";

const COTES = [
  { value: "", label: "— Sélectionner —" },
  { value: "surpasse", label: "⭐ Surpassé" },
  { value: "reussi_plus", label: "✅ Réussi +" },
  { value: "reussi", label: "✔️ Réussi" },
  { value: "reussi_moins", label: "⚠️ Réussi −" },
  { value: "na_pas_atteint", label: "❌ N'a pas atteint" },
];

const OBJECTIFS = [
  {
    id: "obj1",
    titre: "Service à la clientèle (Niveau I)",
    placeholder: `Ex. :\n- Toujours prête à aider, même sous pression\n- Répond rapidement aux urgences\n- Quelques retards en début d'année, corrigés`,
  },
  {
    id: "obj2",
    titre: "Rendement quantitatif",
    placeholder: `Ex. :\n- ~633 demandes traitées\n- Moyenne ~6/jour\n- Fait du temps sup au besoin`,
  },
  {
    id: "obj3",
    titre: "Rendement qualitatif",
    placeholder: `Ex. :\n- Respecte les règles d'affaires\n- Bonne analyse des domaines\n- Quelques oublis de devis en début d'année`,
  },
];

const COMPETENCES = [
  { id: "comp1", titre: "Intégrité et respect", placeholder: `Ex. :\n- Traite collègues et clients avec égard\n- Respecte les règles de sécurité (Protégé B)` },
  { id: "comp2", titre: "Réflexion approfondie", placeholder: `Ex. :\n- Gère bien les demandes complexes\n- Demande des clarifications avant d'agir` },
  { id: "comp3", titre: "Travailler efficacement avec les autres", placeholder: `Ex. :\n- Bonne collaboration avec l'équipe\n- Prend le relais quand un collègue est absent` },
  { id: "comp4", titre: "Initiative et action", placeholder: `Ex. :\n- Prend les devants pour régler les urgences\n- Propose des solutions` },
];

export default function App() {
  const [form, setForm] = useState({
    genre: "F",
    niveau: "AS-03",
    langue: "FR",
    planTalent: "non",
    planAmelioration: "non",
    coteGlobale: "",
    contextGlobal: "",
    objectifs: Object.fromEntries(OBJECTIFS.map((o) => [o.id, { cote: "", notes: "" }])),
    competences: Object.fromEntries(COMPETENCES.map((c) => [c.id, { cote: "", notes: "" }])),
  });
  const [copied, setCopied] = useState(false);

  const update = (section, id, field, value) =>
    setForm((p) => ({ ...p, [section]: { ...p[section], [id]: { ...p[section][id], [field]: value } } }));

  const pct = (() => {
    let total = 0, done = 0;
    [...OBJECTIFS, ...COMPETENCES].forEach((item) => {
      const section = item.id.startsWith("obj") ? "objectifs" : "competences";
      total += 2;
      if (form[section][item.id].cote) done++;
      if (form[section][item.id].notes.trim()) done++;
    });
    return Math.round((done / total) * 100);
  })();

  const buildBrief = () => {
    let out = `═══════════════════════════════════════════
BRIEF D'ÉVALUATION — ${form.niveau} (ANONYMISÉ)
═══════════════════════════════════════════
Profil : ${form.genre === "F" ? "Employée (F)" : "Employé (M)"} | Niveau : ${form.niveau} | Langue : ${form.langue}
Plan de gestion des talents : ${form.planTalent}
Plan d'amélioration du rendement : ${form.planAmelioration}
Cote globale visée : ${form.coteGlobale || "À déterminer"}

CONTEXTE GÉNÉRAL
${form.contextGlobal || "(aucun)"}

───────────────────────────────────────────
SECTION B — OBJECTIFS DE TRAVAIL
───────────────────────────────────────────`;
    OBJECTIFS.forEach((obj) => {
      const d = form.objectifs[obj.id];
      out += `\n\n▶ ${obj.titre}\nCote : ${d.cote || "Non spécifiée"}\nNotes brutes :\n${d.notes || "(aucune note)"}`;
    });
    out += `\n\n───────────────────────────────────────────
SECTION C — COMPÉTENCES ESSENTIELLES
───────────────────────────────────────────`;
    COMPETENCES.forEach((comp) => {
      const d = form.competences[comp.id];
      out += `\n\n▶ ${comp.titre}\nCote : ${d.cote || "Non spécifiée"}\nNotes brutes :\n${d.notes || "(aucune note)"}`;
    });
    out += `\n\n═══════════════════════════════════════════
INSTRUCTIONS POUR CLAUDE
═══════════════════════════════════════════
À partir de ce brief, rédige les commentaires de gestionnaire pour chaque objectif et chaque compétence essentielle, en français.
- Pronoms : ${form.genre === "F" ? "Elle" : "Il"}
- Ton : professionnel, factuel, bienveillant mais sans flatterie
- Ancré dans des comportements observables (éviter le vague)
- Cohérent entre cote attribuée et commentaire rédigé
- Ne pas inventer de faits non mentionnés dans ce brief
═══════════════════════════════════════════`;
    return out;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildBrief());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const s = {
    wrap: { fontFamily: "'Georgia', serif", background: "#0f1117", minHeight: "100vh", padding: "1.5rem 1rem", color: "#e2e8f0" },
    inner: { maxWidth: 740, margin: "0 auto" },
    card: { background: "#1a1f2e", border: "1px solid #2a3148", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" },
    label: { display: "block", fontSize: "0.68rem", fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", marginBottom: "0.4rem", fontWeight: 600 },
    sel: { width: "100%", background: "#111827", border: "1px solid #334155", borderRadius: 7, padding: "0.5rem 0.75rem", color: "#e2e8f0", fontSize: "0.85rem", fontFamily: "sans-serif", outline: "none" },
    ta: { width: "100%", background: "#0d1117", border: "1px solid #1e293b", borderRadius: 7, padding: "0.6rem 0.75rem", color: "#cbd5e1", fontSize: "0.82rem", fontFamily: "sans-serif", resize: "vertical", lineHeight: 1.6, outline: "none" },
    badge: { background: "#f59e0b", color: "#0f1117", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", padding: "0.2rem 0.55rem", borderRadius: 4, textTransform: "uppercase", fontFamily: "sans-serif" },
    radioBtn: (active) => ({ cursor: "pointer", padding: "0.3rem 0.7rem", borderRadius: 6, border: `1px solid ${active ? "#f59e0b" : "#334155"}`, background: active ? "rgba(245,158,11,0.12)" : "#111827", color: active ? "#fbbf24" : "#94a3b8", fontSize: "0.78rem", fontFamily: "sans-serif", fontWeight: active ? 700 : 400, margin: "0 0.3rem 0.3rem 0" }),
  };

  const RadioGroup = ({ options, value, onChange }) => (
    <div style={{ display: "flex", flexWrap: "wrap", marginTop: "0.2rem" }}>
      {options.map(([v, l]) => (
        <button key={v} style={s.radioBtn(value === v)} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#f59e0b", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "0.4rem" }}>Outil de saisie · Gestion du rendement</div>
          <h1 style={{ fontFamily: "'Georgia', serif", color: "#f1f5f9", fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Brief d'évaluation AS-03</h1>
          <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "0.4rem", fontFamily: "sans-serif" }}>Remplissez en notes brutes — Claude se charge de la rédaction</p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#475569", fontFamily: "sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Complétude</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: pct === 100 ? "#34d399" : "#f59e0b", fontFamily: "sans-serif" }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "#1e293b", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#f59e0b,#fbbf24)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Profil */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #1e293b" }}>
            <span style={s.badge}>Profil</span>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontFamily: "sans-serif" }}>Employé·e (anonymisé·e)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div><div style={s.label}>Genre</div><RadioGroup options={[["F","Elle (F)"],["M","Il (M)"]]} value={form.genre} onChange={v=>setForm(p=>({...p,genre:v}))} /></div>
            <div><div style={s.label}>Niveau</div><RadioGroup options={[["AS-02","AS-02"],["AS-03","AS-03"],["AS-04","AS-04"]]} value={form.niveau} onChange={v=>setForm(p=>({...p,niveau:v}))} /></div>
            <div><div style={s.label}>Langue</div><RadioGroup options={[["FR","Français"],["EN","English"]]} value={form.langue} onChange={v=>setForm(p=>({...p,langue:v}))} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div><div style={s.label}>Cote globale visée</div><select style={s.sel} value={form.coteGlobale} onChange={e=>setForm(p=>({...p,coteGlobale:e.target.value}))}>{COTES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            <div><div style={s.label}>Plan de talents</div><RadioGroup options={[["oui","Oui"],["non","Non"]]} value={form.planTalent} onChange={v=>setForm(p=>({...p,planTalent:v}))} /></div>
            <div><div style={s.label}>Plan d'amélioration</div><RadioGroup options={[["oui","Oui"],["non","Non"]]} value={form.planAmelioration} onChange={v=>setForm(p=>({...p,planAmelioration:v}))} /></div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div style={s.label}>Contexte général de l'année (optionnel)</div>
            <textarea style={s.ta} rows={3} placeholder="Ex. : Transition vers nouveau système mi-année, forte pression en fin d'exercice, ressources réduites au Q3..." value={form.contextGlobal} onChange={e=>setForm(p=>({...p,contextGlobal:e.target.value}))} />
          </div>
        </div>

        {/* Objectifs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "1.25rem 0 0.6rem" }}>
          <span style={s.badge}>Section B</span>
          <span style={{ color: "#94a3b8", fontFamily: "sans-serif", fontSize: "0.9rem" }}>Objectifs de travail</span>
        </div>
        {OBJECTIFS.map((obj, i) => (
          <div style={s.card} key={obj.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.9rem" }}>
              <span style={{ ...s.badge, background: "transparent", border: "1px solid #334155", color: "#f59e0b" }}>B{i+1}</span>
              <span style={{ color: "#e2e8f0", fontFamily: "'Georgia', serif", fontSize: "0.95rem" }}>{obj.titre}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "1rem" }}>
              <div><div style={s.label}>Cote</div><select style={s.sel} value={form.objectifs[obj.id].cote} onChange={e=>update("objectifs",obj.id,"cote",e.target.value)}>{COTES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              <div><div style={s.label}>Notes brutes / faits saillants</div><textarea style={s.ta} rows={5} placeholder={obj.placeholder} value={form.objectifs[obj.id].notes} onChange={e=>update("objectifs",obj.id,"notes",e.target.value)} /></div>
            </div>
          </div>
        ))}

        {/* Compétences */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "1.25rem 0 0.6rem" }}>
          <span style={s.badge}>Section C</span>
          <span style={{ color: "#94a3b8", fontFamily: "sans-serif", fontSize: "0.9rem" }}>Compétences essentielles</span>
        </div>
        {COMPETENCES.map((comp, i) => (
          <div style={s.card} key={comp.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.9rem" }}>
              <span style={{ ...s.badge, background: "transparent", border: "1px solid #334155", color: "#94a3b8" }}>C{i+1}</span>
              <span style={{ color: "#e2e8f0", fontFamily: "'Georgia', serif", fontSize: "0.95rem" }}>{comp.titre}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "1rem" }}>
              <div><div style={s.label}>Cote</div><select style={s.sel} value={form.competences[comp.id].cote} onChange={e=>update("competences",comp.id,"cote",e.target.value)}>{COTES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              <div><div style={s.label}>Comportements observés</div><textarea style={s.ta} rows={4} placeholder={comp.placeholder} value={form.competences[comp.id].notes} onChange={e=>update("competences",comp.id,"notes",e.target.value)} /></div>
            </div>
          </div>
        ))}

        {/* Bouton */}
        <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
          <button onClick={handleCopy} style={{ width: "100%", padding: "0.9rem", borderRadius: 10, border: "none", fontFamily: "sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer", background: copied ? "#059669" : "linear-gradient(135deg,#f59e0b,#d97706)", color: copied ? "white" : "#0f1117", transition: "all 0.2s" }}>
            {copied ? "✓ Brief copié — colle-le dans une nouvelle conversation Claude" : "📋 Générer et copier le brief pour Claude"}
          </button>
          <p style={{ textAlign: "center", color: "#334155", fontSize: "0.7rem", marginTop: "0.5rem", fontFamily: "sans-serif" }}>Le brief compilé contient tes notes + les instructions de rédaction pour Claude</p>
        </div>
      </div>
    </div>
  );
}
