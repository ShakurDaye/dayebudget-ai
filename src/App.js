import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Home, Target, MessageSquare, User, TrendingUp, DollarSign,
  CreditCard, BookOpen, Settings, LogOut, Plus, Search,
  Shield, AlertCircle, CheckCircle, X, Trash2, BarChart2,
  FileText, Lock, Eye, EyeOff, Calendar, Wallet,
  Menu, ChevronRight, Bell, Zap, ArrowUpRight, ArrowDownRight,
  Edit2, Star, TrendingDown, AlertTriangle, Award, RefreshCw,
  Layers, Download, ChevronDown, Percent, ChevronsUp
} from "lucide-react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  red: '#E5041C', redDark: '#B20014', redLight: '#FF3347',
  bg: '#090909', bg2: '#0F0F0F',
  card: '#141414', card2: '#1C1C1C', card3: '#232323',
  border: '#222', border2: '#2E2E2E', border3: '#383838',
  text: '#FFFFFF', text2: '#9A9A9A', text3: '#555',
  green: '#22C55E', yellow: '#F59E0B', blue: '#3B82F6',
  purple: '#8B5CF6', pink: '#EC4899', teal: '#14B8A6',
  orange: '#F97316',
};
const FONT = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const HEAD = "'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const USER = { name: "Alex Johnson", email: "alex.johnson@email.com", username: "alexj", isPremium: true, avatar: "AJ", plan: "Premium" };

const TRANSACTIONS = [
  { id:1, name:"Whole Foods", cat:"Groceries", amount:-127.43, date:"Jan 15", recurring:false },
  { id:2, name:"Netflix", cat:"Subscriptions", amount:-15.99, date:"Jan 14", recurring:true },
  { id:3, name:"Shell Gas Station", cat:"Transport", amount:-58.20, date:"Jan 14", recurring:false },
  { id:4, name:"Paycheck — Acme Corp", cat:"Income", amount:3850.00, date:"Jan 13", recurring:true },
  { id:5, name:"Spotify Premium", cat:"Subscriptions", amount:-9.99, date:"Jan 13", recurring:true },
  { id:6, name:"Electric Bill", cat:"Utilities", amount:-143.50, date:"Jan 12", recurring:true },
  { id:7, name:"Chipotle", cat:"Dining", amount:-23.45, date:"Jan 12", recurring:false },
  { id:8, name:"Amazon Purchase", cat:"Shopping", amount:-67.99, date:"Jan 11", recurring:false },
  { id:9, name:"Planet Fitness", cat:"Health", amount:-24.99, date:"Jan 10", recurring:true },
  { id:10, name:"AT&T Phone", cat:"Phone", amount:-85.00, date:"Jan 10", recurring:true },
  { id:11, name:"Starbucks", cat:"Dining", amount:-7.45, date:"Jan 9", recurring:false },
  { id:12, name:"Target", cat:"Shopping", amount:-156.23, date:"Jan 8", recurring:false },
  { id:13, name:"Rent Payment", cat:"Housing", amount:-1450.00, date:"Jan 1", recurring:true },
  { id:14, name:"Car Insurance", cat:"Insurance", amount:-178.00, date:"Jan 5", recurring:true },
  { id:15, name:"Student Loan", cat:"Debt", amount:-287.00, date:"Jan 7", recurring:true },
];

const BUDGET_CATS = [
  { cat:"Housing", planned:1500, spent:1450, color:C.red },
  { cat:"Groceries", planned:400, spent:327, color:C.blue },
  { cat:"Transport", planned:200, spent:158, color:C.green },
  { cat:"Utilities", planned:150, spent:143, color:C.yellow },
  { cat:"Dining", planned:150, spent:231, color:C.pink },
  { cat:"Subscriptions", planned:80, spent:50, color:C.purple },
  { cat:"Phone", planned:90, spent:85, color:C.teal },
  { cat:"Insurance", planned:180, spent:178, color:C.orange },
  { cat:"Debt", planned:300, spent:287, color:'#EF4444' },
  { cat:"Savings", planned:500, spent:400, color:C.green },
  { cat:"Entertainment", planned:100, spent:67, color:'#6366F1' },
  { cat:"Personal", planned:200, spent:224, color:'#84CC16' },
];

const SAVINGS_GOALS = [
  { id:1, name:"Emergency Fund", target:10000, saved:6500, deadline:"Jun 2024", emoji:"🛡️", color:C.red },
  { id:2, name:"Europe Vacation", target:5000, saved:1800, deadline:"Sep 2024", emoji:"✈️", color:C.blue },
  { id:3, name:"New Car", target:25000, saved:8750, deadline:"Jan 2025", emoji:"🚗", color:C.green },
  { id:4, name:"House Down Payment", target:60000, saved:15000, deadline:"Jan 2026", emoji:"🏠", color:C.yellow },
  { id:5, name:"Investment Fund", target:10000, saved:3200, deadline:"Dec 2024", emoji:"📈", color:C.purple },
];

const BILLS = [
  { id:1, name:"Rent", amount:1450, due:"Feb 1", paid:false, cat:"Housing" },
  { id:2, name:"Electric", amount:143.50, due:"Jan 25", paid:false, cat:"Utilities" },
  { id:3, name:"Internet", amount:79.99, due:"Jan 28", paid:true, cat:"Utilities" },
  { id:4, name:"Car Payment", amount:385.00, due:"Jan 20", paid:false, cat:"Transport" },
  { id:5, name:"Netflix", amount:15.99, due:"Jan 14", paid:true, cat:"Entertainment" },
  { id:6, name:"Spotify", amount:9.99, due:"Jan 13", paid:true, cat:"Entertainment" },
  { id:7, name:"Planet Fitness", amount:24.99, due:"Jan 10", paid:true, cat:"Health" },
  { id:8, name:"AT&T Phone", amount:85.00, due:"Jan 18", paid:false, cat:"Phone" },
  { id:9, name:"Car Insurance", amount:178.00, due:"Jan 5", paid:true, cat:"Insurance" },
];

const DEBTS = [
  { id:1, name:"Student Loan", balance:18500, rate:5.8, min:287, due:"Jan 15", color:C.red },
  { id:2, name:"Car Loan", balance:14200, rate:6.9, min:385, due:"Jan 20", color:C.yellow },
  { id:3, name:"Chase Credit Card", balance:3850, rate:24.99, min:115, due:"Jan 22", color:'#EF4444' },
  { id:4, name:"Amex Credit Card", balance:1200, rate:19.99, min:36, due:"Jan 28", color:C.pink },
];

const MONTHLY = [
  { month:'Aug', income:7700, expenses:4200, savings:3500 },
  { month:'Sep', income:7700, expenses:4800, savings:2900 },
  { month:'Oct', income:7700, expenses:3900, savings:3800 },
  { month:'Nov', income:8200, expenses:5200, savings:3000 },
  { month:'Dec', income:8200, expenses:6100, savings:2100 },
  { month:'Jan', income:7700, expenses:4380, savings:3320 },
];

const PIE_DATA = [
  { name:"Housing", value:1450, color:C.red },
  { name:"Food", value:558, color:C.blue },
  { name:"Transport", value:621, color:C.green },
  { name:"Utilities", value:223, color:C.yellow },
  { name:"Subs", value:117, color:C.purple },
  { name:"Other", value:411, color:C.text3 },
];

