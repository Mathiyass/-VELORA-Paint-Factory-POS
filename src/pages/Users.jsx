import React from 'react';
import { UserPlus, Trash2, Edit, Shield } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';

export default function Users() {
  const { users, isModalOpen, formData, editingId, actions } = useUsers();

  return (
    <div className="h-full p-8 flex flex-col bg-[var(--color-bg-app)] text-zinc-200 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Shield className="text-cyan-500" size={32} /> User Management
          </h1>
          <p className="text-zinc-400 mt-1">Manage system access and staff roles.</p>
        </div>
        <button
          onClick={actions.openCreate}
          className="bg-cyan-600 hover:bg-cyan-500 text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all hover:scale-105"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/90 border-b border-zinc-800 text-xs font-bold uppercase text-zinc-500">
            <tr>
              <th className="p-5">Name</th>
              <th className="p-5">Username</th>
              <th className="p-5">Role</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="p-5 font-bold text-white">{user.name}</td>
                <td className="p-5 font-mono text-zinc-400">{user.username}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${user.role === 'admin'
                    ? 'bg-purple-900/20 text-purple-400 border-purple-800/50'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-5 text-right flex justify-end gap-2">
                  <button onClick={() => actions.openEdit(user)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-cyan-400 transition-colors"><Edit size={16} /></button>
                  <button onClick={() => actions.handleDelete(user.id)} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl shadow-cyan-900/20 p-6">
            <h2 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit User' : 'New User'}</h2>
            <form onSubmit={actions.handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Full Name</label>
                <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={formData.name} onChange={e => actions.setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Username</label>
                <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={formData.username} onChange={e => actions.setFormData({ ...formData, username: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Password {editingId && '(Leave blank to keep)'}</label>
                <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  type="password" value={formData.password} onChange={e => actions.setFormData({ ...formData, password: e.target.value })} required={!editingId} />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Role</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  value={formData.role} onChange={e => actions.setFormData({ ...formData, role: e.target.value })}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => actions.setIsModalOpen(false)} className="flex-1 py-3 rounded-lg text-zinc-400 hover:bg-zinc-800 font-bold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
