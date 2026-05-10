import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle2, Terminal } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { motion, AnimatePresence } from 'framer-motion';

const CreateSite = () => {
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdSite, setCreatedSite] = useState(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!siteName || !domain) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/site', { siteName, domain });
      if (response.data.success) {
        toast.success('Site created successfully');
        setCreatedSite(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create site');
    } finally {
      setIsLoading(false);
    }
  };

  const copyScript = () => {
    if (createdSite?.script) {
      navigator.clipboard.writeText(createdSite.script);
      setCopied(true);
      toast.success('Script copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Site</h1>
        <p className="text-muted-foreground mt-2">Register a new website to start tracking analytics.</p>
      </div>

      <AnimatePresence mode="wait">
        {!createdSite ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
              <form onSubmit={onSubmit}>
                <CardHeader>
                  <CardTitle>Site Details</CardTitle>
                  <CardDescription>Enter the details of the website you want to track</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName" 
                      placeholder="My Awesome Blog" 
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input 
                      id="domain" 
                      placeholder="example.com" 
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">Do not include http:// or https://</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => navigate('/dashboard/sites')}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Site'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-green-500/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Site Added Successfully!</CardTitle>
                <CardDescription>Your site <strong>{createdSite.site.siteName}</strong> is ready to be tracked.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Installation</Label>
                  <p className="text-sm text-muted-foreground mb-2">Paste this tracking snippet just before the closing <code>&lt;/head&gt;</code> tag on your website.</p>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg blur opacity-50" />
                    <div className="relative bg-black/50 border border-border/50 rounded-lg p-4 font-mono text-sm text-primary-foreground overflow-x-auto">
                      <div className="absolute top-2 right-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={copyScript}>
                          {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground border-b border-border/50 pb-2">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs">HTML</span>
                      </div>
                      <pre className="whitespace-pre-wrap break-all pt-2">
                        {createdSite.script}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-sm font-medium text-muted-foreground">Site ID</span>
                    <span className="text-sm font-mono">{createdSite.site.siteId}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate('/dashboard/sites')}>
                  Go to My Sites
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateSite;