const ADMIN_USERS = [
  { id:1, name:"Alex Johnson", email:"alex@email.com", plan:"Premium", status:"Active", joined:"Jan 2024" },
  { id:2, name:"Sarah Williams", email:"sarah@email.com", plan:"Free", status:"Active", joined:"Jan 2024" },
  { id:3, name:"Mike Davis", email:"mike@email.com", plan:"Premium", status:"Active", joined:"Dec 2023" },
  { id:4, name:"Lisa Chen", email:"lisa@email.com", plan:"Free", status:"Inactive", joined:"Dec 2023" },
  { id:5, name:"James Brown", email:"james@email.com", plan:"Premium", status:"Active", joined:"Nov 2023" },
  { id:6, name:"Emma Wilson", email:"emma@email.com", plan:"Free", status:"Active", joined:"Nov 2023" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mob;
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  card: { background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` },
  card2: { background: C.card2, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` },
  btn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: C.red, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 15, fontFamily: FONT, minHeight: 48, WebkitAppearance: 'none', touchAction: 'manipulation' },
  btnSm: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: C.red, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: FONT, minHeight: 44, WebkitAppearance: 'none', touchAction: 'manipulation' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: C.text2, border: `1px solid ${C.border2}`, borderRadius: 10, padding: '11px 18px', cursor: 'pointer', fontWeight: 500, fontSize: 14, fontFamily: FONT, minHeight: 44, WebkitAppearance: 'none', touchAction: 'manipulation' },
  input: { background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 10, padding: '12px 14px', color: C.text, fontSize: 14, width: '100%', outline: 'none', fontFamily: FONT },
  label: { color: C.text2, fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' },
  h1: { fontFamily: HEAD, fontSize: 24, fontWeight: 700, color: C.text, margin: 0 },
  h2: { fontFamily: HEAD, fontSize: 20, fontWeight: 700, color: C.text, margin: 0 },
  page: { padding: '28px 24px', minHeight: '100dvh', background: C.bg },
};

// ─── PRIMITIVE COMPONENTS ─────────────────────────────────────────────────────

function ProgressBar({ pct, color = C.red, h = 8 }) {
  const clamp = Math.min(100, Math.max(0, pct));
  const barColor = clamp > 90 ? '#EF4444' : clamp > 75 ? C.yellow : color;
  return (
    <div style={{ background: C.border2, borderRadius: 99, height: h, overflow: 'hidden' }}>
      <div style={{ width: `${clamp}%`, height: '100%', background: barColor, borderRadius: 99, transition: 'width .5s ease' }} />
    </div>
  );
}

