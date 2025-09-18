import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Download, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useApp } from '@/contexts/app-context';
import { LeadModal } from '@/components/modals/lead-modal';
import { exportLeadsToCSV, exportToJSON } from '@/utils/export';
import type { Lead } from '@/types';

const getStageColor = (stage: string) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    booked: 'bg-purple-100 text-purple-800',
    attended: 'bg-indigo-100 text-indigo-800',
    treated: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    lost: 'bg-red-100 text-red-800',
  };
  return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export function Leads() {
  const { state, dispatch, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return state.leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      
      return matchesSearch && matchesStage && matchesSource;
    });
  }, [state.leads, searchTerm, stageFilter, sourceFilter]);

  const handleAddLead = () => {
    setSelectedLead(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete the lead for ${lead.name}?`)) {
      dispatch({ type: 'DELETE_LEAD', payload: lead.id });
      addNotification({
        title: 'Lead Deleted',
        message: `Lead for ${lead.name} has been deleted successfully.`,
        type: 'success',
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportLeadsToCSV(filteredLeads);
      addNotification({
        title: 'Export Successful',
        message: 'Leads have been exported to CSV successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export leads to CSV.',
        type: 'error',
      });
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(filteredLeads, 'leads-export');
      addNotification({
        title: 'Export Successful',
        message: 'Leads have been exported to JSON successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export leads to JSON.',
        type: 'error',
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStageFilter('all');
    setSourceFilter('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage patient leads and track their journey through the pipeline.
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="attended">Attended</SelectItem>
              <SelectItem value="treated">Treated</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Phone Call">Phone Call</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Social Media">Social Media</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
          </div>
          
          <Button onClick={handleAddLead}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredLeads.length} of {state.leads.length} leads
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>
            All patient leads with their current status and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Symptoms</th>
                  <th className="text-left p-4 font-medium">Stage</th>
                  <th className="text-left p-4 font-medium">Source</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{lead.phone}</td>
                    <td className="p-4 text-sm max-w-xs truncate">{lead.symptoms}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{lead.source}</td>
                    <td className="p-4 text-sm">{lead.createdAt.toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLead(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLead(lead)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No leads found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <LeadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lead={selectedLead}
        mode={modalMode}
      />
    </div>
  );
}