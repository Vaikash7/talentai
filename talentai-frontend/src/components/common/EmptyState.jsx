import { Inbox } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title, message }) {
  return (
    <div className="empty-state">
      <Icon size={40} />
      <div className="empty-state-title">{title}</div>
      <div>{message}</div>
    </div>
  );
}