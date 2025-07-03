import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../shared/Loader/Loader';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments} = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payment-success?email=${user.email}`)
            return res.data;
        }
    })

    if (isPending) {
        return <Loader></Loader>;
    }


    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200 text-base font-semibold">
                        <tr>
                            <th>#</th>
                            <th>Transaction ID</th>
                            <th>Parcel ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.map((payment, index) => (
                            <tr key={payment._id}>
                                <td>{index + 1}</td>
                                <td className="font-mono text-sm text-blue-700">{payment.transactionId}</td>
                                <td className="font-mono text-sm text-gray-700">{payment.parcelId}</td>
                                <td>${payment.amount}</td>
                                <td>{payment.paymentMethod?.join(', ')}</td>
                                <td>{new Date(payment.paidAt).toLocaleString()}</td>
                                <td>
                                    <span className={`badge ${payment.status === "success" ? "badge-success" : "badge-error"} text-white`}>
                                        {payment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;