/**
 * FamilyPage Component
 * 
 * A component that manages family members who can be assigned tasks in the application.
 * Allows users to add and remove family members from the system.
 * 
 * @author Thinh Dang
 * @component
 */

import React, { useState } from 'react';

// Tooltip component
const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
    const [show, setShow] = useState(false);

    return (
        <div 
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--task-item-color)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    marginBottom: '8px',
                    border: '1px solid var(--task-item-color)'
                }}>
                    {text}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '6px solid transparent',
                        borderTopColor: 'var(--input-bg)'
                    }} />
                </div>
            )}
        </div>
    );
};

interface FamilyPageProps {
  familyMembers: string[];
  setFamilyMembers: (members: string[]) => void;
  showTooltips?: boolean;
}

export function FamilyPage({ familyMembers, setFamilyMembers, showTooltips = false }: FamilyPageProps) {
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
      <h2 className="title">
        Family Members
        {showTooltips && (
          <Tooltip text="Manage your family members who can be assigned tasks">
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '8px', 
              color: '#666',
              fontStyle: 'italic',
              cursor: 'help'
            }}>
              ℹ️
            </span>
          </Tooltip>
        )}
      </h2>
      {/* Form for adding new family members */}
      <form className="form" onSubmit={handleAddMember}>
        <label style={{ color: 'var(--task-item-color)' }}>
          Add Family Member
          {showTooltips && (
            <Tooltip text="Enter the name of a new family member">
              <span style={{ 
                fontSize: '0.8em', 
                marginLeft: '8px', 
                color: '#666',
                fontStyle: 'italic',
                cursor: 'help'
              }}>
                ℹ️
              </span>
            </Tooltip>
          )}
        </label>
        {/* Input field and add button for new family members */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Enter name"
            title={showTooltips ? "Type the name of the family member to add" : undefined}
          />
          <button 
            type="submit" 
            className="add-button"
            title={showTooltips ? "Add the new family member" : undefined}
          >
            Add
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>

      {/* List of current family members with remove buttons */}
      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 8 }}>
          Current Family Members
          {showTooltips && (
            <Tooltip text="Click ✕ to remove a family member">
              <span style={{ 
                fontSize: '0.8em', 
                marginLeft: '8px', 
                color: '#666',
                fontStyle: 'italic',
                cursor: 'help'
              }}>
                ℹ️
              </span>
            </Tooltip>
          )}
        </h3>
        {familyMembers.length === 0 ? (
          <div>No family members added yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {familyMembers.map((member, index) => (
              <li 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0'
                }}
              >
                <span>{member}</span>
                {/* Remove button for each family member */}
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="icon-button"
                  title={showTooltips ? `Remove ${member} from family members` : undefined}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
} 