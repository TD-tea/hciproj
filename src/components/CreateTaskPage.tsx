import React, { useState } from 'react';
import { Task } from '../types';

interface CreateTaskPageProps {
  familyMembers: string[];
  onCreateTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  commonTasks?: string[];
  showTooltips?: boolean;
}

const defaultCommonTasks = [
  'Cook food',
  'Wash dishes',
  'Clean room',
  'Do laundry',
  'Take out trash',
];

export function CreateTaskPage({ familyMembers, onCreateTask, commonTasks = defaultCommonTasks, showTooltips = false }: CreateTaskPageProps) {
  const [taskName, setTaskName] = useState('');
  const [points, setPoints] = useState(1);
  const [assignedTo, setAssignedTo] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!taskName) {
      setError('Please enter a task name');
      return;
    }
    if (!assignedTo) {
      setError('Please select a family member');
      return;
    }
    
    onCreateTask({ text: taskName, points, assignedTo });
    setTaskName('');
    setPoints(1);
    setAssignedTo('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <>
      <h2 className="title">
        Create Task
        {showTooltips && (
          <span style={{ 
            fontSize: '0.8em', 
            marginLeft: '8px', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            (Create new tasks for family members)
          </span>
        )}
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <label style={{ color: 'var(--task-item-color)' }}>
          Task Name
          {showTooltips && (
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '8px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              (Type or select a common task)
            </span>
          )}
        </label>
        <input
          className="input"
          type="text"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Type or select a task"
          title={showTooltips ? "Enter the name of the task" : undefined}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {commonTasks.map((t, i) => (
            <button
              type="button"
              key={i}
              className="add-button"
              style={{ padding: '4px 10px', fontSize: 14 }}
              onClick={() => setTaskName(t)}
              title={showTooltips ? `Quick select: ${t}` : undefined}
            >
              {t}
            </button>
          ))}
        </div>
        <label style={{ color: 'var(--task-item-color)' }}>
          Task Points
          {showTooltips && (
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '8px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              (Points earned for completing this task)
            </span>
          )}
        </label>
        <input
          className="points-input"
          type="number"
          min={1}
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
          title={showTooltips ? "Set the number of points for this task" : undefined}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[5, 10, 15, 20, 25].map((value) => (
            <button
              type="button"
              key={value}
              className="add-button"
              style={{ padding: '4px 10px', fontSize: 14 }}
              onClick={() => setPoints(value)}
              title={showTooltips ? `Quick select: ${value} points` : undefined}
            >
              {value} points
            </button>
          ))}
        </div>
        <label style={{ color: 'var(--task-item-color)' }}>
          Assign Task
          {showTooltips && (
            <span style={{ 
              fontSize: '0.8em', 
              marginLeft: '8px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              (Select who will complete this task)
            </span>
          )}
        </label>
        <select
          className="input"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          style={{ color: 'var(--input-color)', background: 'var(--input-bg)' }}
          title={showTooltips ? "Choose a family member to assign the task to" : undefined}
        >
          <option value="">Select family member</option>
          {familyMembers.map((member, idx) => (
            <option key={idx} value={member}>{member}</option>
          ))}
        </select>
        <button 
          className="add-button" 
          type="submit"
          title={showTooltips ? "Create the task with the current settings" : undefined}
        >
          SUBMIT
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Task created successfully!</div>}
      </form>
    </>
  );
} 