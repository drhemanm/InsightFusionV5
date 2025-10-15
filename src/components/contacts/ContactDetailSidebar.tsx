import React, { useEffect } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  Edit,
  Trash2,
  MessageSquare,
  DollarSign,
  Clock
} from 'lucide-react';
import { Button, Badge, Avatar, Card, CardBody } from '../ui';
import type { Contact } from '../../types';

interface ContactDetailSidebarProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDetailSidebar: React.FC<ContactDetailSidebarProps> = ({
  contact,
  isOpen,
  onClose
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] bg-dark-500/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-dark-300 border-l border-primary-500/20 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-400/95 backdrop-blur-xl border-b border-primary-500/10 p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar
                name={`${contact.firstName} ${contact.lastName}`}
                size="lg"
                showStatus
                status="online"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-100">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.position && (
                  <p className="text-sm text-gray-400">{contact.position}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-dark-300 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" fullWidth leftIcon={<Mail size={16} />}>
              Email
            </Button>
            <Button variant="secondary" size="sm" fullWidth leftIcon={<Phone size={16} />}>
              Call
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Edit size={16} />}>
              Edit
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={
                contact.status === 'customer' ? 'success' :
                contact.status === 'lead' ? 'warning' :
                'default'
              }
              dot
            >
              {contact.status || 'Active'}
            </Badge>
            {contact.tags?.map((tag) => (
              <Badge key={tag} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Contact Information */}
          <Card variant="glass">
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-gray-200 hover:text-primary-400 transition-colors break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                {contact.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Phone</p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-sm text-gray-200 hover:text-primary-400 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Company</p>
                      <p className="text-sm text-gray-200">{contact.company}</p>
                    </div>
                  </div>
                )}

                {contact.lastContactedAt && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Last Contacted</p>
                      <p className="text-sm text-gray-200">
                        {new Date(contact.lastContactedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Social Profiles */}
          {contact.socialProfiles && Object.keys(contact.socialProfiles).length > 0 && (
            <Card variant="glass">
              <CardBody>
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                  Social Profiles
                </h3>
                <div className="space-y-3">
                  {contact.socialProfiles.linkedin && (
                    <a
                      href={contact.socialProfiles.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-dark-200/50 rounded-lg hover:bg-dark-200 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        in
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200">LinkedIn</p>
                        <p className="text-xs text-gray-400 truncate">
                          {contact.socialProfiles.linkedin}
                        </p>
                      </div>
                    </a>
                  )}
                  {contact.socialProfiles.twitter && (
                    <a
                      href={contact.socialProfiles.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-dark-200/50 rounded-lg hover:bg-dark-200 transition-colors"
                    >
                      <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
                        𝕏
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200">Twitter/X</p>
                        <p className="text-xs text-gray-400 truncate">
                          {contact.socialProfiles.twitter}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Recent Activity */}
          <Card variant="glass">
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent-500/10 text-accent-400 rounded-lg">
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">Email sent</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-500/10 text-primary-400 rounded-lg">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">Phone call completed</p>
                    <p className="text-xs text-gray-400">5 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <DollarSign size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">Deal created</p>
                    <p className="text-xs text-gray-400">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Danger Zone */}
          <Card variant="bordered">
            <CardBody>
              <h3 className="text-sm font-semibold text-error mb-3 uppercase tracking-wide">
                Danger Zone
              </h3>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                leftIcon={<Trash2 size={16} />}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this contact?')) {
                    // Handle delete
                    onClose();
                  }
                }}
              >
                Delete Contact
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
