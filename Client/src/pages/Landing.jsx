import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Zap, Shield, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark overflow-hidden selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] -z-10" />

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">WebTrack</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium mb-8 text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span>Introducing Realtime Analytics 2.0</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Analytics that work <br className="hidden md:block" /> at the speed of thought.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Privacy-first, real-time analytics for modern web applications. 
            Track visitors, pageviews, and custom events without compromising user privacy.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 text-base group">
                Start tracking for free
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
              View live demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Mock Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 top-1/2" />
          <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
            <div className="rounded-lg border border-border/50 bg-background/80 overflow-hidden">
              <div className="h-12 border-b border-border/50 bg-secondary/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 rounded-lg bg-secondary/50 border border-border/50 p-6 space-y-4">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-8 w-16 bg-foreground/20 rounded" />
                  </div>
                ))}
                <div className="col-span-1 md:col-span-2 h-64 rounded-lg bg-secondary/50 border border-border/50" />
                <div className="col-span-1 h-64 rounded-lg bg-secondary/50 border border-border/50" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Activity,
              title: "Real-time Monitoring",
              description: "Watch your traffic come in real-time. See who is on your site right now and what they are doing."
            },
            {
              icon: Shield,
              title: "Privacy First",
              description: "Cookieless tracking out of the box. Fully compliant with GDPR, CCPA and PECR regulations."
            },
            {
              icon: BarChart3,
              title: "Beautiful Insights",
              description: "Clean, intuitive dashboards that give you the data you need without the clutter."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">WebTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WebTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;