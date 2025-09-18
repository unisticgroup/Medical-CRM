import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Download, Tag, Search, Edit, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/app-context';
import { ConditionModal } from '@/components/modals/condition-modal';
import { exportConditionsToCSV, exportToJSON } from '@/utils/export';
import type { Condition } from '@/types';

export function Conditions() {
  const { state, dispatch, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search conditions
  const filteredConditions = useMemo(() => {
    return state.conditions.filter(condition => {
      const matchesSearch = searchTerm === '' || 
        condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        condition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        condition.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [state.conditions, searchTerm]);

  const handleAddCondition = () => {
    setSelectedCondition(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditCondition = (condition: Condition) => {
    setSelectedCondition(condition);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCondition = (condition: Condition) => {
    if (window.confirm(`Are you sure you want to delete the condition "${condition.name}"?`)) {
      dispatch({ type: 'DELETE_CONDITION', payload: condition.id });
      addNotification({
        title: 'Condition Deleted',
        message: `Condition "${condition.name}" has been deleted successfully.`,
        type: 'success',
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportConditionsToCSV(filteredConditions);
      addNotification({
        title: 'Export Successful',
        message: 'Conditions have been exported to CSV successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export conditions to CSV.',
        type: 'error',
      });
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(filteredConditions, 'conditions-export');
      addNotification({
        title: 'Export Successful',
        message: 'Conditions have been exported to JSON successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export conditions to JSON.',
        type: 'error',
      });
    }
  };

  const specialties = useMemo(() => {
    const specialtyCount: Record<string, number> = {};
    state.conditions.forEach(condition => {
      specialtyCount[condition.specialtyId] = (specialtyCount[condition.specialtyId] || 0) + 1;
    });
    
    return Object.entries(specialtyCount).map(([specialty, count]) => ({
      name: specialty.charAt(0).toUpperCase() + specialty.slice(1),
      conditionCount: count,
      color: 'bg-primary/10 text-primary'
    }));
  }, [state.conditions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conditions</h1>
          <p className="text-muted-foreground">
            Manage medical conditions, symptoms, and specialty mappings.
          </p>
        </div>
        <div className="flex space-x-2">
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
          <Button onClick={handleAddCondition}>
            <Plus className="mr-2 h-4 w-4" />
            Add Condition
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredConditions.length} of {state.conditions.length} conditions
        </div>
      </div>

      {/* Specialties Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Specialties Overview</CardTitle>
          <CardDescription>
            Medical specialties and their associated conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <div key={specialty.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{specialty.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {specialty.conditionCount} conditions
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${specialty.color}`}>
                  {specialty.conditionCount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditions Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredConditions.map((condition) => (
          <Card key={condition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{condition.name}</CardTitle>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                  {condition.specialtyId}
                </span>
              </div>
              <CardDescription>{condition.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {condition.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {condition.keywords.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{condition.keywords.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditCondition(condition)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteCondition(condition)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredConditions.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No conditions found matching your search criteria.
          </div>
        )}
      </div>

      {/* Conditions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Conditions</CardTitle>
          <CardDescription>
            Complete list of medical conditions and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Condition</th>
                  <th className="text-left p-4 font-medium">Specialty</th>
                  <th className="text-left p-4 font-medium">Keywords</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConditions.map((condition) => (
                  <tr key={condition.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{condition.name}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {condition.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm capitalize">{condition.specialtyId}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {condition.keywords.length} keywords
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCondition(condition)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCondition(condition)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConditionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        condition={selectedCondition}
        mode={modalMode}
      />
    </div>
  );
}