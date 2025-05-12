import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { TodoApp } from './components/TodoApp';
import { FamilyPage } from './components/FamilyPage';
import { CreateTaskPage } from './components/CreateTaskPage';
import { User } from './types';
import './App.css';

function App() {
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (userData: User) => {
        setUser(userData);
    };

    const handleSignup = (userData: User) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return user ? (
        <TodoApp user={user} onLogout={handleLogout} />
    ) : (
        <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
    );
}

export default App;
