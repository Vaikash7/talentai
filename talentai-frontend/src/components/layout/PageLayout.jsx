import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function PageLayout({ role, title, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`main-area ${collapsed ? 'collapsed' : ''}`}>
        <Topbar title={title} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}