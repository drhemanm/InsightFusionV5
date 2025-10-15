import React, { useState, useEffect } from 'react';
import { useContactStore } from '../../store/contactStore';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Download,
  Upload,
  Grid3x3,
  List,
  MoreVertical,
  Mail,
  Phone,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Card, 
  CardBody, 
  Badge, 
  Avatar,
  Dropdown,
  Spinner,
  Modal
} from '../ui';
import { AddContactModal } from './AddContactModal';
import { ContactDetailSidebar } from './ContactDetailSidebar';
import { ContactFilters } from './ContactFilters';
import type { Contact } from '../../types';

type ViewMode = 'grid' | 'table';

export const ContactList: React.FC = () => {
  const { contacts, isLoading, error, fetchContacts, deleteContact } = useContactStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    tags: [] as string[]
  });

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Filter contacts based on search and filters
  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || contact.status === filters.status;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };

  // Select all contacts
  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedContacts.size} contacts?`)) {
      for (const id of selectedContacts) {
        await deleteContact(id);
      }
      setSelectedContacts(new Set());
    }
  };

  // View contact details
  const viewContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSidebarOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 p-8">
        <Card variant="glass">
          <CardBody>
            <div className="text-center py-12">
              <p className="text-error">{error}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Contacts
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your {filteredContacts.length} contacts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" leftIcon={<Upload size={18} />}>
              Import
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Download size={18} />}>
              Export
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              leftIcon={<UserPlus size={18} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Contact
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <Card variant="glass">
          <CardBody padding="md">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search contacts by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search size={18} />}
                  fullWidth
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Filter size={18} />}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filters
                </Button>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-dark-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'table'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Grid3x3 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {isFilterOpen && (
              <div className="mt-4 pt-4 border-t border-primary-500/10">
                <ContactFilters
                  filters={filters}
                  onChange={setFilters}
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Bulk Actions */}
        {selectedContacts.size > 0 && (
          <Card variant="glass">
            <CardBody padding="sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {selectedContacts.size} contact{selectedContacts.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedContacts(new Set())}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Content */}
        {isLoading ? (
          <Card variant="glass">
            <CardBody>
              <div className="flex justify-center py-12">
                <Spinner size="lg" text="Loading contacts..." />
              </div>
            </CardBody>
          </Card>
        ) : filteredContacts.length === 0 ? (
          <Card variant="glass">
            <CardBody>
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No contacts found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first contact'}
                </p>
                <Button
                  variant="primary"
                  leftIcon={<UserPlus size={18} />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add Your First Contact
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : viewMode === 'table' ? (
          <Card variant="glass">
            <CardBody padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-400/50 border-b border-primary-500/10">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedContacts.size === filteredContacts.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-600 text-primary-500 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-500/5">
                    {filteredContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-dark-300/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedContacts.has(contact.id)}
                            onChange={() => toggleContactSelection(contact.id)}
                            className="rounded border-gray-600 text-primary-500 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={`${contact.firstName} ${contact.lastName}`}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-200">
                                {contact.firstName} {contact.lastName}
                              </p>
                              {contact.position && (
                                <p className="text-xs text-gray-400">
                                  {contact.position}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300">
                            {contact.company || '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300">{contact.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300">
                            {contact.phone || '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              contact.status === 'customer' ? 'success' :
                              contact.status === 'lead' ? 'warning' :
                              'default'
                            }
                            size="sm"
                          >
                            {contact.status || 'active'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => viewContactDetails(contact)}
                              className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-dark-400 transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-dark-400 transition-colors"
                              title="Send Email"
                            >
                              <Mail size={18} />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-dark-400 transition-colors"
                              title="Call"
                            >
                              <Phone size={18} />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-dark-400 transition-colors"
                              title="Delete"
                              onClick={() => {
                                if (window.confirm('Delete this contact?')) {
                                  deleteContact(contact.id);
                                }
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} variant="glass" hover>
                <CardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="rounded border-gray-600 text-primary-500 focus:ring-primary-500"
                      />
                      <Avatar
                        name={`${contact.firstName} ${contact.lastName}`}
                        size="md"
                      />
                    </div>
                    <Badge
                      variant={
                        contact.status === 'customer' ? 'success' :
                        contact.status === 'lead' ? 'warning' :
                        'default'
                      }
                      size="sm"
                    >
                      {contact.status || 'active'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.company && (
                    <p className="text-sm text-gray-400 mb-3">{contact.company}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail size={14} />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone size={14} />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => viewContactDetails(contact)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals & Sidebars */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {selectedContact && (
        <ContactDetailSidebar
          contact={selectedContact}
          isOpen={isDetailSidebarOpen}
          onClose={() => {
            setIsDetailSidebarOpen(false);
            setSelectedContact(null);
          }}
        />
      )}
    </div>
  );
};
