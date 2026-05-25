import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Home, Target, MessageSquare, User, TrendingUp, DollarSign, CreditCard, BookOpen, Settings, LogOut, Plus, Search, Shield, AlertCircle, CheckCircle, X, Trash2, BarChart2, FileText, Eye, EyeOff, Calendar, Wallet, Bell, ArrowUpRight, ArrowDownRight, Star, TrendingDown, Award, RefreshCw, Download, Percent, Edit2, ChevronDown, ChevronUp, ChevronRight, Zap, AlertTriangle, Menu, Sun, Moon, Lock } from "lucide-react";

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const storage = {
  get: (key, fallback = null) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
const fmt = (d) => { if (!d) return ""; try { return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }); } catch { return d; } };
const fmtShort = (d) => { if (!d) return ""; try { return new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); } catch { return d; } };
const today = () => new Date().toISOString().split("T")[0];
const nowTs = () => Date.now();

// ─── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg:"#090909", bg2:"#0F0F0F", card:"#141414", card2:"#1C1C1C", card3:"#232323",
  border:"#222", border2:"#2E2E2E", text:"#FFFFFF", text2:"#9A9A9A", text3:"#444",
  red:"#E5041C", green:"#22C55E", yellow:"#F59E0B", blue:"#3B82F6",
  purple:"#8B5CF6", teal:"#14B8A6", orange:"#F97316", pink:"#EC4899",
};
const LIGHT = {
  bg:"#F8F9FA", bg2:"#FFFFFF", card:"#FFFFFF", card2:"#F1F3F5", card3:"#E9ECEF",
  border:"#DEE2E6", border2:"#CED4DA", text:"#1A1A2E", text2:"#6C757D", text3:"#ADB5BD",
  red:"#E5041C", green:"#16A34A", yellow:"#D97706", blue:"#2563EB",
  purple:"#7C3AED", teal:"#0F766E", orange:"#EA580C", pink:"#DB2777",
};

// ─── APP CONTEXT ──────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

const ADMIN_EMAIL = "admin@dayebudget.com";
const ADMIN_PASS = "Admin123!";

function AppProvider({ children }) {
  const [dark, setDark] = useState(() => storage.get("theme", true));
  const C = dark ? DARK : LIGHT;
  const FONT = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const HEAD = "'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  // AUTH
  const [user, setUser] = useState(() => {
    const s = sessionStorage.getItem("db_session") || localStorage.getItem("db_remember");
    if (s) { try { return JSON.parse(s); } catch {} }
    return null;
  });

  // USER DATA
  const [expenses, setExpenses] = useState(() => storage.get("db_expenses_" + (user?.id || ""), []));
  const [budgetCats, setBudgetCats] = useState(() => storage.get("db_budget_" + (user?.id || ""), []));
  const [income, setIncome] = useState(() => storage.get("db_income_" + (user?.id || ""), ""));
  const [savingsGoals, setSavingsGoals] = useState(() => storage.get("db_goals_" + (user?.id || ""), []));
  const [bills, setBills] = useState(() => storage.get("db_bills_" + (user?.id || ""), []));
  const [debts, setDebts] = useState(() => storage.get("db_debts_" + (user?.id || ""), []));
  const [featureUpdates, setFeatureUpdates] = useState(() => storage.get("db_features", [
    { id:1, title:"App Launched", cat:"New Feature", date:"2026-05-25", desc:"DayeBudget AI is now live! Track expenses, budget smarter, and get AI-powered advice.", published:true },
    { id:2, title:"AI Assistant Upgraded", cat:"Improvement", date:"2026-05-25", desc:"The AI assistant now provides more personalized budgeting advice based on your profile.", published:true },
  ]));
  const [adminUsers, setAdminUsers] = useState(() => storage.get("db_admin_users", [
    { id:"u1", name:"Alex Johnson", email:"alex@email.com", plan:"Premium", status:"Active", joined:"2026-01-15", isAdmin:false },
    { id:"u2", name:"Sarah Williams", email:"sarah@email.com", plan:"Free", status:"Active", joined:"2026-02-01", isAdmin:false },
    { id:"u3", name:"Mike Davis", email:"mike@email.com", plan:"Premium", status:"Active", joined:"2025-12-10", isAdmin:false },
    { id:"u4", name:"Lisa Chen", email:"lisa@email.com", plan:"Free", status:"Inactive", joined:"2025-12-20", isAdmin:false },
  ]));
  const [onboarded, setOnboarded] = useState(() => storage.get("db_onboarded_" + (user?.id || ""), false));
  const [subscription, setSubscription] = useState(() => storage.get("db_sub_" + (user?.id || ""), { plan:"Free", renewDate:"2026-06-25", cancelledAt:null }));
  const [alerts, setAlerts] = useState([]);

  const uid = user?.id || "";

  // Persist data when it changes
  useEffect(() => { if (uid) storage.set("db_expenses_" + uid, expenses); }, [expenses, uid]);
  useEffect(() => { if (uid) storage.set("db_budget_" + uid, budgetCats); }, [budgetCats, uid]);
  useEffect(() => { if (uid) storage.set("db_income_" + uid, income); }, [income, uid]);
  useEffect(() => { if (uid) storage.set("db_goals_" + uid, savingsGoals); }, [savingsGoals, uid]);
  useEffect(() => { if (uid) storage.set("db_bills_" + uid, bills); }, [bills, uid]);
  useEffect(() => { if (uid) storage.set("db_debts_" + uid, debts); }, [debts, uid]);
  useEffect(() => { storage.set("db_features", featureUpdates); }, [featureUpdates]);
  useEffect(() => { storage.set("db_admin_users", adminUsers); }, [adminUsers]);
  useEffect(() => { if (uid) storage.set("db_sub_" + uid, subscription); }, [subscription, uid]);
  useEffect(() => { if (uid) storage.set("db_onboarded_" + uid, onboarded); }, [onboarded, uid]);
  useEffect(() => { storage.set("theme", dark); }, [dark]);

  // Smart alerts
  useEffect(() => {
    if (!uid || !income) return;
    const newAlerts = [];
    const inc = parseFloat(income) || 0;
    const totalExp = expenses.reduce((s, e) => s + Math.abs(parseFloat(e.amount) || 0), 0);
    if (totalExp > inc * 0.9) newAlerts.push({ id:"overspend", type:"alert", msg:"You've used over 90% of your income on expenses this month." });
    const upcoming = bills.filter(b => !b.paid && b.due && new Date(b.due) <= new Date(Date.now() + 3 * 86400000));
    if (upcoming.length) newAlerts.push({ id:"bills", type:"warning", msg:`${upcoming.length} bill(s) due within 3 days. Don't miss them!` });
    const catMap = {};
    expenses.forEach(e => { catMap[e.cat] = (catMap[e.cat] || 0) + Math.abs(parseFloat(e.amount) || 0); });
    if ((catMap["Dining"] || 0) > 200) newAlerts.push({ id:"dining", type:"info", msg:`You've spent $${catMap["Dining"].toFixed(0)} on dining out this month.` });
    setAlerts(newAlerts);
  }, [expenses, bills, income, uid]);

  const login = (userData, remember) => {
    const u = { ...userData, id: userData.id || ("u_" + Date.now()) };
    setUser(u);
    if (remember) localStorage.setItem("db_remember", JSON.stringify(u));
    else sessionStorage.setItem("db_session", JSON.stringify(u));
    // Load user data
    setExpenses(storage.get("db_expenses_" + u.id, []));
    setBudgetCats(storage.get("db_budget_" + u.id, []));
    setIncome(storage.get("db_income_" + u.id, ""));
    setSavingsGoals(storage.get("db_goals_" + u.id, []));
    setBills(storage.get("db_bills_" + u.id, []));
    setDebts(storage.get("db_debts_" + u.id, []));
    setSubscription(storage.get("db_sub_" + u.id, { plan:"Free", renewDate:"2026-06-25", cancelledAt:null }));
    setOnboarded(storage.get("db_onboarded_" + u.id, false));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("db_session");
    localStorage.removeItem("db_remember");
    setExpenses([]); setBudgetCats([]); setIncome(""); setSavingsGoals([]); setBills([]); setDebts([]);
  };

  const isAdmin = user?.isAdmin || user?.email === ADMIN_EMAIL;

  return (
    <AppCtx.Provider value={{ C, FONT, HEAD, dark, setDark, user, login, logout, isAdmin, expenses, setExpenses, budgetCats, setBudgetCats, income, setIncome, savingsGoals, setSavingsGoals, bills, setBills, debts, setDebts, featureUpdates, setFeatureUpdates, adminUsers, setAdminUsers, onboarded, setOnboarded, subscription, setSubscription, alerts, setAlerts }}>
      {children}
    </AppCtx.Provider>
  );
}


// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; }
  body { font-family: 'DM Sans', -apple-system, sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: 'DM Sans', -apple-system, sans-serif; }
  input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="date"], select, textarea { font-size: 16px !important; -webkit-appearance: none; appearance: none; }
  input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  input[type="checkbox"] { width: 17px; height: 17px; accent-color: #E5041C; flex-shrink: 0; cursor: pointer; }
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }
  input::placeholder, textarea::placeholder { color: #555; opacity: 1; }
  button { cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  * { -webkit-tap-highlight-color: transparent; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .page-enter { animation: fadeIn 0.18s ease; }
  @media (max-width: 768px) { .desktop-sidebar { display: none !important; } }
  @media (min-width: 769px) { .mobile-nav { display: none !important; } .mobile-header { display: none !important; } }
  @supports (padding: max(0px)) { .bottom-safe { padding-bottom: max(14px, env(safe-area-inset-bottom)) !important; } }
  html, body { width: 100%; min-height: 100dvh; overflow-x: hidden; }
  #root { width: 100%; min-height: 100dvh; display: flex; flex-direction: column; }
  @media (min-width: 1400px) { .page-content { max-width: 1400px; margin: 0 auto; width: 100%; } }
  .hover-btn:hover { opacity: 0.88; }
  .hover-row:hover { background: rgba(255,255,255,0.03); }
  select option { background: #1C1C1C; color: #fff; }
`;

// ─── SHARED COMPONENT HELPERS ─────────────────────────────────────────────────
function useStyles() {
  const { C, FONT } = useApp();
  return {
    card: { background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` },
    card2: { background:C.card2, borderRadius:12, padding:16, border:`1px solid ${C.border}` },
    btn: { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, background:C.red, color:"#fff", border:"none", borderRadius:10, padding:"13px 22px", cursor:"pointer", fontWeight:600, fontSize:15, fontFamily:FONT, minHeight:48, WebkitAppearance:"none", touchAction:"manipulation", transition:"opacity .15s" },
    btnSm: { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:5, background:C.red, color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", cursor:"pointer", fontWeight:600, fontSize:14, fontFamily:FONT, minHeight:42, WebkitAppearance:"none", touchAction:"manipulation" },
    btnGhost: { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, background:"transparent", color:C.text2, border:`1px solid ${C.border2}`, borderRadius:10, padding:"11px 18px", cursor:"pointer", fontWeight:500, fontSize:14, fontFamily:FONT, minHeight:44, WebkitAppearance:"none" },
    btnDanger: { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, background:"#EF4444", color:"#fff", border:"none", borderRadius:10, padding:"13px 22px", cursor:"pointer", fontWeight:600, fontSize:15, fontFamily:FONT, minHeight:48 },
    input: { background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, padding:"13px 14px", color:C.text, fontSize:16, width:"100%", outline:"none", fontFamily:FONT, minHeight:48, WebkitAppearance:"none", boxSizing:"border-box", display:"block" },
    label: { color:C.text2, fontSize:11, fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" },
    h1: { fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:700, color:C.text },
    h2: { fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:700, color:C.text },
    page: { padding:"20px 16px", minHeight:"100dvh", background:C.bg, width:"100%", maxWidth:"100%", overflowX:"hidden" },
  };
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
function Btn({ children, onClick, disabled, variant="primary", style={}, full=false }) {
  const S = useStyles();
  const base = variant==="ghost" ? S.btnGhost : variant==="danger" ? S.btnDanger : variant==="sm" ? S.btnSm : S.btn;
  return <button onClick={onClick} disabled={disabled} className="hover-btn" style={{ ...base, opacity:disabled?0.55:1, width:full?"100%":"auto", ...style }}>{children}</button>;
}

function Input({ label, error, type="text", ...props }) {
  const S = useStyles();
  const { C } = useApp();
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={S.label}>{label}</label>}
      <input type={type} style={{ ...S.input, borderColor:error?"#EF4444":undefined }} {...props} />
      {error && <p style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{error}</p>}
    </div>
  );
}

function ProgressBar({ pct=0, color, h=8 }) {
  const { C } = useApp();
  color = color || C.red;
  const clamp = Math.min(100, Math.max(0, pct || 0));
  const col = clamp > 90 ? "#EF4444" : clamp > 75 ? C.yellow : color;
  return (
    <div style={{ background:C.border2, borderRadius:99, height:h, overflow:"hidden", width:"100%" }}>
      <div style={{ width:`${clamp}%`, height:"100%", background:col, borderRadius:99, transition:"width .5s ease" }} />
    </div>
  );
}

function Badge({ children, color }) {
  const { C } = useApp();
  color = color || C.red;
  return <span style={{ background:color+"22", color, borderRadius:6, padding:"3px 9px", fontSize:11, fontWeight:700, display:"inline-block", whiteSpace:"nowrap" }}>{children}</span>;
}

function EmptyState({ icon:Icon, title, sub, action }) {
  const { C } = useApp();
  return (
    <div style={{ textAlign:"center", padding:"48px 20px", color:C.text2 }}>
      {Icon && <Icon size={44} style={{ margin:"0 auto 14px", opacity:0.25, display:"block" }} />}
      <p style={{ fontWeight:600, fontSize:16, color:C.text, marginBottom:8 }}>{title}</p>
      <p style={{ fontSize:13, lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>{sub}</p>
      {action && <div style={{ marginTop:20 }}>{action}</div>}
    </div>
  );
}

function Modal({ title, onClose, children, maxW=480 }) {
  const { C } = useApp();
  useEffect(() => { const p = document.body.style.overflow; document.body.style.overflow="hidden"; return () => { document.body.style.overflow=p; }; }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:"22px 20px 32px", width:"100%", maxWidth:maxW, border:`1px solid ${C.border2}`, maxHeight:"92dvh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background:C.card2, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.text2 }}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, confirmText="Confirm", cancelText="Cancel", onConfirm, onCancel, danger=false }) {
  const { C } = useApp();
  const S = useStyles();
  return (
    <Modal title={title} onClose={onCancel} maxW={380}>
      <p style={{ fontSize:14, color:C.text2, lineHeight:1.65, marginBottom:24 }}>{message}</p>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onCancel} style={{ ...S.btnGhost, flex:1 }}>{cancelText}</button>
        <button onClick={onConfirm} style={{ ...S.btn, flex:1, background:danger?"#EF4444":C.red }}>{confirmText}</button>
      </div>
    </Modal>
  );
}

function StatCard({ label, value, sub, icon:Icon, iconColor, trend }) {
  const { C } = useApp();
  iconColor = iconColor || C.red;
  return (
    <div style={{ background:C.card, borderRadius:16, padding:18, border:`1px solid ${C.border}`, flex:1, minWidth:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ minWidth:0, flex:1 }}>
          <p style={{ color:C.text2, fontSize:12, marginBottom:7, fontWeight:500 }}>{label}</p>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:C.text, lineHeight:1, wordBreak:"break-word" }}>{value}</p>
          {sub && <p style={{ fontSize:11, color:trend==="up"?C.green:trend==="down"?"#EF4444":C.text2, marginTop:5, display:"flex", alignItems:"center", gap:3, flexWrap:"wrap" }}>
            {trend==="up" && <ArrowUpRight size={11} />}{trend==="down" && <ArrowDownRight size={11} />}{sub}
          </p>}
        </div>
        <div style={{ width:40, height:40, minWidth:40, borderRadius:12, background:iconColor+"1A", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={19} color={iconColor} />
        </div>
      </div>
    </div>
  );
}

function AIInsight({ text, type="info" }) {
  const { C } = useApp();
  const map = { info:[C.blue,"💡"], warning:[C.yellow,"⚠️"], success:[C.green,"✅"], alert:["#EF4444","🚨"] };
  const [col, em] = map[type] || map.info;
  return (
    <div style={{ background:col+"14", border:`1px solid ${col}30`, borderRadius:12, padding:"11px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
      <span style={{ fontSize:15, flexShrink:0, lineHeight:1.5 }}>{em}</span>
      <p style={{ color:C.text, fontSize:13, lineHeight:1.55, margin:0, wordBreak:"break-word" }}>{text}</p>
    </div>
  );
}

function PageHeader({ title, sub, action }) {
  const { C } = useApp();
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22, flexWrap:"wrap", gap:12 }}>
      <div style={{ minWidth:0 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:C.text }}>{title}</h1>
        {sub && <p style={{ color:C.text2, fontSize:13, marginTop:4 }}>{sub}</p>}
      </div>
      {action && <div style={{ flexShrink:0 }}>{action}</div>}
    </div>
  );
}

function AlertBanner({ alerts }) {
  const { C } = useApp();
  const [dismissed, setDismissed] = useState([]);
  const visible = alerts.filter(a => !dismissed.includes(a.id));
  if (!visible.length) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
      {visible.slice(0,3).map(a => (
        <div key={a.id} style={{ background:a.type==="alert"?"#EF444418":a.type==="warning"?C.yellow+"18":C.blue+"18", border:`1px solid ${a.type==="alert"?"#EF444430":a.type==="warning"?C.yellow+"30":C.blue+"30"}`, borderRadius:10, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
          <p style={{ fontSize:12, color:C.text, flex:1 }}>{a.type==="alert"?"🚨":a.type==="warning"?"⚠️":"💡"} {a.msg}</p>
          <button onClick={() => setDismissed([...dismissed, a.id])} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:4 }}><X size={13} /></button>
        </div>
      ))}
    </div>
  );
}


// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:Home },
  { id:"budget", label:"Budget Planner", icon:Wallet },
  { id:"expenses", label:"Expenses", icon:CreditCard },
  { id:"savings", label:"Savings Goals", icon:Target },
  { id:"ai", label:"AI Assistant", icon:MessageSquare },
  { id:"bills", label:"Bills & Subs", icon:FileText },
  { id:"debt", label:"Debt Payoff", icon:TrendingDown },
  { id:"reports", label:"Reports", icon:BarChart2 },
  { id:"learn", label:"Learn", icon:BookOpen },
  { id:"updates", label:"What's New", icon:Zap },
  { id:"profile", label:"Profile", icon:Settings },
];
const BOTTOM_NAV = [
  { id:"dashboard", label:"Home", icon:Home },
  { id:"budget", label:"Budget", icon:Wallet },
  { id:"ai", label:"AI", icon:MessageSquare },
  { id:"savings", label:"Goals", icon:Target },
  { id:"profile", label:"Profile", icon:User },
];

function Sidebar({ page, setPage }) {
  const { C, FONT, user, logout, isAdmin, dark, setDark, alerts } = useApp();
  return (
    <div className="desktop-sidebar" style={{ width:236, minWidth:236, height:"100dvh", background:C.bg2, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, overflowY:"auto" }}>
      <div style={{ padding:"20px 18px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><DollarSign size={18} color="#fff" /></div>
          <div><p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:C.text, lineHeight:1 }}>DayeBudget</p><p style={{ fontSize:10, color:C.red, fontWeight:700, letterSpacing:"0.08em" }}>AI</p></div>
        </div>
      </div>
      <div style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {NAV_ITEMS.map(({ id, label, icon:Icon }) => {
          const active = page===id;
          return (
            <button key={id} onClick={() => setPage(id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 11px", borderRadius:9, border:"none", cursor:"pointer", background:active?C.red+"18":"transparent", color:active?C.red:C.text2, fontFamily:FONT, fontSize:13, fontWeight:active?600:400, marginBottom:2, minHeight:42, textAlign:"left", transition:"all .12s" }}>
              <Icon size={16} />
              <span style={{ flex:1 }}>{label}</span>
              {id==="updates" && alerts.length>0 && <span style={{ background:C.red, color:"#fff", borderRadius:99, fontSize:10, fontWeight:700, padding:"1px 6px", minWidth:18, textAlign:"center" }}>{alerts.length}</span>}
            </button>
          );
        })}
        {isAdmin && (
          <button onClick={() => setPage("admin")} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 11px", borderRadius:9, border:"none", cursor:"pointer", background:page==="admin"?C.red+"18":"transparent", color:page==="admin"?C.red:C.text2, fontFamily:FONT, fontSize:13, fontWeight:page==="admin"?600:400, marginBottom:2, minHeight:42, textAlign:"left" }}>
            <Shield size={16} />Admin Panel
          </button>
        )}
        <div style={{ borderTop:`1px solid ${C.border}`, marginTop:10, paddingTop:10 }}>
          <button onClick={() => setDark(!dark)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 11px", borderRadius:9, border:"none", cursor:"pointer", background:"transparent", color:C.text2, fontFamily:FONT, fontSize:13, marginBottom:2, minHeight:42, textAlign:"left" }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}{dark?"Light Mode":"Dark Mode"}
          </button>
          <button onClick={logout} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 11px", borderRadius:9, border:"none", cursor:"pointer", background:"transparent", color:"#EF4444", fontFamily:FONT, fontSize:13, marginBottom:2, minHeight:42, textAlign:"left" }}>
            <LogOut size={16} />Log Out
          </button>
        </div>
      </div>
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:32, height:32, minWidth:32, borderRadius:9, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>{(user?.name||"?").slice(0,2).toUpperCase()}</div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:12, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name||"User"}</p>
            <Badge color={C.yellow}>{user?.plan||"Free"}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNavBar({ page, setPage }) {
  const { C, FONT, alerts } = useApp();
  return (
    <div className="mobile-nav bottom-safe" style={{ position:"fixed", bottom:0, left:0, right:0, background:C.card, borderTop:`1px solid ${C.border}`, display:"none", zIndex:100, paddingBottom:14 }}>
      {BOTTOM_NAV.map(({ id, label, icon:Icon }) => {
        const active = page===id, isAI=id==="ai";
        return (
          <button key={id} onClick={() => setPage(id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, paddingTop:10, border:"none", background:"transparent", cursor:"pointer", color:active?C.red:C.text3, fontFamily:FONT, fontSize:10, fontWeight:active?600:400, minHeight:54, touchAction:"manipulation" }}>
            {isAI ? <div style={{ width:40, height:40, borderRadius:12, background:active?C.red:C.card2, display:"flex", alignItems:"center", justifyContent:"center", marginTop:-16, border:`2px solid ${active?C.red:C.border2}` }}><Icon size={19} color={active?"#fff":C.text2} /></div> : <Icon size={21} />}
            {!isAI && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

function MobileHeader({ page, setPage }) {
  const { C, FONT, dark, setDark } = useApp();
  const title = NAV_ITEMS.find(n=>n.id===page)?.label || "DayeBudget AI";
  return (
    <div className="mobile-header" style={{ background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:"13px 16px", display:"none", alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"sticky", top:0, zIndex:50 }}>
      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:C.red, display:"flex", alignItems:"center", justifyContent:"center" }}><DollarSign size={15} color="#fff" /></div>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:C.text }}>{title}</p>
      </div>
      <div style={{ display:"flex", gap:4 }}>
        <button onClick={() => setDark(!dark)} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.text2, padding:6, minHeight:40, minWidth:40, display:"flex", alignItems:"center", justifyContent:"center" }}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
        <button onClick={() => setPage("profile")} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.text2, padding:6, minHeight:40, minWidth:40, display:"flex", alignItems:"center", justifyContent:"center" }}><Settings size={18} /></button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingFlow({ onDone }) {
  const { C, FONT, HEAD, setIncome, setBudgetCats, user } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ payFreq:"biweekly", paycheck:"", goals:[], wantAI:true, wantBillReminders:true });
  const goals = ["Save money","Pay off debt","Build emergency fund","Buy a car","Buy a house","Start investing","Stop overspending","Track bills","Learn finance basics"];

  const finish = () => {
    if (data.paycheck) {
      const monthly = data.payFreq==="weekly" ? parseFloat(data.paycheck)*4.33 : data.payFreq==="biweekly" ? parseFloat(data.paycheck)*2.17 : data.payFreq==="semimonthly" ? parseFloat(data.paycheck)*2 : parseFloat(data.paycheck);
      setIncome(monthly.toFixed(2));
    }
    onDone();
  };

  const steps = [
    { title:"How often do you get paid?", content:(
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {[["weekly","Weekly"],["biweekly","Every 2 Weeks"],["semimonthly","Twice a Month"],["monthly","Once a Month"]].map(([v,l]) => (
          <button key={v} onClick={() => setData({...data, payFreq:v})} style={{ padding:"14px 16px", borderRadius:12, border:`2px solid ${data.payFreq===v?C.red:C.border2}`, background:data.payFreq===v?C.red+"14":C.card2, cursor:"pointer", textAlign:"left", color:C.text, fontFamily:FONT, fontSize:14, fontWeight:data.payFreq===v?600:400 }}>{l}</button>
        ))}
      </div>
    )},
    { title:"What's your average paycheck?", content:(
      <div>
        <p style={{ fontSize:13, color:C.text2, marginBottom:14 }}>This helps us calculate your monthly income and budget recommendations.</p>
        <Input label="Paycheck Amount ($)" type="number" inputMode="decimal" placeholder="e.g. 1800" value={data.paycheck} onChange={e => setData({...data, paycheck:e.target.value})} />
      </div>
    )},
    { title:"What are your main goals?", content:(
      <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
        {goals.map(g => {
          const sel = data.goals.includes(g);
          return <button key={g} onClick={() => setData({...data, goals:sel?data.goals.filter(x=>x!==g):[...data.goals,g]})} style={{ padding:"9px 14px", borderRadius:20, border:`2px solid ${sel?C.red:C.border2}`, background:sel?C.red+"18":C.card2, cursor:"pointer", color:sel?C.red:C.text2, fontFamily:FONT, fontSize:13, fontWeight:sel?600:400 }}>{g}</button>;
        })}
      </div>
    )},
    { title:"Set up your preferences", content:(
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {[["wantAI","Enable AI Recommendations","Get personalized budgeting advice"],["wantBillReminders","Bill Reminders","Get notified before bills are due"]].map(([key,label,desc]) => (
          <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", borderRadius:12, border:`1px solid ${C.border2}`, background:C.card2 }}>
            <div><p style={{ fontWeight:600, fontSize:14, color:C.text }}>{label}</p><p style={{ fontSize:12, color:C.text2 }}>{desc}</p></div>
            <button onClick={() => setData({...data, [key]:!data[key]})} style={{ width:48, height:28, borderRadius:14, background:data[key]?C.red:C.border2, border:"none", cursor:"pointer", position:"relative", flexShrink:0 }}>
              <div style={{ width:22, height:22, borderRadius:11, background:"#fff", position:"absolute", top:3, left:data[key]?22:3, transition:"left .2s" }} />
            </button>
          </div>
        ))}
      </div>
    )},
  ];

  return (
    <div style={{ background:C.bg, minHeight:"100dvh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><DollarSign size={26} color="#fff" /></div>
          <h1 style={{ fontFamily:HEAD, fontSize:24, fontWeight:700, color:C.text, marginBottom:4 }}>Welcome, {user?.name?.split(" ")[0] || "there"}!</h1>
          <p style={{ color:C.text2, fontSize:13 }}>Let's personalize your experience ({step+1}/{steps.length})</p>
        </div>
        <div style={{ background:C.card, borderRadius:20, padding:24, border:`1px solid ${C.border2}`, marginBottom:20 }}>
          <h2 style={{ fontFamily:HEAD, fontSize:17, fontWeight:700, color:C.text, marginBottom:18 }}>{steps[step].title}</h2>
          {steps[step].content}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {step > 0 && <button onClick={() => setStep(s=>s-1)} style={{ flex:1, padding:"13px", borderRadius:10, border:`1px solid ${C.border2}`, background:"transparent", color:C.text2, cursor:"pointer", fontFamily:FONT, fontSize:14, fontWeight:500 }}>Back</button>}
          <button onClick={() => step<steps.length-1 ? setStep(s=>s+1) : finish()} style={{ flex:2, padding:"13px", borderRadius:10, border:"none", background:C.red, color:"#fff", cursor:"pointer", fontFamily:FONT, fontSize:15, fontWeight:600 }}>
            {step<steps.length-1 ? "Next →" : "Get Started 🚀"}
          </button>
        </div>
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:18 }}>
          {steps.map((_,i) => <div key={i} style={{ width:i===step?22:7, height:7, borderRadius:99, background:i===step?C.red:C.border2, transition:"all .2s" }} />)}
        </div>
      </div>
    </div>
  );
}


// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function SignInPage({ goSignUp, goLanding }) {
  const { C, FONT, HEAD, login } = useApp();
  const S = useStyles();
  const [form, setForm] = useState({ email:"", password:"", remember:false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const isAdm = form.email === "admin@dayebudget.com";
    const existing = storage.get("db_users", []).find(u => u.email === form.email);
    const userData = existing || { id:"demo_" + Date.now(), name:"Demo User", email:form.email, plan:"Free", isAdmin:isAdm };
    login(userData, form.remember);
    setLoading(false);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100dvh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}><DollarSign size={26} color="#fff" /></div>
          <h1 style={{ fontFamily:HEAD, fontSize:26, fontWeight:700, color:C.text, marginBottom:5 }}>Welcome Back</h1>
          <p style={{ color:C.text2, fontSize:14 }}>Sign in to DayeBudget AI</p>
        </div>
        <div style={{ background:C.card, borderRadius:20, padding:24, border:`1px solid ${C.border2}` }}>
          <Input label="Email Address" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} error={errors.email} autoComplete="email" />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} style={{ ...S.input, paddingRight:50, borderColor:errors.password?"#EF4444":undefined }} placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} onKeyDown={e => e.key==="Enter"&&submit()} autoComplete="current-password" />
              <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.text2, padding:6, minHeight:44, minWidth:44, display:"flex", alignItems:"center", justifyContent:"center" }}>{showPass?<EyeOff size={16} />:<Eye size={16} />}</button>
            </div>
            {errors.password && <p style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{errors.password}</p>}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:8 }}>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, color:C.text2, minHeight:44 }}>
              <input type="checkbox" checked={form.remember} onChange={e => setForm({...form, remember:e.target.checked})} />Remember Me
            </label>
            <a href="#" style={{ fontSize:13, color:C.red }}>Forgot Password?</a>
          </div>
          <Btn onClick={submit} disabled={loading} full style={{ marginBottom:12 }}>
            {loading?<><RefreshCw size={15} style={{ animation:"spin 1s linear infinite" }} />Signing In...</>:"Sign In"}
          </Btn>
          <p style={{ textAlign:"center", color:C.text2, fontSize:13 }}>
            No account? <button onClick={goSignUp} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:FONT, padding:"4px 0" }}>Sign Up Free</button>
          </p>
        </div>
        <p style={{ textAlign:"center", color:C.text3, fontSize:12, marginTop:14 }}>Demo: any email + 6+ char password</p>
        <button onClick={goLanding} style={{ display:"block", margin:"10px auto 0", background:"none", border:"none", color:C.text3, cursor:"pointer", fontSize:12, fontFamily:FONT }}>← Back to Home</button>
      </div>
    </div>
  );
}

