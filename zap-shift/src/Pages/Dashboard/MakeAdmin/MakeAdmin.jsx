import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
import Loader from '../../shared/Loader/Loader';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🔍 Fetch users based on search text
    useEffect(() => {
        if (!searchText) {
            setUsers([]);
            return;
        }

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await axiosSecure.get(`/users/search?email=${searchText}`);
                setUsers(res.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        const delayDebounce = setTimeout(fetchUsers, 400); // debounce

        return () => clearTimeout(delayDebounce);
    }, [searchText, axiosSecure]);

    // 🔧 Role update mutation
    const { mutate: updateRole } = useMutation({
        mutationFn: async ({ id, role }) => {
            return await axiosSecure.patch(`/users/${id}/role`, { role });
        },
        onSuccess: (_, { role }) => {
            Swal.fire({
                icon: 'success',
                title: `User role updated to ${role}`,
                showConfirmButton: false,
                timer: 1500,
            });
            // Force refresh
            setSearchText(prev => prev + ' ');
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to update role',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });

    // 🔁 Handle role change with confirmation
    const handleRoleChange = (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';

        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${newRole === 'admin' ? 'make' : 'remove'} admin access for ${user.email}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${newRole === 'admin' ? 'make' : 'remove'} admin`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateRole({ id: user._id, role: newRole });
            }
        });
    };

    return (
        <div className='ps-5'>
            <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>

            {/* 🔍 Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by email..."
                    className="input input-bordered w-full max-w-md"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* 🌀 Loader */}
            {isLoading && <Loader />}

            {/* 👥 Users Table */}
            {!isLoading && users.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200 text-base font-semibold">
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-warning'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleRoleChange(user)}
                                            className={`btn btn-sm ${user.role === 'admin' ? 'btn-error' : 'btn-primary'}`}
                                        >
                                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ❌ No Users Found */}
            {!isLoading && searchText && users.length === 0 && (
                <div className="text-center text-gray-500 mt-4">No users found.</div>
            )}
        </div>
    );
};

export default MakeAdmin;
