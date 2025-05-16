/**
 * CreateTaskPage Component
 * 
 * Provides an interface for creating new tasks in the application.
 * Allows users to specify task details including name, points, and assigned family member.
 * Includes quick-select options for common tasks and point values.
 * 
 * @author Thinh Dang
 * @component
 */

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
          <Tooltip text="Create new tasks for family members">
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
      <form className="form" onSubmit={handleSubmit}>
        {/* Task name input with quick-select buttons for common tasks */}
        <label style={{ color: 'var(--task-item-color)' }}>
          Task Name
          {showTooltips && (
            <Tooltip text="Type or select a common task">
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
        <input
          className="input"
          type="text"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Type or select a task"
          title={showTooltips ? "Enter the name of the task" : undefined}
        />
        {/* Quick-select buttons for common household tasks */}
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

        {/* Points input with quick-select buttons for common point values */}
        <label style={{ color: 'var(--task-item-color)' }}>
          Task Points
          {showTooltips && (
            <Tooltip text="Points earned for completing this task">
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
        <input
          className="points-input"
          type="number"
          min={1}
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
          title={showTooltips ? "Set the number of points for this task" : undefined}
        />
        {/* Quick-select buttons for common point values */}
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

        {/* Family member selection dropdown */}
        <label style={{ color: 'var(--task-item-color)' }}>
          Assign Task
          {showTooltips && (
            <Tooltip text="Select who will complete this task">
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

        {/* Submit button to create the task */}
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