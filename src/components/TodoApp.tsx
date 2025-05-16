/**
 * TodoApp Component
 * 
 * The main application component that manages the task management system.
 * Handles task creation, completion, and deletion, as well as family member management.
 * Includes features like dark mode, language settings, and tooltips.
 * 
 * @author Thinh Dang
 * @component
 */

import React, { useState, useEffect } from 'react';
import { User, Task } from '../types';
import { FamilyPage } from './FamilyPage';
import { CreateTaskPage } from './CreateTaskPage';
import { SettingsPage } from './SettingsPage';
import Confetti from 'react-confetti';

// Import defaultCommonTasks from CreateTaskPage
const defaultCommonTasks = [
    'Cook food',
    'Wash dishes',
    'Clean room',
    'Do laundry',
    'Take out trash',
];

interface TodoAppProps {
    user: User;
    onLogout: () => void;
}

type Page = 'tasks' | 'family' | 'create' | 'settings';

function getSystemDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

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

export function TodoApp({ user, onLogout }: TodoAppProps) {
    const [tasks, setTasks] = useState<Task[]>(user.tasks || []);
    const [familyMembers, setFamilyMembers] = useState<string[]>([]);
    const [page, setPage] = useState<Page>('tasks');
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) return stored === 'true';
        return getSystemDarkMode();
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });
    const [showTooltips, setShowTooltips] = useState(() => {
        return localStorage.getItem('showTooltips') === 'true';
    });
    // Add state for confirmation dialogs
    const [confirmDialog, setConfirmDialog] = useState<{
        show: boolean;
        type: 'complete' | 'delete';
        taskId: number | null;
        taskText: string;
    }>({
        show: false,
        type: 'complete',
        taskId: null,
        taskText: ''
    });
    const [editingTask, setEditingTask] = useState<{
        id: number;
        text: string;
        points: number;
        assignedTo: string;
    } | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('showTooltips', showTooltips ? 'true' : 'false');
    }, [showTooltips]);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: User) => 
            u.id === user.id ? { ...u, tasks } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }, [tasks, user.id]);

    // Optionally persist family members per user
    useEffect(() => {
        const stored = localStorage.getItem(`family_${user.id}`);
        if (stored) setFamilyMembers(JSON.parse(stored));
    }, [user.id]);
    useEffect(() => {
        localStorage.setItem(`family_${user.id}` , JSON.stringify(familyMembers));
    }, [familyMembers, user.id]);

    // Split tasks into active and completed
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    // Leaderboard calculation
    const leaderboard = familyMembers.map(member => {
        const points = tasks
            .filter(task => task.completed && task.assignedTo === member)
            .reduce((sum, task) => sum + (task.points || 0), 0);
        return { member, points };
    }).sort((a, b) => b.points - a.points);

    const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
        setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
    };

    const handleCompleteClick = (taskId: number, taskText: string) => {
        setConfirmDialog({
            show: true,
            type: 'complete',
            taskId,
            taskText
        });
    };

    const handleDeleteClick = (taskId: number, taskText: string) => {
        setConfirmDialog({
            show: true,
            type: 'delete',
            taskId,
            taskText
        });
    };

    const handleConfirmAction = () => {
        if (confirmDialog.taskId === null) return;

        if (confirmDialog.type === 'complete') {
            setTasks(tasks.map(task => 
                task.id === confirmDialog.taskId ? { ...task, completed: true } : task
            ));
            // Show confetti when task is completed
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
        } else {
            setTasks(tasks.filter(task => task.id !== confirmDialog.taskId));
        }

        setConfirmDialog({
            show: false,
            type: 'complete',
            taskId: null,
            taskText: ''
        });
    };

    const handleCancelAction = () => {
        setConfirmDialog({
            show: false,
            type: 'complete',
            taskId: null,
            taskText: ''
        });
    };

    const handleEditTask = (task: Task) => {
        setEditingTask({
            id: task.id,
            text: task.text,
            points: task.points,
            assignedTo: task.assignedTo || ''
        });
    };

    const handleSaveEdit = () => {
        if (!editingTask) return;

        setTasks(tasks.map(task => 
            task.id === editingTask.id 
                ? { ...task, text: editingTask.text, points: editingTask.points, assignedTo: editingTask.assignedTo }
                : task
        ));
        setEditingTask(null);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    // Add window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderContent = () => {
        switch (page) {
            case 'family':
                return <FamilyPage familyMembers={familyMembers} setFamilyMembers={setFamilyMembers} showTooltips={showTooltips} />;
            case 'create':
                return <CreateTaskPage familyMembers={familyMembers} onCreateTask={addTask} showTooltips={showTooltips} />;
            case 'settings':
                return <SettingsPage language={language} onLanguageChange={setLanguage} />;
            case 'tasks':
            default:
                return (
                    <>
                        <div className="leaderboard" style={{ marginBottom: 24 }}>
                            <h3 style={{ textAlign: 'center', margin: 0 }}>
                                Leaderboard
                                {showTooltips && (
                                    <Tooltip text="Shows points earned by each family member">
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
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {leaderboard.map(({ member, points }, idx) => (
                                    <li key={member} style={{ fontWeight: idx === 0 ? 'bold' : 'normal', color: idx === 0 ? '#1976d2' : 'var(--task-item-color)' }}>
                                        {member}: {points} points
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="task-list">
                            <h3 style={{ marginBottom: 8 }}>
                                Active Tasks
                                {showTooltips && (
                                    <Tooltip text="Tasks that need to be completed">
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
                            {activeTasks.length === 0 && <div>No active tasks.</div>}
                            {activeTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className="task-item"
                                    onClick={() => handleEditTask(task)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="task-content">
                                        <span className="task-text">
                                            {task.text}: {task.points} points
                                            {task.assignedTo && (
                                                <span style={{ marginLeft: 8, fontStyle: 'italic', color: '#1976d2' }}>
                                                    (Assigned to: {task.assignedTo})
                                                </span>
                                            )}
                                        </span>
                                        <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => handleCompleteClick(task.id, task.text)}
                                                className="icon-button"
                                                title={showTooltips ? "Mark task as completed" : undefined}
                                                style={{ color: '#4CAF50' }}
                                            >
                                                ✓
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(task.id, task.text)}
                                                className="icon-button"
                                                title={showTooltips ? "Delete task" : undefined}
                                                style={{ color: '#f44336' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="task-list" style={{ marginTop: 32 }}>
                            <h3 style={{ marginBottom: 8 }}>
                                Completed Tasks
                                {showTooltips && (
                                    <Tooltip text="Tasks that have been finished">
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
                            {completedTasks.length === 0 && <div>No completed tasks.</div>}
                            {completedTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className="task-item" 
                                    style={{ opacity: 0.7, cursor: 'pointer' }}
                                    onClick={() => handleEditTask(task)}
                                >
                                    <div className="task-content">
                                        <span className="task-text">
                                            {task.text}: {task.points} points
                                            {task.assignedTo && (
                                                <span style={{ marginLeft: 8, fontStyle: 'italic', color: '#1976d2' }}>
                                                    (Assigned to: {task.assignedTo})
                                                </span>
                                            )}
                                        </span>
                                        <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => handleDeleteClick(task.id, task.text)}
                                                className="icon-button"
                                                title={showTooltips ? "Delete completed task" : undefined}
                                                style={{ color: '#f44336' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="container">
            {/* Confetti effect */}
            {showConfetti && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 9999
                }}>
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.2}
                        initialVelocityY={10}
                        tweenDuration={3000}
                        colors={['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F08080']}
                    />
                </div>
            )}

            {/* Top navigation bar with app title and utility buttons */}
            <div className="header">
                <h1 className="title">HB</h1>
                <div className="user-info" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Tooltip toggle button - shows/hides help text throughout the app */}
                    <button
                        className="add-button"
                        onClick={() => setShowTooltips(!showTooltips)}
                        title={showTooltips ? 'Hide tooltips' : 'Show tooltips'}
                        style={{ padding: '8px' }}
                    >
                        ❓
                    </button>
                    {/* Dark/Light mode toggle button */}
                    <button
                        className="add-button"
                        onClick={() => setDarkMode(dm => !dm)}
                        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{ padding: '8px' }}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    {/* Settings button - opens language preferences */}
                    <button
                        className="add-button"
                        onClick={() => setPage('settings')}
                        title="Settings"
                        style={{ padding: '8px' }}
                    >
                        ⚙️
                    </button>
                    <button 
                        onClick={onLogout} 
                        className="logout-button"
                        title="Logout"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main navigation buttons - switches between different app sections */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button 
                    className={`add-button ${page === 'tasks' ? 'active' : ''}`} 
                    onClick={() => setPage('tasks')}
                >
                    Task List
                </button>
                <button 
                    className={`add-button ${page === 'create' ? 'active' : ''}`} 
                    onClick={() => setPage('create')}
                >
                    Create Task
                </button>
                <button 
                    className={`add-button ${page === 'family' ? 'active' : ''}`} 
                    onClick={() => setPage('family')}
                >
                    Family Members
                </button>
            </div>

            {/* Main content area - displays different views based on selected page */}
            <div className="content-container">
                {renderContent()}
            </div>

            {/* Edit Task Dialog */}
            {editingTask && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--input-bg)',
                        padding: '15px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '85%',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                            Edit Task
                            {showTooltips && (
                                <Tooltip text="Modify task details">
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
                        <div className="form" style={{ padding: '10px 10px' }}>
                            <label style={{ color: 'var(--task-item-color)', fontWeight: 'bold', marginTop: '10px' }}>
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
                                value={editingTask.text}
                                onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                                placeholder="Type or select a task"
                                title={showTooltips ? "Enter the name of the task" : undefined}
                            />
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '10px' }}>
                                {defaultCommonTasks.map((t: string, i: number) => (
                                    <button
                                        type="button"
                                        key={i}
                                        className="add-button"
                                        style={{ padding: '4px 10px', fontSize: 14 }}
                                        onClick={() => setEditingTask({ ...editingTask, text: t })}
                                        title={showTooltips ? `Quick select: ${t}` : undefined}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <label style={{ color: 'var(--task-item-color)', fontWeight: 'bold' }}>
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
                                value={editingTask.points}
                                onChange={(e) => setEditingTask({ ...editingTask, points: Number(e.target.value) })}
                                title={showTooltips ? "Set the number of points for this task" : undefined}
                            />
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '10px' }}>
                                {[5, 10, 15, 20, 25].map((value) => (
                                    <button
                                        type="button"
                                        key={value}
                                        className="add-button"
                                        style={{ padding: '4px 10px', fontSize: 14 }}
                                        onClick={() => setEditingTask({ ...editingTask, points: value })}
                                        title={showTooltips ? `Quick select: ${value} points` : undefined}
                                    >
                                        {value} points
                                    </button>
                                ))}
                            </div>

                            <label style={{ color: 'var(--task-item-color)', fontWeight: 'bold' }}>
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
                                value={editingTask.assignedTo}
                                onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                                style={{ color: 'var(--input-color)', background: 'var(--input-bg)' }}
                                title={showTooltips ? "Choose a family member to assign the task to" : undefined}
                            >
                                <option value="">Select family member</option>
                                {familyMembers.map((member, idx) => (
                                    <option key={idx} value={member}>{member}</option>
                                ))}
                            </select>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button
                                    className="add-button"
                                    onClick={handleCancelEdit}
                                    style={{ backgroundColor: '#666' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="add-button"
                                    onClick={handleSaveEdit}
                                    style={{ backgroundColor: '#4CAF50' }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--input-bg)',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, color: 'var(--task-item-color)' }}>
                            {confirmDialog.type === 'complete' ? 'Complete Task' : 'Delete Task'}
                        </h3>
                        <p style={{ color: 'var(--task-item-color)' }}>
                            Are you sure you want to {confirmDialog.type === 'complete' ? 'complete' : 'delete'} the task:
                            <br />
                            <strong>"{confirmDialog.taskText}"</strong>?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                className="add-button"
                                onClick={handleCancelAction}
                                style={{ backgroundColor: '#666' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="add-button"
                                onClick={handleConfirmAction}
                                style={{ 
                                    backgroundColor: confirmDialog.type === 'complete' ? '#4CAF50' : '#f44336'
                                }}
                            >
                                {confirmDialog.type === 'complete' ? 'Complete' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 