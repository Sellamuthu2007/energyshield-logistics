import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroIllustration from '@/components/landing/HeroIllustration';
import StatsSection from '@/components/landing/StatsSection';
import {
  Shield,
  ShoppingCart,
  Ship,
  Factory,
  BarChart3,
  ArrowRight,
  Database,
  Cpu,
  Lock,
  Globe
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  const dashboards = [
    {
      title: 'Government Portal',
      description: 'National oil reserve monitoring, supply risk scores, and procurement recommendations approval.',
      role: 'Government Officer',
      path: '/government',
      icon: Shield,
      borderColor: 'border-brand-primary',
      iconColor: 'text-brand-primary',
    },
    {
      title: 'Procurement Portal',
      description: 'Supplier rankings, purchasing orders management, and crude oil refinery compatibility analysis.',
      role: 'Procurement Officer',
      path: '/procurement',
      icon: ShoppingCart,
      borderColor: 'border-brand-teal',
      iconColor: 'text-brand-teal',
    },
    {
      title: 'Shipping Logistics',
      description: 'Live tanker tracking via marine AIS, weather risk mitigation, and port congestion analytics.',
      role: 'Logistics Manager',
      path: '/shipping',
      icon: Ship,
      borderColor: 'border-brand-green',
      iconColor: 'text-brand-green',
    },
    {
      title: 'Refinery Portal',
      description: 'Real-time crude stocks, refinery production schedules, and predictive maintenance schedules.',
      role: 'Plant Operations Head',
      path: '/refinery',
      icon: Factory,
      borderColor: 'border-brand-yellow',
      iconColor: 'text-brand-yellow',
    },
    {
      title: 'Decision Intelligence',
      description: 'Aggregate executive KPIs, macroeconomic impact assessments, and AI strategy simulators.',
      role: 'Secretary MoPNG & CEOs',
      path: '/decision',
      icon: BarChart3,
      borderColor: 'border-brand-primary',
      iconColor: 'text-brand-primary',
    },
  ];

  return (
    <div className="bg-brand-dark min-h-screen text-brand-text">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="space-y-6 text-left">
            <span className="inline-flex items-center space-x-2 rounded border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5" />
              <span>Next-Gen Enterprise Supply Intelligence</span>
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              AI-Powered Energy Supply Chain Integrity
            </h1>
            <p className="text-base text-brand-muted max-w-lg leading-relaxed">
              EnergyShield AI integrates real-time risk assessment, maritime tanker tracking, refining throughput scheduling, and executive decision simulators into a single unified workspace.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 rounded bg-brand-primary px-6 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover transition-colors"
              >
                <span>Access Security Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="flex items-center justify-center rounded border border-brand-border bg-brand-card px-6 py-3 text-sm font-semibold text-brand-text hover:bg-[#1a2130] transition-colors"
              >
                Explore Modules
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-brand-card/30 rounded border border-brand-border/40 p-2">
            <HeroIllustration />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-brand-border bg-[#0a0e16] py-12">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-left max-w-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-brand-primary mb-1">Grid Dashboard Summary</h2>
            <p className="text-lg font-bold text-white uppercase">Supply Chain Operations Integrity Matrix</p>
          </div>
          <StatsSection />
        </div>
      </section>

      {/* Pipeline Workflow Section */}
      <section id="pipeline" className="container mx-auto px-6 py-16 text-center space-y-12">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-green uppercase tracking-widest block">Operational Workflow</span>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">End-to-End Supply Pipeline</h2>
          <p className="text-xs text-brand-muted">
            EnergyShield AI connects five specialized roles into a continuous workflow loop mediated by secure edge functions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center max-w-5xl mx-auto">
          {dashboards.map((dash, index) => {
            const Icon = dash.icon;
            return (
              <React.Fragment key={dash.title}>
                <div className={`flex flex-col items-center p-4 rounded border bg-brand-card ${dash.borderColor}`}>
                  <div className={`p-3 rounded bg-brand-dark mb-3 ${dash.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{dash.title}</h3>
                  <p className="text-[10px] text-brand-muted mt-1 leading-snug">{dash.role}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:flex justify-center text-brand-border">
                    <ArrowRight className="h-6 w-6 text-brand-muted/40 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Dashboard Preview Cards Section */}
      <section id="features" className="border-t border-brand-border bg-[#0a0e16]/60 py-20">
        <div className="container mx-auto px-6 space-y-12">
          <div className="text-left space-y-2 max-w-xl">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest block">System Modules</span>
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">Role-Based Dashboard Gateways</h2>
            <p className="text-sm text-brand-muted">
              Select your agency access point below. Direct authentication will route you to your designated operating screen.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((dash) => {
              const Icon = dash.icon;
              return (
                <div
                  key={dash.title}
                  className={`flex flex-col justify-between rounded border ${dash.borderColor} bg-brand-card p-6 hover:shadow-lg transition-all`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded bg-brand-dark ${dash.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest bg-brand-dark px-2.5 py-1 rounded">
                        {dash.role}
                      </span>
                    </div>
                    <div className="text-left space-y-1">
                      <h3 className="text-md font-bold text-white">{dash.title}</h3>
                      <p className="text-xs text-brand-muted leading-relaxed">{dash.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      to={`/login?redirect=${dash.path}`}
                      className="flex items-center justify-center space-x-2 rounded bg-brand-dark border border-brand-border py-2 text-xs font-bold text-white hover:bg-brand-primary hover:border-brand-primary transition-all"
                    >
                      <span>Initialize Gateway</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="container mx-auto px-6 py-20 text-center space-y-12">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest block">System Integrity</span>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">Enterprise Architecture Stack</h2>
          <p className="text-xs text-brand-muted">
            EnergyShield AI uses secure, high-performance web frameworks to guarantee 99.99% uptime of logistics intelligence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded border border-brand-border bg-brand-card flex items-center space-x-3">
            <div className="p-2 rounded bg-brand-dark text-brand-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">Supabase RLS</p>
              <p className="text-[10px] text-brand-muted">Row Level Security</p>
            </div>
          </div>

          <div className="p-4 rounded border border-brand-border bg-brand-card flex items-center space-x-3">
            <div className="p-2 rounded bg-brand-dark text-brand-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">Gemini AI</p>
              <p className="text-[10px] text-brand-muted">Risk Intelligence</p>
            </div>
          </div>

          <div className="p-4 rounded border border-brand-border bg-brand-card flex items-center space-x-3">
            <div className="p-2 rounded bg-brand-dark text-brand-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">SSO Auth</p>
              <p className="text-[10px] text-brand-muted">Secure Access Tokens</p>
            </div>
          </div>

          <div className="p-4 rounded border border-brand-border bg-brand-card flex items-center space-x-3">
            <div className="p-2 rounded bg-brand-dark text-brand-primary">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">Vessel AIS</p>
              <p className="text-[10px] text-brand-muted">Real-time Telemetry</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
