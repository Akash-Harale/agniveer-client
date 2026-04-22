'use client';

import { useState, useMemo } from 'react';
import { Search, Users, UserCheck, UserX } from 'lucide-react';

/* ============================================================
   TYPE
   ============================================================ */
type Officer = {
  id: number;
  name: string;
  rank: string;
  designation: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
};

/* ============================================================
   DATA
   ============================================================ */
const MOCK_USERS: Officer[] = [
  { id: 1, name: 'Priya Sharma', rank: 'Deputy Inspector General', designation: 'DIG', email: 'priya.sharma@cisf.gov.in', phone: '+91-9876543211', status: 'Active' },
  { id: 2, name: 'Rahul Verma', rank: 'Inspector General', designation: 'IG', email: 'rahul.verma@cisf.gov.in', phone: '+91-9123456780', status: 'Active' },
  { id: 3, name: 'Anita Singh', rank: 'Assistant Commandant', designation: 'AC', email: 'anita.singh@cisf.gov.in', phone: '+91-9988776655', status: 'Inactive' },
  { id: 4, name: 'Vikram Yadav', rank: 'Commandant', designation: 'Commandant', email: 'vikram.yadav@cisf.gov.in', phone: '+91-8899776655', status: 'Active' },
  { id: 5, name: 'Sneha Patil', rank: 'Sub Inspector', designation: 'SI', email: 'sneha.patil@cisf.gov.in', phone: '+91-7766554433', status: 'Inactive' },
  { id: 6, name: 'Amit Kulkarni', rank: 'Inspector', designation: 'Inspector', email: 'amit.kulkarni@cisf.gov.in', phone: '+91-6655443322', status: 'Active' },
  { id: 7, name: 'Pooja Nair', rank: 'Assistant Sub Inspector', designation: 'ASI', email: 'pooja.nair@cisf.gov.in', phone: '+91-9988123456', status: 'Active' },
  { id: 8, name: 'Rohit Mishra', rank: 'Head Constable', designation: 'HC', email: 'rohit.mishra@cisf.gov.in', phone: '+91-8877665544', status: 'Inactive' },
  { id: 9, name: 'Meena Joshi', rank: 'Constable', designation: 'Constable', email: 'meena.joshi@cisf.gov.in', phone: '+91-7766443322', status: 'Active' },
  { id: 10, name: 'Sanjay Gupta', rank: 'Deputy Commandant', designation: 'DC', email: 'sanjay.gupta@cisf.gov.in', phone: '+91-6655332211', status: 'Active' },
];

export default function UsersPage() {
  const [search, setSearch] = useState<string>('');

  /* Counts */
  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter(u => u.status === 'Active').length;
  const inactiveUsers = MOCK_USERS.filter(u => u.status === 'Inactive').length;

  /* Filter */
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.rank.toLowerCase().includes(search.toLowerCase()) ||
      u.designation.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Officer Management
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        {/* Total Users */}
        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Users className="text-blue-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{totalUsers}</h3>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <UserCheck className="text-green-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{activeUsers}</h3>
            <p className="text-gray-500 text-sm">Active Users</p>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-xl">
            <UserX className="text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{inactiveUsers}</h3>
            <p className="text-gray-500 text-sm">Inactive Users</p>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="relative w-full mb-5">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search officers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u.id} className="border-t hover:bg-blue-50 transition">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.rank}</td>
                <td className="p-3">{u.designation}</td>
                <td className="p-3 text-blue-700">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    u.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}