import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Activity, Server, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cpuData = [
  { time: '15:40', usage: 20 }, { time: '15:45', usage: 45 },
  { time: '15:50', usage: 78 }, { time: '15:55', usage: 52 },
  { time: '16:00', usage: 38 }, { time: '16:05', usage: 41 },
];

// Production API URL - Talking to the Backend on Port 5000
const API_URL = "http://16.170.162.69:5000";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, formData);
      alert(response.data.message);
      if (isLogin) {
        setUserName(response.data.name);
        setIsLoggedIn(true);
      } else {
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Connection Error:", error);
      alert(error.response?.data?.message || "Connection to API failed! Check Port 5000 in AWS Security Groups.");
    }
  };

  if (isLoggedIn) return <Dashboard name={userName} />;

  return (
    <div style={styles.container}>
      <div style={styles.glassBox}>
        <div style={styles.header}>
          <ShieldCheck size={40} color="#38bdf8" />
          <h2 style={styles.title}>DevStream <span style={{fontWeight: 'lighter'}}>Portal</span></h2>
          <p style={styles.subtitle}>{isLogin ? 'Welcome back, Engineer' : 'Initialize your account'}</p>
        </div>

        <form onSubmit={handleAuth} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <User size={20} style={styles.icon} />
              <input type="text" placeholder="Full Name" style={styles.input} required 
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div style={styles.inputGroup}>
            <Mail size={20} style={styles.icon} />
            <input type="email" placeholder="Work Email" style={styles.input} required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div style={styles.inputGroup}>
            <Lock size={20} style={styles.icon} />
            <input type="password" placeholder="Password" style={styles.input} required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" style={styles.button}>
            {isLogin ? 'Access System' : 'Create Account'}
            <ArrowRight size={18} style={{ marginLeft: 10 }} />
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "New to the cluster?" : "Already registered?"} 
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? ' Request Access' : ' Secure Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const Dashboard = ({name}: {name: string}) => (
  <div style={{ padding: '30px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
      <div>
        <h1 style={{ margin: 0, color: '#38bdf8' }}>🛡️ Ops-Center <span style={{ fontWeight: 'lighter', color: 'white' }}>Active</span></h1>
        <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>Engineer: {name}</p>
      </div>
      <button onClick={() => window.location.reload()} style={{...styles.button, marginTop: 0, padding: '5px 15px', height: '40px'}}>Logout</button>
    </header>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={styles.metricCard}><Activity color="#38bdf8"/> CPU: 14.2%</div>
        <div style={styles.metricCard}><Server color="#4ade80"/> API: Online</div>
        <div style={styles.metricCard}><Database color="#f472b6"/> DB: Connected</div>
    </div>
    <div style={{ marginTop: '30px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
        <h3>Cluster Traffic</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <AreaChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{backgroundColor: '#1e293b'}} />
              <Area type="monotone" dataKey="usage" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </div>
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at top left, #1e293b, #0f172a)', fontFamily: 'sans-serif' },
  glassBox: { width: '400px', padding: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'center' },
  header: { marginBottom: '30px' },
  title: { color: 'white', fontSize: '24px', margin: '10px 0' },
  subtitle: { color: '#94a3b8', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '0 15px', border: '1px solid #334155' },
  icon: { color: '#64748b' },
  input: { width: '100%', padding: '15px', background: 'transparent', border: 'none', color: 'white', outline: 'none' },
  button: { marginTop: '10px', padding: '15px', borderRadius: '12px', border: 'none', background: '#0ea5e9', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  toggleText: { color: '#94a3b8', marginTop: '20px', fontSize: '14px' },
  link: { color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' },
  metricCard: { backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: 'white' }
};

export default App;