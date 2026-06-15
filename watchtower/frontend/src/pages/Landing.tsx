import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Shield, Activity, Globe, Lock, Server, Bell, Zap, ChevronRight, CheckCircle,
  ArrowRight, Star, Users, TrendingUp, Clock, AlertTriangle, BarChart2,
  Code, Cpu, Eye, Menu, X, Play, ChevronDown, Check, MessageSquare, Mail,
  Twitter, Github, Linkedin, ExternalLink, Database, Radio
} from 'lucide-react';

// ---- Animated Counter ----
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => spring.on('change', (v) => {
    if (ref.current) ref.current.textContent = prefix + Math.round(v).toLocaleString() + suffix;
  }), [spring, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ---- Navbar ----
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/10 shadow-xl shadow-black/20' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Shield size={18} className="text-white"/>
          </div>
          <span className="text-xl font-bold gradient-text">WatchTower</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          {['Features','Pricing','How It Works','Testimonials'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g,'-')}`} className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="btn-outline py-2 px-5 text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary py-2 px-5 text-sm relative z-10">Start Free</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-white/5">{open ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
      {open && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="md:hidden glass border-t border-white/10 p-4 space-y-3">
          {['Features','Pricing','How It Works','Testimonials'].map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} onClick={()=>setOpen(false)} className="block text-white/60 hover:text-white text-sm py-2">{l}</a>)}
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" className="btn-outline text-center text-sm" onClick={()=>setOpen(false)}>Sign in</Link>
            <Link to="/register" className="btn-primary text-center text-sm relative z-10" onClick={()=>setOpen(false)}>Start Free</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ---- Hero ----
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* BG glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-glow w-[600px] h-[600px] bg-primary-500/15 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
        <div className="hero-glow w-[400px] h-[400px] bg-purple-600/10 top-3/4 left-1/4"/>
        <div className="hero-glow w-[300px] h-[300px] bg-blue-500/10 top-1/4 right-1/4"/>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',backgroundSize:'60px 60px'}}/>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-white/60">Monitoring</span>
            <span className="gradient-text font-semibold">2,419 websites</span>
            <span className="text-white/60">right now</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Know When Your<br/>
            <span className="gradient-text">Site Goes Down</span><br/>
            Before Users Do
          </h1>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            WatchTower monitors your websites, APIs, SSL certificates, and domains 24/7.
            Get instant alerts via email before downtime costs you customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 relative z-10">
              Start Monitoring Free <ArrowRight size={18}/>
            </Link>
            <a href="#how-it-works" className="btn-outline text-base px-8 py-4 flex items-center justify-center gap-2">
              <Play size={16}/> See How It Works
            </a>
          </div>
        </motion.div>

        {/* Live Dashboard Preview */}
        <motion.div initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} transition={{duration:0.9,delay:0.3}} className="relative max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-1 shadow-2xl shadow-primary-500/20 border border-white/10">
            <div className="bg-dark-100 rounded-xl p-4 sm:p-6">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/60"/>
                <div className="w-3 h-3 rounded-full bg-amber-500/60"/>
                <div className="w-3 h-3 rounded-full bg-green-500/60"/>
                <div className="flex-1 bg-white/5 rounded-lg h-6 ml-3 flex items-center px-3 text-white/20 text-xs">app.watchtower.io/dashboard</div>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[{label:'Total Monitors',val:'24',color:'text-primary-400'},{label:'Uptime Avg',val:'99.97%',color:'text-green-400'},{label:'Down Now',val:'0',color:'text-green-400'},{label:'Avg Response',val:'143ms',color:'text-blue-400'}].map(s => (
                  <div key={s.label} className="glass rounded-xl p-3">
                    <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Monitor list */}
              <div className="space-y-2">
                {[{name:'api.myapp.com',url:'https://api.myapp.com',status:'UP',rt:89,up:99.98},{name:'app.myapp.com',url:'https://app.myapp.com',status:'UP',rt:134,up:99.95},{name:'cdn.myapp.com',url:'https://cdn.myapp.com',status:'UP',rt:45,up:100},{name:'staging.myapp.com',url:'https://staging.myapp.com',status:'DOWN',rt:null,up:97.2}].map((m, i) => (
                  <motion.div key={m.name} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*0.1}} className="glass flex items-center gap-3 p-3 rounded-xl">
                    <div className={`pulse-dot ${m.status==='DOWN'?'down':''}`}/>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{m.name}</div>
                      <div className="text-xs text-white/30 truncate">{m.url}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status==='UP'?'badge-up':'badge-down'}`}>{m.status}</span>
                    <div className="hidden sm:block text-xs text-white/40">{m.rt ? `${m.rt}ms` : '—'}</div>
                    <div className="hidden sm:block text-xs text-green-400">{m.up}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          {/* Floating badges */}
          <motion.div animate={{y:[0,-8,0]}} transition={{repeat:Infinity,duration:3}} className="absolute -right-4 top-8 glass px-3 py-2 rounded-xl shadow-xl hidden lg:block">
            <div className="flex items-center gap-2 text-sm"><Bell size={14} className="text-amber-400"/><span className="font-medium">Alert sent</span></div>
            <div className="text-xs text-white/40 mt-0.5">staging.myapp.com is DOWN</div>
          </motion.div>
          <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:4,delay:1}} className="absolute -left-4 bottom-12 glass px-3 py-2 rounded-xl shadow-xl hidden lg:block">
            <div className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-400"/><span className="font-medium">Site recovered</span></div>
            <div className="text-xs text-white/40 mt-0.5">Downtime: 2m 34s</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ---- Trusted By ----
