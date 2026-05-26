'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Review } from '@/lib/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/formatters';
import {
  UserComment,
  addComment,
  deleteComment,
  getCommentsForProduct,
  updateComment,
} from '@/lib/utils/userComments';
import { MessageSquare, Pencil, Trash2, X, Check } from 'lucide-react';

interface ProductCommentsProps {
  productId: string;
  initialReviews: Review[];
}

type DisplayComment = {
  id: string;
  author: string;
  text: string;
  date: string;
  editable: boolean;
  source: 'user' | 'static';
};

function mapStaticReviews(reviews: Review[]): DisplayComment[] {
  return reviews.map((review) => ({
    id: review.id,
    author: review.user,
    text: review.comment,
    date: review.created_at,
    editable: false,
    source: 'static' as const,
  }));
}

export function ProductComments({ productId, initialReviews }: ProductCommentsProps) {
  const [userComments, setUserComments] = useState<UserComment[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [mounted, setMounted] = useState(false);

  const loadComments = useCallback(() => {
    setUserComments(getCommentsForProduct(productId));
  }, [productId]);

  useEffect(() => {
    setMounted(true);
    loadComments();
  }, [loadComments]);

  const allComments = useMemo(() => {
    const staticComments = mapStaticReviews(initialReviews);
    const userDisplay: DisplayComment[] = userComments.map((c) => ({
      id: c.id,
      author: c.author,
      text: c.text,
      date: c.updatedAt || c.createdAt,
      editable: true,
      source: 'user' as const,
    }));
    return [...userDisplay, ...staticComments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [initialReviews, userComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(productId, 'You', text);
    setText('');
    loadComments();
  };

  const handleStartEdit = (comment: DisplayComment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    updateComment(id, editText);
    setEditingId(null);
    setEditText('');
    loadComments();
  };

  const handleDelete = (id: string) => {
    deleteComment(id);
    if (editingId === id) handleCancelEdit();
    loadComments();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Comments</h2>
          {mounted && allComments.length > 0 && (
            <span className="text-sm text-gray-500 font-normal">({allComments.length})</span>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-4 border-b border-gray-100">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={500}
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-800 focus:ring-0 transition-colors duration-200"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!text.trim()}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                text.trim()
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md scale-100'
                  : 'bg-gray-100 text-gray-400 cursor-default scale-95 opacity-60'
              }`}
            >
              Comment
            </button>
          </div>
        </form>

        {!mounted ? (
          <p className="p-6 text-gray-500">Loading comments...</p>
        ) : allComments.length === 0 ? (
          <p className="p-6 text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {allComments.map((comment) => (
              <div key={comment.id} className="p-6 group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-gray-500 ml-2 text-sm">{formatDate(comment.date)}</span>
                    {comment.source === 'static' && (
                      <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Community
                      </span>
                    )}
                  </div>
                  {comment.editable && editingId !== comment.id && (
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(comment)}
                        className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        aria-label="Edit comment"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="w-full rounded-lg border border-primary-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={!editText.trim()}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
