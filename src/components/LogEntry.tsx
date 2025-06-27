
import React from 'react';
import { Shield } from 'lucide-react';

interface LogData {
  id: string;
  timestamp: string;
  ip: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
}

interface LogEntryProps {
  log: LogData;
  showIP: boolean;
  darkMode: boolean;
}

export const LogEntry: React.FC<LogEntryProps> = ({ log, showIP, darkMode }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'warning':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'error':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'critical':
        return 'text-red-300 bg-red-900/40 border-red-400/50 animate-pulse';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const maskIP = (ip: string) => {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.***.**`;
  };

  return (
    <div className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-lg ${getLevelColor(log.level)} ${
      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium text-sm uppercase tracking-wide">
            {log.level}
          </span>
          <span className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
            {log.source}
          </span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {formatTimestamp(log.timestamp)}
        </div>
      </div>
      
      <div className="mb-2">
        <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {log.message}
        </p>
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-4">
          <span className={`font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            IP: {showIP ? log.ip : maskIP(log.ip)}
          </span>
        </div>
        <div className="text-gray-500">
          ID: {log.id}
        </div>
      </div>
    </div>
  );
};