function TrustedBy() {
  const logos = ['Acme Corp','Stripe','Vercel','Linear','Notion','Figma','Discord','GitHub'];
  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-white/30 text-sm font-medium mb-8 uppercase tracking-widest">Trusted by engineering teams at</p>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {logos.map(l => (
            <div key={l} className="text-white/20 font-bold text-lg hover:text-white/40 transition-colors cursor-default tracking-tight">{l}</div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
          {[{val:'99.9%',label:'Avg uptime delivered'},{val:'2M+',label:'Checks per day'},{val:'<30s',label:'Alert delivery time'},{val:'10K+',label:'Monitors running'}].map(s => (
            <div key={s.label} className="text-center glass-card p-5">
              <div className="text-2xl font-black gradient-text">{s.val}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Features ----
function Features() {
  const features = [
    { icon: Globe, title:'Website Monitoring', desc:'HTTP/HTTPS checks with configurable intervals as low as 30 seconds. Track status codes and response times.',color:'from-blue-500/20 to-blue-600/10' },
    { icon: Code, title:'API Monitoring', desc:'Monitor REST API endpoints, validate response payloads, and track performance across all your services.',color:'from-primary-500/20 to-primary-600/10' },
    { icon: Lock, title:'SSL Certificate Monitoring', desc:'Get alerted before your SSL certificates expire. Never lose a visitor to a "Not Secure" warning again.',color:'from-amber-500/20 to-amber-600/10' },
    { icon: Globe, title:'Domain Expiry Tracking', desc:'Automatically track domain expiration dates and get alerts weeks before they expire.',color:'from-green-500/20 to-green-600/10' },
    { icon: AlertTriangle, title:'Incident Tracking', desc:'Full downtime history with resolution times, root cause tracking, and automatic recovery detection.',color:'from-red-500/20 to-red-600/10' },
    { icon: Bell, title:'Multi-Channel Alerts', desc:'Instant alerts via email, with WhatsApp, Telegram, Discord, and Slack channels coming soon.',color:'from-purple-500/20 to-purple-600/10' },
  ];
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 text-sm"><Cpu size={14} className="text-primary-400"/> Features</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Everything you need to<br/><span className="gradient-text">stay online</span></h2>
          <p className="text-white/40 max-w-xl mx-auto">Production-grade monitoring for teams of all sizes. Set up in under 2 minutes.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="glass-card p-6 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon size={22} className="text-white"/>
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Why Choose Us ----
function WhyUs() {
  const reasons = [
    { icon: Zap, title:'Instant Alerts', sub:'Under 30 seconds', desc:'Our monitoring infrastructure sends alerts within 30 seconds of detecting an issue — faster than any competitor.' },
    { icon: Eye, title:'Zero False Positives', sub:'Triple verification', desc:'Every alert is triple-verified from multiple geographic locations before you\'re notified.' },
    { icon: BarChart2, title:'Beautiful Reporting', sub:'Always insightful', desc:'Get actionable insights with clean charts, historical data, and exportable reports your team will actually use.' },
    { icon: Database, title:'100% Data Ownership', sub:'Your data, your rules', desc:'All monitoring data is stored securely. Export anytime. Delete anytime. No lock-in.' },
    { icon: Server, title:'Global Check Nodes', sub:'Multiple regions', desc:'Checks run from multiple global locations to eliminate false positives from regional outages.' },
    { icon: Radio, title:'99.99% Platform Uptime', sub:'Always watching', desc:'Our monitoring platform itself runs on redundant infrastructure so we\'re always watching your sites.' },
  ];
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent pointer-events-none"/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 text-sm"><TrendingUp size={14} className="text-green-400"/> Why WatchTower</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Built for <span className="gradient-text">reliability</span></h2>
          <p className="text-white/40 max-w-xl mx-auto">We obsess over every millisecond so you don't have to.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r,i) => (
            <motion.div key={r.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0"><r.icon size={18} className="text-primary-400"/></div>
                <div>
                  <div className="font-bold mb-0.5">{r.title}</div>
                  <div className="text-xs text-primary-400 mb-2 font-medium">{r.sub}</div>
                  <p className="text-white/40 text-sm leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Statistics ----
function Statistics() {
  const stats = [
    { target:10000, suffix:'+', label:'Websites Monitored', icon: Globe },
    { target:2000000, suffix:'+', label:'Checks Per Day', icon: Activity },
    { target:99, suffix:'.9%', label:'Platform Uptime', icon: TrendingUp },
    { target:30, suffix:'s', prefix:'<', label:'Alert Delivery', icon: Bell },
    { target:150, suffix:'+', label:'Countries Covered', icon: Users },
    { target:5000, suffix:'+', label:'Happy Teams', icon: Star },
  ];
  return (
    <section className="py-24 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Numbers that <span className="gradient-text">matter</span></h2>
          <p className="text-white/40">The scale and reliability behind WatchTower</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.1}} className="glass-card p-6 text-center">
              <s.icon size={28} className="text-primary-400 mx-auto mb-3"/>
              <div className="text-4xl font-black gradient-text mb-1">
                <AnimatedCounter target={s.target} suffix={s.suffix} prefix={s.prefix}/>
              </div>
              <div className="text-white/40 text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- How It Works ----
function HowItWorks() {
  const steps = [
    { n:'01', title:'Add Your Monitor', desc:'Paste your URL, choose the monitor type (HTTP, API, SSL, Domain), set your check interval, and save. Done in seconds.', icon: Globe },
    { n:'02', title:'We Watch 24/7', desc:'WatchTower checks your endpoint from multiple locations at your configured interval — as often as every 30 seconds.', icon: Eye },
    { n:'03', title:'Instant Alert', desc:'The moment we detect an issue (confirmed across multiple checks to eliminate false positives), you\'re notified immediately.', icon: Bell },
    { n:'04', title:'Recover & Analyze', desc:'Once your site recovers, you get a recovery alert with full incident duration data. Use analytics to prevent future issues.', icon: TrendingUp },
  ];
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 text-sm"><Clock size={14} className="text-primary-400"/> How It Works</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Up and running in <span className="gradient-text">2 minutes</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"/>
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}} className="glass-card p-6 text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                <s.icon size={24} className="text-white"/>
              </div>
              <div className="text-xs text-primary-400 font-bold mb-2 tracking-widest">{s.n}</div>
              <h3 className="font-bold text-base mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Testimonials ----
function Testimonials() {
  const testimonials = [
    { name:'Sarah Chen', role:'CTO at Launchpad', quote:'WatchTower caught our API outage at 3am and had our team alerted before any customer even noticed. Saved us thousands in lost revenue.', stars:5, avatar:'SC' },
    { name:'Marcus Williams', role:'Lead DevOps, FinTech Startup', quote:'We switched from UptimeRobot and the difference is night and day. The analytics alone are worth the upgrade.', stars:5, avatar:'MW' },
    { name:'Elena Rodriguez', role:'Founder, SaaS Platform', quote:'Setup took literally 2 minutes. Now I sleep easy knowing WatchTower is watching our 47 monitors around the clock.', stars:5, avatar:'ER' },
    { name:'David Park', role:'VP Engineering, Ecommerce', quote:'The SSL expiry alerts alone have saved us from multiple potential disasters. Every team needs this.', stars:5, avatar:'DP' },
    { name:'Jennifer Liu', role:'Platform Engineer', quote:'Clean UI, fast alerts, no false positives. WatchTower is exactly what professional monitoring should look like.', stars:5, avatar:'JL' },
    { name:'Alex Thompson', role:'Solo Founder', quote:'As a solo founder, I can\'t afford downtime. WatchTower is the first thing I set up for every project. Non-negotiable.', stars:5, avatar:'AT' },
  ];
  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 text-sm"><Star size={14} className="text-amber-400"/> Testimonials</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Loved by <span className="gradient-text">engineering teams</span></h2>
          <p className="text-white/40">Don't take our word for it</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="glass-card p-6">
              <div className="flex mb-3">{Array(t.stars).fill(0).map((_,j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400"/>)}</div>
              <p className="text-white/70 text-sm leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">{t.avatar}</div>
                <div><div className="font-semibold text-sm">{t.name}</div><div className="text-white/40 text-xs">{t.role}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Pricing ----
function Pricing() {
  const plans = [
    { name:'Free', price:0, monitors:5, interval:'5 min', features:['5 monitors','5-min checks','Email alerts','7-day history','Community support'], cta:'Get Started', highlight:false },
    { name:'Starter', price:9, monitors:20, interval:'1 min', features:['20 monitors','1-min checks','Email alerts','30-day history','API access','Slack integration'], cta:'Start Free Trial', highlight:false },
    { name:'Pro', price:29, monitors:100, interval:'30 sec', features:['100 monitors','30-sec checks','All alert channels','90-day history','Team members (3)','Priority support','SLA'], cta:'Start Free Trial', highlight:true },
    { name:'Business', price:99, monitors:500, interval:'15 sec', features:['500 monitors','15-sec checks','All alert channels','1-year history','Unlimited team','Dedicated support','Custom SLA','Status page'], cta:'Contact Sales', highlight:false },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 text-sm"><CreditCard size={14} className="text-primary-400" style={{display:'inline'}}/> Pricing</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Simple, <span className="gradient-text">transparent</span> pricing</h2>
          <p className="text-white/40">Start free. Upgrade when you're ready. No hidden fees.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
              className={`glass-card p-6 relative ${p.highlight ? 'border-primary-500/50 ring-2 ring-primary-500/30' : ''}`}>
              {p.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>}
              <div className="mb-6">
                <div className="text-lg font-bold mb-2">{p.name}</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black">{p.price===0?'Free':`$${p.price}`}</span>
                  {p.price > 0 && <span className="text-white/40 text-sm mb-1">/mo</span>}
                </div>
                {p.price > 0 && <div className="text-white/30 text-xs mt-1">Billed monthly</div>}
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map(f => <li key={f} className="flex items-center gap-2 text-sm"><Check size={13} className="text-green-400 flex-shrink-0"/><span className="text-white/70">{f}</span></li>)}
              </ul>
              <Link to="/register" className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${p.highlight ? 'btn-primary relative z-10' : 'btn-outline'}`}>{p.cta}</Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8 text-white/30 text-sm">All plans include a 14-day free trial. No credit card required.</div>
      </div>
    </section>
  );
}

// ---- FAQ ----
function FAQ() {
  const [open, setOpen] = useState<number|null>(null);
  const faqs = [
    {q:'How quickly will I be alerted when my site goes down?', a:'WatchTower sends alerts within 30 seconds of confirming an outage. We triple-verify issues from multiple locations to ensure zero false positives before alerting you.'},
    {q:'What types of monitors does WatchTower support?', a:'We support HTTP/HTTPS website monitoring, REST API endpoint monitoring, SSL certificate expiry tracking, and domain name expiry tracking. More monitor types are on our roadmap.'},
    {q:'Can I monitor private/internal URLs?', a:'Currently WatchTower monitors public URLs. Private network monitoring via agent installation is on our product roadmap for the Business plan.'},
    {q:'How is uptime percentage calculated?', a:'Uptime is calculated as the percentage of successful checks over the last 100 checks for your monitor. This gives you an accurate rolling window of recent reliability.'},
    {q:'What happens if I need more monitors than my plan allows?', a:'You\'ll be prompted to upgrade when you hit your monitor limit. Upgrading is instant and your existing monitors continue uninterrupted.'},
    {q:'Is my data secure?', a:'Yes. All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We never share your data with third parties. You can export or delete your data at any time.'},
    {q:'Can I cancel anytime?', a:'Absolutely. Cancel any time from your billing settings with no questions asked. You\'ll retain access until the end of your billing period.'},
  ];
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Frequently asked <span className="gradient-text">questions</span></h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="glass-card overflow-hidden">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full p-5 flex items-center justify-between text-left gap-4">
                <span className="font-semibold text-sm">{f.q}</span>
                <ChevronDown size={18} className={`text-white/40 flex-shrink-0 transition-transform ${open===i?'rotate-180':''}`}/>
              </button>
              {open===i && <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{f.a}</motion.div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- CTA ----
function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-600/5 to-transparent pointer-events-none"/>
          <div className="hero-glow w-80 h-80 bg-primary-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{position:'absolute'}}/>
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Start monitoring <span className="gradient-text">for free</span></h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">5 monitors, no credit card, no commitment. Know when your site goes down before your users do.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 relative z-10">
                Start Monitoring Free <ArrowRight size={18}/>
              </Link>
              <Link to="/login" className="btn-outline text-base px-8 py-4 flex items-center justify-center gap-2">
                Sign in <ChevronRight size={18}/>
              </Link>
            </div>
            <p className="text-white/20 text-sm mt-6">No credit card required • Free forever plan • Setup in 2 minutes</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---- Footer ----
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center"><Shield size={16} className="text-white"/></div>
              <span className="font-bold gradient-text">WatchTower</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">Professional website monitoring that alerts you before your users notice downtime.</p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => <a key={i} href="#" className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"><Icon size={16}/></a>)}
            </div>
          </div>
          {[{label:'Product', links:['Features','Pricing','How It Works','Changelog','Status Page']},
            {label:'Resources', links:['Documentation','API Reference','Integrations','Blog','Support']},
            {label:'Company', links:['About','Careers','Privacy','Terms','Contact']}].map(col => (
            <div key={col.label}>
              <div className="font-semibold text-sm mb-4">{col.label}</div>
              <ul className="space-y-2.5">{col.links.map(l => <li key={l}><a href="#" className="text-white/40 text-sm hover:text-white transition-colors">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div>© 2024 WatchTower. All rights reserved.</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"/> All systems operational</div>
        </div>
      </div>
    </footer>
  );
}

// ---- Main ----
export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar/>
      <Hero/>
      <TrustedBy/>
      <Features/>
      <WhyUs/>
      <Statistics/>
      <HowItWorks/>
      <Testimonials/>
      <Pricing/>
      <FAQ/>
      <CTA/>
      <Footer/>
    </div>
  );
}
