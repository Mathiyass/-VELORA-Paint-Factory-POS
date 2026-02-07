
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useUsers = () => {
    const { success, error } = useToast();
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'staff' });
    const [editingId, setEditingId] = useState(null);

    const loadUsers = useCallback(async () => {
        try {
            const data = await api.getUsers();
            setUsers(data || []);
        } catch (e) {
            console.error(e);
            error("Failed to load users");
        }
    }, [error]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.updateUser({ ...formData, id: editingId });
            } else {
                await api.addUser(formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', username: '', password: '', role: 'staff' });
            setEditingId(null);
            loadUsers();
            success(editingId ? "User updated" : "User created");
        } catch (err) {
            error("Error: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete user?")) return;
        try {
            await api.deleteUser(id);
            loadUsers();
            success("User deleted");
        } catch (e) {
            error(e.message);
        }
    };

    const openEdit = (user) => {
        setFormData({ name: user.name, username: user.username, role: user.role, password: '' });
        setEditingId(user.id);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingId(null);
        setFormData({ name: '', username: '', password: '', role: 'staff' });
        setIsModalOpen(true);
    };

    return {
        users,
        isModalOpen,
        formData,
        editingId,
        actions: {
            setFormData,
            setIsModalOpen,
            handleSubmit,
            handleDelete,
            openEdit,
            openCreate
        }
    };
};