function Badge({ children, color = C.red }) {
  return <span style={{ background: color + '22', color, borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' }}>{children}</span>;
}

function StatCard({ label, value, sub, icon: Icon, iconColor = C.red, trend }) {
  return (
    <div style={{ ...S.card, flex: 1, minWidth: 150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: C.text2, fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{label}</p>
          <p style={{ fontFamily: HEAD, fontSize: 24, fontWeight: 700, color: C.text, lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: trend === 'up' ? C.green : trend === 'down' ? '#EF4444' : C.text2, marginTop: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
            {trend === 'up' && <ArrowUpRight size={12} />}
            {trend === 'down' && <ArrowDownRight size={12} />}
            {sub}
          </p>}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: iconColor + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} color={iconColor} />
        </div>
      </div>
    </div>
  );
}

function AIInsight({ text, type = 'info' }) {
  const map = { info: [C.blue, '💡'], warning: [C.yellow, '⚠️'], success: [C.green, '✅'], alert: ['#EF4444', '🚨'] };
  const [col, em] = map[type] || map.info;
  return (
    <div style={{ background: col + '14', border: `1px solid ${col}30`, borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{em}</span>
      <p style={{ color: C.text, fontSize: 13, lineHeight: 1.55, margin: 0 }}>{text}</p>
    </div>
  );
}

function PageHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={S.h1}>{title}</h1>
        {sub && <p style={{ color: C.text2, fontSize: 13, marginTop: 4 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: C.card, borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, border: `1px solid ${C.border2}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={S.h2}>{title}</h2>
          <button onClick={onClose} style={{ background: C.card2, border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text2 }}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={S.label}>{label}</label>
      {children}
      {error && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { id:'dashboard', label:'Dashboard', icon:Home },
  { id:'budget', label:'Budget Planner', icon:Wallet },
  { id:'expenses', label:'Expenses', icon:CreditCard },
  { id:'savings', label:'Savings Goals', icon:Target },
  { id:'ai', label:'AI Assistant', icon:MessageSquare },
  { id:'bills', label:'Bills & Subs', icon:FileText },
  { id:'debt', label:'Debt Payoff', icon:TrendingDown },
  { id:'reports', label:'Reports', icon:BarChart2 },
  { id:'education', label:'Learn', icon:BookOpen },
  { id:'profile', label:'Profile', icon:Settings },
];
const BOTTOM_NAV = [
  { id:'dashboard', label:'Home', icon:Home },
  { id:'budget', label:'Budget', icon:Wallet },
  { id:'ai', label:'AI', icon:MessageSquare },
  { id:'savings', label:'Goals', icon:Target },
  { id:'profile', label:'Profile', icon:User },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, onLogout, onAdmin }) {
  return (
    <div style={{ width: 240, minHeight: '100dvh', background: C.bg2, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 15, color: C.text, lineHeight: 1 }}>DayeBudget</p>
            <p style={{ fontSize: 10, color: C.red, fontWeight: 700, letterSpacing: '0.08em' }}>AI</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: active ? C.red + '18' : 'transparent',
              color: active ? C.red : C.text2,
              fontFamily: FONT, fontSize: 13, fontWeight: active ? 600 : 400,
              marginBottom: 2, transition: 'all .15s',
            }}>
              <Icon size={17} />
              {label}
            </button>
          );
        })}
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 12 }}>
          <button onClick={onAdmin} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'none', cursor:'pointer', background:'transparent', color:C.text2, fontFamily:FONT, fontSize:13, fontWeight:400, marginBottom:2 }}>
            <Shield size={17} /> Admin Panel
          </button>
          <button onClick={onLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'none', cursor:'pointer', background:'transparent', color:'#EF4444', fontFamily:FONT, fontSize:13, fontWeight:400, marginBottom:2 }}>
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{USER.avatar}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{USER.name}</p>
            <Badge color={C.yellow}>{USER.plan}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ page, setPage }) {
  return (
    <div className="bottom-safe" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 100, paddingBottom: 12 }}>
      {BOTTOM_NAV.map(({ id, label, icon: Icon }) => {
        const active = page === id;
        return (
          <button key={id} onClick={() => setPage(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer', color: active ? C.red : C.text3, fontFamily: FONT, fontSize: 10, fontWeight: active ? 600 : 400 }}>
            {id === 'ai' ? (
              <div style={{ width: 40, height: 40, borderRadius: 12, background: active ? C.red : C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -12 }}>
                <Icon size={18} color={active ? '#fff' : C.text2} />
              </div>
            ) : <Icon size={20} />}
            {id !== 'ai' && label}
          </button>
        );
      })}
    </div>
  );
}

function MobileHeader({ page, onMenu, onNotify }) {
  const title = NAV.find(n => n.id === page)?.label || 'DayeBudget AI';
  return (
    <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={17} color="#fff" /></div>
        <p style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14, color: C.text }}>{title}</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onNotify} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.text2, padding: 4 }}><Bell size={20} /></button>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ goSignIn, goSignUp }) {
  const features = [
    { icon:Wallet, label:"Smart Budgeting", desc:"Set budgets by category and get real-time alerts before you overspend." },
    { icon:MessageSquare, label:"AI Assistant", desc:"Ask your personal finance AI anything — budgeting, debt, investing." },
    { icon:TrendingUp, label:"Savings Goals", desc:"Create visual goals with progress tracking and AI savings advice." },
    { icon:BarChart2, label:"Deep Reports", desc:"Monthly charts, category breakdowns, and a personalized budget score." },
    { icon:CreditCard, label:"Debt Payoff", desc:"Snowball or avalanche strategies powered by AI recommendations." },
    { icon:Shield, label:"Bank-Grade Security", desc:"Your data is private, encrypted, and never sold to advertisers." },
  ];
  const testimonials = [
    { name:"Maria T.", loc:"Charlotte, NC", text:"I paid off $8,000 in credit card debt in 8 months using the AI debt planner. This app changed my life.", stars:5 },
    { name:"Devon P.", loc:"Atlanta, GA", text:"The AI assistant is like having a financial advisor in my pocket. It helped me finally build a 6-month emergency fund.", stars:5 },
    { name:"Jasmine R.", loc:"Houston, TX", text:"I never knew where my money went. DayeBudget showed me I was spending $400/mo on subscriptions I forgot about!", stars:5 },
  ];

  return (
    <div style={{ background: C.bg, fontFamily: FONT, color: C.text, minHeight: '100dvh' }}>
      {/* NAV */}
      <nav style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: C.bg, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={22} color="#fff" /></div>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 20 }}>DayeBudget <span style={{ color: C.red }}>AI</span></span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={goSignIn} style={{ ...S.btnGhost }}>Sign In</button>
          <button onClick={goSignUp} style={{ ...S.btn }}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '90px 32px 80px', textAlign: 'center', maxWidth: 820, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'inline-block', background: C.red + '18', border: `1px solid ${C.red}40`, borderRadius: 99, padding: '5px 16px', marginBottom: 28 }}>
          <span style={{ color: C.red, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>🤖 AI-POWERED PERSONAL FINANCE</span>
        </div>
        <h1 style={{ fontFamily: HEAD, fontSize: 'clamp(36px, 6vw, 62px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          Take Control of Your Money <br /><span style={{ color: C.red }}>With AI at Your Side</span>
        </h1>
        <p style={{ fontSize: 18, color: C.text2, lineHeight: 1.7, marginBottom: 38, maxWidth: 580, margin: '0 auto 38px' }}>
          DayeBudget AI helps you budget smarter, save more, crush debt, and build the financial future you deserve — all with intelligent AI guidance.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={goSignUp} style={{ ...S.btn, padding: '16px 36px', fontSize: 16, borderRadius: 12 }}>Start for Free →</button>
          <button onClick={goSignIn} style={{ ...S.btnGhost, padding: '16px 28px', fontSize: 16 }}>Sign In</button>
        </div>
        <p style={{ color: C.text3, fontSize: 12, marginTop: 20 }}>No credit card required · Free plan available · Cancel anytime</p>
      </div>

      {/* STATS STRIP */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.card, padding: '24px 32px', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[['$2.4B+','Tracked by users'],['50K+','Active members'],['92%','Report saving more'],['4.9★','App store rating']].map(([v,l]) => (
          <div key={v} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: HEAD, fontSize: 26, fontWeight: 700, color: C.red }}>{v}</p>
            <p style={{ fontSize: 12, color: C.text2 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Everything You Need to Win With Money</h2>
          <p style={{ color: C.text2, fontSize: 16 }}>12 powerful tools built into one beautiful app</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ ...S.card, borderRadius: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.red + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={24} color={C.red} />
              </div>
              <h3 style={{ fontFamily: HEAD, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{label}</h3>
              <p style={{ color: C.text2, fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI PREVIEW */}
      <div style={{ padding: '60px 32px', background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <p style={{ color: C.red, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>AI BUDGET ASSISTANT</p>
            <h2 style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>Your Personal Finance AI, Available 24/7</h2>
            <p style={{ color: C.text2, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>Ask anything about your finances — from creating a budget to understanding compound interest. Get smart, personalized answers instantly.</p>
            <button onClick={goSignUp} style={S.btn}>Try the AI Free →</button>
          </div>
          <div style={{ background: C.card2, borderRadius: 20, padding: 24, border: `1px solid ${C.border2}` }}>
            {[
              { who:'user', msg:'How can I save $500 this month?' },
              { who:'ai', msg:"Based on your spending, I see 3 quick wins: cancel unused subscriptions (-$42), reduce dining out by 30% (-$69), and set up auto-transfer on payday. That\'s already $111 saved. Want a full plan?" },
              { who:'user', msg:'Yes! Give me a full plan.' },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: m.who === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', background: m.who === 'user' ? C.red : C.card3, borderRadius: m.who === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px' }}>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: C.text }}>{m.msg}</p>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              {['Build my budget', 'Cut spending', 'Pay off debt'].map(t => (
                <span key={t} style={{ background: C.card3, border: `1px solid ${C.border3}`, borderRadius: 8, padding: '5px 10px', fontSize: 11, color: C.text2, cursor: 'pointer' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Real People. Real Results.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {testimonials.map((t) => (
            <div key={t.name} style={{ ...S.card, borderRadius: 18 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} fill={C.yellow} color={C.yellow} />)}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t.name}</p>
              <p style={{ fontSize: 11, color: C.text2 }}>{t.loc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '60px 32px', background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>Simple, Transparent Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { name:'Free', price:'$0', period:'/month', color:C.text2, features:['Basic budgeting tools','Expense tracking','3 savings goals','5 AI questions/month','Basic reports'] },
              { name:'Premium', price:'$9', period:'.99/month', color:C.red, features:['Everything in Free','Unlimited AI assistant','Debt payoff planner','Advanced reports & charts','Subscription tracker','Personalized AI reports','Priority support'] },
            ].map((p) => (
              <div key={p.name} style={{ ...S.card, borderRadius: 20, border: p.name === 'Premium' ? `2px solid ${C.red}` : `1px solid ${C.border}`, position: 'relative' }}>
                {p.name === 'Premium' && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.red, borderRadius: 99, padding: '4px 16px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                <p style={{ fontFamily: HEAD, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{p.name}</p>
                <p style={{ fontFamily: HEAD, fontSize: 38, fontWeight: 800, color: p.color, lineHeight: 1 }}>{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: C.text2 }}>{p.period}</span></p>
                <div style={{ borderTop: `1px solid ${C.border}`, margin: '20px 0', paddingTop: 20 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                      <CheckCircle size={15} color={C.green} />
                      <span style={{ fontSize: 13, color: C.text }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={goSignUp} style={{ ...S.btn, width: '100%', background: p.name === 'Premium' ? C.red : 'transparent', border: p.name === 'Free' ? `1px solid ${C.border2}` : 'none', color: p.name === 'Free' ? C.text : '#fff' }}>
                  {p.name === 'Free' ? 'Get Started Free' : 'Start Premium'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Ready to Take Control of Your Finances?</h2>
        <p style={{ color: C.text2, fontSize: 16, marginBottom: 32 }}>Join 50,000+ people building wealth with DayeBudget AI</p>
        <button onClick={goSignUp} style={{ ...S.btn, padding: '18px 48px', fontSize: 17, borderRadius: 14 }}>Create Your Free Account →</button>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={15} color="#fff" /></div>
          <span style={{ fontFamily: HEAD, fontWeight: 700 }}>DayeBudget AI</span>
        </div>
        <p style={{ color: C.text3, fontSize: 12 }}>© 2024 DayeBudget AI · AI advice is educational, not professional financial advice.</p>
      </div>
    </div>
  );
}

// ─── SIGN IN ──────────────────────────────────────────────────────────────────
function SignInPage({ goSignUp, onSignIn }) {
  const [form, setForm] = useState({ username:'', password:'', remember:false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSignIn();
  };

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><DollarSign size={30} color="#fff" /></div>
          <h1 style={{ ...S.h1, fontFamily: HEAD, fontSize: 28, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: C.text2, fontSize: 14 }}>Sign in to your DayeBudget AI account</p>
        </div>
        <div style={S.card}>
          <FormField label="Username or Email" error={errors.username}>
            <input style={{ ...S.input, borderColor: errors.username ? '#EF4444' : C.border2 }} placeholder="Enter your username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} style={{ ...S.input, paddingRight: 44, borderColor: errors.password ? '#EF4444' : C.border2 }} placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.text2 }}>{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </FormField>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: C.text2 }}>
              <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} style={{ accentColor: C.red }} />
              Remember Me
            </label>
            <a href="#" style={{ fontSize: 13, color: C.red }}>Forgot Password?</a>
          </div>
          <button onClick={submit} disabled={loading} style={{ ...S.btn, width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing In...</> : 'Sign In'}
          </button>
          <p style={{ textAlign: 'center', color: C.text2, fontSize: 13, marginTop: 18 }}>
            Don't have an account? <button onClick={goSignUp} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Sign Up Free</button>
          </p>
        </div>
        <p style={{ textAlign: 'center', color: C.text3, fontSize: 11, marginTop: 20 }}>Demo: any username + 6+ char password</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── SIGN UP ──────────────────────────────────────────────────────────────────
function SignUpPage({ goSignIn, onSignIn }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', confirm:'', terms:false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const sLevel = strength(form.password);
  const sColors = ['', '#EF4444', C.orange, C.yellow, C.green];
  const sLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    if (!form.confirm) e.confirm = 'Required';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (!form.terms) e.terms = 'You must accept the Terms & Conditions';
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    onSignIn();
  };

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: FONT }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><DollarSign size={28} color="#fff" /></div>
          <h1 style={{ ...S.h1, fontFamily: HEAD, fontSize: 26, marginBottom: 4 }}>Create Your Account</h1>
          <p style={{ color: C.text2, fontSize: 13 }}>Start your financial journey today</p>
        </div>
        <div style={S.card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="First Name" error={errors.firstName}>
              <input style={{ ...S.input, borderColor: errors.firstName ? '#EF4444' : C.border2 }} placeholder="Alex" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </FormField>
            <FormField label="Last Name" error={errors.lastName}>
              <input style={{ ...S.input, borderColor: errors.lastName ? '#EF4444' : C.border2 }} placeholder="Johnson" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Email Address" error={errors.email}>
            <input type="email" style={{ ...S.input, borderColor: errors.email ? '#EF4444' : C.border2 }} placeholder="alex@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} style={{ ...S.input, paddingRight: 44, borderColor: errors.password ? '#EF4444' : C.border2 }} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.text2 }}>{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:4, borderRadius:99, background: i <= sLevel ? sColors[sLevel] : C.border2 }} />)}
                </div>
                <p style={{ fontSize: 11, color: sColors[sLevel] }}>{sLabels[sLevel]} password</p>
              </div>
            )}
          </FormField>
          <FormField label="Confirm Password" error={errors.confirm}>
            <input type="password" style={{ ...S.input, borderColor: errors.confirm ? '#EF4444' : C.border2 }} placeholder="Re-enter your password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
          </FormField>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', gap: 8, cursor: 'pointer', fontSize: 13, color: C.text2, alignItems: 'flex-start' }}>
              <input type="checkbox" checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} style={{ accentColor: C.red, marginTop: 2 }} />
              I agree to the <a href="#" style={{ color: C.red }}>Terms & Conditions</a> and <a href="#" style={{ color: C.red }}>Privacy Policy</a>
            </label>
            {errors.terms && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.terms}</p>}
          </div>
          <button onClick={submit} disabled={loading} style={{ ...S.btn, width: '100%', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</> : 'Create Free Account'}
          </button>
          <p style={{ textAlign: 'center', color: C.text2, fontSize: 13, marginTop: 18 }}>
            Already have an account? <button onClick={goSignIn} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FONT }}>Sign In</button>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ setPage }) {
  const score = 74;
  return (
    <div style={S.page}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: C.text2, fontSize: 13 }}>Good morning,</p>
        <h1 style={{ ...S.h1, fontFamily: HEAD, fontSize: 28 }}>Alex Johnson 👋</h1>
        <p style={{ color: C.text2, fontSize: 13, marginTop: 4 }}>Here's your financial overview for January 2024</p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Monthly Income" value="$7,700" sub="+5.5% vs last month" icon={TrendingUp} iconColor={C.green} trend="up" />
        <StatCard label="Total Expenses" value="$4,380" sub="-8.2% vs last month" icon={CreditCard} iconColor={C.red} trend="down" />
        <StatCard label="Remaining Budget" value="$3,320" sub="43% of income saved" icon={Wallet} iconColor={C.blue} />
        <StatCard label="Savings Progress" value="$6,500" sub="+$400 this month" icon={Target} iconColor={C.yellow} trend="up" />
      </div>

      {/* BUDGET HEALTH + CHART */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700 }}>Monthly Trends</h3>
            <Badge color={C.green}>6 Months</Badge>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.3}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={0.3}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: C.text2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.text2, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 10, color: C.text }} formatter={(v) => [`$${v.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="income" stroke={C.green} strokeWidth={2} fill="url(#gInc)" />
                <Area type="monotone" dataKey="expenses" stroke={C.red} strokeWidth={2} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
            {[['Income', C.green],['Expenses', C.red]].map(([l,c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 11, color: C.text2 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* BUDGET SCORE */}
          <div style={{ ...S.card, flex: 'none' }}>
            <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Budget Health Score</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke={C.border2} strokeWidth="8" />
                  <circle cx="45" cy="45" r="38" fill="none" stroke={score > 80 ? C.green : score > 60 ? C.yellow : C.red} strokeWidth="8"
                    strokeDasharray={`${(score / 100) * 238.6} 238.6`} strokeLinecap="round" transform="rotate(-90 45 45)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: HEAD, fontSize: 22, fontWeight: 800, color: C.yellow }}>{score}</span>
                </div>
              </div>
              <div>
                <p style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 700, color: C.yellow }}>Good</p>
                <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.5 }}>You're managing well! Reduce dining out to reach Excellent.</p>
              </div>
            </div>
          </div>
          {/* SPENDING PIE */}
          <div style={{ ...S.card, flex: 1 }}>
            <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Spending Breakdown</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ height: 130, flex: '0 0 130px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" strokeWidth={0}>
                    {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {PIE_DATA.map(d => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <span style={{ fontSize: 11, color: C.text2 }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>${d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div style={{ ...S.card, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700 }}>🤖 AI Financial Insights</h3>
          <button onClick={() => setPage('ai')} style={S.btnGhost}>Ask AI →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <AIInsight text="You overspent on Dining Out by $81 this month. Cooking 3 meals at home per week could save you $240/month." type="warning" />
          <AIInsight text="Your Emergency Fund is 65% complete! At your current pace you'll hit $10,000 by June 2024." type="success" />
          <AIInsight text="You have 3 credit cards. Prioritizing Chase Card (24.99% APR) with the avalanche method saves you $1,200 in interest." type="info" />
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700 }}>Recent Transactions</h3>
          <button onClick={() => setPage('expenses')} style={S.btnGhost}>View All →</button>
        </div>
        {TRANSACTIONS.slice(0,7).map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.amount > 0 ? C.green + '1A' : C.red + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.amount > 0 ? <ArrowUpRight size={17} color={C.green} /> : <ArrowDownRight size={17} color={C.red} />}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{t.name}</p>
                <p style={{ fontSize: 11, color: C.text2 }}>{t.cat} · {t.date}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: t.amount > 0 ? C.green : C.text }}>{t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}</p>
              {t.recurring && <Badge color={C.blue}>Recurring</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BUDGET PLANNER ───────────────────────────────────────────────────────────
function BudgetPage() {
  const [cats, setCats] = useState(BUDGET_CATS);
  const [showModal, setShowModal] = useState(false);
  const [income, setIncome] = useState('7700');
  const [newCat, setNewCat] = useState({ cat:'', planned:'', color:C.blue });
  const totalPlanned = cats.reduce((s, c) => s + c.planned, 0);
  const totalSpent = cats.reduce((s, c) => s + c.spent, 0);
  const over = cats.filter(c => c.spent > c.planned);

  const addCat = () => {
    if (!newCat.cat || !newCat.planned) return;
    setCats([...cats, { ...newCat, planned: +newCat.planned, spent: 0 }]);
    setShowModal(false);
    setNewCat({ cat:'', planned:'', color:C.blue });
  };

  return (
    <div style={S.page}>
      <PageHeader title="Budget Planner" sub="Set spending limits and track your progress"
        action={<button onClick={() => setShowModal(true)} style={S.btnSm}><Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Add Category</button>} />

      {/* INCOME */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div>
            <label style={S.label}>Monthly Income</label>
            <input style={S.input} value={income} onChange={e => setIncome(e.target.value)} placeholder="0.00" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[['Planned', `$${totalPlanned.toLocaleString()}`, C.blue],['Spent', `$${totalSpent.toLocaleString()}`, C.red],['Remaining', `$${(+income - totalSpent).toLocaleString()}`, C.green]].map(([l,v,c]) => (
              <div key={l} style={{ textAlign: 'center', background: C.card2, borderRadius: 12, padding: '14px 8px' }}>
                <p style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>{l}</p>
                <p style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 700, color: c }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {over.length > 0 && (
        <AIInsight text={`⚠️ You're overspending in ${over.length} categor${over.length > 1 ? 'ies' : 'y'}: ${over.map(c => c.cat).join(', ')}. Consider reducing spending or adjusting your budget.`} type="alert" />
      )}
      <div style={{ height: 16 }} />

      {/* AI SUGGESTION */}
      <div style={{ ...S.card, marginBottom: 20, background: C.red + '10', border: `1px solid ${C.red}30` }}>
        <p style={{ fontSize: 12, color: C.red, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8 }}>🤖 AI BUDGET SUGGESTION</p>
        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>Based on your income of ${income}, try the <strong style={{ color: C.red }}>50/30/20 rule</strong>: ${(+income * 0.5).toFixed(0)} for needs, ${(+income * 0.3).toFixed(0)} for wants, and ${(+income * 0.2).toFixed(0)} for savings & debt. Your current savings rate is {((+income - totalSpent) / +income * 100).toFixed(0)}%.</p>
      </div>

      {/* CATEGORIES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cats.map((c, i) => {
          const pct = Math.round((c.spent / c.planned) * 100);
          const over = c.spent > c.planned;
          return (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color }} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{c.cat}</span>
                  {over && <Badge color="#EF4444">Over!</Badge>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: over ? '#EF4444' : C.text }}>${c.spent.toFixed(0)}</span>
                  <span style={{ fontSize: 12, color: C.text2 }}> / ${c.planned}</span>
                </div>
              </div>
              <ProgressBar pct={pct} color={c.color} h={7} />
              <p style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>{pct}% used · {over ? `$${(c.spent - c.planned).toFixed(0)} over budget` : `$${(c.planned - c.spent).toFixed(0)} remaining`}</p>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Add Budget Category" onClose={() => setShowModal(false)}>
          <FormField label="Category Name"><input style={S.input} placeholder="e.g. Entertainment" value={newCat.cat} onChange={e => setNewCat({ ...newCat, cat: e.target.value })} /></FormField>
          <FormField label="Monthly Limit ($)"><input type="number" style={S.input} placeholder="0" value={newCat.planned} onChange={e => setNewCat({ ...newCat, planned: e.target.value })} /></FormField>
          <button onClick={addCat} style={{ ...S.btn, width: '100%' }}>Add Category</button>
        </Modal>
      )}
    </div>
  );
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
function ExpensesPage() {
  const [txns, setTxns] = useState(TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newTxn, setNewTxn] = useState({ name:'', cat:'Groceries', amount:'', date:'Jan 2024' });

  const cats = ['All', ...Array.from(new Set(TRANSACTIONS.map(t => t.cat)))];
  const filtered = txns.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || t.cat === filterCat;
    return matchSearch && matchCat;
  });

  const addTxn = () => {
    if (!newTxn.name || !newTxn.amount) return;
    setTxns([{ id: Date.now(), ...newTxn, amount: -Math.abs(+newTxn.amount), recurring: false }, ...txns]);
    setShowAdd(false);
    setNewTxn({ name:'', cat:'Groceries', amount:'', date:'Jan 2024' });
  };

  return (
    <div style={S.page}>
      <PageHeader title="Expense Tracker" sub="Track and manage all your transactions"
        action={<button onClick={() => setShowAdd(true)} style={S.btnSm}><Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Add Expense</button>} />

      {/* SEARCH + FILTER */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.text2 }} />
          <input style={{ ...S.input, paddingLeft: 38 }} placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{ background: filterCat === cat ? C.red : C.card2, color: filterCat === cat ? '#fff' : C.text2, border: `1px solid ${C.border2}`, borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontFamily: FONT, fontWeight: filterCat === cat ? 600 : 400 }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div style={S.card}>
        <p style={{ fontSize: 12, color: C.text2, marginBottom: 14 }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: C.text2 }}><Search size={40} style={{ marginBottom: 10, opacity: 0.3 }} /><p>No transactions found</p></div>}
        {filtered.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.amount > 0 ? C.green + '1A' : C.red + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.amount > 0 ? <ArrowUpRight size={17} color={C.green} /> : <ArrowDownRight size={17} color={C.red} />}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{t.name}</p>
                <p style={{ fontSize: 11, color: C.text2 }}>{t.cat} · {t.date} {t.recurring && '· 🔁 Recurring'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: t.amount > 0 ? C.green : C.text }}>{t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}</p>
              <button onClick={() => setTxns(txns.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text3, padding: 4 }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Add Expense" onClose={() => setShowAdd(false)}>
          <FormField label="Description"><input style={S.input} placeholder="e.g. Grocery run" value={newTxn.name} onChange={e => setNewTxn({ ...newTxn, name: e.target.value })} /></FormField>
          <FormField label="Category">
            <select style={{ ...S.input }} value={newTxn.cat} onChange={e => setNewTxn({ ...newTxn, cat: e.target.value })}>
              {['Groceries','Dining','Transport','Utilities','Shopping','Health','Subscriptions','Phone','Insurance','Housing','Debt','Entertainment'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Amount ($)"><input type="number" style={S.input} placeholder="0.00" value={newTxn.amount} onChange={e => setNewTxn({ ...newTxn, amount: e.target.value })} /></FormField>
          <button onClick={addTxn} style={{ ...S.btn, width: '100%' }}>Add Expense</button>
        </Modal>
      )}
    </div>
  );
}

// ─── SAVINGS GOALS ────────────────────────────────────────────────────────────
function SavingsPage() {
  const [goals, setGoals] = useState(SAVINGS_GOALS);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name:'', target:'', saved:'0', deadline:'', emoji:'🎯' });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    setGoals([...goals, { id: Date.now(), ...newGoal, target: +newGoal.target, saved: +newGoal.saved, color: C.blue }]);
    setShowAdd(false);
    setNewGoal({ name:'', target:'', saved:'0', deadline:'', emoji:'🎯' });
  };

  return (
    <div style={S.page}>
      <PageHeader title="Savings Goals" sub="Build toward your biggest financial dreams"
        action={<button onClick={() => setShowAdd(true)} style={S.btnSm}><Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />New Goal</button>} />

      <AIInsight text="Great progress! You're on track to fully fund your Emergency Fund by June 2024. Consider starting a Roth IRA after that milestone." type="success" />
      <div style={{ height: 20 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {goals.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
          const remaining = g.target - g.saved;
          return (
            <div key={g.id} style={{ ...S.card, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: g.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{g.emoji}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{g.name}</p>
                    <p style={{ fontSize: 11, color: C.text2, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} />{g.deadline}</p>
                  </div>
                </div>
                <button onClick={() => setGoals(goals.filter(x => x.id !== g.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text3, padding: 4 }}><X size={14} /></button>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: C.text2 }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={g.color} h={10} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, color: C.text2 }}>Saved</p>
                  <p style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 700, color: C.text }}>${g.saved.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: C.text2 }}>Target</p>
                  <p style={{ fontFamily: HEAD, fontSize: 18, fontWeight: 700, color: g.color }}>${g.target.toLocaleString()}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.text2, marginTop: 8 }}>💡 ${remaining.toLocaleString()} remaining · ~${Math.ceil(remaining / 6).toLocaleString()}/mo to reach by deadline</p>
            </div>
          );
        })}

        {/* Add placeholder */}
        <button onClick={() => setShowAdd(true)} style={{ ...S.card, border: `2px dashed ${C.border2}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: 'transparent', color: C.text2, minHeight: 200 }}>
          <Plus size={28} />
          <p style={{ fontWeight: 600 }}>Add New Goal</p>
        </button>
      </div>

      {showAdd && (
        <Modal title="Create Savings Goal" onClose={() => setShowAdd(false)}>
          <FormField label="Goal Name"><input style={S.input} placeholder="e.g. Emergency Fund" value={newGoal.name} onChange={e => setNewGoal({ ...newGoal, name: e.target.value })} /></FormField>
          <FormField label="Target Amount ($)"><input type="number" style={S.input} placeholder="10000" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} /></FormField>
          <FormField label="Already Saved ($)"><input type="number" style={S.input} placeholder="0" value={newGoal.saved} onChange={e => setNewGoal({ ...newGoal, saved: e.target.value })} /></FormField>
          <FormField label="Target Deadline"><input style={S.input} placeholder="e.g. Dec 2024" value={newGoal.deadline} onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })} /></FormField>
          <button onClick={addGoal} style={{ ...S.btn, width: '100%' }}>Create Goal</button>
        </Modal>
      )}
    </div>
  );
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AIPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your DayeBudget AI assistant 👋\n\nI can help you budget smarter, save more, pay off debt, and plan your financial future. What would you like to work on today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const PROMPTS = [
    "Help me create a monthly budget",
    "How can I save $500 this month?",
    "Where am I overspending?",
    "Should I pay debt or save first?",
    "How much should I put in emergency fund?",
    "Give me beginner investing advice",
  ];

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');
    const newMsgs = [...messages, { role: 'user', content: msg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: `You are DayeBudget AI, a friendly and knowledgeable personal finance assistant. You help users with budgeting, saving money, paying off debt, and investing basics. Keep responses concise (2-4 short paragraphs max), practical, and encouraging. Use occasional emojis. IMPORTANT DISCLAIMER: Always mention at the end of investment advice that AI guidance is educational and not professional financial advice. The user's current financial snapshot: Monthly income $7,700, monthly expenses $4,380, savings $6,500 (emergency fund goal $10,000), total debt $37,750 (student loan $18,500 at 5.8%, car loan $14,200 at 6.9%, Chase card $3,850 at 24.99%, Amex card $1,200 at 19.99%), budget health score 74/100.`,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Please try again!";
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: "I'm having a connection issue. Please check your internet and try again. In the meantime, I recommend reviewing your highest-interest debt first!" }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{ ...S.page, display: 'flex', flexDirection: 'column', height: '100dvh', padding: 0 }}>
      {/* HEADER */}
      <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} color="#fff" /></div>
          <div>
            <h2 style={{ ...S.h2, fontSize: 17 }}>AI Budget Assistant</h2>
            <p style={{ fontSize: 11, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}>● Online · Powered by Claude AI</p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
            {m.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: 9, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><MessageSquare size={16} color="#fff" /></div>
            )}
            <div style={{
              maxWidth: '78%',
              background: m.role === 'user' ? C.red : C.card,
              border: m.role === 'assistant' ? `1px solid ${C.border2}` : 'none',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '12px 16px',
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: C.text, whiteSpace: 'pre-wrap', margin: 0 }}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MessageSquare size={16} color="#fff" /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: '18px 18px 18px 4px', padding: '14px 18px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.text2, animation: `bounce 1.2s infinite ${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* PROMPT CHIPS */}
      {messages.length < 3 && (
        <div style={{ padding: '0 24px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} style={{ background: C.card2, border: `1px solid ${C.border2}`, borderRadius: 20, padding: '7px 14px', fontSize: 12, color: C.text2, cursor: 'pointer', fontFamily: FONT }}>{p}</button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${C.border}`, background: C.bg2 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            style={{ ...S.input, resize: 'none', height: 52, lineHeight: 1.5, paddingTop: 14, flex: 1 }}
            placeholder="Ask anything about your finances..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{ ...S.btn, padding: '14px 20px', opacity: (loading || !input.trim()) ? 0.5 : 1, borderRadius: 12, flexShrink: 0 }}>Send</button>
        </div>
        <p style={{ fontSize: 10, color: C.text3, marginTop: 8 }}>⚠️ AI advice is educational and not professional financial advice. Consult a licensed financial advisor for major decisions.</p>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}

// ─── BILLS ────────────────────────────────────────────────────────────────────
function BillsPage() {
  const [bills, setBills] = useState(BILLS);
  const toggle = (id) => setBills(bills.map(b => b.id === id ? { ...b, paid: !b.paid } : b));
  const unpaid = bills.filter(b => !b.paid);
  const totalDue = unpaid.reduce((s, b) => s + b.amount, 0);

  return (
    <div style={S.page}>
      <PageHeader title="Bills & Subscriptions" sub="Never miss a payment again" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Bills Due" value={`$${totalDue.toFixed(2)}`} sub={`${unpaid.length} unpaid`} icon={AlertCircle} iconColor={C.yellow} />
        <StatCard label="Monthly Total" value={`$${bills.reduce((s,b) => s+b.amount,0).toFixed(2)}`} sub="All recurring bills" icon={Calendar} iconColor={C.blue} />
        <StatCard label="Paid This Month" value={`$${bills.filter(b=>b.paid).reduce((s,b)=>s+b.amount,0).toFixed(2)}`} sub={`${bills.filter(b=>b.paid).length} bills paid`} icon={CheckCircle} iconColor={C.green} />
      </div>

      <AIInsight text="You're spending $50.97/month on entertainment subscriptions (Netflix, Spotify, Gym). Consider which ones you use most and cancel unused ones to save." type="warning" />
      <div style={{ height: 16 }} />

      <div style={{ ...S.card }}>
        <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>All Bills</h3>
        {bills.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => toggle(b.id)} style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${b.paid ? C.green : C.border2}`, background: b.paid ? C.green : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {b.paid && <CheckCircle size={14} color="#fff" />}
              </button>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: b.paid ? C.text2 : C.text, textDecoration: b.paid ? 'line-through' : 'none' }}>{b.name}</p>
                <p style={{ fontSize: 11, color: C.text2 }}>{b.cat} · Due {b.due}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: b.paid ? C.green : C.text }}>${b.amount.toFixed(2)}</p>
              <Badge color={b.paid ? C.green : C.yellow}>{b.paid ? 'Paid' : 'Unpaid'}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DEBT ──────────────────────────────────────────────────────────────────────
function DebtPage() {
  const [method, setMethod] = useState('avalanche');
  const totalDebt = DEBTS.reduce((s, d) => s + d.balance, 0);
  const totalMin = DEBTS.reduce((s, d) => s + d.min, 0);
  const sorted = method === 'avalanche' ? [...DEBTS].sort((a,b) => b.rate - a.rate) : [...DEBTS].sort((a,b) => a.balance - b.balance);

  return (
    <div style={S.page}>
      <PageHeader title="Debt Payoff Planner" sub="Track and eliminate your debt strategically" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Debt" value={`$${totalDebt.toLocaleString()}`} sub="Across all accounts" icon={TrendingDown} iconColor={C.red} />
        <StatCard label="Min. Payments" value={`$${totalMin}/mo`} sub="Monthly minimums" icon={CreditCard} iconColor={C.yellow} />
        <StatCard label="Highest APR" value="24.99%" sub="Chase Credit Card" icon={Percent} iconColor="#EF4444" />
        <StatCard label="Est. Payoff" value="38 mos" sub="With extra $200/mo" icon={Calendar} iconColor={C.green} />
      </div>

      {/* STRATEGY */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Payoff Strategy</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[['avalanche','Avalanche Method','Highest interest first'],['snowball','Snowball Method','Smallest balance first']].map(([id,name,desc]) => (
            <button key={id} onClick={() => setMethod(id)} style={{ flex: 1, padding: '14px 16px', borderRadius: 12, border: `2px solid ${method === id ? C.red : C.border2}`, background: method === id ? C.red + '14' : C.card2, cursor: 'pointer', textAlign: 'left' }}>
              <p style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 14, color: method === id ? C.red : C.text, marginBottom: 3 }}>{name}</p>
              <p style={{ fontSize: 11, color: C.text2 }}>{desc}</p>
            </button>
          ))}
        </div>
        <AIInsight text={method === 'avalanche' ? "💡 AI Recommendation: The Avalanche method saves you the most money in interest. Focus extra payments on your Chase card (24.99% APR) — paying an extra $200/month saves ~$1,200 in interest." : "💡 AI Recommendation: The Snowball method builds momentum. Start with your Amex card ($1,200 balance) for a quick win, then roll that payment to the next debt."} type="info" />
      </div>

      {/* DEBT LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sorted.map((d, i) => {
          const pct = Math.round((d.balance / totalDebt) * 100);
          return (
            <div key={d.id} style={{ ...S.card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: d.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 13, color: d.color }}>#{i + 1}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{d.name}</p>
                    <p style={{ fontSize: 11, color: C.text2 }}>Due: {d.due} · Min: ${d.min}/mo</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: HEAD, fontSize: 20, fontWeight: 700, color: d.color }}>${d.balance.toLocaleString()}</p>
                  <Badge color={d.rate > 15 ? '#EF4444' : C.yellow}>{d.rate}% APR</Badge>
                </div>
              </div>
              <ProgressBar pct={pct} color={d.color} h={6} />
              <p style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>{pct}% of total debt</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function ReportsPage() {
  const savings = [
    { month:'Aug', amount:3500 }, { month:'Sep', amount:6400 }, { month:'Oct', amount:10200 },
    { month:'Nov', amount:13200 }, { month:'Dec', amount:15300 }, { month:'Jan', amount:18620 },
  ];

  return (
    <div style={S.page}>
      <PageHeader title="Reports & Insights" sub="Deep dive into your financial health"
        action={<button style={S.btnGhost}><Download size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Export</button>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Net Worth" value="$22,140" sub="+$4,200 this year" icon={TrendingUp} iconColor={C.green} trend="up" />
        <StatCard label="Savings Rate" value="43.1%" sub="+3.2% vs last month" icon={Target} iconColor={C.blue} trend="up" />
        <StatCard label="Avg Daily Spend" value="$146" sub="-$12 vs last month" icon={CreditCard} iconColor={C.yellow} />
        <StatCard label="Budget Score" value="74/100" sub="+6 pts this month" icon={Award} iconColor={C.purple} trend="up" />
      </div>

      {/* INCOME VS EXPENSES BAR */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Income vs Expenses (6 Months)</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY} margin={{ top:5, right:10, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fill:C.text2, fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.text2, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}k`} />
              <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, color:C.text }} formatter={(v)=>[`$${v.toLocaleString()}`,'']} />
              <Bar dataKey="income" fill={C.green} radius={[4,4,0,0]} />
              <Bar dataKey="expenses" fill={C.red} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display:'flex', gap:16, marginTop:10, justifyContent:'center' }}>
          {[['Income',C.green],['Expenses',C.red]].map(([l,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:c }} />
              <span style={{ fontSize:11, color:C.text2 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SAVINGS GROWTH */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Savings Growth</h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savings} margin={{ top:5, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="gSav" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill:C.text2, fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.text2, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}k`} />
              <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, color:C.text }} formatter={(v)=>[`$${v.toLocaleString()}`,'']} />
              <Area type="monotone" dataKey="amount" stroke={C.green} strokeWidth={2.5} fill="url(#gSav)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY PIE */}
      <div style={S.card}>
        <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Spending by Category (January)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border2}`, borderRadius:10, color:C.text }} formatter={(v)=>[`$${v}`,'']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
            {PIE_DATA.map(d => {
              const total = PIE_DATA.reduce((s,x) => s+x.value, 0);
              const pct = Math.round(d.value/total*100);
              return (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                      <span style={{ fontSize: 13, color: C.text }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>${d.value} <span style={{ color: C.text2, fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <ProgressBar pct={pct} color={d.color} h={4} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────
function EducationPage() {
  const topics = [
    { icon:'💰', title:'The 50/30/20 Rule', desc:'A simple budgeting method: 50% needs, 30% wants, 20% savings and debt.', tag:'Budgeting' },
    { icon:'🛡️', title:'Emergency Fund Basics', desc:'Build 3-6 months of expenses in a liquid savings account before investing.', tag:'Saving' },
    { icon:'📈', title:'Compound Interest', desc:'The 8th wonder of the world. $1,000 at 7% becomes $7,612 in 30 years.', tag:'Investing' },
    { icon:'❄️', title:'Debt Snowball vs Avalanche', desc:'Snowball: smallest balance first. Avalanche: highest rate first. Both work.', tag:'Debt' },
    { icon:'💳', title:'Credit Score Basics', desc:'Payment history (35%), utilization (30%), length (15%), mix (10%), new (10%).', tag:'Credit' },
    { icon:'🏦', title:'High-Yield Savings', desc:'HYSAs offer 4-5% APY vs 0.01% at big banks. Park your emergency fund here.', tag:'Saving' },
    { icon:'📊', title:'Index Fund Investing', desc:'Low-cost index funds beat 90% of actively managed funds over 10+ years.', tag:'Investing' },
    { icon:'🎯', title:'FIRE Movement', desc:'Financial Independence, Retire Early. Save 25x your annual expenses to retire.', tag:'Investing' },
    { icon:'📋', title:'Roth vs Traditional IRA', desc:'Roth: pay taxes now, grow tax-free. Traditional: defer taxes until retirement.', tag:'Retirement' },
    { icon:'⚡', title:'Zero-Based Budgeting', desc:'Give every dollar a job. Income - expenses = 0. Maximum intentionality.', tag:'Budgeting' },
    { icon:'🔄', title:'Debt Payoff Strategies', desc:'Pay minimums on all debts, throw every extra dollar at your priority debt.', tag:'Debt' },
    { icon:'🌱', title:'Investing Risk & Reward', desc:'Higher potential return = higher risk. Diversify across assets to balance both.', tag:'Investing' },
  ];
  const tagColors = { Budgeting:C.blue, Saving:C.green, Investing:C.purple, Debt:C.red, Credit:C.yellow, Retirement:C.teal };
  const [activeTag, setActiveTag] = useState('All');
  const tags = ['All', ...Array.from(new Set(topics.map(t => t.tag)))];
  const filtered = activeTag === 'All' ? topics : topics.filter(t => t.tag === activeTag);

  return (
    <div style={S.page}>
      <PageHeader title="Financial Education" sub="Learn the fundamentals of building wealth" />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {tags.map(t => (
          <button key={t} onClick={() => setActiveTag(t)} style={{ background: activeTag === t ? C.red : C.card2, color: activeTag === t ? '#fff' : C.text2, border: `1px solid ${C.border2}`, borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontFamily: FONT, fontWeight: activeTag === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map(t => (
          <div key={t.title} style={{ ...S.card, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 30 }}>{t.icon}</span>
              <Badge color={tagColors[t.tag] || C.blue}>{t.tag}</Badge>
            </div>
            <h3 style={{ fontFamily: HEAD, fontSize: 15, fontWeight: 700, marginBottom: 8, color: C.text }}>{t.title}</h3>
            <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.6 }}>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({ onLogout }) {
  const [form, setForm] = useState({ name: USER.name, email: USER.email, username: USER.username });
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifs, setNotifs] = useState({ bills: true, budget: true, ai: false });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={S.page}>
      <PageHeader title="Profile & Settings" sub="Manage your account and preferences" />

      {/* PROFILE CARD */}
      <div style={{ ...S.card, marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontFamily: HEAD, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{USER.avatar}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: HEAD, fontSize: 20, fontWeight: 700 }}>{form.name}</h2>
          <p style={{ color: C.text2, fontSize: 13 }}>{form.email}</p>
          <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
            <Badge color={C.yellow}>Premium Member</Badge>
            <Badge color={C.green}>Account Active</Badge>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {/* PERSONAL INFO */}
        <div style={S.card}>
          <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Personal Information</h3>
          <FormField label="Full Name"><input style={S.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Email Address"><input style={S.input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></FormField>
          <FormField label="Username"><input style={S.input} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></FormField>
          <button onClick={save} style={{ ...S.btn, display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}>
            {saved ? <><CheckCircle size={15} /> Saved!</> : 'Save Changes'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* SECURITY */}
          <div style={S.card}>
            <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Security</h3>
            <FormField label="Current Password"><input type="password" style={S.input} placeholder="••••••••" /></FormField>
            <FormField label="New Password"><input type="password" style={S.input} placeholder="••••••••" /></FormField>
            <button style={S.btnGhost}>Update Password</button>
          </div>

          {/* PREFERENCES */}
          <div style={S.card}>
            <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Preferences</h3>
            {[['Dark Mode', 'Interface appearance', darkMode, () => setDarkMode(!darkMode)],
              ['Bill Reminders', 'Notify before bills are due', notifs.bills, () => setNotifs({...notifs, bills: !notifs.bills})],
              ['Budget Alerts', 'Alert when near spending limit', notifs.budget, () => setNotifs({...notifs, budget: !notifs.budget})],
              ['AI Digest', 'Weekly AI financial summary', notifs.ai, () => setNotifs({...notifs, ai: !notifs.ai})],
            ].map(([name, desc, val, toggle]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{name}</p>
                  <p style={{ fontSize: 11, color: C.text2 }}>{desc}</p>
                </div>
                <button onClick={toggle} style={{ width: 46, height: 26, borderRadius: 13, background: val ? C.red : C.border2, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', position: 'absolute', top: 3, left: val ? 22 : 3, transition: 'left .2s' }} />
                </button>
              </div>
            ))}
          </div>

          {/* SUBSCRIPTION */}
          <div style={{ ...S.card, background: C.red + '10', border: `1px solid ${C.red}30` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700 }}>Your Plan</h3>
              <Badge color={C.yellow}>Premium</Badge>
            </div>
            <p style={{ fontSize: 13, color: C.text2, marginBottom: 14 }}>$9.99/month · Renews Feb 1, 2024 · Unlimited AI, all features</p>
            <button style={{ ...S.btnGhost, fontSize: 12 }}>Manage Subscription</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button onClick={onLogout} style={{ background: '#EF444420', color: '#EF4444', border: `1px solid #EF444440`, borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      <div style={{ marginTop: 20, padding: '16px 20px', background: C.card2, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.7 }}>
          🔒 <strong style={{ color: C.text }}>Privacy & Security:</strong> Your financial data is encrypted and private. We never sell your data to third parties. AI advice is educational — consult a licensed financial advisor for major decisions.
        </p>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminPage({ onBack }) {
  const [users, setUsers] = useState(ADMIN_USERS);
  const toggle = (id, field) => setUsers(users.map(u => u.id === id ? { ...u, [field]: u[field] === 'Active' ? 'Inactive' : 'Active' } : u));
  const togglePlan = (id) => setUsers(users.map(u => u.id === id ? { ...u, plan: u.plan === 'Premium' ? 'Free' : 'Premium' } : u));

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button onClick={onBack} style={{ ...S.btnGhost, padding: '8px 14px', fontSize: 12 }}>← Back</button>
        <div>
          <h1 style={S.h1}>Admin Panel</h1>
          <p style={{ color: C.red, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', marginTop: 2 }}>🔐 OWNER ACCESS ONLY</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Users" value={users.length.toString()} sub="Registered accounts" icon={User} iconColor={C.blue} />
        <StatCard label="Premium Users" value={users.filter(u=>u.plan==='Premium').length.toString()} sub="Paying subscribers" icon={Award} iconColor={C.yellow} />
        <StatCard label="Active Users" value={users.filter(u=>u.status==='Active').length.toString()} sub="This month" icon={CheckCircle} iconColor={C.green} />
        <StatCard label="Monthly Revenue" value="$29.97" sub="From premium subs" icon={DollarSign} iconColor={C.red} />
      </div>

      {/* USERS TABLE */}
      <div style={S.card}>
        <h3 style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>User Management</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Email', 'Plan', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.text2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 500, color: C.text }}>{u.name}</td>
                  <td style={{ padding: '12px', fontSize: 12, color: C.text2 }}>{u.email}</td>
                  <td style={{ padding: '12px' }}><Badge color={u.plan === 'Premium' ? C.yellow : C.text2}>{u.plan}</Badge></td>
                  <td style={{ padding: '12px' }}><Badge color={u.status === 'Active' ? C.green : C.text3}>{u.status}</Badge></td>
                  <td style={{ padding: '12px', fontSize: 12, color: C.text2 }}>{u.joined}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggle(u.id, 'status')} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: `1px solid ${C.border2}`, background: 'transparent', color: C.text2, cursor: 'pointer', fontFamily: FONT }}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                      <button onClick={() => togglePlan(u.id)} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: `1px solid ${C.border2}`, background: 'transparent', color: u.plan === 'Free' ? C.yellow : C.text2, cursor: 'pointer', fontFamily: FONT }}>{u.plan === 'Free' ? '+ Premium' : '− Premium'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell({ onLogout }) {
  const [page, setPage] = useState('dashboard');
  const [showAdmin, setShowAdmin] = useState(false);
  const isMobile = useIsMobile();

  if (showAdmin) return <div style={{ background: C.bg, minHeight: '100dvh', fontFamily: FONT, color: C.text }}><AdminPage onBack={() => setShowAdmin(false)} /></div>;

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage setPage={setPage} />;
      case 'budget': return <BudgetPage />;
      case 'expenses': return <ExpensesPage />;
      case 'savings': return <SavingsPage />;
      case 'ai': return <AIPage />;
      case 'bills': return <BillsPage />;
      case 'debt': return <DebtPage />;
      case 'reports': return <ReportsPage />;
      case 'education': return <EducationPage />;
      case 'profile': return <ProfilePage onLogout={onLogout} />;
      default: return <DashboardPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', fontFamily: FONT, color: C.text, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {!isMobile && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar page={page} setPage={setPage} onLogout={onLogout} onAdmin={() => setShowAdmin(true)} />
          <div style={{ flex: 1, overflowY: 'auto' }}>{renderPage()}</div>
        </div>
      )}
      {isMobile && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MobileHeader page={page} onNotify={() => {}} />
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>{renderPage()}</div>
          <BottomNav page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function DayeBudgetAI() {
  const [view, setView] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; }
    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #090909; color: #fff; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    input, select, textarea, button { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    input[type="text"], input[type="email"], input[type="password"], input[type="number"], select, textarea { font-size: 16px !important; -webkit-appearance: none; -moz-appearance: none; appearance: none; }
    input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type="checkbox"] { width: 16px; height: 16px; accent-color: #E5041C; flex-shrink: 0; }
    input::placeholder, textarea::placeholder { color: #4A4A4A; opacity: 1; }
    button { cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    * { -webkit-tap-highlight-color: transparent; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0F0F0F; }
    ::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 2px; }
    img { max-width: 100%; height: auto; display: block; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .page-enter { animation: fadeIn 0.2s ease; }
    @media (max-width: 768px) { .desktop-sidebar { display: none !important; } }
    @media (min-width: 769px) { .mobile-nav { display: none !important; } .mobile-header { display: none !important; } }
    @supports (padding: max(0px)) { .bottom-safe { padding-bottom: max(12px, env(safe-area-inset-bottom)) !important; } }
  `;

  if (isLoggedIn) {
    return (
      <>
        <style>{globalCSS}</style>
        <AppShell onLogout={() => { setIsLoggedIn(false); setView('landing'); }} />
      </>
    );
  }

  return (
    <>
      <style>{globalCSS}</style>
      {view === 'landing' && <LandingPage goSignIn={() => setView('signin')} goSignUp={() => setView('signup')} />}
      {view === 'signin' && <SignInPage goSignUp={() => setView('signup')} onSignIn={() => setIsLoggedIn(true)} />}
      {view === 'signup' && <SignUpPage goSignIn={() => setView('signin')} onSignIn={() => setIsLoggedIn(true)} />}
    </>
  );
}
