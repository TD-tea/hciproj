import React, { useState } from 'react';

interface FamilyPageProps {
  familyMembers: string[];
  setFamilyMembers: (members: string[]) => void;
}

export function FamilyPage({ familyMembers, setFamilyMembers }: FamilyPageProps) {
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  const addMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (name.trim() && !familyMembers.includes(name.trim())) {
      setFamilyMembers([...familyMembers, name.trim()]);
      setName('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <>
      <h2 className="title">Add Family Members</h2>
      <form className="form" onSubmit={addMember}>
        <input
          className="input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter family member name"
        />
        <button className="add-button" type="submit">Add</button>
        {success && <div className="success">Family member added successfully!</div>}
      </form>
      <ul style={{ color: 'var(--task-item-color)' }}>
        {familyMembers.map((member, idx) => (
          <li key={idx} style={{ color: 'var(--task-item-color)' }}>{member}</li>
        ))}
      </ul>
    </>
  );
} 