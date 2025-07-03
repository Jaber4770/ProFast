import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../shared/Loader/Loader';

const PendingRiders = () => {

    const [selectedRider, setSelectedRider] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pendingQuery'],
        queryFn: async() => {
            const res = await axiosSecure.get('/riders?status=pending');
            return res.data;
        }
    })

    if (isPending) {
        return <Loader></Loader>

    }

    const openModal = (rider) => {
        setSelectedRider(rider);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedRider(null);
    };

    const handleApprove = async (email) => {
        if (!selectedRider) return;
        setActionLoading(true);
        try {
            await axiosSecure.patch(`/riders/${selectedRider._id}`, { status: 'approved', email });

            Swal.fire({
                title: "Rider Approved!",
                text: `${selectedRider.name} has been approved successfully.`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            setModalOpen(false);
            refetch();

        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: `Failed to approve rider.`,
                icon: "error",
                confirmButtonColor: "#d33",
            });
        } finally {
            setActionLoading(false);
        }
    };


    const handleCancel = async () => {
        if (!selectedRider) return;
        setActionLoading(true);
        try {
            // ask admin first if he/she confirrm to delete
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Calcel the application!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // PATCH or POST to update rider status to 'cancelled' or 'rejected'
                    const res = await axiosSecure.patch(`/riders/${selectedRider._id}`, { status: 'cancelled' });

                    if (res) {
                        Swal.fire({
                            title: "Cancelled!",
                            text: "Your action has been save successfully.",
                            icon: "success"
                        });
                        setModalOpen(false);
                        refetch();
                    }
                }
            });

        } catch (error) {
            // alert('Failed to cancel rider application.', error);
            Swal.fire({
                title: "Error!",
                text: `Failed to approve rider.`,
                icon: "error",
                confirmButtonColor: "#d33",
            });
        } finally {
            setActionLoading(false);
        }
    };



    return (
        <div className="px-6 py-10 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Pending Riders</h1>
            {riders.length === 0 ? (
                <p className="text-gray-600">No pending riders found.</p>
            ) : (
                <table className="w-full table-auto border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Region</th>
                            <th className="border px-4 py-2">District</th>
                            <th className="border px-4 py-2">Contact</th>
                            <th className="border px-4 py-2">Applied At</th>
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
                                <td className="border px-4 py-2">{rider.contact}</td>
                                <td className="border px-4 py-2">{new Date(rider.appliedAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => openModal(rider)}
                                        className="px-3 py-1 bg-red-400 cursor-pointer text-white rounded"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
            {modalOpen && selectedRider && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center backdrop-blur-sm justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Rider Details</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Name:</strong> {selectedRider.name}</p>
                            <p><strong>Email:</strong> {selectedRider.email}</p>
                            <p><strong>Region:</strong> {selectedRider.region}</p>
                            <p><strong>District:</strong> {selectedRider.district}</p>
                            <p><strong>Contact:</strong> {selectedRider.contact}</p>
                            <p><strong>Age:</strong> {selectedRider.age}</p>
                            <p><strong>NID:</strong> {selectedRider.nid}</p>
                            <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
                            <p><strong>Bike Registration:</strong> {selectedRider.bikeRegistration}</p>
                            <p><strong>Applied At:</strong> {new Date(selectedRider.appliedAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span className='text-red-500'>{selectedRider.status}</span></p>
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                                Cancel Application
                            </button>
                            <button
                                onClick={() => handleApprove(selectedRider.email)}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Approve Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PendingRiders;
