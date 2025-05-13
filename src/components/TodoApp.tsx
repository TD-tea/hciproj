import React, { useState, useEffect } from 'react';
import { User, Task } from '../types';
import { FamilyPage } from './FamilyPage';
import { CreateTaskPage } from './CreateTaskPage';
import { SettingsPage } from './SettingsPage';

interface TodoAppProps {
    user: User;
    onLogout: () => void;
}

type Page = 'tasks' | 'family' | 'create' | 'settings';

function getSystemDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

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

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

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

    const completeTask = (taskId: number) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: true } : task
        ));
    };

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const renderContent = () => {
        switch (page) {
            case 'family':
                return <FamilyPage familyMembers={familyMembers} setFamilyMembers={setFamilyMembers} />;
            case 'create':
                return <CreateTaskPage familyMembers={familyMembers} onCreateTask={addTask} />;
            case 'settings':
                return <SettingsPage language={language} onLanguageChange={setLanguage} />;
            case 'tasks':
            default:
                return (
                    <>
                        <div className="leaderboard" style={{ marginBottom: 24 }}>
                            <h3 style={{ textAlign: 'center', margin: 0 }}>Leaderboard</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {leaderboard.map(({ member, points }, idx) => (
                                    <li key={member} style={{ fontWeight: idx === 0 ? 'bold' : 'normal', color: idx === 0 ? '#1976d2' : 'var(--task-item-color)' }}>
                                        {member}: {points} points
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="task-list">
                            <h3 style={{ marginBottom: 8 }}>Active Tasks</h3>
                            {activeTasks.length === 0 && <div>No active tasks.</div>}
                            {activeTasks.map(task => (
                                <div key={task.id} className="task-item">
                                    <div className="task-content">
                                        <span className="task-text">
                                            {task.text}: {task.points} points
                                            {task.assignedTo && (
                                                <span style={{ marginLeft: 8, fontStyle: 'italic', color: '#1976d2' }}>
                                                    (Assigned to: {task.assignedTo})
                                                </span>
                                            )}
                                        </span>
                                        <div className="task-actions">
                                            <button 
                                                onClick={() => completeTask(task.id)}
                                                className="icon-button"
                                            >
                                                ✓
                                            </button>
                                            <button 
                                                onClick={() => deleteTask(task.id)}
                                                className="icon-button"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="task-list" style={{ marginTop: 32 }}>
                            <h3 style={{ marginBottom: 8 }}>Completed Tasks</h3>
                            {completedTasks.length === 0 && <div>No completed tasks.</div>}
                            {completedTasks.map(task => (
                                <div key={task.id} className="task-item" style={{ opacity: 0.7 }}>
                                    <div className="task-content">
                                        <span className="task-text">
                                            {task.text}: {task.points} points
                                            {task.assignedTo && (
                                                <span style={{ marginLeft: 8, fontStyle: 'italic', color: '#1976d2' }}>
                                                    (Assigned to: {task.assignedTo})
                                                </span>
                                            )}
                                        </span>
                                        <div className="task-actions">
                                            <button 
                                                onClick={() => deleteTask(task.id)}
                                                className="icon-button"
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
            <div className="header">
                <h1 className="title">HomeBase</h1>
                <div className="user-info">
                    <button onClick={onLogout} className="logout-button">Logout</button>
                    <button
                        className="add-button"
                        style={{ marginLeft: 8 }}
                        onClick={() => setDarkMode(dm => !dm)}
                        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button
                        className="add-button"
                        style={{ marginLeft: 8 }}
                        onClick={() => setPage('settings')}
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </div>
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
            <div className="content-container">
                {renderContent()}
            </div>
        </div>
    );
} 