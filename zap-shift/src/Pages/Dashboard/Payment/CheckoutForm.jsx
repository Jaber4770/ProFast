import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState();
    const { parcelId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { isPending, data: parcelInfo = {}} = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    if (isPending) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    // console.log(parcelInfo);
    const amount = parcelInfo.totalCost;
    const amountInCents = amount * 100;
    // console.log(amountInCents);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        // get card info
        const card = elements.getElement(CardElement);
        if (!card) {
            return;
        }

        // step-1: validate the card
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            // console.log("payment error: ", error.message);
            setError(error);
        } else {
            console.log('payment Method', paymentMethod);
            setError('');

            // step-2: create payment intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId
            })
            // console.log('res from intent',res);

            // step-3: Confirm the payment on the client
            const result = await stripe.confirmCardPayment(res?.data?.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user?.displayName,
                        email: user?.email,
                    },
                },
            });
            if (result.error) {
                setError(result.error.message);
                // console.log(result);
            } else {
                // Payment successful
                setError('');
                // step-4: mark parcel paid also create payment history
                try {
                    if (result.paymentIntent.status === 'succeeded') {
                        console.log('Payment successful!');
                        const paymentData = {
                            parcelId,
                            email: user.email,
                            amount,
                            transactionId: result.paymentIntent.id,
                            paymentMethod: result.paymentIntent.payment_method_types,
                        }
                        const paymentRes = await axiosSecure.post('/payment-success', paymentData);

                        if (paymentRes.data.insertedId) {
                            // console.log("payment done");
                            await Swal.fire({
                                icon: 'success',
                                title: "Payment Successful!",
                                html: `<strong>Transaction ID: </strong> <code>${result.paymentIntent.id}</code>`,
                                confirmButtonText: "Go to My Parceels",
                            });

                            // redirect ot parcel pagee
                            navigate('/dashboard/myParcels');
                        }
                    }
                } catch (error) {
                    console.log("error during payment inserted to db: ", error);
                }
                
            }
        }



    }


    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto my-5'>
                <CardElement className='py-2'>
                </CardElement>
                <button
                    className='btn bg-[]'
                    type="submit"
                    disabled={!stripe}>
                    Pay ${amount}
                </button>
                {error ? <span className='text-red-500 block'>{error.message}</span> : ''}
            </form>
        </div>
    );
};

export default CheckoutForm;