function SignUpPage({ goSignIn }) {
  const { C, FONT, HEAD, login } = useApp();
  const S = useStyles();
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", password:"", confirm:"", terms:false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = p => { if (!p) return 0; let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++; return s; };
  const sl = strength(form.password);
  const sColors = ["","#EF4444",C.orange,C.yellow,C.green];
  const sLabels = ["","Weak","Fair","Good","Strong"];

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName="Required";
    if (!form.lastName.trim()) e.lastName="Required";
    if (!form.email.trim()) e.email="Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email="Invalid email";
    if (!form.password) e.password="Required";
    else if (form.password.length<8) e.password="Minimum 8 characters";
    if (form.confirm !== form.password) e.confirm="Passwords do not match";
    if (!form.terms) e.terms="Must accept Terms & Conditions";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const userId = "u_" + Date.now();
    const userData = { id:userId, name:`${form.firstName} ${form.lastName}`, email:form.email, plan:"Free", isAdmin:false };
    const users = storage.get("db_users", []);
    storage.set("db_users", [...users, userData]);
    login(userData, false);
    setLoading(false);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100dvh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}><DollarSign size={25} color="#fff" /></div>
          <h1 style={{ fontFamily:HEAD, fontSize:24, fontWeight:700, color:C.text, marginBottom:4 }}>Create Your Account</h1>
          <p style={{ color:C.text2, fontSize:13 }}>Free to start. Cancel anytime.</p>
        </div>
        <div style={{ background:C.card, borderRadius:20, padding:24, border:`1px solid ${C.border2}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="First Name" placeholder="Alex" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} error={errors.firstName} autoComplete="given-name" />
            <Input label="Last Name" placeholder="Johnson" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} error={errors.lastName} autoComplete="family-name" />
          </div>
          <Input label="Email Address" type="email" placeholder="alex@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} error={errors.email} autoComplete="email" />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} style={{ ...S.input, paddingRight:50, borderColor:errors.password?"#EF4444":undefined }} placeholder="Min. 8 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} autoComplete="new-password" />
              <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.text2, padding:6, minHeight:44, minWidth:44, display:"flex", alignItems:"center", justifyContent:"center" }}>{showPass?<EyeOff size={15} />:<Eye size={15} />}</button>
            </div>
            {errors.password && <p style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{errors.password}</p>}
            {form.password && <div style={{ marginTop:7 }}><div style={{ display:"flex", gap:4, marginBottom:3 }}>{[1,2,3,4].map(i=><div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<=sl?sColors[sl]:C.border2 }} />)}</div><p style={{ fontSize:11, color:sColors[sl] }}>{sLabels[sl]} password</p></div>}
          </div>
          <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} error={errors.confirm} autoComplete="new-password" />
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"flex", gap:9, cursor:"pointer", fontSize:13, color:C.text2, alignItems:"flex-start", lineHeight:1.5 }}>
              <input type="checkbox" checked={form.terms} onChange={e=>setForm({...form,terms:e.target.checked})} style={{ marginTop:2 }} />
              <span>I agree to the <a href="#" style={{ color:C.red }}>Terms & Conditions</a> and <a href="#" style={{ color:C.red }}>Privacy Policy</a></span>
            </label>
            {errors.terms && <p style={{ color:"#EF4444", fontSize:12, marginTop:4 }}>{errors.terms}</p>}
          </div>
          <Btn onClick={submit} disabled={loading} full>
            {loading?<><RefreshCw size={15} style={{ animation:"spin 1s linear infinite" }} />Creating Account...</>:"Create Free Account"}
          </Btn>
          <p style={{ textAlign:"center", color:C.text2, fontSize:13, marginTop:16 }}>
            Have an account? <button onClick={goSignIn} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:FONT }}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}


// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ setPage }) {
  const { C, user, expenses, income, savingsGoals, bills, debts, alerts } = useApp();
  const totalExp = expenses.reduce((s,e)=>s+Math.abs(parseFloat(e.amount)||0),0);
  const inc = parseFloat(income)||0;
  const remaining = inc - totalExp;
  const totalSaved = savingsGoals.reduce((s,g)=>s+parseFloat(g.saved||0),0);
  const totalDebt = debts.reduce((s,d)=>s+parseFloat(d.balance||0),0);
  const paidBills = bills.filter(b=>b.paid).length;
  const score = Math.min(100, Math.max(0, Math.round(
    (inc>0 ? Math.min(40, (remaining/inc)*100) : 0) +
    (savingsGoals.length>0 ? 20 : 0) +
    (totalDebt===0 ? 20 : Math.max(0, 20-(totalDebt/10000)*5)) +
    (bills.length>0 ? Math.round((paidBills/bills.length)*20) : 0)
  )));
  const scoreLabel = score>=80?"Excellent":score>=60?"Good":score>=40?"Needs Work":"High Risk";
  const scoreColor = score>=80?C.green:score>=60?C.yellow:score>=40?C.orange:"#EF4444";

  const catSpend = {};
  expenses.forEach(e => { catSpend[e.cat]=(catSpend[e.cat]||0)+Math.abs(parseFloat(e.amount)||0); });
  const pieData = Object.entries(catSpend).map(([name,value],i) => ({ name, value:Math.round(value), color:[C.red,C.blue,C.green,C.yellow,C.purple,C.teal,C.orange,C.pink][i%8] }));

  const hasData = inc>0 || expenses.length>0;

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <AlertBanner alerts={alerts} />
      <div style={{ marginBottom:22 }}>
        <p style={{ color:C.text2, fontSize:13 }}>Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"},</p>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:700, color:C.text }}>{user?.name?.split(" ")[0] || "there"} 👋</h1>
        <p style={{ color:C.text2, fontSize:13, marginTop:3 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</p>
      </div>

      {!hasData ? (
        <div style={{ background:C.card, borderRadius:16, padding:32, border:`1px solid ${C.border}`, textAlign:"center", marginBottom:20 }}>
          <Wallet size={48} style={{ margin:"0 auto 14px", opacity:0.25, display:"block", color:C.text }} />
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>Set Up Your Financial Dashboard</h2>
          <p style={{ color:C.text2, fontSize:13, lineHeight:1.7, maxWidth:340, margin:"0 auto 20px" }}>Start by adding your income in Budget Planner, then track expenses to see your financial overview here.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <Btn onClick={() => setPage("budget")} variant="sm"><Plus size={14} />Set Budget</Btn>
            <Btn onClick={() => setPage("expenses")} variant="sm"><Plus size={14} />Add Expense</Btn>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(148px, 1fr))", gap:12, marginBottom:18 }}>
            <StatCard label="Monthly Income" value={inc>0?`$${inc.toLocaleString("en",{maximumFractionDigits:2})}`:"—"} sub={inc>0?"This month":undefined} icon={TrendingUp} iconColor={C.green} />
            <StatCard label="Total Expenses" value={totalExp>0?`$${totalExp.toFixed(2)}`:"$0"} sub={expenses.length+" transactions"} icon={CreditCard} iconColor={C.red} />
            <StatCard label="Remaining" value={inc>0?`$${remaining.toFixed(2)}`:"—"} sub={inc>0?`${((remaining/inc)*100).toFixed(0)}% of income`:undefined} icon={Wallet} iconColor={remaining>=0?C.green:"#EF4444"} />
            <StatCard label="Total Saved" value={totalSaved>0?`$${totalSaved.toLocaleString()}`:"$0"} sub={`${savingsGoals.length} goals`} icon={Target} iconColor={C.yellow} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16, marginBottom:16 }}>
            <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:12 }}>Budget Health Score</h3>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ position:"relative", width:80, height:80, flexShrink:0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="33" fill="none" stroke={C.border2} strokeWidth="7" />
                    <circle cx="40" cy="40" r="33" fill="none" stroke={scoreColor} strokeWidth="7" strokeDasharray={`${(score/100)*207.3} 207.3`} strokeLinecap="round" transform="rotate(-90 40 40)" />
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:800, color:scoreColor }}>{score}</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:scoreColor }}>{scoreLabel}</p>
                  <p style={{ fontSize:12, color:C.text2, lineHeight:1.5 }}>{score<60?"Add income, track expenses, and set savings goals to improve.":"You're on the right track! Keep saving and paying bills on time."}</p>
                </div>
              </div>
            </div>
            {pieData.length>0 && (
              <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:10 }}>Spending by Category</h3>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ height:120, flex:"0 0 120px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={0}>{pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    {pieData.slice(0,5).map(d=>(
                      <div key={d.name} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:2, background:d.color, flexShrink:0 }} /><span style={{ fontSize:11, color:C.text2 }}>{d.name}</span></div>
                        <span style={{ fontSize:11, fontWeight:600, color:C.text }}>${d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text }}>🤖 AI Insights</h3>
          <Btn onClick={() => setPage("ai")} variant="ghost" style={{ fontSize:13, padding:"8px 14px", minHeight:36 }}>Ask AI →</Btn>
        </div>
        {expenses.length===0 ? (
          <AIInsight text="Add your income and expenses to get personalized AI insights about your spending habits and savings opportunities." type="info" />
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {remaining<0 && <AIInsight text={`You're $${Math.abs(remaining).toFixed(2)} over budget this month. Review your expenses to find areas to cut back.`} type="alert" />}
            {remaining>=0 && inc>0 && <AIInsight text={`You have $${remaining.toFixed(2)} (${((remaining/inc)*100).toFixed(0)}% of income) remaining. Consider moving $${(remaining*0.2).toFixed(0)} to savings.`} type="success" />}
            {savingsGoals.length===0 && <AIInsight text="You have no savings goals yet. Create one to start building your financial safety net." type="info" />}
          </div>
        )}
      </div>

      <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text }}>Recent Transactions</h3>
          <Btn onClick={() => setPage("expenses")} variant="ghost" style={{ fontSize:13, padding:"8px 14px", minHeight:36 }}>View All →</Btn>
        </div>
        {expenses.length===0 ? (
          <EmptyState icon={CreditCard} title="No transactions yet" sub="Add your first expense to start tracking where your money is going." action={<Btn onClick={() => setPage("expenses")} variant="sm"><Plus size={13} />Add Expense</Btn>} />
        ) : (
          expenses.slice(0,6).map(t => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}`, gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1 }}>
                <div style={{ width:36, height:36, minWidth:36, borderRadius:10, background:C.red+"1A", display:"flex", alignItems:"center", justifyContent:"center" }}><ArrowDownRight size={16} color={C.red} /></div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.name}</p>
                  <p style={{ fontSize:11, color:C.text2 }}>{t.cat} · {fmtShort(t.date)}</p>
                </div>
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap", flexShrink:0 }}>-${parseFloat(t.amount||0).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// ─── EXPENSES PAGE ────────────────────────────────────────────────────────────
const EXP_CATS = ["Housing","Groceries","Transport","Utilities","Dining","Subscriptions","Phone","Insurance","Debt","Entertainment","Health","Shopping","Personal","Other"];
const PAY_METHODS = ["Cash","Debit Card","Credit Card","Bank Transfer","Venmo/Zelle","Other"];

function ExpensesPage() {
  const { C, expenses, setExpenses, income } = useApp();
  const S = useStyles();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const blank = { name:"", cat:"Groceries", amount:"", date:today(), method:"Debit Card", recurring:false, notes:"" };
  const [form, setForm] = useState(blank);
  const [formErr, setFormErr] = useState({});

  const cats = ["All",...EXP_CATS];
  const filtered = expenses.filter(t => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase())||t.cat.toLowerCase().includes(search.toLowerCase());
    const mc = filterCat==="All"||t.cat===filterCat;
    return ms && mc;
  });
  const totalExp = expenses.reduce((s,e)=>s+Math.abs(parseFloat(e.amount)||0),0);
  const inc = parseFloat(income)||0;

  const validateForm = () => {
    const e={};
    if (!form.name.trim()) e.name="Expense name is required";
    if (!form.amount||parseFloat(form.amount)<=0) e.amount="Enter a valid amount";
    return e;
  };

  const save = () => {
    const e = validateForm(); setFormErr(e);
    if (Object.keys(e).length) return;
    if (editItem) {
      setExpenses(expenses.map(x => x.id===editItem.id ? { ...editItem, ...form, amount:parseFloat(form.amount), id:editItem.id } : x));
      setEditItem(null);
    } else {
      setExpenses([{ ...form, amount:parseFloat(form.amount), id:"exp_"+Date.now() }, ...expenses]);
    }
    setForm(blank); setShowAdd(false); setFormErr({});
  };

  const openEdit = (item) => { setEditItem(item); setForm({ name:item.name, cat:item.cat, amount:String(item.amount), date:item.date||today(), method:item.method||"Debit Card", recurring:item.recurring||false, notes:item.notes||"" }); setShowAdd(true); };

  const del = id => setExpenses(expenses.filter(x=>x.id!==id));

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Expense Tracker" sub={<>Money leaving your account — <span style={{ color:C.red }}>track every dollar out</span></>}
        action={<Btn onClick={() => { setEditItem(null); setForm(blank); setShowAdd(true); }} variant="sm"><Plus size={14} />Add Expense</Btn>} />

      <div style={{ background:C.card2, borderRadius:12, padding:"12px 14px", border:`1px solid ${C.border}`, marginBottom:16 }}>
        <p style={{ fontSize:13, color:C.text2, lineHeight:1.65 }}>📤 <strong style={{ color:C.text }}>What are expenses?</strong> Expenses are money going out of your paycheck — bills, groceries, gas, subscriptions, debt payments, and personal spending. Track them here to understand where your money goes.</p>
      </div>

      {inc > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <StatCard label="Total Expenses" value={`$${totalExp.toFixed(2)}`} sub={`${expenses.length} transactions`} icon={ArrowDownRight} iconColor={C.red} />
          <StatCard label="Remaining Budget" value={`$${(inc-totalExp).toFixed(2)}`} sub={inc>0?`${(((inc-totalExp)/inc)*100).toFixed(0)}% of income left`:undefined} icon={Wallet} iconColor={(inc-totalExp)>=0?C.green:"#EF4444"} />
        </div>
      )}

      {totalExp>inc*0.85 && inc>0 && <div style={{ marginBottom:14 }}><AIInsight text={`⚠️ You've spent ${((totalExp/inc)*100).toFixed(0)}% of your income. Consider reducing spending in your top categories.`} type="alert" /></div>}

      <div style={{ background:C.card, borderRadius:16, padding:16, border:`1px solid ${C.border}`, marginBottom:16 }}>
        <div style={{ position:"relative", marginBottom:12 }}>
          <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.text2 }} />
          <input style={{ ...S.input, paddingLeft:36 }} placeholder="Search expenses..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          {cats.map(cat => <button key={cat} onClick={()=>setFilterCat(cat)} style={{ background:filterCat===cat?C.red:C.card2, color:filterCat===cat?"#fff":C.text2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"7px 12px", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:filterCat===cat?600:400, minHeight:34, touchAction:"manipulation" }}>{cat}</button>)}
        </div>
      </div>

      <div style={{ background:C.card, borderRadius:16, padding:16, border:`1px solid ${C.border}` }}>
        <p style={{ fontSize:12, color:C.text2, marginBottom:12 }}>{filtered.length} expense{filtered.length!==1?"s":""} found</p>
        {filtered.length===0 ? (
          <EmptyState icon={CreditCard} title="No expenses added yet" sub="Add your first expense to start tracking what is going out of your paycheck." action={<Btn onClick={()=>setShowAdd(true)} variant="sm"><Plus size={13}/>Add Expense</Btn>} />
        ) : (
          filtered.map(t => (
            <div key={t.id} className="hover-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}`, gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1 }}>
                <div style={{ width:36, height:36, minWidth:36, borderRadius:10, background:C.red+"1A", display:"flex", alignItems:"center", justifyContent:"center" }}><ArrowDownRight size={16} color={C.red} /></div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.name}</p>
                  <p style={{ fontSize:11, color:C.text2 }}>{t.cat} · {fmtShort(t.date)}{t.recurring?" · 🔁 Recurring":""}{t.method?` · ${t.method}`:""}</p>
                  {t.notes && <p style={{ fontSize:11, color:C.text3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.notes}</p>}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <p style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:"nowrap" }}>-${parseFloat(t.amount||0).toFixed(2)}</p>
                <button onClick={()=>openEdit(t)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:34, minWidth:34, display:"flex", alignItems:"center", justifyContent:"center" }}><Edit2 size={13} /></button>
                <button onClick={()=>del(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:34, minWidth:34, display:"flex", alignItems:"center", justifyContent:"center" }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <Modal title={editItem?"Edit Expense":"Add Expense"} onClose={()=>{ setShowAdd(false); setEditItem(null); setForm(blank); setFormErr({}); }}>
          <Input label="Expense Name *" placeholder="e.g. Electric Bill" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} error={formErr.name} />
          <Input label="Amount ($) *" type="number" inputMode="decimal" placeholder="0.00" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} error={formErr.amount} />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Category</label>
            <select style={S.input} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {EXP_CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Payment Method</label>
            <select style={S.input} value={form.method} onChange={e=>setForm({...form,method:e.target.value})}>
              {PAY_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Notes (Optional)</label>
            <textarea style={{ ...S.input, height:72, resize:"none" }} placeholder="Add notes..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", fontSize:14, color:C.text2 }}>
              <input type="checkbox" checked={form.recurring} onChange={e=>setForm({...form,recurring:e.target.checked})} />Recurring expense (monthly)
            </label>
          </div>
          <Btn onClick={save} full>{editItem?"Save Changes":"Add Expense"}</Btn>
        </Modal>
      )}
    </div>
  );
}

