/**
 * LoginPage Component
 * 
 * Handles user authentication including login and signup functionality.
 * Provides a form for users to enter their credentials and manages the authentication state.
 * 
 * @author Thinh Dang
 * @component
 */

import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
    onSignup: (user: User) => void;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (isLogin) {
            // Login logic
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find((u: User) => u.email === email && u.password === password);
            if (user) {
                setSuccess('Login successful!');
                setTimeout(() => onLogin(user), 1000);
            } else {
                setError('Invalid email or password');
            }
        } else {
            // Signup logic
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some((u: User) => u.email === email)) {
                setError('Email already exists');
                return;
            }
            const newUser: User = { id: Date.now(), email, password, tasks: [] };
            localStorage.setItem('users', JSON.stringify([...users, newUser]));
            setSuccess('Account created successfully!');
            setTimeout(() => onSignup(newUser), 1000);
        }
    };

    return (
        <div className="container">
            <h1 className="title">HomeBase</h1>
            <h2 className="title" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{isLogin ? 'Login' : 'Create Account'}</h2>
            <form onSubmit={handleSubmit} className="form">
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <button type="submit" className="add-button">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="switch-button"
                >
                    {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
                </button>
            </form>
        </div>
    );
} 