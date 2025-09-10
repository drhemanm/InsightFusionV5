import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Bot, LineChart, Users, Shield, ArrowRight, CheckCircle, Star, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and predictions for your sales pipeline with advanced machine learning'
    },
    {
      icon: LineChart,
      title: 'Advanced Analytics',
      description: 'Deep insights into your sales performance with customizable dashboards and real-time reporting'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team members, share insights, and track progress in real-time'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with advanced encryption, SOC 2 compliance, and GDPR readiness'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Sales Director',
      company: 'TechCorp',
      content: 'InsightFusion transformed our sales process. We increased our conversion rate by 40% in just 3 months.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'CEO',
      company: 'GrowthLabs',
      content: 'The AI insights are game-changing. We can now predict which deals will close with 90% accuracy.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP Sales',
      company: 'InnovateCo',
      content: 'Best CRM investment we\'ve made. The team collaboration features are outstanding.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">InsightFusion</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white hover:text-blue-200 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Sales Intelligence
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your customer relationships with AI-powered insights, automated workflows, and intelligent sales coaching. 
            Built for teams that demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            
            <Link
              to="/demo"
              className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <span>Watch Demo</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-gray-300 mb-12">Start with a plan that fits your business needs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-4xl font-bold text-white">MUR 200</span>
                  <span className="text-gray-300 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Up to 5 team members</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>1,000 contacts</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Core CRM features</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Basic reporting</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>10GB storage</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  state={{ selectedPlan: 'basic' }}
                  className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-400/50 hover:border-blue-400/70 transition-all duration-300 hover:scale-105 transform">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-4xl font-bold text-white">MUR 400</span>
                  <span className="text-gray-300 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Up to 20 team members</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>10,000 contacts</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>AI-powered insights</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>50GB storage</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  state={{ selectedPlan: 'professional' }}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-4xl font-bold text-white">MUR 600</span>
                  <span className="text-gray-300 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Unlimited contacts</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>White-label options</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>500GB storage</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  state={{ selectedPlan: 'enterprise' }}
                  className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the AI revolution in customer relationship management. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-blue-200 font-medium transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};