// ─── BUDGET PAGE ──────────────────────────────────────────────────────────────
function BudgetPage() {
  const { C, budgetCats, setBudgetCats, income, setIncome, expenses } = useApp();
  const S = useStyles();
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ cat:"", planned:"", color:C.blue });
  const inc = parseFloat(income)||0;
  const totalPlanned = budgetCats.reduce((s,c)=>s+parseFloat(c.planned||0),0);

  const catSpend = {};
  expenses.forEach(e => { catSpend[e.cat]=(catSpend[e.cat]||0)+Math.abs(parseFloat(e.amount)||0); });

  const cats = budgetCats.map(c => ({ ...c, spent:catSpend[c.cat]||0 }));
  const totalSpent = cats.reduce((s,c)=>s+c.spent,0);
  const over = cats.filter(c=>c.spent>parseFloat(c.planned||0));

  const COLORS = [C.red,C.blue,C.green,C.yellow,C.purple,C.teal,C.orange,C.pink,"#6366F1","#84CC16","#EF4444","#EC4899"];

  const addCat = () => {
    if (!newCat.cat||!newCat.planned) return;
    const color = COLORS[budgetCats.length%COLORS.length];
    setBudgetCats([...budgetCats,{ id:"bc_"+Date.now(), ...newCat, planned:parseFloat(newCat.planned), color }]);
    setNewCat({ cat:"", planned:"", color:C.blue }); setShowAdd(false);
  };

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Budget Planner" sub="Set spending limits and see actual vs planned"
        action={<Btn onClick={()=>setShowAdd(true)} variant="sm"><Plus size={14}/>Add Category</Btn>} />

      <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
        <label style={S.label}>Monthly Income ($)</label>
        <input style={S.input} type="number" inputMode="decimal" placeholder="Enter your monthly income" value={income} onChange={e=>setIncome(e.target.value)} />
        {inc>0 && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:14 }}>
            {[["Budgeted",`$${totalPlanned.toFixed(0)}`,C.blue],["Spent",`$${totalSpent.toFixed(0)}`,C.red],["Left",`$${(inc-totalSpent).toFixed(0)}`,(inc-totalSpent)>=0?C.green:"#EF4444"]].map(([l,v,c])=>(
              <div key={l} style={{ textAlign:"center", background:C.card2, borderRadius:10, padding:"12px 8px" }}>
                <p style={{ fontSize:11, color:C.text2, marginBottom:3 }}>{l}</p>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:c }}>{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {over.length>0 && <div style={{ marginBottom:14 }}><AIInsight text={`You're over budget in: ${over.map(c=>c.cat).join(", ")}. Review spending in these areas.`} type="alert" /></div>}

      {inc>0 && (
        <div style={{ background:C.red+"10", border:`1px solid ${C.red}30`, borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
          <p style={{ fontSize:11, color:C.red, fontWeight:700, letterSpacing:"0.05em", marginBottom:5 }}>🤖 AI 50/30/20 SUGGESTION</p>
          <p style={{ fontSize:13, color:C.text, lineHeight:1.6 }}><strong style={{ color:C.red }}>50%</strong> needs (${(inc*0.5).toFixed(0)}) · <strong style={{ color:C.yellow }}>30%</strong> wants (${(inc*0.3).toFixed(0)}) · <strong style={{ color:C.green }}>20%</strong> savings/debt (${(inc*0.2).toFixed(0)})</p>
        </div>
      )}

      {budgetCats.length===0 ? (
        <EmptyState icon={Wallet} title="No budget categories yet" sub="Add categories like Housing, Groceries, and Transport to set spending limits and track your budget." action={<Btn onClick={()=>setShowAdd(true)} variant="sm"><Plus size={13}/>Add Category</Btn>} />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {cats.map((c,i)=>{
            const planned = parseFloat(c.planned||0);
            const pct = planned>0 ? Math.round((c.spent/planned)*100) : 0;
            const ov = c.spent>planned;
            return (
              <div key={c.id||i} style={{ background:C.card, borderRadius:14, padding:16, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                    <div style={{ width:9, height:9, minWidth:9, borderRadius:2, background:c.color||C.red }} />
                    <span style={{ fontWeight:600, fontSize:14, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.cat}</span>
                    {ov && <Badge color="#EF4444">Over!</Badge>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:ov?"#EF4444":C.text }}>${c.spent.toFixed(0)}</span>
                    <span style={{ fontSize:12, color:C.text2 }}>/ ${planned.toFixed(0)}</span>
                    <button onClick={()=>setBudgetCats(budgetCats.filter(x=>(x.id||x.cat)!==(c.id||c.cat)))} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:4, minHeight:30, minWidth:30 }}><X size={12}/></button>
                  </div>
                </div>
                <ProgressBar pct={pct} color={c.color||C.red} h={7} />
                <p style={{ fontSize:11, color:C.text2, marginTop:5 }}>{pct}% used · {ov?`$${(c.spent-planned).toFixed(0)} over budget`:`$${(planned-c.spent).toFixed(0)} remaining`}</p>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Budget Category" onClose={()=>setShowAdd(false)}>
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Category Name</label>
            <select style={S.input} value={newCat.cat} onChange={e=>setNewCat({...newCat,cat:e.target.value})}>
              <option value="">Select category...</option>
              {EXP_CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Monthly Limit ($)" type="number" inputMode="decimal" placeholder="e.g. 400" value={newCat.planned} onChange={e=>setNewCat({...newCat,planned:e.target.value})} />
          <Btn onClick={addCat} full>Add Category</Btn>
        </Modal>
      )}
    </div>
  );
}


// ─── SAVINGS PAGE ─────────────────────────────────────────────────────────────
function SavingsPage() {
  const { C, savingsGoals, setSavingsGoals } = useApp();
  const S = useStyles();
  const blank = { name:"", target:"", saved:"0", deadline:"", emoji:"🎯" };
  const [form, setForm] = useState(blank);
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formErr, setFormErr] = useState({});
  const EMOJIS = ["🎯","🛡️","✈️","🚗","🏠","📈","💍","🎓","💼","🌟","🏋️","🎮"];
  const COLORS = [C.red,C.blue,C.green,C.yellow,C.purple,C.teal,C.orange,C.pink,"#6366F1","#84CC16"];

  const validateForm = () => {
    const e={};
    if (!form.name.trim()) e.name="Goal name is required";
    if (!form.target||parseFloat(form.target)<=0) e.target="Enter a valid target amount";
    return e;
  };

  const save = () => {
    const e=validateForm(); setFormErr(e);
    if (Object.keys(e).length) return;
    const target=parseFloat(form.target), saved=parseFloat(form.saved||0);
    if (editItem) {
      setSavingsGoals(savingsGoals.map(x=>x.id===editItem.id?{ ...editItem, ...form, target, saved }:x));
      setEditItem(null);
    } else {
      const color = COLORS[savingsGoals.length%COLORS.length];
      setSavingsGoals([...savingsGoals,{ ...form, target, saved, id:"g_"+Date.now(), color }]);
    }
    setForm(blank); setShowAdd(false); setFormErr({});
  };

  const openEdit = g => { setEditItem(g); setForm({ name:g.name, target:String(g.target), saved:String(g.saved||0), deadline:g.deadline||"", emoji:g.emoji||"🎯" }); setShowAdd(true); };
  const del = id => setSavingsGoals(savingsGoals.filter(x=>x.id!==id));

  const monthsToDeadline = deadline => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.max(1, Math.round(diff / (1000*60*60*24*30)));
  };

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Savings Goals" sub="Build toward your biggest financial dreams"
        action={<Btn onClick={()=>{ setEditItem(null); setForm(blank); setShowAdd(true); }} variant="sm"><Plus size={14}/>New Goal</Btn>} />

      {savingsGoals.length===0 ? (
        <EmptyState icon={Target} title="No savings goals yet" sub="Create your first savings goal — emergency fund, vacation, car, house, or anything you're working toward." action={<Btn onClick={()=>setShowAdd(true)} variant="sm"><Plus size={13}/>Create Goal</Btn>} />
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(265px, 1fr))", gap:16 }}>
          {savingsGoals.map(g => {
            const target=parseFloat(g.target||0), saved=parseFloat(g.saved||0);
            const pct = target>0 ? Math.min(100,Math.round((saved/target)*100)) : 0;
            const remaining = target-saved;
            const months = monthsToDeadline(g.deadline);
            const monthlyNeeded = months && remaining>0 ? (remaining/months).toFixed(2) : null;
            return (
              <div key={g.id} style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <div style={{ width:44, height:44, minWidth:44, borderRadius:13, background:(g.color||C.red)+"1A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{g.emoji||"🎯"}</div>
                    <div>
                      <p style={{ fontWeight:600, fontSize:14, color:C.text }}>{g.name}</p>
                      {g.deadline && <p style={{ fontSize:11, color:C.text2, display:"flex", alignItems:"center", gap:3 }}><Calendar size={10} />{fmt(g.deadline)}</p>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:4 }}>
                    <button onClick={()=>openEdit(g)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:34, minWidth:34 }}><Edit2 size={13}/></button>
                    <button onClick={()=>del(g.id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:34, minWidth:34 }}><X size={14}/></button>
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, color:C.text2 }}>Progress</span>
                    <span style={{ fontSize:12, fontWeight:700, color:g.color||C.red }}>{pct}%</span>
                  </div>
                  <ProgressBar pct={pct} color={g.color||C.red} h={9} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <div><p style={{ fontSize:11, color:C.text2 }}>Saved</p><p style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:C.text }}>${saved.toLocaleString()}</p></div>
                  <div style={{ textAlign:"right" }}><p style={{ fontSize:11, color:C.text2 }}>Target</p><p style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:g.color||C.red }}>${target.toLocaleString()}</p></div>
                </div>
                {monthlyNeeded && <p style={{ fontSize:11, color:C.text2, background:C.card2, borderRadius:8, padding:"7px 10px" }}>💡 Save <strong style={{ color:C.text }}>${monthlyNeeded}/mo</strong> ({months} months) to reach your goal by deadline.</p>}
                {pct===100 && <p style={{ fontSize:12, color:C.green, fontWeight:600, marginTop:8, textAlign:"center" }}>🎉 Goal reached!</p>}
              </div>
            );
          })}
          <button onClick={()=>{ setEditItem(null); setForm(blank); setShowAdd(true); }} style={{ background:C.card, borderRadius:16, border:`2px dashed ${C.border2}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:9, cursor:"pointer", color:C.text2, minHeight:180, padding:20 }}>
            <Plus size={26}/><p style={{ fontWeight:600 }}>Add New Goal</p>
          </button>
        </div>
      )}

      {showAdd && (
        <Modal title={editItem?"Edit Goal":"Create Savings Goal"} onClose={()=>{ setShowAdd(false); setEditItem(null); setForm(blank); setFormErr({}); }}>
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Choose an Emoji</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {EMOJIS.map(e=><button key={e} onClick={()=>setForm({...form,emoji:e})} style={{ width:38, height:38, borderRadius:10, border:`2px solid ${form.emoji===e?C.red:C.border2}`, background:form.emoji===e?C.red+"18":C.card2, cursor:"pointer", fontSize:18 }}>{e}</button>)}
            </div>
          </div>
          <Input label="Goal Name *" placeholder="e.g. Emergency Fund" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} error={formErr.name} />
          <Input label="Target Amount ($) *" type="number" inputMode="decimal" placeholder="10000" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} error={formErr.target} />
          <Input label="Amount Already Saved ($)" type="number" inputMode="decimal" placeholder="0" value={form.saved} onChange={e=>setForm({...form,saved:e.target.value})} />
          <Input label="Target Deadline (Calendar)" type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
          {form.deadline && form.target && form.saved!==undefined && (
            <div style={{ background:C.card2, borderRadius:10, padding:"10px 13px", marginBottom:14 }}>
              <p style={{ fontSize:12, color:C.text2 }}>📅 {monthsToDeadline(form.deadline)} months until deadline · You need to save <strong style={{ color:C.text }}>${monthsToDeadline(form.deadline)>0?((parseFloat(form.target||0)-parseFloat(form.saved||0))/monthsToDeadline(form.deadline)).toFixed(2):"—"}/mo</strong></p>
            </div>
          )}
          <Btn onClick={save} full>{editItem?"Save Changes":"Create Goal"}</Btn>
        </Modal>
      )}
    </div>
  );
}

// ─── BILLS PAGE ───────────────────────────────────────────────────────────────
function BillsPage() {
  const { C, bills, setBills } = useApp();
  const S = useStyles();
  const blank = { name:"", amount:"", due:today(), cat:"Housing", paid:false, recurring:true };
  const [form, setForm] = useState(blank);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const BILL_CATS = ["Housing","Utilities","Transport","Phone","Insurance","Entertainment","Health","Subscriptions","Other"];

  const toggle = id => setBills(bills.map(b=>b.id===id?{...b,paid:!b.paid}:b));
  const del = id => setBills(bills.filter(b=>b.id!==id));
  const save = () => {
    if (!form.name||!form.amount) return;
    if (editItem) { setBills(bills.map(x=>x.id===editItem.id?{...editItem,...form,amount:parseFloat(form.amount)}:x)); setEditItem(null); }
    else setBills([...bills,{...form,amount:parseFloat(form.amount),id:"b_"+Date.now()}]);
    setForm(blank); setShowAdd(false);
  };
  const openEdit = b => { setEditItem(b); setForm({name:b.name,amount:String(b.amount),due:b.due||today(),cat:b.cat||"Housing",paid:b.paid||false,recurring:b.recurring||false}); setShowAdd(true); };

  const unpaid = bills.filter(b=>!b.paid);
  const upcoming = bills.filter(b=>!b.paid&&b.due&&new Date(b.due)<=new Date(Date.now()+7*86400000));
  const totalDue = unpaid.reduce((s,b)=>s+parseFloat(b.amount||0),0);

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Bills & Subscriptions" sub="Stay on top of every payment"
        action={<Btn onClick={()=>{ setEditItem(null); setForm(blank); setShowAdd(true); }} variant="sm"><Plus size={14}/>Add Bill</Btn>} />

      {bills.length>0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:18 }}>
          <StatCard label="Due Now" value={`$${totalDue.toFixed(2)}`} sub={`${unpaid.length} unpaid`} icon={AlertCircle} iconColor={C.yellow} />
          <StatCard label="Monthly Total" value={`$${bills.reduce((s,b)=>s+parseFloat(b.amount||0),0).toFixed(2)}`} sub="All recurring" icon={Calendar} iconColor={C.blue} />
          <StatCard label="Paid" value={`${bills.filter(b=>b.paid).length}/${bills.length}`} sub="This period" icon={CheckCircle} iconColor={C.green} />
        </div>
      )}

      {upcoming.length>0 && <div style={{ marginBottom:14 }}><AIInsight text={`${upcoming.length} bill(s) due within 7 days: ${upcoming.map(b=>b.name).join(", ")}`} type="warning" /></div>}

      {bills.length===0 ? (
        <EmptyState icon={FileText} title="No bills added yet" sub="Add your rent, utilities, phone, subscriptions, and other regular payments to track them here." action={<Btn onClick={()=>setShowAdd(true)} variant="sm"><Plus size={13}/>Add Bill</Btn>} />
      ) : (
        <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}` }}>
          {bills.map(b=>(
            <div key={b.id} className="hover-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderBottom:`1px solid ${C.border}`, gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                <button onClick={()=>toggle(b.id)} style={{ width:28, height:28, minWidth:28, borderRadius:8, border:`2px solid ${b.paid?C.green:C.border2}`, background:b.paid?C.green:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {b.paid&&<CheckCircle size={13} color="#fff"/>}
                </button>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:14, fontWeight:500, color:b.paid?C.text2:C.text, textDecoration:b.paid?"line-through":"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.name}</p>
                  <p style={{ fontSize:11, color:C.text2 }}>{b.cat} · Due {fmt(b.due)}{b.recurring?" · 🔁":""}</p>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:14, fontWeight:700, color:b.paid?C.green:C.text }}>${parseFloat(b.amount||0).toFixed(2)}</p>
                  <Badge color={b.paid?C.green:C.yellow}>{b.paid?"Paid":"Unpaid"}</Badge>
                </div>
                <button onClick={()=>openEdit(b)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:34 }}><Edit2 size={13}/></button>
                <button onClick={()=>del(b.id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:34 }}><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title={editItem?"Edit Bill":"Add Bill"} onClose={()=>{ setShowAdd(false); setEditItem(null); setForm(blank); }}>
          <Input label="Bill Name" placeholder="e.g. Electric Bill" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Input label="Amount ($)" type="number" inputMode="decimal" placeholder="0.00" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Category</label>
            <select style={S.input} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {BILL_CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Due Date" type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})} />
          <div style={{ marginBottom:20, display:"flex", flexDirection:"column", gap:10 }}>
            <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", fontSize:14, color:C.text2 }}><input type="checkbox" checked={form.paid} onChange={e=>setForm({...form,paid:e.target.checked})} />Mark as Paid</label>
            <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", fontSize:14, color:C.text2 }}><input type="checkbox" checked={form.recurring} onChange={e=>setForm({...form,recurring:e.target.checked})} />Recurring Bill</label>
          </div>
          <Btn onClick={save} full>{editItem?"Save Changes":"Add Bill"}</Btn>
        </Modal>
      )}
    </div>
  );
}


// ─── DEBT PAGE ────────────────────────────────────────────────────────────────
const DEBT_TYPES = ["Credit Card","Car Loan","Student Loan","Personal Loan","Medical Debt","Mortgage","Other"];

