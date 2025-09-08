import React, { useState } from 'react';
import { MessageSquare, Paperclip, User } from 'lucide-react';
import { format } from 'date-fns';
import type { TicketComment } from '../../types/tickets';

interface TicketCommentsProps {
  comments: TicketComment[];
  onAddComment: (content: string, isInternal: boolean, attachments?: File[]) => void;
}

export const TicketComments: React.FC<TicketCommentsProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (isInternal: boolean) => {
    if (!newComment.trim()) return;
    onAddComment(newComment, isInternal, attachments);
    setNewComment('');
    setAttachments([]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments & Updates</h3>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-4 rounded-lg ${
              comment.isInternal ? 'bg-yellow-50' : 'bg-gray-50'
            }`}
          >
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
                    <a
                      href={attachment}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attachment.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <Paperclip size={16} />
              Attach Files
            </label>
            {attachments.length > 0 && (
              <span className="text-sm text-gray-500">
                {attachments.length} file(s) selected
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200"
            >
              Add Internal Note
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
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