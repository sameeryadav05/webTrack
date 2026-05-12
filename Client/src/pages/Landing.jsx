import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, BarChart3, Zap, Shield, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LandingBackdrop } from '../components/LandingBackdrop';

const Landing = () => {
  const reduceMotion = useReducedMotion();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 380, damping: 28 },
    },
  };

  const features = [
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description:
        'Watch your traffic come in real-time. See who is on your site right now and what they are doing.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description:
        'Cookieless tracking out of the box. Fully compliant with GDPR, CCPA and PECR regulations.',
    },
    {
      icon: BarChart3,
      title: 'Beautiful Insights',
      description:
        'Clean, intuitive dashboards that give you the data you need without the clutter.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground dark overflow-hidden selection:bg-primary/30">
      <LandingBackdrop />

      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <motion.div
              className="rounded-lg border border-primary/30 bg-primary/20 p-2"
              whileHover={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.55 }}
            >
              <Activity className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">WebTrack</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-0 mx-auto max-w-7xl px-4 pb-32 pt-16 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/40 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          >
            <motion.span
              animate={reduceMotion ? false : { scale: [1, 1.15, 1], opacity: [1, 0.85, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className="h-4 w-4 text-primary" />
            </motion.span>
            <span>Introducing Realtime Analytics 2.0</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-8 bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl"
          >
            Analytics that work <br className="hidden md:block" /> at the speed of thought.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground"
          >
            Privacy-first, real-time analytics for modern web applications. Track visitors,
            pageviews, and custom events without compromising user privacy.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/register">
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" className="group h-12 px-8 text-base">
                  Start tracking for free
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.span>
            </Link>
            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button size="lg" variant="outline" className="h-12 bg-background/50 px-8 text-base backdrop-blur-sm">
                View live demo
              </Button>
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.75, type: 'spring', stiffness: 90, damping: 20 }}
          className="relative mt-20"
        >
          <motion.div
            className="absolute inset-0 top-1/2 z-10 bg-gradient-to-t from-background via-transparent to-transparent"
            aria-hidden
          />
          <motion.div
            className="overflow-hidden rounded-xl border border-border/50 bg-card/40 p-2 shadow-2xl backdrop-blur-xl"
            animate={reduceMotion ? false : { y: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="overflow-hidden rounded-lg border border-border/50 bg-background/80">
              <div className="flex h-12 items-center gap-2 border-b border-border/50 bg-secondary/50 px-4">
                <motion.span
                  className="h-3 w-3 rounded-full bg-red-500/80"
                  animate={reduceMotion ? false : { opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <motion.span
                  className="h-3 w-3 rounded-full bg-yellow-500/80"
                  animate={reduceMotion ? false : { opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.25 }}
                />
                <motion.span
                  className="h-3 w-3 rounded-full bg-green-500/80"
                  animate={reduceMotion ? false : { opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 p-8 opacity-80 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.4 }}
                    className="space-y-4 rounded-lg border border-border/50 bg-secondary/50 p-6"
                  >
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="h-8 w-16 rounded bg-foreground/20" />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75, duration: 0.45 }}
                  className="col-span-1 h-64 rounded-lg border border-border/50 bg-secondary/50 md:col-span-2"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85, duration: 0.45 }}
                  className="col-span-1 h-64 rounded-lg border border-border/50 bg-secondary/50"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 h-px max-w-md bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 26 }}
              whileHover={{
                y: -6,
                transition: { type: 'spring', stiffness: 400, damping: 18 },
              }}
              className="group rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/25 hover:bg-card/45"
            >
              <motion.div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-primary/20"
                whileHover={{ scale: 1.08, borderColor: 'hsl(var(--primary) / 0.45)' }}
                transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              >
                <feature.icon className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-auto border-t border-border/50 bg-background/75 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">WebTrack</span>
          </motion.div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} WebTrack. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;