function DebtPage() {
  const { C, debts, setDebts } = useApp();
  const S = useStyles();
  const blank = { name:"", type:"Credit Card", balance:"", rate:"", min:"", due:today() };
  const [form, setForm] = useState(blank);
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [method, setMethod] = useState("avalanche");

  const save = () => {
    if (!form.name||!form.balance) return;
    const color = [C.red,"#EF4444",C.yellow,C.orange,C.purple,C.pink,C.blue][debts.length%7];
    if (editItem) { setDebts(debts.map(x=>x.id===editItem.id?{...editItem,...form,balance:parseFloat(form.balance),rate:parseFloat(form.rate||0),min:parseFloat(form.min||0)}:x)); setEditItem(null); }
    else setDebts([...debts,{...form,balance:parseFloat(form.balance),rate:parseFloat(form.rate||0),min:parseFloat(form.min||0),id:"d_"+Date.now(),color}]);
    setForm(blank); setShowAdd(false);
  };

  const openEdit = d => { setEditItem(d); setForm({name:d.name,type:d.type||"Credit Card",balance:String(d.balance),rate:String(d.rate||0),min:String(d.min||0),due:d.due||today()}); setShowAdd(true); };
  const del = id => setDebts(debts.filter(d=>d.id!==id));

  const totalDebt = debts.reduce((s,d)=>s+parseFloat(d.balance||0),0);
  const totalMin = debts.reduce((s,d)=>s+parseFloat(d.min||0),0);
  const avgRate = debts.length>0 ? (debts.reduce((s,d)=>s+parseFloat(d.rate||0),0)/debts.length) : 0;
  const sorted = method==="avalanche" ? [...debts].sort((a,b)=>parseFloat(b.rate||0)-parseFloat(a.rate||0)) : [...debts].sort((a,b)=>parseFloat(a.balance||0)-parseFloat(b.balance||0));

  // Estimate months to payoff (simplified)
  const estMonths = (balance, rate, min) => {
    if (!balance||!min) return null;
    const r = (parseFloat(rate||0)/100)/12;
    if (r===0) return Math.ceil(balance/min);
    let b=balance, m=0;
    while(b>0&&m<600){ const interest=b*r; b=b+interest-min; if(b<0)b=0; m++; }
    return m<600?m:null;
  };

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Debt Payoff Planner" sub="Track and eliminate debt strategically"
        action={<Btn onClick={()=>{ setEditItem(null); setForm(blank); setShowAdd(true); }} variant="sm"><Plus size={14}/>Add Debt</Btn>} />

      {debts.length>0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:18 }}>
          <StatCard label="Total Debt" value={`$${totalDebt.toLocaleString()}`} sub="All accounts" icon={TrendingDown} iconColor={C.red} />
          <StatCard label="Min. Payments" value={`$${totalMin.toFixed(0)}/mo`} sub="Monthly minimums" icon={CreditCard} iconColor={C.yellow} />
          <StatCard label="Avg. Interest" value={`${avgRate.toFixed(1)}%`} sub="APR average" icon={Percent} iconColor={C.orange} />
          <StatCard label="# of Debts" value={debts.length.toString()} sub="Active accounts" icon={FileText} iconColor={C.blue} />
        </div>
      )}

      {debts.length>0 && (
        <div style={{ background:C.card, borderRadius:16, padding:18, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:12 }}>Payoff Strategy</h3>
          <div style={{ background:C.card2, borderRadius:10, padding:"10px 14px", marginBottom:12 }}>
            <p style={{ fontSize:12, color:C.text2, lineHeight:1.65 }}>❄️ <strong style={{ color:C.text }}>Snowball</strong> pays smallest balance first for motivation. 📈 <strong style={{ color:C.text }}>Avalanche</strong> pays highest interest rate first to save the most money.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            {[["avalanche","Avalanche","Highest rate first — saves most money"],["snowball","Snowball","Smallest balance first — quick wins"]].map(([id,name,desc])=>(
              <button key={id} onClick={()=>setMethod(id)} style={{ padding:"12px 10px", borderRadius:12, border:`2px solid ${method===id?C.red:C.border2}`, background:method===id?C.red+"14":C.card2, cursor:"pointer", textAlign:"left" }}>
                <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:method===id?C.red:C.text, marginBottom:2 }}>{name}</p>
                <p style={{ fontSize:11, color:C.text2 }}>{desc}</p>
              </button>
            ))}
          </div>
          <AIInsight text={method==="avalanche"?`Focus extra payments on ${sorted[0]?.name||"your highest APR debt"} (${parseFloat(sorted[0]?.rate||0).toFixed(1)}% APR). Every extra dollar here saves the most in interest.`:`Start with ${sorted[0]?.name||"your smallest debt"} ($${parseFloat(sorted[0]?.balance||0).toLocaleString()}). Pay it off fast, then roll that payment to the next debt.`} type="info" />
        </div>
      )}

      {debts.length===0 ? (
        <EmptyState icon={TrendingDown} title="No debt accounts added" sub="Add your credit cards, loans, and other debts to create a payoff plan and track your progress." action={<Btn onClick={()=>setShowAdd(true)} variant="sm"><Plus size={13}/>Add Debt</Btn>} />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {sorted.map((d,i)=>{
            const balance=parseFloat(d.balance||0), rate=parseFloat(d.rate||0), min=parseFloat(d.min||0);
            const months=estMonths(balance,rate,min);
            const payoffDate = months ? new Date(Date.now()+months*30*86400000).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : null;
            const pctOfTotal = totalDebt>0 ? Math.round((balance/totalDebt)*100) : 0;
            return (
              <div key={d.id} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, gap:8 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", minWidth:0 }}>
                    <div style={{ width:34, height:34, minWidth:34, borderRadius:10, background:(d.color||C.red)+"20", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:d.color||C.red }}>#{i+1}</span>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontWeight:600, fontSize:14, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</p>
                      <p style={{ fontSize:11, color:C.text2 }}>{d.type} · Min: ${min}/mo{d.due?` · Due: ${fmt(d.due)}`:""}</p>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:700, color:d.color||C.red }}>${balance.toLocaleString()}</p>
                    <Badge color={rate>15?"#EF4444":rate>8?C.orange:C.yellow}>{rate}% APR</Badge>
                  </div>
                </div>
                <ProgressBar pct={pctOfTotal} color={d.color||C.red} h={6} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7, flexWrap:"wrap", gap:6 }}>
                  <p style={{ fontSize:11, color:C.text2 }}>{pctOfTotal}% of total debt</p>
                  {payoffDate && <p style={{ fontSize:11, color:C.green }}>🎯 Payoff by {payoffDate} (min payments)</p>}
                </div>
                <div style={{ display:"flex", gap:6, marginTop:10 }}>
                  <button onClick={()=>openEdit(d)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:32 }}><Edit2 size={13}/></button>
                  <button onClick={()=>del(d.id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5, minHeight:32 }}><Trash2 size={13}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title={editItem?"Edit Debt":"Add Debt Account"} onClose={()=>{ setShowAdd(false); setEditItem(null); setForm(blank); }}>
          <Input label="Debt Name" placeholder="e.g. Chase Credit Card" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Debt Type</label>
            <select style={S.input} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              {DEBT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Current Balance ($)" type="number" inputMode="decimal" placeholder="3500" value={form.balance} onChange={e=>setForm({...form,balance:e.target.value})} />
          <Input label="Interest Rate (APR %)" type="number" inputMode="decimal" placeholder="24.99" value={form.rate} onChange={e=>setForm({...form,rate:e.target.value})} />
          <Input label="Minimum Payment ($/mo)" type="number" inputMode="decimal" placeholder="115" value={form.min} onChange={e=>setForm({...form,min:e.target.value})} />
          <Input label="Due Date" type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})} />
          <Btn onClick={save} full>{editItem?"Save Changes":"Add Debt"}</Btn>
        </Modal>
      )}
    </div>
  );
}


// ─── AI PAGE ──────────────────────────────────────────────────────────────────
const BANNED_TOPICS = ["fraud","scam","identity theft","fake","illegal","money laundering","hack","steal","counterfeit","cheat","embezzle","forgery","fake document","evade","tax evasion"];

