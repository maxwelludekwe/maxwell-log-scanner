
import React, { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface LogData {
  id: string;
  timestamp: string;
  ip: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogData[];
  darkMode: boolean;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, logs, darkMode }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('Security Log Report');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateEmailBody = () => {
    const timestamp = new Date().toISOString();
    let body = `Security Log Report - Generated on ${timestamp}\n\n`;
    
    if (additionalMessage) {
      body += `Additional Message:\n${additionalMessage}\n\n`;
    }
    
    body += `Summary:\n`;
    body += `- Total Logs: ${logs.length}\n`;
    body += `- Critical: ${logs.filter(log => log.level === 'critical').length}\n`;
    body += `- Error: ${logs.filter(log => log.level === 'error').length}\n`;
    body += `- Warning: ${logs.filter(log => log.level === 'warning').length}\n`;
    body += `- Info: ${logs.filter(log => log.level === 'info').length}\n\n`;
    
    body += `Detailed Logs:\n`;
    body += `${'='.repeat(50)}\n`;
    
    logs.forEach((log, index) => {
      body += `${index + 1}. [${log.level.toUpperCase()}] ${new Date(log.timestamp).toLocaleString()}\n`;
      body += `   Source: ${log.source}\n`;
      body += `   IP: ${log.ip}\n`;
      body += `   Message: ${log.message}\n`;
      body += `   ID: ${log.id}\n`;
      body += `   ${'-'.repeat(30)}\n`;
    });
    
    return body;
  };

  const handleSendEmail = async () => {
    if (!recipient.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate email sending - in a real app, you'd send this to your backend
      const emailBody = generateEmailBody();
      
      // Create a mailto link as a fallback
      const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // For demonstration, we'll show a success message
      // In a real implementation, you would send this through your backend email service
      setTimeout(() => {
        toast({
          title: "Email Prepared",
          description: `Log report prepared for ${recipient}. Opening your email client...`,
        });
        
        // Open the user's email client with the pre-filled email
        window.location.href = mailtoLink;
        
        setIsLoading(false);
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error preparing email:', error);
      toast({
        title: "Error",
        description: "Failed to prepare email. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Forward Security Logs</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="glow-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="security-team@company.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Message (Optional)</label>
            <Textarea
              placeholder="Add any additional context or instructions..."
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              className="w-full h-24 resize-none"
            />
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="text-sm font-medium mb-2">Report Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Logs: {logs.length}</div>
              <div>Critical: {logs.filter(log => log.level === 'critical').length}</div>
              <div>Errors: {logs.filter(log => log.level === 'error').length}</div>
              <div>Warnings: {logs.filter(log => log.level === 'warning').length}</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 glow-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="flex-1 glow-button"
          >
            {isLoading ? (
              <>Preparing...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
