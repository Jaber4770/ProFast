import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Loader2 } from 'lucide-react';
import Loader from '../../shared/Loader/Loader';

const BlockedRiders = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Fetch blocked riders
    const {isPending ,data: riders = [] } = useQuery({
        queryKey: ['blockedRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders?status=blocked');
            return res.data;
        }
    });

    // Mutation to unblock rider
    const unblockMutation = useMutation({
        mutationFn: async (rider) => {
            return await axiosSecure.patch(`/riders/${rider._id}`, { status: 'approved' });
        },
        onSuccess: (data, rider) => {
            Swal.fire({
                title: 'Unblocked!',
                text: `${rider.name} is now approved.`,
                icon: 'success',
            });
            queryClient.invalidateQueries(['blockedRiders']);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to unblock rider.', 'error');
        }
    });

    const handleUnblock = (rider) => {
        unblockMutation.mutate(rider);
    };

    if (isPending) {
        return <Loader></Loader>;
    }


    return (
        <div className="px-6 py-10 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Blocked Riders</h1>
            <table className="w-full table-auto border-collapse text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Region</th>
                        <th className="border px-4 py-2">District</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {riders.map((rider) => (
                        <tr key={rider._id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{rider.name}</td>
                            <td className="border px-4 py-2">{rider.email}</td>
                            <td className="border px-4 py-2">{rider.region}</td>
                            <td className="border px-4 py-2">{rider.district}</td>
                            <td className="border px-4 py-2 text-red-600">{rider.status}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleUnblock(rider)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-green-600"
                                >
                                    Unblock Rider
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default BlockedRiders;
