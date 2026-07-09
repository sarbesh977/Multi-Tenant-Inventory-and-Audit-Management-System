import React, { useState, useEffect } from 'react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const response = await fetch('http://localhost:5001/api/auth/all-users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    throw new Error('Session expired or unauthorized. Please re-login.');
                }

                if (!response.ok) {
                    throw new Error('Failed to retrieve user registry from invapp_db.');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); 

    if (loading) {
        return (
            <div style={{ padding: '30px', fontFamily: 'sans-serif', color: '#666' }}>
                🔄 Loading system directory...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '30px', fontFamily: 'sans-serif', color: '#dc3545', fontWeight: 'bold' }}>
                Error: {error}
            </div>
        );
    }

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 8px 0', color: '#212529', fontSize: '24px' }}>Active System Users</h2>
                <p style={{ margin: '0 0 24px 0', color: '#6c757d', fontSize: '14px' }}>
                    A real-time directory of profiles authorized to operate inside <strong>invapp_db</strong>.
                </p>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #dee2e6', backgroundColor: '#fff' }}>
                            <th style={{ padding: '12px', color: '#495057', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '12px', color: '#495057', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '12px', color: '#495057', fontWeight: '600' }}>Email Address</th>
                            <th style={{ padding: '12px', color: '#495057', fontWeight: '600' }}>System Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                                    No registered users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '14px 12px', color: '#6c757d' }}>#{user.id}</td>
                                    <td style={{ padding: '14px 12px', fontWeight: '600', color: '#212529' }}>{user.name}</td>
                                    <td style={{ padding: '14px 12px', color: '#495057' }}>{user.email}</td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '50px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: user.role === 'Manager' || user.role === 'Admin' ? '#e8f5e9' : '#e9ecef',
                                            color: user.role === 'Manager' || user.role === 'Admin' ? '#2e7d32' : '#495057'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;