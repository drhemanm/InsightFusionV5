import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { TicketList } from './TicketList';
import { CreateTicketForm } from './CreateTicketForm';
import { TicketAnalytics } from './TicketAnalytics';
import { TicketDetails } from './TicketDetails';
import { useTicketStore } from '../../store/ticketStore';

export const TicketDashboard: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const { tickets } = useTicketStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TicketAnalytics />
      
      <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={`${selectedTicket ? 'col-span-7' : 'col-span-12'}`}>
          <TicketList onSelectTicket={setSelectedTicket} />
        </div>

        {selectedTicket && (
          <div className="col-span-5">
            <TicketDetails 
              ticketId={selectedTicket} 
              onClose={() => setSelectedTicket(null)} 
            />
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <CreateTicketForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};