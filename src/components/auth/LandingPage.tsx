import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Brain, TrendingUp, Shield, Users, Sparkles, ArrowRight, Check } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-500 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-primary-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center shadow-glow-cyan">
            <Zap className="text-dark-500" size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            InsightFusion
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-medium hover:shadow-glow-cyan transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-8">
            <Sparkles size={16} className="text-accent-400" />
            <span className="text-sm">AI-Powered CRM for Modern Teams</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Close Deals{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Faster
            </span>
            <br />
            With AI Intelligence
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time on manual data entry. Let AI handle the boring stuff while you focus on building relationships and closing deals.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-bold text-lg hover:shadow-glow-cyan transition-all flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-dark-200/50 backdrop-blur-xl border border-primary-500/30 rounded-xl font-bold text-lg hover:bg-dark-200 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-32">
          <FeatureCard
            icon={Brain}
            title="AI Lead Scoring"
            description="Automatically prioritize your hottest leads with machine learning"
            color="primary"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Smart Forecasting"
            description="Predict revenue with 95% accuracy using AI models"
            color="accent"
          />
          <FeatureCard
            icon={Zap}
            title="Auto Workflows"
            description="Automate follow-ups, emails, and tasks intelligently"
            color="primary"
          />
          <FeatureCard
            icon={Shield}
            title="Enterprise Security"
            description="Bank-grade encryption with SOC 2 compliance"
            color="accent"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 border-y border-primary-500/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <StatItem number="10x" label="Faster Deal Closing" />
            <StatItem number="95%" label="Lead Scoring Accuracy" />
            <StatItem number="50K+" label="Happy Users Worldwide" />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Simple,{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard
            name="Starter"
            price="Free"
            description="Perfect for solo entrepreneurs"
            features={[
              'Up to 100 contacts',
              'Basic CRM features',
              'Email integration',
              'Mobile app access',
              'Community support'
            ]}
            buttonText="Start Free"
            popular={false}
          />
          
          <PricingCard
            name="Professional"
            price="$49"
            period="/month"
            description="For growing sales teams"
            features={[
              'Unlimited contacts',
              'AI lead scoring',
              'Advanced analytics',
              'Workflow automation',
              'Priority support',
              'API access'
            ]}
            buttonText="Start Trial"
            popular={true}
          />
          
          <PricingCard
            name="Enterprise"
            price="Custom"
            description="For large organizations"
            features={[
              'Everything in Pro',
              'Custom AI models',
              'Dedicated support',
              'SSO & SAML',
              'Advanced security',
              'Custom integrations'
            ]}
            buttonText="Contact Sales"
            popular={false}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-3xl p-16 text-center backdrop-blur-xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of teams already closing deals faster with AI
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-bold text-lg hover:shadow-glow-cyan transition-all"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary-500/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
                <Zap className="text-dark-500" size={18} />
              </div>
              <span className="font-bold text-gray-400">© 2025 InsightFusion</span>
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{
  icon: any;
  title: string;
  description: string;
  color: 'primary' | 'accent';
}> = ({ icon: Icon, title, description, color }) => {
  const colorClasses = color === 'primary' 
    ? 'from-primary-500/20 to-primary-400/10 border-primary-500/30 hover:shadow-glow-cyan'
    : 'from-accent-500/20 to-accent-400/10 border-accent-500/30 hover:shadow-glow-lime';

  return (
    <div className={`bg-gradient-to-br ${colorClasses} border backdrop-blur-xl rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color === 'primary' ? 'from-primary-500 to-primary-600' : 'from-accent-500 to-accent-600'} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const StatItem: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <div>
    <div className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
      {number}
    </div>
    <div className="text-gray-400">{label}</div>
  </div>
);

const PricingCard: React.FC<{
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}> = ({ name, price, period, description, features, buttonText, popular }) => (
  <div className={`relative bg-dark-200/50 backdrop-blur-xl border ${popular ? 'border-primary-500 shadow-glow-cyan' : 'border-primary-500/20'} rounded-2xl p-8 hover:-translate-y-1 transition-all`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-sm font-bold">
        Most Popular
      </div>
    )}
    
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <p className="text-gray-400 mb-6">{description}</p>
    
    <div className="mb-6">
      <span className="text-5xl font-bold">{price}</span>
      {period && <span className="text-gray-400">{period}</span>}
    </div>
    
    <Link
      to="/register"
      className={`block w-full py-3 rounded-xl font-bold text-center mb-6 transition-all ${
        popular
          ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-glow-cyan'
          : 'bg-dark-300 hover:bg-dark-200 border border-primary-500/30'
      }`}
    >
      {buttonText}
    </Link>
    
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check size={20} className="text-accent-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);
