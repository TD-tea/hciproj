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
          <span style={{ 
            fontSize: '0.8em', 
            marginLeft: '8px', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            (Manage your family members who can be assigned tasks)
          </span>
        )}
      </h2>
      {/* Form for adding new family members */}
      <form className="form" onSubmit={handleAddMember}>
        <label style={{ color: 'var(--task-item-color)' }}>
          Add Family Member
          {showTooltips && (
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '8px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              (Enter the name of a new family member)
            </span>
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
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '8px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              (Click ✕ to remove a family member)
            </span>
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