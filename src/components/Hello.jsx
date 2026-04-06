import React from 'react';
import Button from '../common/components/Button';
import Badge from '../common/components/Badge';

export default function Hello() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-outfit p-6">
      <div className="bg-white rounded-2xl shadow-theme-xl p-8 max-w-lg w-full border border-gray-200 text-left">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-title-sm font-semibold text-gray-900">
            TailAdmin Components
          </h1>
          <Badge color="success" variant="light">Active</Badge>
        </div>

        <p className="text-theme-sm text-gray-500 mb-8">
          This component is using shared UI components (`Button`, `Badge`) that I've extracted from the TailAdmin kit. 
          The styles are correctly applied via Tailwind CSS v4.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
            <span className="text-theme-xs font-semibold text-gray-400 uppercase tracking-wider">Status Badges</span>
            <div className="flex flex-wrap gap-2">
              <Badge color="primary">Primary</Badge>
              <Badge color="error">Error</Badge>
              <Badge color="warning">Warning</Badge>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
            <span className="text-theme-xs font-semibold text-gray-400 uppercase tracking-wider">Button Variants</span>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">Outline</Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-4 border-t border-gray-100 mb-6">
          <div className="size-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shadow-theme-sm">
            P
          </div>
          <div>
            <p className="text-theme-sm font-medium text-gray-900">Piko</p>
            <p className="text-theme-xs text-gray-500">Project Creator</p>
          </div>
        </div>

        <Button className="w-full shadow-theme-md" onClick={() => alert('TailAdmin UI is working!')}>
          Test UI Integration
        </Button>
      </div>
    </div>
  );
}