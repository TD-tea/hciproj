import React, { useState } from 'react';
import { Task } from '../types';
import { Tooltip } from './Tooltip';

interface CreateTaskPageProps {
  familyMembers: string[];
  onCreateTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  commonTasks?: string[];
}

const defaultCommonTasks = [
  'Cook food',
  'Wash dishes',
  'Clean room',
  'Do laundry',
  'Take out trash',
];

export function CreateTaskPage({ familyMembers, onCreateTask, commonTasks = defaultCommonTasks }: CreateTaskPageProps) {
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
      <h2 className="title">Create Task <Tooltip text="Create new tasks and assign them to family members. Tasks can be worth different points based on their difficulty." /></h2>
      <form className="form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ color: 'var(--task-item-color)' }}>Task Name</label>
          <Tooltip text="Enter a task name or select from common tasks below. This is what will be displayed in the task list." />
        </div>
        <input
          className="input"
          type="text"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Type or select a task"
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {commonTasks.map((t, i) => (
            <button
              type="button"
              key={i}
              className="add-button"
              style={{ padding: '4px 10px', fontSize: 14 }}
              onClick={() => setTaskName(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ color: 'var(--task-item-color)' }}>Task Points</label>
          <Tooltip text="Set how many points this task is worth. More difficult tasks should be worth more points. Points contribute to the leaderboard." />
        </div>
        <input
          className="points-input"
          type="number"
          min={1}
          value={points}
          onChange={e => setPoints(Number(e.target.value))}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[5, 10, 15, 20, 25].map((value) => (
            <button
              type="button"
              key={value}
              className="add-button"
              style={{ padding: '4px 10px', fontSize: 14 }}
              onClick={() => setPoints(value)}
            >
              {value} points
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ color: 'var(--task-item-color)' }}>Assign Task</label>
          <Tooltip text="Select which family member should complete this task. Make sure to add family members in the Family Members page first." />
        </div>
        <select
          className="input"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          style={{ color: 'var(--input-color)', background: 'var(--input-bg)' }}
        >
          <option value="">Select family member</option>
          {familyMembers.map((member, idx) => (
            <option key={idx} value={member}>{member}</option>
          ))}
        </select>
        <button className="add-button" type="submit">SUBMIT</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Task created successfully!</div>}
      </form>
    </>
  );
} 