function AIPage() {
  const { C, FONT, expenses, income, savingsGoals, debts, bills, user } = useApp();
  const [messages, setMessages] = useState([{
    role:"assistant",
    content:`Hi ${user?.name?.split(" ")[0]||"there"}! 👋 I'm your DayeBudget AI assistant.\n\nI can help you budget smarter, save more, pay off debt, understand bills, and answer any personal finance questions you have. What would you like to work on today?\n\n⚠️ Disclaimer: DayeBudget AI provides educational guidance only and is not professional financial advice. Consult a licensed financial advisor for major financial decisions.`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const PROMPTS = ["Help me create a monthly budget","How can I save $500 this month?","Where am I overspending?","Should I pay debt or save first?","How much for emergency fund?","How can I lower my monthly expenses?","Give me beginner investing advice","How much should I save per paycheck?"];

  const isBanned = (text) => BANNED_TOPICS.some(t => text.toLowerCase().includes(t));

  const buildContext = () => {
    const inc = parseFloat(income)||0;
    const totalExp = expenses.reduce((s,e)=>s+Math.abs(parseFloat(e.amount)||0),0);
    const totalDebt = debts.reduce((s,d)=>s+parseFloat(d.balance||0),0);
    const totalSaved = savingsGoals.reduce((s,g)=>s+parseFloat(g.saved||0),0);
    const unpaidBills = bills.filter(b=>!b.paid).reduce((s,b)=>s+parseFloat(b.amount||0),0);
    return `User financial snapshot: Monthly income $${inc}, Monthly expenses $${totalExp.toFixed(2)}, Total savings $${totalSaved}, Total debt $${totalDebt}, Unpaid bills $${unpaidBills.toFixed(2)}, Savings goals: ${savingsGoals.length}, Active debts: ${debts.length}. Top expense categories: ${Object.entries(expenses.reduce((a,e)=>{a[e.cat]=(a[e.cat]||0)+Math.abs(parseFloat(e.amount||0));return a;},{})).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k} $${v.toFixed(0)}`).join(", ")||"none yet"}.`;
  };

  const send = async (text) => {
    const msg = (text||input).trim();
    if (!msg || loading) return;
    setInput("");

    if (isBanned(msg)) {
      setMessages(prev => [...prev,
        { role:"user", content:msg },
        { role:"assistant", content:"I can't help with fraud, scams, or illegal financial activity. 🚫\n\nI can help you:\n• Build a legal budget\n• Save money legitimately\n• Pay down debt\n• Protect yourself FROM scams\n• Understand your rights as a consumer\n\nWhat financial goal would you like to work on?" }
      ]);
      return;
    }

    const newMsgs = [...messages, { role:"user", content:msg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:700,
          system:`You are DayeBudget AI, a friendly, knowledgeable, and honest personal finance assistant. Give concise (2-4 paragraphs), practical, encouraging advice. Use emojis occasionally. Be realistic — give real numbers and strategies. NEVER help with fraud, scams, identity theft, illegal activity, or anything harmful. If asked, refuse politely and redirect to legal financial advice. ${buildContext()} Always end investment-related answers with: "⚠️ AI advice is educational only — not professional financial advice."`,
          messages:newMsgs.map(m=>({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role:"assistant", content:data.content?.[0]?.text || "I had trouble connecting. Please try again!" }]);
    } catch {
      setMessages([...newMsgs, { role:"assistant", content:"Connection issue — please try again.\n\nQuick tip: Start by listing all your monthly expenses and compare to your income. That's the foundation of any good budget! 💡" }]);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  return (
    <div style={{ display:"flex", flexDirection:"column", background:C.bg, height:"100%" }}>
      <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${C.border}`, background:C.bg2, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, minWidth:40, borderRadius:12, background:C.red, display:"flex", alignItems:"center", justifyContent:"center" }}><MessageSquare size={19} color="#fff" /></div>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text }}>AI Budget Assistant</h2>
            <p style={{ fontSize:11, color:C.green }}>● Online · Powered by Claude AI</p>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:14, WebkitOverflowScrolling:"touch" }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:9, alignItems:"flex-end" }}>
            {m.role==="assistant" && <div style={{ width:30, height:30, minWidth:30, borderRadius:8, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:2 }}><MessageSquare size={13} color="#fff" /></div>}
            <div style={{ maxWidth:"80%", background:m.role==="user"?C.red:C.card, border:m.role==="assistant"?`1px solid ${C.border2}`:"none", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"11px 14px" }}>
              <p style={{ fontSize:13, lineHeight:1.65, color:C.text, whiteSpace:"pre-wrap", margin:0, wordBreak:"break-word" }}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:9, alignItems:"flex-end" }}>
            <div style={{ width:30, height:30, minWidth:30, borderRadius:8, background:C.red, display:"flex", alignItems:"center", justifyContent:"center" }}><MessageSquare size={13} color="#fff" /></div>
            <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:"16px 16px 16px 4px", padding:"13px 16px", display:"flex", gap:5 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.text2, animation:`bounce 1.2s infinite ${i*0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length<=2 && (
        <div style={{ padding:"0 14px 10px", display:"flex", gap:8, flexWrap:"wrap" }}>
          {PROMPTS.map(p=><button key={p} onClick={()=>send(p)} style={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:20, padding:"8px 14px", fontSize:12, color:C.text2, cursor:"pointer", fontFamily:FONT, minHeight:36 }}>{p}</button>)}
        </div>
      )}

      <div style={{ padding:"10px 14px 16px", borderTop:`1px solid ${C.border}`, background:C.bg2, flexShrink:0 }}>
        <div style={{ display:"flex", gap:9, alignItems:"flex-end" }}>
          <textarea style={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, padding:"13px 14px", color:C.text, fontSize:16, width:"100%", outline:"none", fontFamily:FONT, minHeight:50, WebkitAppearance:"none", resize:"none", flex:1 }} placeholder="Ask about your finances..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }} />
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{ background:C.red, color:"#fff", border:"none", borderRadius:12, padding:"13px 18px", cursor:"pointer", fontWeight:600, fontSize:14, fontFamily:FONT, minHeight:50, opacity:(loading||!input.trim())?0.5:1, flexShrink:0 }}>Send</button>
        </div>
        <p style={{ fontSize:10, color:C.text3, marginTop:6 }}>⚠️ Educational guidance only — not professional financial advice. Do not share personal banking credentials here.</p>
      </div>
    </div>
  );
}


// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage() {
  const { C, expenses, income, savingsGoals, debts, bills } = useApp();
  const inc = parseFloat(income)||0;
  const totalExp = expenses.reduce((s,e)=>s+Math.abs(parseFloat(e.amount)||0),0);
  const hasData = inc>0 || expenses.length>0 || savingsGoals.length>0;

  const catSpend = {};
  expenses.forEach(e => { catSpend[e.cat]=(catSpend[e.cat]||0)+Math.abs(parseFloat(e.amount)||0); });
  const pieData = Object.entries(catSpend).map(([name,value],i) => ({ name, value:Math.round(value), color:[C.red,C.blue,C.green,C.yellow,C.purple,C.teal,C.orange,C.pink][i%8] }));

  const score = Math.min(100, Math.max(0, Math.round(
    (inc>0?Math.min(40,(((inc-totalExp)/inc)*100)):0) +
    (savingsGoals.length>0?20:0) +
    (debts.length===0?20:Math.max(0,20-(debts.reduce((s,d)=>s+parseFloat(d.balance||0),0)/20000)*10)) +
    (bills.length>0?Math.round((bills.filter(b=>b.paid).length/bills.length)*20):0)
  )));

  const exportReport = () => {
    const lines = [
      "DayeBudget AI - Financial Report",
      `Date: ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`,
      "",
      `Monthly Income: $${inc.toFixed(2)}`,
      `Total Expenses: $${totalExp.toFixed(2)}`,
      `Remaining: $${(inc-totalExp).toFixed(2)}`,
      `Budget Health Score: ${score}/100`,
      "",
      "Spending by Category:",
      ...pieData.map(d=>`  ${d.name}: $${d.value}`),
      "",
      `Savings Goals: ${savingsGoals.length}`,
      `Total Saved: $${savingsGoals.reduce((s,g)=>s+parseFloat(g.saved||0),0).toLocaleString()}`,
      "",
      `Total Debt: $${debts.reduce((s,d)=>s+parseFloat(d.balance||0),0).toLocaleString()}`,
      "",
      "Note: AI advice is educational only — not professional financial advice.",
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `DayeBudget_Report_${today()}.txt`;
    a.click();
  };

  if (!hasData) return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Reports & Insights" sub="Deep dive into your financial health" />
      <EmptyState icon={BarChart2} title="Not enough data yet" sub="Add income, expenses, bills, or savings goals to generate your financial report. The more you track, the more insights you'll see." action={null} />
    </div>
  );

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Reports & Insights" sub="Based on your actual financial data"
        action={<Btn onClick={exportReport} variant="ghost" style={{ fontSize:13, padding:"9px 14px", minHeight:38, gap:5 }}><Download size={14}/>Export</Btn>} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:18 }}>
        <StatCard label="Monthly Income" value={inc>0?`$${inc.toLocaleString("en",{maximumFractionDigits:0})}`:"—"} icon={TrendingUp} iconColor={C.green} />
        <StatCard label="Monthly Expenses" value={`$${totalExp.toFixed(0)}`} sub={`${expenses.length} transactions`} icon={CreditCard} iconColor={C.red} />
        <StatCard label="Savings Rate" value={inc>0?`${(((inc-totalExp)/inc)*100).toFixed(1)}%`:"—"} sub={inc>0?"Of income saved":undefined} icon={Target} iconColor={C.blue} />
        <StatCard label="Budget Score" value={`${score}/100`} sub={score>=80?"Excellent":score>=60?"Good":score>=40?"Needs Work":"High Risk"} icon={Award} iconColor={score>=80?C.green:score>=60?C.yellow:score>=40?C.orange:"#EF4444"} />
      </div>

      {pieData.length>0 && (
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>Spending by Category</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16 }}>
            <div style={{ height:200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" strokeWidth={0}>
                    {pieData.map((e,i)=><Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, color:C.text, fontSize:12 }} formatter={(v)=>[`$${v}`,""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, justifyContent:"center" }}>
              {pieData.map(d=>{
                const total=pieData.reduce((s,x)=>s+x.value,0);
                const pct=total>0?Math.round(d.value/total*100):0;
                return (
                  <div key={d.name}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:8, height:8, borderRadius:2, background:d.color }} /><span style={{ fontSize:12, color:C.text }}>{d.name}</span></div>
                      <span style={{ fontSize:12, fontWeight:600, color:C.text }}>${d.value} <span style={{ color:C.text2 }}>({pct}%)</span></span>
                    </div>
                    <ProgressBar pct={pct} color={d.color} h={4} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {savingsGoals.length>0 && (
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>Savings Goals Progress</h3>
          {savingsGoals.map(g=>{
            const target=parseFloat(g.target||0), saved=parseFloat(g.saved||0);
            const pct=target>0?Math.min(100,Math.round((saved/target)*100)):0;
            return (
              <div key={g.id} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, color:C.text }}>{g.emoji||"🎯"} {g.name}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.text }}>${saved.toLocaleString()} / ${target.toLocaleString()} ({pct}%)</span>
                </div>
                <ProgressBar pct={pct} color={g.color||C.green} h={8} />
              </div>
            );
          })}
        </div>
      )}

      {debts.length>0 && (
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>Debt Overview</h3>
          {debts.map(d=>{
            const total=debts.reduce((s,x)=>s+parseFloat(x.balance||0),0);
            const pct=total>0?Math.round((parseFloat(d.balance||0)/total)*100):0;
            return (
              <div key={d.id} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, color:C.text }}>{d.name}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:d.color||C.red }}>${parseFloat(d.balance||0).toLocaleString()} · {parseFloat(d.rate||0).toFixed(1)}% APR</span>
                </div>
                <ProgressBar pct={pct} color={d.color||C.red} h={7} />
              </div>
            );
          })}
          <p style={{ fontSize:12, color:C.text2, marginTop:10 }}>Total debt: <strong style={{ color:C.text }}>${debts.reduce((s,d)=>s+parseFloat(d.balance||0),0).toLocaleString()}</strong></p>
        </div>
      )}

      {bills.length>0 && (
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:12 }}>Bills Status</h3>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <div style={{ background:C.green+"14", borderRadius:10, padding:"12px 16px", flex:1, minWidth:120 }}>
              <p style={{ fontSize:11, color:C.text2 }}>Paid</p>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:C.green }}>{bills.filter(b=>b.paid).length}</p>
            </div>
            <div style={{ background:C.yellow+"14", borderRadius:10, padding:"12px 16px", flex:1, minWidth:120 }}>
              <p style={{ fontSize:11, color:C.text2 }}>Unpaid</p>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:C.yellow }}>{bills.filter(b=>!b.paid).length}</p>
            </div>
            <div style={{ background:C.blue+"14", borderRadius:10, padding:"12px 16px", flex:1, minWidth:120 }}>
              <p style={{ fontSize:11, color:C.text2 }}>Amount Due</p>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:C.blue }}>${bills.filter(b=>!b.paid).reduce((s,b)=>s+parseFloat(b.amount||0),0).toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── LEARN PAGE ───────────────────────────────────────────────────────────────
const LESSONS = [
  { id:"5030", icon:"💰", title:"The 50/30/20 Rule", tag:"Budgeting", color:"#3B82F6",
    body:"A simple budgeting method that divides your after-tax income into three categories.",
    sections:[
      { heading:"What it means", text:"50% goes to Needs (rent, food, utilities), 30% to Wants (dining, entertainment, hobbies), and 20% to Savings & Debt payoff." },
      { heading:"Example on a $2,000 paycheck", text:"$1,000 for needs · $600 for wants · $400 for savings and debt. Simple and sustainable." },
      { heading:"How to apply it", text:"First, calculate your monthly after-tax income. Then set budget limits for each category using the percentages above. Track weekly to stay on target." },
    ],
    tip:"Start tracking just 1 week of spending to see where your money really goes.",
    quiz:["What % goes to needs in 50/30/20?","What's the 'wants' category percentage?","How much should savings be?"],
  },
  { id:"emfund", icon:"🛡️", title:"Emergency Fund Basics", tag:"Saving", color:"#22C55E",
    body:"Your financial safety net for unexpected expenses like job loss, medical bills, or car repairs.",
    sections:[
      { heading:"Why you need one", text:"Without an emergency fund, unexpected expenses force you into credit card debt. An emergency fund breaks this cycle." },
      { heading:"How much to save", text:"Start with $1,000 as a starter emergency fund. Then build to 3 months of expenses. Ideal goal is 6 months of expenses." },
      { heading:"Where to keep it", text:"Use a High-Yield Savings Account (HYSA) paying 4-5% APY. Keep it separate from your checking account so you're not tempted to spend it." },
    ],
    tip:"Automate $25-$50 per paycheck into a HYSA to build your fund without thinking about it.",
    quiz:["What's the starter emergency fund goal?","How many months of expenses should you save?"],
  },
  { id:"compound", icon:"📈", title:"Compound Interest", tag:"Investing", color:"#8B5CF6",
    body:"The 8th wonder of the world — your money earns interest, then that interest earns interest.",
    sections:[
      { heading:"How it works", text:"$1,000 invested at 7% per year becomes $1,070 after year 1. In year 2, you earn 7% on $1,070 — not just the original $1,000. It snowballs." },
      { heading:"The power of time", text:"$1,000 at 7% = $7,612 in 30 years. The same $1,000 waiting 10 extra years = only $3,870. Starting early is worth more than the amount." },
      { heading:"Rule of 72", text:"Divide 72 by your interest rate to find how long it takes to double your money. At 7%, your money doubles every ~10 years." },
    ],
    tip:"Even $50/month invested starting today beats $500/month starting 10 years from now.",
  },
  { id:"debt", icon:"❄️", title:"Debt Snowball vs Avalanche", tag:"Debt", color:"#EF4444",
    body:"Two proven strategies to pay off debt faster and smarter.",
    sections:[
      { heading:"Snowball Method", text:"Pay minimums on all debts. Put ALL extra money on the smallest balance first. Once paid off, roll that payment to the next debt. Motivating — quick wins!" },
      { heading:"Avalanche Method", text:"Pay minimums on all debts. Put ALL extra money on the HIGHEST interest rate first. Mathematically saves the most money in interest charges." },
      { heading:"Which is better?", text:"Avalanche saves more money. Snowball provides more motivation. Both beat doing nothing. Choose the one you'll actually stick with." },
    ],
    tip:"List all your debts with balances and interest rates. Pick your method and attack the priority debt aggressively.",
  },
  { id:"credit", icon:"💳", title:"Credit Score Basics", tag:"Credit", color:"#F59E0B",
    body:"Your credit score affects loans, renting apartments, and even job applications.",
    sections:[
      { heading:"How it's calculated (FICO)", text:"Payment History 35% · Credit Utilization 30% · Length of Credit 15% · Credit Mix 10% · New Credit 10%" },
      { heading:"Boost your score fast", text:"Pay every bill on time. Keep credit card balances below 30% of the limit. Don't close old accounts. These three alone can significantly improve your score." },
      { heading:"What's a good score?", text:"750+ = Excellent (best rates). 700-749 = Good. 650-699 = Fair. Under 650 = Needs work. Under 580 = Poor (hard to get approved)." },
    ],
    tip:"Set up autopay for minimum payments to never miss a payment — the single biggest factor in your score.",
  },
  { id:"hysa", icon:"🏦", title:"High-Yield Savings Accounts", tag:"Saving", color:"#14B8A6",
    body:"Earn 40-50x more interest than a traditional bank savings account.",
    sections:[
      { heading:"What is an HYSA?", text:"An HYSA is a savings account typically offered by online banks that pays 4-5% APY (annual percentage yield) instead of the 0.01% at big banks." },
      { heading:"Best uses for an HYSA", text:"Emergency fund · Short-term savings goals · Any money you'll need in 1-3 years but want to earn interest on." },
      { heading:"Popular HYSA options", text:"Marcus by Goldman Sachs, Ally Bank, SoFi, Discover, and American Express Savings. All are FDIC insured up to $250,000." },
    ],
    tip:"Transfer your emergency fund to an HYSA today. Even $5,000 earns ~$200/year more than a regular savings account.",
  },
  { id:"index", icon:"📊", title:"Index Fund Investing", tag:"Investing", color:"#8B5CF6",
    body:"The most proven, low-cost way for beginners to invest in the stock market.",
    sections:[
      { heading:"What is an index fund?", text:"An index fund tracks a market index like the S&P 500, holding shares in hundreds of companies automatically. No active management needed." },
      { heading:"Why they work", text:"Over any 20-year period, the S&P 500 has returned an average of ~10%/year. Low-cost index funds beat 90%+ of actively managed funds over 10+ years." },
      { heading:"How to get started", text:"Open a Roth IRA or brokerage account. Buy a total market index fund like VTI or VOO. Invest consistently regardless of market conditions (dollar-cost averaging)." },
    ],
    tip:"Warren Buffett's recommendation for most people: just invest in a low-cost S&P 500 index fund consistently. ⚠️ AI advice is educational — not professional financial advice.",
  },
  { id:"roth", icon:"📋", title:"Roth vs Traditional IRA", tag:"Retirement", color:"#14B8A6",
    body:"Two types of retirement accounts with different tax advantages.",
    sections:[
      { heading:"Roth IRA", text:"You pay taxes NOW on contributions. Your money grows tax-free. Withdrawals in retirement are tax-free. Best if you expect to be in a higher tax bracket later." },
      { heading:"Traditional IRA", text:"You get a tax DEDUCTION now. Money grows tax-deferred. You pay taxes when you withdraw in retirement. Best if you're in a higher bracket now than you expect to be later." },
      { heading:"2024 contribution limits", text:"You can contribute up to $7,000/year ($8,000 if age 50+) to IRAs. Many financial advisors recommend maxing these out before investing in a regular brokerage account." },
    ],
    tip:"If you're young and in a lower tax bracket, a Roth IRA is usually the better choice. ⚠️ AI advice is educational — not professional financial advice.",
  },
  { id:"zerobased", icon:"⚡", title:"Zero-Based Budgeting", tag:"Budgeting", color:"#3B82F6",
    body:"Give every single dollar a job so nothing is wasted.",
    sections:[
      { heading:"The concept", text:"Income minus ALL expenses, savings, and investments equals zero. Every dollar is assigned before the month begins. Nothing is unaccounted for." },
      { heading:"How to do it", text:"1. Write down monthly income. 2. List every expense (fixed and variable). 3. Assign remaining money to savings/debt. 4. Adjust until income - expenses = $0." },
      { heading:"Why it works", text:"Forces intentional spending. Eliminates mystery spending. Many people discover hundreds of dollars 'disappearing' each month when they start this method." },
    ],
    tip:"Do your zero-based budget the last week of each month for the following month. Review and adjust throughout the month.",
  },
  { id:"taxes", icon:"📑", title:"Tax Basics", tag:"Taxes", color:"#F97316",
    body:"Understanding taxes helps you keep more of your money legally.",
    sections:[
      { heading:"W-2 vs 1099", text:"W-2 = employee (employer withholds taxes). 1099 = contractor/freelancer (you owe taxes yourself). 1099 workers should set aside 25-30% of income for taxes." },
      { heading:"Tax deductions and credits", text:"Standard deduction reduces your taxable income. Credits reduce your actual tax bill dollar-for-dollar. Look for education credits, child tax credits, and retirement contribution deductions." },
      { heading:"Key deadlines", text:"April 15 is the annual tax filing deadline. If you owe money, penalties apply for late filing. Extensions give you more time to FILE but not to PAY." },
    ],
    tip:"Use free IRS Free File software if your income is under $73,000. Consider a tax professional for complex situations.",
  },
  { id:"homebuying", icon:"🏠", title:"Home Buying Basics", tag:"Home Buying", color:"#22C55E",
    body:"Buying a home is the largest purchase most people make. Know the basics before you start.",
    sections:[
      { heading:"The 28/36 rule", text:"Your mortgage payment shouldn't exceed 28% of gross income. Total debt payments (including mortgage) shouldn't exceed 36% of gross income." },
      { heading:"Down payment options", text:"Conventional loan: 20% down avoids PMI. FHA loan: 3.5% down with good credit. VA/USDA: 0% down for qualifying buyers. More down = lower monthly payment." },
      { heading:"Hidden costs of buying", text:"Closing costs (2-5% of loan). Property taxes. Homeowner's insurance. HOA fees. Maintenance (budget 1-2% of home value per year). Don't buy at the max you qualify for." },
    ],
    tip:"Check your credit score and build a down payment fund BEFORE starting the home search. Get pre-approved to know your real budget.",
  },
  { id:"carloan", icon:"🚗", title:"Car Loans & Auto Finance", tag:"Car Loans", color:"#EC4899",
    body:"Cars are expensive. Know how to finance smarter and avoid common traps.",
    sections:[
      { heading:"The 20/4/10 rule", text:"Put 20% down. Finance for no more than 4 years. Keep total car costs under 10% of gross income. Following this rule prevents being 'car poor.'" },
      { heading:"New vs used", text:"New cars lose 15-25% of value in the first year. A 2-3 year old used car gives you most of the reliability at 30-40% less cost. Run the numbers before deciding." },
      { heading:"Dealer financing traps", text:"Focus on total price, not monthly payment. Extended warranties are usually not worth it. Don't let dealers stretch the loan to 72-84 months just to lower payments." },
    ],
    tip:"Get pre-approved by your bank or credit union BEFORE visiting a dealership. This gives you negotiating power and often better rates.",
  },
];

function LearnPage() {
  const { C, FONT } = useApp();
  const [activeTag, setActiveTag] = useState("All");
  const [openLesson, setOpenLesson] = useState(null);
  const [simplify, setSimplify] = useState(false);
  const [simplifyText, setSimplifyText] = useState("");
  const [simplifyLoading, setSimplifyLoading] = useState(false);

  const tags = ["All",...Array.from(new Set(LESSONS.map(l=>l.tag)))];
  const filtered = activeTag==="All" ? LESSONS : LESSONS.filter(l=>l.tag===activeTag);

  const handleSimplify = async (lesson) => {
    setSimplifyLoading(true); setSimplify(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:400,
          system:"Explain financial concepts in the simplest possible terms for a complete beginner. Use short sentences, simple words, and a friendly tone. No jargon. Max 150 words.",
          messages:[{ role:"user", content:`Explain "${lesson.title}" in the simplest terms possible for a beginner who knows nothing about personal finance.` }],
        }),
      });
      const data = await res.json();
      setSimplifyText(data.content?.[0]?.text || "");
    } catch { setSimplifyText("Could not load simplified explanation. Please try again."); }
    setSimplifyLoading(false);
  };

  if (openLesson) {
    const l = openLesson;
    return (
      <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
        <button onClick={()=>{ setOpenLesson(null); setSimplify(false); setSimplifyText(""); }} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 14px", color:C.text2, cursor:"pointer", fontFamily:FONT, fontSize:13, display:"flex", alignItems:"center", gap:7, marginBottom:20, minHeight:38 }}>← Back to Lessons</button>
        <div style={{ background:l.color+"14", border:`1px solid ${l.color}30`, borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:32 }}>{l.icon}</span>
            <div>
              <Badge color={l.color}>{l.tag}</Badge>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:C.text, marginTop:5 }}>{l.title}</h1>
            </div>
          </div>
          <p style={{ fontSize:14, color:C.text2, marginTop:10, lineHeight:1.65 }}>{l.body}</p>
        </div>
        {l.sections.map((s,i)=>(
          <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>{s.heading}</h3>
            <p style={{ fontSize:13, color:C.text2, lineHeight:1.7 }}>{s.text}</p>
          </div>
        ))}
        {l.tip && (
          <div style={{ background:C.yellow+"14", border:`1px solid ${C.yellow}30`, borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
            <p style={{ fontSize:13, color:C.text, lineHeight:1.6 }}>💡 <strong>Action Tip:</strong> {l.tip}</p>
          </div>
        )}
        <div style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text, marginBottom:10 }}>🤖 Need a simpler explanation?</h3>
          <button onClick={()=>handleSimplify(l)} style={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:9, padding:"10px 16px", color:C.text2, cursor:"pointer", fontFamily:FONT, fontSize:13, minHeight:40 }}>
            Explain this simpler with AI
          </button>
          {simplify && (
            <div style={{ marginTop:12, background:C.card2, borderRadius:10, padding:"12px 14px" }}>
              {simplifyLoading ? <p style={{ fontSize:13, color:C.text2 }}>Loading...</p> : <p style={{ fontSize:13, color:C.text, lineHeight:1.65, whiteSpace:"pre-wrap" }}>{simplifyText}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Financial Education" sub="Click any lesson to learn more" />
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:20 }}>
        {tags.map(t=><button key={t} onClick={()=>setActiveTag(t)} style={{ background:activeTag===t?C.red:C.card2, color:activeTag===t?"#fff":C.text2, border:`1px solid ${C.border2}`, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:12, fontFamily:FONT, fontWeight:activeTag===t?600:400, minHeight:34 }}>{t}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:14 }}>
        {filtered.map(l=>(
          <button key={l.id} onClick={()=>{ setOpenLesson(l); setSimplify(false); setSimplifyText(""); }} style={{ background:C.card, borderRadius:16, padding:18, border:`1px solid ${C.border}`, textAlign:"left", cursor:"pointer", transition:"all .15s" }} className="hover-btn">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <span style={{ fontSize:28 }}>{l.icon}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Badge color={l.color}>{l.tag}</Badge>
                <ChevronRight size={14} color={C.text3} />
              </div>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>{l.title}</h3>
            <p style={{ fontSize:12, color:C.text2, lineHeight:1.6 }}>{l.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}


// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ onLogout }) {
  const { C, FONT, user, login, dark, setDark, subscription, setSubscription } = useApp();
  const S = useStyles();
  const [form, setForm] = useState({ name:user?.name||"", email:user?.email||"", username:user?.username||user?.email?.split("@")[0]||"" });
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(() => storage.get("db_notifs_"+(user?.id||""), { bills:true, budget:true, ai:false }));
  const [showSub, setShowSub] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelStep, setCancelStep] = useState(1); // 1=confirm, 2=reason, 3=done
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => { storage.set("db_notifs_"+(user?.id||""), notifs); }, [notifs, user]);

  const saveProfile = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const updated = { ...user, ...form };
    login(updated, !!localStorage.getItem("db_remember"));
    if (localStorage.getItem("db_remember")) localStorage.setItem("db_remember", JSON.stringify(updated));
    else sessionStorage.setItem("db_session", JSON.stringify(updated));
    setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  const updatePw = () => {
    if (!pwForm.newPw) { setPwMsg("Enter a new password"); return; }
    if (pwForm.newPw.length<8) { setPwMsg("Minimum 8 characters"); return; }
    if (pwForm.newPw!==pwForm.confirm) { setPwMsg("Passwords don't match"); return; }
    setPwMsg("✅ Password updated successfully!");
    setPwForm({ current:"", newPw:"", confirm:"" });
    setTimeout(()=>setPwMsg(""), 3000);
  };

  const confirmCancel = () => {
    if (cancelStep===1) { setCancelStep(2); return; }
    if (cancelStep===2) {
      setSubscription({ ...subscription, plan:"Free", cancelledAt:today() });
      const updated = { ...user, plan:"Free" };
      login(updated, !!localStorage.getItem("db_remember"));
      setCancelStep(3);
      return;
    }
    setShowCancelConfirm(false); setShowSub(false); setCancelStep(1); setCancelReason("");
  };

  const isPremium = subscription?.plan==="Premium" || user?.plan==="Premium";

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="Profile & Settings" sub="Manage your account and preferences" />

      <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ width:68, height:68, minWidth:68, borderRadius:18, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#fff" }}>{(form.name||"?").slice(0,2).toUpperCase()}</div>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:700, color:C.text }}>{form.name||"User"}</h2>
          <p style={{ color:C.text2, fontSize:13 }}>{form.email}</p>
          <div style={{ marginTop:6, display:"flex", gap:8, flexWrap:"wrap" }}>
            <Badge color={isPremium?C.yellow:C.text2}>{isPremium?"Premium":"Free"}</Badge>
            <Badge color={C.green}>Account Active</Badge>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>Personal Information</h3>
            <Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} autoComplete="name" />
            <Input label="Email Address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} autoComplete="email" />
            <Input label="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} autoComplete="username" />
            <Btn onClick={saveProfile} full style={{ gap:8 }}>
              {saved?<><CheckCircle size={15}/>Saved!</>:"Save Changes"}
            </Btn>
          </div>

          <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>Update Password</h3>
            <Input label="Current Password" type="password" placeholder="••••••••" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})} autoComplete="current-password" />
            <Input label="New Password" type="password" placeholder="Min. 8 characters" value={pwForm.newPw} onChange={e=>setPwForm({...pwForm,newPw:e.target.value})} autoComplete="new-password" />
            <Input label="Confirm New Password" type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} autoComplete="new-password" />
            {pwMsg && <p style={{ fontSize:12, color:pwMsg.startsWith("✅")?C.green:"#EF4444", marginBottom:12 }}>{pwMsg}</p>}
            <Btn onClick={updatePw} variant="ghost" full>Update Password</Btn>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>Preferences</h3>
            {[
              ["Dark Mode","Interface appearance",dark,()=>setDark(!dark)],
              ["Bill Reminders","Before bills are due",notifs.bills,()=>setNotifs({...notifs,bills:!notifs.bills})],
              ["Budget Alerts","Near spending limit",notifs.budget,()=>setNotifs({...notifs,budget:!notifs.budget})],
              ["AI Digest","Weekly financial summary",notifs.ai,()=>setNotifs({...notifs,ai:!notifs.ai})],
            ].map(([name,desc,val,toggle])=>(
              <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:500, color:C.text }}>{name}</p>
                  <p style={{ fontSize:11, color:C.text2 }}>{desc}</p>
                </div>
                <button onClick={toggle} style={{ width:50, height:28, borderRadius:14, background:val?C.red:C.border2, border:"none", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                  <div style={{ width:22, height:22, borderRadius:11, background:"#fff", position:"absolute", top:3, left:val?24:3, transition:"left .2s" }} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ background:isPremium?C.red+"10":C.card2, border:`1px solid ${isPremium?C.red+"30":C.border}`, borderRadius:16, padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text }}>Your Plan</h3>
              <Badge color={isPremium?C.yellow:C.text2}>{isPremium?"Premium":"Free"}</Badge>
            </div>
            {isPremium ? (
              <>
                <p style={{ fontSize:13, color:C.text2, marginBottom:4 }}>$9.99/month · Renews {fmt(subscription?.renewDate)}</p>
                <p style={{ fontSize:12, color:C.text2, marginBottom:14 }}>Unlimited AI · Advanced reports · Debt planner · All features</p>
                <Btn onClick={()=>setShowSub(true)} variant="ghost" style={{ fontSize:13, minHeight:38, padding:"9px 16px" }}>Manage Subscription</Btn>
              </>
            ) : (
              <>
                <p style={{ fontSize:13, color:C.text2, marginBottom:4 }}>Basic budgeting · 5 AI questions/mo</p>
                {subscription?.cancelledAt && <p style={{ fontSize:12, color:C.yellow, marginBottom:10 }}>Cancelled on {fmt(subscription.cancelledAt)}</p>}
                <Btn style={{ fontSize:13, minHeight:38, padding:"9px 16px" }}>Upgrade to Premium</Btn>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop:20, textAlign:"center" }}>
        <button onClick={onLogout} style={{ background:"#EF444418", color:"#EF4444", border:"1px solid #EF444430", borderRadius:10, padding:"12px 28px", cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:FONT, display:"inline-flex", alignItems:"center", gap:8, minHeight:48 }}>
          <LogOut size={16}/>Log Out
        </button>
      </div>
      <div style={{ marginTop:16, padding:"13px 16px", background:C.card2, borderRadius:12, border:`1px solid ${C.border}` }}>
        <p style={{ fontSize:12, color:C.text2, lineHeight:1.7 }}>🔒 <strong style={{ color:C.text }}>Privacy & Security:</strong> Your financial data is encrypted and never sold to third parties. AI advice is educational — consult a licensed financial advisor for major decisions.</p>
      </div>

      {showSub && !showCancelConfirm && (
        <Modal title="Manage Subscription" onClose={()=>setShowSub(false)}>
          <div style={{ background:C.card2, borderRadius:12, padding:16, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:14, color:C.text2 }}>Plan</span><Badge color={C.yellow}>Premium</Badge></div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ fontSize:14, color:C.text2 }}>Amount</span><span style={{ fontSize:14, fontWeight:600, color:C.text }}>$9.99/month</span></div>
            <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:14, color:C.text2 }}>Renews</span><span style={{ fontSize:14, color:C.text }}>{fmt(subscription?.renewDate)}</span></div>
          </div>
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:8 }}>Premium includes:</p>
            {["Unlimited AI assistant","Advanced reports & charts","Debt payoff planner","Investing education","Subscription tracker","Priority support"].map(f=>(
              <div key={f} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}><CheckCircle size={14} color={C.green}/><span style={{ fontSize:13, color:C.text2 }}>{f}</span></div>
            ))}
          </div>
          <Btn onClick={()=>setShowCancelConfirm(true)} variant="ghost" full style={{ color:"#EF4444", borderColor:"#EF444440", marginBottom:8 }}>Cancel Subscription</Btn>
          <Btn onClick={()=>setShowSub(false)} full variant="ghost">Keep Premium</Btn>
        </Modal>
      )}

      {showSub && showCancelConfirm && (
        <Modal title={cancelStep===3?"Subscription Cancelled":"Cancel Subscription"} onClose={()=>{ setShowCancelConfirm(false); setShowSub(false); setCancelStep(1); setCancelReason(""); }}>
          {cancelStep===1 && (
            <>
              <p style={{ fontSize:14, color:C.text2, lineHeight:1.65, marginBottom:20 }}>Are you sure you want to cancel your Premium subscription? You'll lose access to unlimited AI, advanced reports, and debt payoff features.</p>
              <div style={{ display:"flex", gap:10 }}>
                <Btn onClick={()=>{ setShowCancelConfirm(false); }} variant="ghost" style={{ flex:1 }}>Keep Subscription</Btn>
                <Btn onClick={confirmCancel} style={{ flex:1, background:"#EF4444" }}>Continue →</Btn>
              </div>
            </>
          )}
          {cancelStep===2 && (
            <>
              <p style={{ fontSize:14, color:C.text2, marginBottom:12 }}>We're sorry to see you go. Help us improve by sharing why you're cancelling:</p>
              {["Too expensive","Not using it enough","Missing features I need","Found a better app","Financial situation changed","Other"].map(r=>(
                <button key={r} onClick={()=>setCancelReason(r)} style={{ display:"block", width:"100%", padding:"11px 14px", marginBottom:8, borderRadius:10, border:`2px solid ${cancelReason===r?C.red:C.border2}`, background:cancelReason===r?C.red+"14":C.card2, cursor:"pointer", textAlign:"left", color:C.text, fontFamily:FONT, fontSize:13 }}>{r}</button>
              ))}
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <Btn onClick={()=>setCancelStep(1)} variant="ghost" style={{ flex:1 }}>← Back</Btn>
                <Btn onClick={confirmCancel} style={{ flex:1, background:"#EF4444" }}>Confirm Cancel</Btn>
              </div>
            </>
          )}
          {cancelStep===3 && (
            <>
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <span style={{ fontSize:48 }}>😢</span>
                <p style={{ fontSize:15, fontWeight:600, color:C.text, marginTop:12, marginBottom:8 }}>Subscription Cancelled</p>
                <p style={{ fontSize:13, color:C.text2, lineHeight:1.65 }}>Your Premium access is active until {fmt(subscription?.renewDate)}. After that, your account will switch to the Free plan.</p>
              </div>
              <Btn onClick={()=>{ setShowCancelConfirm(false); setShowSub(false); setCancelStep(1); setCancelReason(""); }} full variant="ghost" style={{ marginTop:16 }}>Close</Btn>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}


// ─── FEATURE UPDATES PAGE ─────────────────────────────────────────────────────
const UPDATE_CATS = ["New Feature","Bug Fix","Improvement","Coming Soon","Security Update"];
const UPDATE_COLORS = { "New Feature":"#22C55E", "Bug Fix":"#EF4444", "Improvement":"#3B82F6", "Coming Soon":"#8B5CF6", "Security Update":"#F59E0B" };

function UpdatesPage() {
  const { C, FONT, featureUpdates, setFeatureUpdates, isAdmin } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const blank = { title:"", cat:"New Feature", date:today(), desc:"", published:true };
  const [form, setForm] = useState(blank);
  const S = useStyles();

  const catColors = { "New Feature":C.green, "Bug Fix":"#EF4444", "Improvement":C.blue, "Coming Soon":C.purple, "Security Update":C.yellow };

  const save = () => {
    if (!form.title||!form.desc) return;
    if (editItem) { setFeatureUpdates(featureUpdates.map(x=>x.id===editItem.id?{...editItem,...form}:x)); setEditItem(null); }
    else setFeatureUpdates([{ ...form, id:Date.now() }, ...featureUpdates]);
    setForm(blank); setShowAdd(false);
  };

  const del = id => setFeatureUpdates(featureUpdates.filter(x=>x.id!==id));
  const openEdit = u => { setEditItem(u); setForm({title:u.title,cat:u.cat||"New Feature",date:u.date||today(),desc:u.desc,published:u.published!==false}); setShowAdd(true); };

  const visible = isAdmin ? featureUpdates : featureUpdates.filter(u=>u.published!==false);

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <PageHeader title="What's New" sub="Latest updates, features, and improvements"
        action={isAdmin && <Btn onClick={()=>{ setEditItem(null); setForm(blank); setShowAdd(true); }} variant="sm"><Plus size={14}/>Post Update</Btn>} />

      {visible.length===0 ? (
        <EmptyState icon={Zap} title="No updates posted yet" sub={isAdmin?"Post your first feature update or bug fix announcement.":"Check back soon for the latest updates!"} />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {visible.map(u=>(
            <div key={u.id} style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", minWidth:0, flexWrap:"wrap" }}>
                  <Badge color={catColors[u.cat]||C.blue}>{u.cat}</Badge>
                  {!u.published && <Badge color={C.text3}>Draft</Badge>}
                  <span style={{ fontSize:11, color:C.text2 }}>{fmt(u.date)}</span>
                </div>
                {isAdmin && (
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={()=>setFeatureUpdates(featureUpdates.map(x=>x.id===u.id?{...x,published:!x.published}:x))} style={{ background:"none", border:`1px solid ${C.border2}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", color:C.text2, fontSize:11, fontFamily:FONT }}>{u.published?"Unpublish":"Publish"}</button>
                    <button onClick={()=>openEdit(u)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5 }}><Edit2 size={13}/></button>
                    <button onClick={()=>del(u.id)} style={{ background:"none", border:"none", cursor:"pointer", color:C.text3, padding:5 }}><Trash2 size={13}/></button>
                  </div>
                )}
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>{u.title}</h3>
              <p style={{ fontSize:13, color:C.text2, lineHeight:1.65 }}>{u.desc}</p>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title={editItem?"Edit Update":"Post Update"} onClose={()=>{ setShowAdd(false); setEditItem(null); setForm(blank); }}>
          <Input label="Title" placeholder="e.g. Savings Goal Calendar Added" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Category</label>
            <select style={S.input} value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {UPDATE_CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Description</label>
            <textarea style={{ ...S.input, height:90, resize:"none" }} placeholder="Describe this update..." value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", fontSize:14, color:C.text2 }}>
              <input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} />Publish immediately (visible to all users)
            </label>
          </div>
          <Btn onClick={save} full>{editItem?"Save Changes":"Post Update"}</Btn>
        </Modal>
      )}
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ onBack }) {
  const { C, FONT, adminUsers, setAdminUsers, user:currentUser } = useApp();
  const S = useStyles();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [confirm, setConfirm] = useState(null);

  const toggleStatus = id => setAdminUsers(adminUsers.map(u=>u.id===id?{...u,status:u.status==="Active"?"Inactive":"Active"}:u));
  const togglePlan = id => setAdminUsers(adminUsers.map(u=>u.id===id?{...u,plan:u.plan==="Premium"?"Free":"Premium"}:u));
  const toggleAdmin = id => setAdminUsers(adminUsers.map(u=>u.id===id?{...u,isAdmin:!u.isAdmin}:u));

  const filtered = adminUsers.filter(u=>{
    const ms = u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="All"||u.plan===filter||u.status===filter||(filter==="Admin"&&u.isAdmin);
    return ms && mf;
  });

  const doConfirm = () => {
    if (!confirm) return;
    if (confirm.action==="toggleStatus") toggleStatus(confirm.id);
    else if (confirm.action==="togglePlan") togglePlan(confirm.id);
    else if (confirm.action==="toggleAdmin") toggleAdmin(confirm.id);
    setConfirm(null);
  };

  return (
    <div style={{ background:C.bg, padding:"20px 16px", minHeight:"100dvh" }} className="page-enter">
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24, flexWrap:"wrap" }}>
        <Btn onClick={onBack} variant="ghost" style={{ fontSize:13, padding:"9px 14px", minHeight:38 }}>← Back</Btn>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:C.text }}>Admin Panel</h1>
          <p style={{ color:C.red, fontSize:11, fontWeight:700, letterSpacing:"0.05em", marginTop:2 }}>🔐 OWNER ACCESS ONLY</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:20 }}>
        <StatCard label="Total Users" value={adminUsers.length.toString()} icon={User} iconColor={C.blue} />
        <StatCard label="Premium" value={adminUsers.filter(u=>u.plan==="Premium").length.toString()} sub="Paying subscribers" icon={Award} iconColor={C.yellow} />
        <StatCard label="Active" value={adminUsers.filter(u=>u.status==="Active").length.toString()} sub="This month" icon={CheckCircle} iconColor={C.green} />
        <StatCard label="Revenue" value={`$${(adminUsers.filter(u=>u.plan==="Premium").length*9.99).toFixed(2)}`} sub="Monthly" icon={DollarSign} iconColor={C.red} />
      </div>

      <div style={{ background:C.card, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>User Management</h3>
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <Search size={14} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.text2 }} />
            <input style={{ ...S.input, paddingLeft:34 }} placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select style={{ ...S.input, width:"auto", minWidth:130 }} value={filter} onChange={e=>setFilter(e.target.value)}>
            {["All","Premium","Free","Active","Inactive","Admin"].map(f=><option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:580 }}>
            <thead>
              <tr>{["User","Email","Plan","Status","Joined","Actions"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"8px 10px", fontSize:11, color:C.text2, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id} className="hover-row" style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:"11px 10px", whiteSpace:"nowrap" }}>
                    <p style={{ fontSize:13, fontWeight:500, color:C.text }}>{u.name}</p>
                    {u.isAdmin && <Badge color={C.red}>Admin</Badge>}
                  </td>
                  <td style={{ padding:"11px 10px", fontSize:12, color:C.text2, whiteSpace:"nowrap" }}>{u.email}</td>
                  <td style={{ padding:"11px 10px" }}><Badge color={u.plan==="Premium"?C.yellow:C.text2}>{u.plan}</Badge></td>
                  <td style={{ padding:"11px 10px" }}><Badge color={u.status==="Active"?C.green:C.text3}>{u.status}</Badge></td>
                  <td style={{ padding:"11px 10px", fontSize:12, color:C.text2, whiteSpace:"nowrap" }}>{fmt(u.joined)}</td>
                  <td style={{ padding:"11px 10px" }}>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      <button onClick={()=>setConfirm({id:u.id,action:"toggleStatus",msg:`${u.status==="Active"?"Deactivate":"Activate"} ${u.name}?`,label:u.status==="Active"?"Deactivate":"Activate"})} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:`1px solid ${C.border2}`, background:"transparent", color:C.text2, cursor:"pointer", fontFamily:FONT, minHeight:30 }}>{u.status==="Active"?"Deactivate":"Activate"}</button>
                      <button onClick={()=>setConfirm({id:u.id,action:"togglePlan",msg:`${u.plan==="Premium"?"Remove Premium from":"Upgrade"} ${u.name}?`,label:u.plan==="Premium"?"−Premium":"+Premium"})} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:`1px solid ${C.border2}`, background:"transparent", color:u.plan==="Free"?C.yellow:C.text2, cursor:"pointer", fontFamily:FONT, minHeight:30 }}>{u.plan==="Free"?"+ Premium":"− Premium"}</button>
                      {u.id!==currentUser?.id && <button onClick={()=>setConfirm({id:u.id,action:"toggleAdmin",msg:`${u.isAdmin?"Remove admin from":"Make"} ${u.name} an admin?`,label:u.isAdmin?"−Admin":"+Admin"})} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:`1px solid ${C.border2}`, background:"transparent", color:u.isAdmin?C.orange:C.text2, cursor:"pointer", fontFamily:FONT, minHeight:30 }}>{u.isAdmin?"− Admin":"+ Admin"}</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmModal title={confirm.label} message={confirm.msg} confirmText={confirm.label} onConfirm={doConfirm} onCancel={()=>setConfirm(null)} danger={confirm.action==="toggleStatus"} />
      )}
    </div>
  );
}


// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ goSignIn, goSignUp }) {
  const { C, FONT, HEAD } = useApp();
  const features = [
    { icon:Wallet, label:"Smart Budgeting", desc:"Set limits by category and get alerts before you overspend." },
    { icon:MessageSquare, label:"AI Assistant", desc:"Ask anything about your finances and get real, practical answers." },
    { icon:Target, label:"Savings Goals", desc:"Visual progress tracking with deadline calculators and AI tips." },
    { icon:TrendingDown, label:"Debt Payoff", desc:"Snowball or Avalanche strategy with AI recommendation." },
    { icon:FileText, label:"Bill Tracker", desc:"Never miss a payment with due date tracking and reminders." },
    { icon:Shield, label:"Private & Secure", desc:"Your data stays private and is never sold to advertisers." },
  ];
  return (
    <div style={{ background:C.bg, fontFamily:FONT, color:C.text, minHeight:"100dvh", overflowX:"hidden", width:"100%" }}>
      <nav style={{ padding:"15px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:C.bg, zIndex:50, gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:C.red, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><DollarSign size={18} color="#fff" /></div>
          <span style={{ fontFamily:HEAD, fontWeight:800, fontSize:17, whiteSpace:"nowrap" }}>DayeBudget <span style={{ color:C.red }}>AI</span></span>
        </div>
        <div style={{ display:"flex", gap:9 }}>
          <Btn onClick={goSignIn} variant="ghost" style={{ padding:"10px 16px", fontSize:14, minHeight:42 }}>Sign In</Btn>
          <Btn onClick={goSignUp} style={{ padding:"10px 16px", fontSize:14, minHeight:42 }}>Get Started Free</Btn>
        </div>
      </nav>

      <div style={{ padding:"64px 20px 56px", textAlign:"center", maxWidth:820, margin:"0 auto" }}>
        <div style={{ display:"inline-block", background:C.red+"18", border:`1px solid ${C.red}40`, borderRadius:99, padding:"5px 16px", marginBottom:22 }}>
          <span style={{ color:C.red, fontSize:12, fontWeight:700, letterSpacing:"0.06em" }}>🤖 AI-POWERED PERSONAL FINANCE</span>
        </div>
        <h1 style={{ fontFamily:HEAD, fontSize:"clamp(28px, 6vw, 56px)", fontWeight:800, lineHeight:1.15, marginBottom:18 }}>
          Take Control of Your Money<br /><span style={{ color:C.red }}>With AI at Your Side</span>
        </h1>
        <p style={{ fontSize:"clamp(14px,2vw,17px)", color:C.text2, lineHeight:1.7, marginBottom:30, maxWidth:560, margin:"0 auto 30px" }}>
          Budget smarter, save more, pay off debt, and build the financial future you deserve — all with AI-powered guidance designed for real people.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <Btn onClick={goSignUp} style={{ padding:"14px 32px", fontSize:16, borderRadius:12 }}>Start for Free →</Btn>
          <Btn onClick={goSignIn} variant="ghost" style={{ padding:"14px 24px", fontSize:15 }}>Sign In</Btn>
        </div>
        <p style={{ color:C.text3, fontSize:12, marginTop:14 }}>No credit card required · Free plan available · Cancel anytime</p>
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, background:C.card, padding:"22px 20px" }}>
        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(20px,5vw,48px)", flexWrap:"wrap" }}>
          {[["$2.4B+","Tracked"],["50K+","Members"],["92%","Save More"],["4.9★","Rating"]].map(([v,l])=>(
            <div key={v} style={{ textAlign:"center" }}>
              <p style={{ fontFamily:HEAD, fontSize:"clamp(20px,4vw,24px)", fontWeight:700, color:C.red }}>{v}</p>
              <p style={{ fontSize:12, color:C.text2 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"56px 20px", maxWidth:1100, margin:"0 auto" }}>
        <h2 style={{ fontFamily:HEAD, fontSize:"clamp(20px,4vw,32px)", fontWeight:700, textAlign:"center", marginBottom:36, color:C.text }}>Everything You Need to Win With Money</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:14 }}>
          {features.map(({ icon:Icon, label, desc })=>(
            <div key={label} style={{ background:C.card, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
              <div style={{ width:44, height:44, borderRadius:12, background:C.red+"1A", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}><Icon size={21} color={C.red} /></div>
              <h3 style={{ fontFamily:HEAD, fontSize:15, fontWeight:700, marginBottom:7, color:C.text }}>{label}</h3>
              <p style={{ color:C.text2, fontSize:13, lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"44px 20px", background:C.card, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:32, alignItems:"center" }}>
          <div>
            <p style={{ color:C.red, fontSize:11, fontWeight:700, letterSpacing:"0.08em", marginBottom:10 }}>AI BUDGET ASSISTANT</p>
            <h2 style={{ fontFamily:HEAD, fontSize:"clamp(20px,4vw,28px)", fontWeight:700, marginBottom:14, lineHeight:1.2, color:C.text }}>Your Personal Finance AI, 24/7</h2>
            <p style={{ color:C.text2, fontSize:13, lineHeight:1.7, marginBottom:20 }}>Ask anything — budget creation, savings advice, debt payoff strategies, or investing basics. Get smart answers based on YOUR financial situation.</p>
            <Btn onClick={goSignUp}>Try the AI Free →</Btn>
          </div>
          <div style={{ background:C.card2, borderRadius:18, padding:22, border:`1px solid ${C.border2}` }}>
            {[{who:"user",msg:"Where is most of my money going?"},{who:"ai",msg:"Based on your spending, your top 3 expense categories are Housing ($1,450), Transport ($621), and Food ($558). These 3 together are 62% of your income. Want me to suggest a plan to reduce any of them? 💡"}].map((m,i)=>(
              <div key={i} style={{ marginBottom:12, display:"flex", justifyContent:m.who==="user"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"82%", background:m.who==="user"?C.red:C.card3, borderRadius:m.who==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", padding:"10px 14px" }}>
                  <p style={{ fontSize:13, lineHeight:1.55, color:C.text }}>{m.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:"44px 20px", maxWidth:900, margin:"0 auto" }}>
        <h2 style={{ fontFamily:HEAD, fontSize:"clamp(20px,4vw,30px)", fontWeight:700, textAlign:"center", marginBottom:32, color:C.text }}>Simple Pricing</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))", gap:18 }}>
          {[
            { name:"Free", price:"$0", col:C.text2, features:["Basic budgeting & tracking","Expense tracking","3 savings goals","5 AI questions/month","Basic reports"] },
            { name:"Premium", price:"$9.99", col:C.red, features:["Everything in Free","Unlimited AI assistant","Debt payoff planner","Advanced reports & charts","Subscription tracker","Priority support"] },
          ].map(p=>(
            <div key={p.name} style={{ background:C.card, borderRadius:18, padding:22, border:p.name==="Premium"?`2px solid ${C.red}`:`1px solid ${C.border}`, position:"relative" }}>
              {p.name==="Premium" && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:C.red, borderRadius:99, padding:"4px 16px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", color:"#fff" }}>MOST POPULAR</div>}
              <p style={{ fontFamily:HEAD, fontSize:17, fontWeight:700, marginBottom:7, color:C.text }}>{p.name}</p>
              <p style={{ fontFamily:HEAD, fontSize:32, fontWeight:800, color:p.col, lineHeight:1, marginBottom:18 }}>{p.price}<span style={{ fontSize:14, fontWeight:400, color:C.text2 }}>/mo</span></p>
              {p.features.map(f=><div key={f} style={{ display:"flex", gap:7, alignItems:"center", marginBottom:9 }}><CheckCircle size={13} color={C.green}/><span style={{ fontSize:13, color:C.text }}>{f}</span></div>)}
              <Btn onClick={goSignUp} style={{ width:"100%", marginTop:14, background:p.name==="Premium"?C.red:"transparent", border:p.name==="Free"?`1px solid ${C.border2}`:"none", color:p.name==="Free"?C.text:"#fff" }}>{p.name==="Free"?"Get Started Free":"Start Premium"}</Btn>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, padding:"22px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <span style={{ fontFamily:HEAD, fontWeight:700, fontSize:14, color:C.text }}>DayeBudget <span style={{ color:C.red }}>AI</span></span>
        <p style={{ color:C.text3, fontSize:11 }}>© {new Date().getFullYear()} DayeBudget AI · AI advice is educational, not professional financial advice.</p>
      </div>
    </div>
  );
}


// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell() {
  const { C, user, isAdmin, onboarded, setOnboarded, alerts, logout } = useApp();
  const [page, setPage] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 769 : false);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 769);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  // Show onboarding for new users who haven't completed it
  if (!onboarded) return <OnboardingFlow onDone={() => setOnboarded(true)} />;

  const renderPage = () => {
    if (page === "admin" && !isAdmin) return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:16, padding:40 }}>
        <Shield size={64} style={{ opacity:0.2, color:C.text }} />
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, color:C.text }}>Access Denied</h2>
        <p style={{ color:C.text2, fontSize:14 }}>You don't have admin permissions.</p>
        <button onClick={() => setPage("dashboard")} style={{ background:C.red, color:"#fff", border:"none", borderRadius:10, padding:"11px 24px", cursor:"pointer", fontSize:14, fontWeight:600 }}>Go to Dashboard</button>
      </div>
    );
    switch (page) {
      case "dashboard": return <DashboardPage setPage={setPage} />;
      case "budget": return <BudgetPage />;
      case "expenses": return <ExpensesPage />;
      case "savings": return <SavingsPage />;
      case "ai": return <AIPage />;
      case "bills": return <BillsPage />;
      case "debt": return <DebtPage />;
      case "reports": return <ReportsPage />;
      case "learn": return <LearnPage />;
      case "updates": return <UpdatesPage />;
      case "profile": return <ProfilePage onLogout={logout} />;
      case "admin": return <AdminPage onBack={() => setPage("dashboard")} />;
      default: return <DashboardPage setPage={setPage} />;
    }
  };

  if (isMobile) return (
    <div style={{ background:C.bg, display:"flex", flexDirection:"column", height:"100dvh", overflow:"hidden", color:C.text, width:"100%" }}>
      <MobileHeader page={page} setPage={setPage} />
      <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", WebkitOverflowScrolling:"touch", paddingBottom:76 }}>
        {renderPage()}
      </div>
      <BottomNavBar page={page} setPage={setPage} />
    </div>
  );

  return (
    <div style={{ background:C.bg, display:"flex", height:"100dvh", overflow:"hidden", color:C.text, width:"100%" }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", width:"100%", minWidth:0 }}>
        {page === "ai" ? (
          <div style={{ display:"flex", flexDirection:"column", height:"100dvh" }}>
            {renderPage()}
          </div>
        ) : renderPage()}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AuthGate() {
  const { C, user, login } = useApp();
  const [view, setView] = useState("landing");

  if (user) return <AppShell />;

  return (
    <div style={{ width:"100%", minHeight:"100dvh" }}>
      {view === "landing" && <LandingPage goSignIn={() => setView("signin")} goSignUp={() => setView("signup")} />}
      {view === "signin" && <SignInPage goSignUp={() => setView("signup")} goLanding={() => setView("landing")} />}
      {view === "signup" && <SignUpPage goSignIn={() => setView("signin")} />}
    </div>
  );
}

export default function DayeBudgetAI() {
  return (
    <AppProvider>
      <style>{GLOBAL_CSS}</style>
      <AuthGate />
    </AppProvider>
  );
}
