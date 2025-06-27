import React, { useState, useEffect, useRef } from 'react';
import { Upload, Eye, EyeOff, Play, Pause, Trash2, RotateCcw, Filter, Sun, Moon, Mail, Save, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ThreatChart } from './ThreatChart';
import { LogEntry } from './LogEntry';
import { EmailModal } from './EmailModal';
import { useToast } from '@/hooks/use-toast';

interface LogData {
  id: string;
  timestamp: string;
  ip: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
}

const LogScanner = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showIPs, setShowIPs] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<LogData[]>([]);
  const { toast } = useToast();

  // Mock threat data for the pie chart
  const threatData = [
    { name: 'Low', value: 45, color: '#10B981' },
    { name: 'Medium', value: 30, color: '#F59E0B' },
    { name: 'High', value: 20, color: '#EF4444' },
    { name: 'Critical', value: 5, color: '#DC2626' }
  ];

  // Generate mock live logs
  const generateMockLog = (): LogData => {
    const levels: Array<'info' | 'warning' | 'error' | 'critical'> = ['info', 'warning', 'error', 'critical'];
    const sources = ['Windows Firewall', 'IIS', 'Windows Security', 'System', 'Application'];
    const messages = [
      'Failed login attempt detected',
      'Suspicious network activity',
      'Malware signature detected',
      'Malware signature detected',
      'Port scan detected',
      'Unauthorized access attempt',
      'System file modified',
      'Normal system operation',
      'User authentication successful'
    ];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      level: levels[Math.floor(Math.random() * levels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      source: sources[Math.floor(Math.random() * sources.length)]
    };
  };

  // Live mode simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveMode) {
      interval = setInterval(() => {
        const newLog = generateMockLog();
        setLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep only last 1000 logs
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  // Enhanced filter logs with search functionality
  useEffect(() => {
    let filtered = logs;
    
    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }
    
    if (filterSource !== 'all') {
      filtered = filtered.filter(log => log.source === filterSource);
    }

    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(log => {
        // Search in IP addresses (both IPv4 and IPv6 patterns)
        const ipv4Pattern = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
        const ipv6Pattern = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g;
        
        return (
          log.ip.toLowerCase().includes(searchLower) ||
          log.message.toLowerCase().includes(searchLower) ||
          log.source.toLowerCase().includes(searchLower) ||
          log.level.toLowerCase().includes(searchLower) ||
          log.timestamp.toLowerCase().includes(searchLower) ||
          log.id.toLowerCase().includes(searchLower) ||
          ipv4Pattern.test(log.message) && log.message.toLowerCase().includes(searchLower) ||
          ipv6Pattern.test(log.message) && log.message.toLowerCase().includes(searchLower)
        );
      });
    }
    
    setFilteredLogs(filtered);
  }, [logs, filterLevel, filterSource, searchTerm]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Simple log parsing - in real app, you'd have more sophisticated parsing
        const lines = content.split('\n').filter(line => line.trim());
        const parsedLogs: LogData[] = lines.map((line, index) => ({
          id: `upload-${index}`,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1', // Mock IP for uploaded logs
          level: line.toLowerCase().includes('error') ? 'error' : 
                 line.toLowerCase().includes('warning') ? 'warning' : 'info',
          message: line,
          source: 'Uploaded File'
        }));
        setLogs(prev => [...parsedLogs, ...prev]);
      };
      reader.readAsText(file);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const resetFilters = () => {
    setFilterLevel('all');
    setFilterSource('all');
  };

  const saveLogsOffline = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs Saved",
      description: `${filteredLogs.length} logs saved to your device`,
    });
  };

  const handleEmailForward = () => {
    setSelectedLogs(filteredLogs);
    setIsEmailModalOpen(true);
  };

  const resetSearch = () => {
    setSearchTerm('');
  };

  const uniqueSources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CyberLog Sentinel
            </h1>
            <p className="text-gray-400 mt-2">Advanced Cybersecurity Log Analysis Platform</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="outline"
              size="sm"
              className="glow-button"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className={`mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Search className="h-4 w-4 mr-2" />
              Search Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Search by IP address, message, source, level, or timestamp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={resetSearch}
                variant="outline"
                className="glow-button"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Search supports IPv4/IPv6 addresses, keywords, and partial matches
            </p>
          </CardContent>
        </Card>

        {/* Controls Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {/* Upload Section */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upload Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".log,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full glow-button"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardContent>
          </Card>

          {/* Live Mode Controls */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`w-full glow-button ${isLiveMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
                variant={isLiveMode ? "default" : "outline"}
              >
                {isLiveMode ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isLiveMode ? 'Stop Live' : 'Start Live'}
              </Button>
            </CardContent>
          </Card>

          {/* View Controls */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">View Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show IPs</span>
                <Switch checked={showIPs} onCheckedChange={setShowIPs} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Scroll</span>
                <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
              </div>
            </CardContent>
          </Card>

          {/* Export & Share */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export & Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={saveLogsOffline}
                variant="outline"
                className="w-full glow-button"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Offline
              </Button>
              <Button
                onClick={handleEmailForward}
                variant="outline"
                className="w-full glow-button"
                size="sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Forward
              </Button>
            </CardContent>
          </Card>

          {/* Log Management */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Log Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={clearLogs}
                variant="destructive"
                className="w-full glow-button"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Logs
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full glow-button"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className={`mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Threat Level</label>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Source</label>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {uniqueSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => setShowIPs(!showIPs)}
                  variant="outline"
                  className="glow-button"
                >
                  {showIPs ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  {showIPs ? 'Hide IPs' : 'Show IPs'}
                </Button>
              </div>
              
              <div className="text-sm text-gray-400">
                {searchTerm ? `Found: ${filteredLogs.length} / ${logs.length}` : `Total Logs: ${logs.length}`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Stream - Moved to Top */}
        <Card className={`mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Security Log Stream</span>
              {isLiveMode && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-500">Live</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={logsContainerRef}
              className="h-96 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300"
            >
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  {searchTerm ? 'No logs match your search criteria.' : 'No logs to display. Upload a log file or start live monitoring.'}
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <LogEntry
                    key={log.id}
                    log={log}
                    showIP={showIPs}
                    darkMode={darkMode}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Threat Analysis Chart */}
        <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle>Threat Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ThreatChart data={threatData} />
          </CardContent>
        </Card>
      </div>
      
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        logs={selectedLogs}
        darkMode={darkMode}
      />
    </div>
  );
};

export default LogScanner;
