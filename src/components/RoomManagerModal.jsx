import React, { useState, useEffect } from 'react';
import { 
  X, 
  DoorClosed, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertCircle, 
  Building, 
  Users, 
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const RoomManagerModal = ({ 
  isOpen, 
  onClose, 
  property, 
  tenants = [], 
  onSaveRooms 
}) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomInput, setNewRoomInput] = useState('');
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [editingRoomValue, setEditingRoomValue] = useState('');
  const [renamedMap, setRenamedMap] = useState({}); // { oldRoom: newRoom }
  const [batchPrefix, setBatchPrefix] = useState('Room ');
  const [batchStart, setBatchStart] = useState('');
  const [batchEnd, setBatchEnd] = useState('');
  const [showBatchGen, setShowBatchGen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (property) {
      const initialRooms = property.availableRooms && property.availableRooms.length > 0
        ? [...property.availableRooms]
        : ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301'];
      setRooms(initialRooms);
      setRenamedMap({});
      setEditingRoomIndex(null);
      setErrorMsg('');
      setNewRoomInput('');
    }
  }, [property, isOpen]);

  if (!isOpen || !property) return null;

  // Filter tenants residing in this property
  const propTenants = tenants.filter(t => t.propertyId === property.id || t.propertyName === property.name);

  // Helper to find occupying tenant for a room
  const getOccupyingTenant = (roomName) => {
    // Check if this room was renamed
    const originalRoom = Object.keys(renamedMap).find(key => renamedMap[key] === roomName) || roomName;
    return propTenants.find(t => (t.roomNo === originalRoom || t.roomNumber === originalRoom || t.unit === originalRoom || t.roomNo === roomName || t.roomNumber === roomName || t.unit === roomName));
  };

  // Add single room
  const handleAddRoom = (e) => {
    e?.preventDefault();
    const trimmed = newRoomInput.trim();
    if (!trimmed) return;

    if (rooms.includes(trimmed)) {
      setErrorMsg(`Room "${trimmed}" already exists in this property roster.`);
      return;
    }

    setRooms(prev => [...prev, trimmed]);
    setNewRoomInput('');
    setErrorMsg('');
  };

  // Batch generate rooms
  const handleBatchGenerate = () => {
    const start = parseInt(batchStart, 10);
    const end = parseInt(batchEnd, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      setErrorMsg('Please enter valid starting and ending unit numbers (e.g., 401 to 405).');
      return;
    }

    if (end - start > 50) {
      setErrorMsg('Cannot generate more than 50 units at once.');
      return;
    }

    const generated = [];
    for (let i = start; i <= end; i++) {
      const roomStr = `${batchPrefix}${i}`;
      if (!rooms.includes(roomStr) && !generated.includes(roomStr)) {
        generated.push(roomStr);
      }
    }

    if (generated.length === 0) {
      setErrorMsg('All generated room numbers already exist in the roster.');
      return;
    }

    setRooms(prev => [...prev, ...generated]);
    setBatchStart('');
    setBatchEnd('');
    setShowBatchGen(false);
    setErrorMsg('');
  };

  // Start editing a room
  const handleStartEdit = (index, currentVal) => {
    setEditingRoomIndex(index);
    setEditingRoomValue(currentVal);
    setErrorMsg('');
  };

  // Save renamed room
  const handleSaveRename = (index) => {
    const trimmed = editingRoomValue.trim();
    const oldVal = rooms[index];

    if (!trimmed) {
      setErrorMsg('Room name cannot be empty.');
      return;
    }

    if (trimmed !== oldVal && rooms.includes(trimmed)) {
      setErrorMsg(`Room "${trimmed}" already exists.`);
      return;
    }

    if (trimmed !== oldVal) {
      // Find if oldVal was already mapped from an earlier original
      const originalSource = Object.keys(renamedMap).find(key => renamedMap[key] === oldVal) || oldVal;
      setRenamedMap(prev => ({
        ...prev,
        [originalSource]: trimmed
      }));

      setRooms(prev => prev.map((r, i) => i === index ? trimmed : r));
    }

    setEditingRoomIndex(null);
    setEditingRoomValue('');
    setErrorMsg('');
  };

  // Cancel renaming
  const handleCancelRename = () => {
    setEditingRoomIndex(null);
    setEditingRoomValue('');
  };

  // Delete a room unit
  const handleDeleteRoom = (index) => {
    const roomToDelete = rooms[index];
    const occupying = getOccupyingTenant(roomToDelete);

    if (occupying) {
      setErrorMsg(`Cannot delete ${roomToDelete}: Currently occupied by tenant ${occupying.name}. Please vacate or reassign the tenant first.`);
      return;
    }

    setRooms(prev => prev.filter((_, i) => i !== index));
    // Clean up renamed map if applicable
    setRenamedMap(prev => {
      const copy = { ...prev };
      delete copy[roomToDelete];
      return copy;
    });
    setErrorMsg('');
  };

  // Save everything to property and tenant models
  const handleSaveAll = () => {
    if (rooms.length === 0) {
      setErrorMsg('A property must have at least one room unit.');
      return;
    }
    onSaveRooms(property.id || property._id, rooms, renamedMap);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary-subtle)',
              border: '1px solid var(--accent-primary-ring)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <DoorClosed size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Manage Room Units & Allocation
                </h3>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  Owner Control
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {property.name} • {property.address}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ width: '28px', height: '28px', padding: 0, borderRadius: 'var(--radius-sm)' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Roster Summary Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.875rem'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Configured Units</span>
              <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {rooms.length} Units
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Occupied Units</span>
              <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--status-paid-text)' }}>
                {rooms.filter(r => getOccupyingTenant(r)).length} Occupied
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vacant Ready</span>
              <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--status-pending-text)' }}>
                {rooms.filter(r => !getOccupyingTenant(r)).length} Vacant
              </div>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div style={{
              background: 'var(--status-alert-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.625rem 0.875rem',
              color: 'var(--status-alert-text)',
              fontSize: '0.775rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Renamed notification banner */}
          {Object.keys(renamedMap).length > 0 && (
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)' }}>
                <Sparkles size={13} /> Pending Unit Renames:
              </div>
              {Object.entries(renamedMap).map(([oldR, newR]) => (
                <div key={oldR} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="tabular-nums">{oldR}</span>
                  <ArrowRight size={11} />
                  <strong className="tabular-nums">{newR}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    (Assigned tenant records will synchronize automatically)
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ADD ROOM UNIT TOOLBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ marginBottom: 0 }}
                  placeholder="e.g. Room 303 or Unit 4B..."
                  value={newRoomInput}
                  onChange={(e) => setNewRoomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRoom();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Plus size={14} /> Add Unit
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowBatchGen(!showBatchGen)}
                className="btn btn-secondary btn-sm"
              >
                <Layers size={13} /> {showBatchGen ? 'Close Range Generator' : 'Floor Range Generator'}
              </button>
            </div>

            {/* Batch Generator Panel */}
            {showBatchGen && (
              <div style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Bulk Floor / Room Number Generator:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.625rem', alignItems: 'flex-end' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Prefix</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginBottom: 0 }}
                      placeholder="Room "
                      value={batchPrefix}
                      onChange={(e) => setBatchPrefix(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Start #</label>
                    <input
                      type="number"
                      className="form-input tabular-nums"
                      style={{ marginBottom: 0 }}
                      placeholder="401"
                      value={batchStart}
                      onChange={(e) => setBatchStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>End #</label>
                    <input
                      type="number"
                      className="form-input tabular-nums"
                      style={{ marginBottom: 0 }}
                      placeholder="406"
                      value={batchEnd}
                      onChange={(e) => setBatchEnd(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleBatchGenerate}
                    className="btn btn-primary btn-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ROOM UNITS ROSTER LIST */}
          <div>
            <div style={{ 
              fontSize: '0.725rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Configured Room Units ({rooms.length})</span>
              <span>Status & Controls</span>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem', 
              maxHeight: '340px', 
              overflowY: 'auto',
              padding: '2px 4px 2px 2px'
            }}>
              {rooms.map((roomName, index) => {
                const tenant = getOccupyingTenant(roomName);
                const isOccupied = !!tenant;
                const isEditing = editingRoomIndex === index;

                return (
                  <div
                    key={`${roomName}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.85rem',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border-color)',
                      gap: '0.75rem',
                      lineHeight: '1.4'
                    }}
                  >
                    {/* Left: Room Title or Edit Input */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <DoorClosed 
                        size={16} 
                        color={isOccupied ? 'var(--status-paid-text)' : 'var(--text-muted)'} 
                      />

                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ margin: 0, padding: '4px 8px', fontSize: '0.825rem' }}
                            value={editingRoomValue}
                            autoFocus
                            onChange={(e) => setEditingRoomValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(index);
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(index)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px' }}
                            title="Save Rename"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelRename}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            title="Cancel"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="tabular-nums" style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                            {roomName}
                          </div>
                          {isOccupied && (
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <span>Resident: <strong style={{ color: 'var(--text-secondary)' }}>{tenant.name}</strong></span>
                              <span>• <span className="tabular-nums">{formatINR(tenant.rentAmount || 0)}/mo</span></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Badge & Action Buttons */}
                    {!isEditing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className={`badge ${isOccupied ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                          {isOccupied ? 'Occupied' : 'Vacant'}
                        </span>

                        {/* Rename Button (Owner only) */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(index, roomName)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem', gap: '3px', minHeight: '26px' }}
                          title="Rename unit"
                        >
                          <Edit2 size={11} /> Rename
                        </button>

                        {/* Delete Button (Owner only, vacant only) */}
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(index)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '4px 7px',
                            color: isOccupied ? 'var(--text-muted)' : 'var(--status-alert-text)',
                            cursor: isOccupied ? 'not-allowed' : 'pointer'
                          }}
                          disabled={isOccupied}
                          title={isOccupied ? `Cannot delete occupied unit (${tenant?.name})` : `Delete ${roomName}`}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Authorized Owner Modification
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleSaveAll} className="btn btn-primary">
              <Check size={14} /> Save Room Roster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
