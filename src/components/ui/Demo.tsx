import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  Dropdown,
  Badge,
  Avatar,
  AvatarGroup,
  Spinner,
  Skeleton,
  Toast,
  ToastContainer,
  ToastProps
} from './index';
import { Plus, Search, Mail, User, Settings } from 'lucide-react';

export const ComponentDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const dropdownOptions = [
    { value: 'option1', label: 'Option 1', icon: <Settings size={16} /> },
    { value: 'option2', label: 'Option 2', icon: <Mail size={16} /> },
    { value: 'option3', label: 'Option 3', icon: <User size={16} /> },
  ];

  const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const newToast: ToastProps = {
      id: Date.now().toString(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      message: `This is a ${type} toast notification!`,
      onClose: (id) => setToasts(prev => prev.filter(t => t.id !== id))
    };
    setToasts(prev => [...prev, newToast]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
            VoltCRM Design System
          </h1>
          <p className="text-gray-400 text-lg">
            Production-ready UI components with electric cyan + lime aesthetic
          </p>
        </div>

        {/* Buttons */}
        <Card variant="glass">
          <CardHeader title="Buttons" subtitle="Various button styles and sizes" />
          <CardBody>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">With Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button leftIcon={<Plus size={18} />}>Add New</Button>
                  <Button variant="secondary" rightIcon={<Search size={18} />}>Search</Button>
                  <Button isLoading>Loading</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Inputs */}
        <Card variant="glass">
          <CardHeader title="Inputs" subtitle="Form input components" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail size={18} />}
              />
              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                helperText="Must be unique"
              />
              <Input
                label="With Error"
                type="text"
                error="This field is required"
              />
              <Input
                label="Search"
                type="text"
                placeholder="Search..."
                leftIcon={<Search size={18} />}
              />
            </div>
          </CardBody>
        </Card>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader title="Default Card" />
            <CardBody>
              <p className="text-gray-400">This is a default card with standard styling.</p>
            </CardBody>
          </Card>

          <Card variant="glass" hover>
            <CardHeader title="Glass Card" />
            <CardBody>
              <p className="text-gray-400">Glassmorphism effect with hover animation.</p>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardHeader 
              title="Elevated Card"
              action={<Button size="sm" variant="ghost">Action</Button>}
            />
            <CardBody>
              <p className="text-gray-400">Card with elevated shadow.</p>
            </CardBody>
            <CardFooter>
              <Button fullWidth>Click Me</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Badges & Avatars */}
        <Card variant="glass">
          <CardHeader title="Badges & Avatars" />
          <CardBody>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success" dot>Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info" removable onRemove={() => {}}>Removable</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Avatars</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar name="John Doe" size="xs" />
                  <Avatar name="Jane Smith" size="sm" showStatus status="online" />
                  <Avatar name="Bob Johnson" size="md" />
                  <Avatar name="Alice Williams" size="lg" showStatus status="away" />
                  <Avatar name="Mike Davis" size="xl" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Avatar Group</h4>
                <AvatarGroup max={4}>
                  <Avatar name="John Doe" />
                  <Avatar name="Jane Smith" />
                  <Avatar name="Bob Johnson" />
                  <Avatar name="Alice Williams" />
                  <Avatar name="Mike Davis" />
                  <Avatar name="Sarah Connor" />
                </AvatarGroup>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Dropdowns & Modals */}
        <Card variant="glass">
          <CardHeader title="Dropdowns & Modals" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Dropdown
                label="Select an option"
                options={dropdownOptions}
                value={selectedValue}
                onChange={setSelectedValue}
                placeholder="Choose..."
              />
              <div>
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Loading States */}
        <Card variant="glass">
          <CardHeader title="Loading States" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Spinners</h4>
                <div className="flex flex-wrap items-center gap-6">
                  <Spinner size="sm" />
                  <Spinner size="md" variant="accent" />
                  <Spinner size="lg" text="Loading..." />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Skeletons</h4>
                <div className="space-y-3">
                  <Skeleton variant="text" count={3} />
                  <Skeleton variant="rectangular" height={100} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Toasts */}
        <Card variant="glass">
          <CardHeader title="Toast Notifications" />
          <CardBody>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => addToast('success')} variant="success">
                Success Toast
              </Button>
              <Button onClick={() => addToast('error')} variant="danger">
                Error Toast
              </Button>
              <Button onClick={() => addToast('warning')} variant="secondary">
                Warning Toast
              </Button>
              <Button onClick={() => addToast('info')} variant="primary">
                Info Toast
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            This is a modal dialog with glassmorphism styling. It supports custom footers, different sizes, and can be closed by clicking outside or pressing ESC.
          </p>
          <Input
            label="Example Input"
            placeholder="Type something..."
          />
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />
    </div>
  );
};
