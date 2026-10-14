import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createService } from '../services/api';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [intervalSeconds, setIntervalSeconds] = useState(30);
  const [expectedStatus, setExpectedStatus] = useState(200);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetUrl) {
      setError('Please provide service name and target URL');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createService({
        name,
        target_url: targetUrl,
        interval_seconds: Number(intervalSeconds),
        expected_status_code: Number(expectedStatus),
      });
      setName('');
      setTargetUrl('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create service check');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#0d1322',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
            Add New Service Monitor
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Service Name
            </label>
            <input
              type="text"
              placeholder="e.g. User Auth API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: '#111827',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Target Endpoint URL
            </label>
            <input
              type="text"
              placeholder="http://backend:8000/health"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: '#111827',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Interval (Seconds)
              </label>
              <input
                type="number"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Expected Status Code
              </label>
              <input
                type="number"
                value={expectedStatus}
                onChange={(e) => setExpectedStatus(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#1f293d',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Adding...' : 'Add Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
