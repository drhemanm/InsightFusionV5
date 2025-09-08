import React from 'react';
import { Clock, MessageSquare, Paperclip, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Ticket, TicketComment } from '../../types/tickets';

interface TicketDetailsProps {
  ticket: Ticket;
  comments: TicketComment[];
  onAddComment: (content: string, isInternal: boolean) => void;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  comments,
  onAddComment
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{ticket.subject}</h2>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {ticket.priority.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {ticket.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>Created by {ticket.contactId}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{format(ticket.createdAt, 'MMM d, yyyy HH:mm')}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{ticket.description}</p>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
              <div className="space-y-2">
                {ticket.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Paperclip size={16} className="text-gray-400" />
                    <a href={attachment} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {attachment.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium mb-4">Comments</h3>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className={`p-4 rounded-lg ${
              comment.isInternal ? 'bg-yellow-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium">{comment.userId}</span>
                  {comment.isInternal && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                      Internal Note
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {format(comment.createdAt, 'MMM d, HH:mm')}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {comment.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Paperclip size={14} className="text-gray-400" />
                      <a href={attachment} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {attachment.split('/').pop()}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onAddComment('', true)}
              className="px-4 py-2 text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200"
            >
              Add Internal Note
            </button>
            <button
              onClick={() => onAddComment('', false)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};