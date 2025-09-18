import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Download, Star, MapPin, Clock, Search, Edit, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/app-context';
import { DoctorModal } from '@/components/modals/doctor-modal';
import { exportDoctorsToCSV, exportToJSON } from '@/utils/export';
import type { Doctor } from '@/types';

export function Doctors() {
  const { state, dispatch, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Filter and search doctors
  const filteredDoctors = useMemo(() => {
    return state.doctors.filter(doctor => {
      const matchesSearch = searchTerm === '' || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = specialtyFilter === 'all' || 
        doctor.specialties.some(specialty => specialty.includes(specialtyFilter));
      
      const matchesLocation = locationFilter === 'all' || 
        doctor.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [state.doctors, searchTerm, specialtyFilter, locationFilter]);

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
      dispatch({ type: 'DELETE_DOCTOR', payload: doctor.id });
      addNotification({
        title: 'Doctor Deleted',
        message: `Dr. ${doctor.name} has been deleted successfully.`,
        type: 'success',
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportDoctorsToCSV(filteredDoctors);
      addNotification({
        title: 'Export Successful',
        message: 'Doctors have been exported to CSV successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export doctors to CSV.',
        type: 'error',
      });
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(filteredDoctors, 'doctors-export');
      addNotification({
        title: 'Export Successful',
        message: 'Doctors have been exported to JSON successfully.',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Export Failed',
        message: 'Failed to export doctors to JSON.',
        type: 'error',
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSpecialtyFilter('all');
    setLocationFilter('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">
            Manage doctor profiles, specialties, and availability.
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="endocrinology">Endocrinology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
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
          
          <Button onClick={handleAddDoctor}>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredDoctors.length} of {state.doctors.length} doctors
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {doctor.rating} • {doctor.experience} years
                  </CardDescription>
                </div>
                {doctor.isAvailableForTelehealth && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Telehealth
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1">
                  {doctor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full capitalize"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Languages</h4>
                <p className="text-sm text-muted-foreground">
                  {doctor.languages.join(', ')}
                </p>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {doctor.location}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Insurance Accepted</h4>
                <div className="flex flex-wrap gap-1">
                  {doctor.insuranceAccepted.slice(0, 2).map((insurance) => (
                    <span
                      key={insurance}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {insurance}
                    </span>
                  ))}
                  {doctor.insuranceAccepted.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{doctor.insuranceAccepted.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditDoctor(doctor)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteDoctor(doctor)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDoctors.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No doctors found matching your search criteria.
          </div>
        )}
      </div>

      {/* Doctor Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Performance Overview</CardTitle>
          <CardDescription>
            Performance metrics and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Doctor</th>
                  <th className="text-left p-4 font-medium">Specialty</th>
                  <th className="text-left p-4 font-medium">Experience</th>
                  <th className="text-left p-4 font-medium">Rating</th>
                  <th className="text-left p-4 font-medium">Telehealth</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">{doctor.location}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {doctor.specialties.slice(0, 2).join(', ')}
                      {doctor.specialties.length > 2 && ` +${doctor.specialties.length - 2}`}
                    </td>
                    <td className="p-4 text-sm">{doctor.experience} years</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{doctor.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doctor.isAvailableForTelehealth 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doctor.isAvailableForTelehealth ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor)}
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

      <DoctorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        doctor={selectedDoctor}
        mode={modalMode}
      />
    </div>
  );
}