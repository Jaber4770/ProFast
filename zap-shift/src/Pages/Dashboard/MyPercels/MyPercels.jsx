import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { format } from "date-fns";
import Swal from 'sweetalert2'; // ✅ Import Swal

const MyPercels = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['my-percels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data;
        }
    });

    // console.log(parcels);

    const handleDelete = async (id) => {
        // console.log(id);
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/parcels/${id}`);
                // console.log("axios  res: ", res.data);
                if (res.data?.deletedCount) {
                    Swal.fire(
                        'Deleted!',
                        'Your parcel has been deleted.',
                        'success'
                    );
                    refetch();
                } else {
                    Swal.fire(
                        'Error!',
                        'Parcel not found or already deleted.',
                        'error'
                    );
                }

            } catch (err) {
                console.error(err);
                Swal.fire(
                    'Error!',
                    'Something went wrong while deleting.',
                    'error'
                );
            }
        }
    }

    const handleViewDetails = () => {
        console.log('view detils');
    }

    const handlePay = () => {
        console.log('pay');
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                    <tr>
                        <th>Index</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Created At</th>
                        <th>Cost</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {parcels.map((parcel, index) => {
                        const createdDate = new Date(parcel.createdAt); // Handles ISO format correctly
                        const formattedDate = format(createdDate, "dd MMM yyyy, hh:mm a");

                        return (
                            <tr key={parcel._id}>
                                <th>{index + 1}</th>
                                <th>{parcel.title}</th>
                                <td className="capitalize">
                                    {parcel.type === "document" ? "Document" : "Parcel"}
                                </td>
                                <td>{formattedDate}</td>
                                <td>{parcel.totalCost} Tk</td>
                                <td>
                                    <span
                                        className={`badge ${parcel.paymentStatus === "Paid" ? "badge-success" : "badge-error"
                                            } text-white`}
                                    >
                                        {parcel.paymentStatus}
                                    </span>
                                </td>
                                <td className="space-x-1">
                                    <button onClick={handleViewDetails} className="btn btn-sm btn-info text-white">View</button>
                                    {parcel.paymentStatus !== "Paid" && (
                                        <button onClick={handlePay} className="btn btn-sm btn-success text-white">Pay</button>
                                    )}
                                    <button onClick={() => handleDelete(parcel._id)} className="btn btn-sm btn-error text-white">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MyPercels;
