import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ApprovedRiders = () => {
    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['approvedRider'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders?status=approved'); // ✅ Only approved
            return res.data;
        }
    });

    const handleBlock = async (rider) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to unblock within 24h!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Block rider!"
            }).then(async(result) => {
                if (result.isConfirmed) {
                    // send req to server to block rider
                    const res = await axiosSecure.patch(`/riders/${rider._id}`, { status: 'blocked' });
                    if (res) {
                        Swal.fire({
                            title: "Blocked!",
                            text: `${rider.name} has been ${res.data.message}.`,
                            icon: "warning",
                            confirmButtonColor: "#d33"
                        });
                        refetch();
                    }
                }
            });
            
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Failed to block rider.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    };

    if (isPending) {
        return <span className="loading loading-spinner loading-xl"></span>;
    }

    return (
        <div className="px-6 py-10 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Approved Riders</h1>
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
                    {riders.map(rider => (
                        <tr key={rider._id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{rider.name}</td>
                            <td className="border px-4 py-2">{rider.email}</td>
                            <td className="border px-4 py-2">{rider.region}</td>
                            <td className="border px-4 py-2">{rider.district}</td>
                            <td className="border px-4 py-2 text-green-600">{rider.status}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleBlock(rider)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Block Rider
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedRiders;
