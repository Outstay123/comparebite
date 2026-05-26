export interface UserComment {
  id: string;
  productId: string;
  author: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

const COMMENTS_KEY = 'comparebite_comments';
const AUTHOR_KEY = 'comparebite_comment_author';

function readAll(): UserComment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? (JSON.parse(raw) as UserComment[]) : [];
  } catch {
    return [];
  }
}

function writeAll(comments: UserComment[]) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function getStoredAuthorName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AUTHOR_KEY) || '';
}

export function setStoredAuthorName(name: string) {
  localStorage.setItem(AUTHOR_KEY, name.trim());
}

export function getCommentsForProduct(productId: string): UserComment[] {
  return readAll()
    .filter((c) => c.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(productId: string, author: string, text: string): UserComment {
  const comment: UserComment = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    productId,
    author: author.trim() || 'Anonymous',
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  writeAll([comment, ...readAll()]);
  setStoredAuthorName(comment.author);
  return comment;
}

export function updateComment(id: string, text: string): UserComment | null {
  const all = readAll();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updated: UserComment = {
    ...all[index],
    text: text.trim(),
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function deleteComment(id: string): boolean {
  const all = readAll();
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}
