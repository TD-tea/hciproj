import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

interface FamilyPageProps {
  familyMembers: string[];
  setFamilyMembers: (members: string[]) => void;
}

export function FamilyPage({ familyMembers, setFamilyMembers }: FamilyPageProps) {
  const [newMember, setNewMember] = useState('');
  const [error, setError] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newMember.trim()) {
      setError('Please enter a name');
      return;
    }

    if (familyMembers.includes(newMember.trim())) {
      setError('This family member already exists');
      return;
    }

    setFamilyMembers([...familyMembers, newMember.trim()]);
    setNewMember('');
  };

  const handleRemoveMember = (memberToRemove: string) => {
    setFamilyMembers(familyMembers.filter(member => member !== memberToRemove));
  };

  return (
    <>
      <h2 className="title">Family Members <Tooltip text="Add and manage family members who can be assigned tasks. Each member's completed tasks contribute to their points on the leaderboard." /></h2>
      <form onSubmit={handleAddMember} className="form">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ color: 'var(--task-item-color)' }}>Add Family Member</label>
          <Tooltip text="Enter the name of a family member to add them to the list. You can then assign tasks to them." />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Enter name"
            className="input"
          />
          <button type="submit" className="add-button">Add</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ color: 'var(--task-item-color)', marginBottom: 12 }}>Family Members List <Tooltip text="View and manage your family members. Click the X button to remove a member. Note: Removing a member will not delete their completed tasks." /></h3>
        {familyMembers.length === 0 ? (
          <div style={{ color: 'var(--task-item-color)', opacity: 0.7 }}>No family members added yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {familyMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--task-item-bg)',
                  borderRadius: '6px',
                  color: 'var(--task-item-color)'
                }}
              >
                <span>{member}</span>
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="icon-button"
                  style={{ color: '#ff4444' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 