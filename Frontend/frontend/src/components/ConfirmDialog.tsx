import React from 'react';

export default function ConfirmDialog({
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
}: {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)'}} onClick={onCancel} />
      <div style={{background: 'white', padding: 20, borderRadius: 8, minWidth: 320, zIndex: 70}}>
        <h3 style={{marginTop: 0}}>{title}</h3>
        <p style={{marginTop: 4, marginBottom: 16}}>{message}</p>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
          <button onClick={onCancel} style={{padding: '6px 12px'}}>Cancel</button>
          <button onClick={onConfirm} style={{padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4}}>Logout</button>
        </div>
      </div>
    </div>
  );
}
