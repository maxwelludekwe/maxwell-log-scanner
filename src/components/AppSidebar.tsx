
import React from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  Save, 
  Mail, 
  Trash2, 
  RotateCcw, 
  Eye, 
  EyeOff,
  BarChart3,
  PieChart,
  Filter,
  Search
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  isLiveMode: boolean;
  showIPs: boolean;
  autoScroll: boolean;
  chartView: 'pie' | 'bar' | 'both';
  onToggleLiveMode: () => void;
  onToggleIPs: () => void;
  onToggleAutoScroll: () => void;
  onUploadFile: () => void;
  onSaveLogs: () => void;
  onEmailForward: () => void;
  onClearLogs: () => void;
  onResetFilters: () => void;
  onChartViewChange: (view: 'pie' | 'bar' | 'both') => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isLiveMode,
  showIPs,
  autoScroll,
  chartView,
  onToggleLiveMode,
  onToggleIPs,
  onToggleAutoScroll,
  onUploadFile,
  onSaveLogs,
  onEmailForward,
  onClearLogs,
  onResetFilters,
  onChartViewChange,
}) => {
  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>File Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onUploadFile}>
                  <Upload className="h-4 w-4" />
                  <span>Upload Log File</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSaveLogs}>
                  <Save className="h-4 w-4" />
                  <span>Save Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onEmailForward}>
                  <Mail className="h-4 w-4" />
                  <span>Email Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onToggleLiveMode}
                  className={isLiveMode ? 'bg-green-600 text-white' : ''}
                >
                  {isLiveMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isLiveMode ? 'Stop Live Mode' : 'Start Live Mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>View Options</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onToggleIPs}>
                  {showIPs ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span>{showIPs ? 'Hide IPs' : 'Show IPs'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onToggleAutoScroll}>
                  <span>Auto Scroll: {autoScroll ? 'On' : 'Off'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Charts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onChartViewChange('pie')}
                  className={chartView === 'pie' ? 'bg-blue-600 text-white' : ''}
                >
                  <PieChart className="h-4 w-4" />
                  <span>Pie Chart</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onChartViewChange('bar')}
                  className={chartView === 'bar' ? 'bg-blue-600 text-white' : ''}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Bar Chart</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => onChartViewChange('both')}
                  className={chartView === 'both' ? 'bg-blue-600 text-white' : ''}
                >
                  <span>Both Charts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onClearLogs} className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                  <span>Clear Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onResetFilters}>
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Filters</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
