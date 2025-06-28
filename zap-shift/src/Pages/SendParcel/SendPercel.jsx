import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const SendPercel = () => {
    const [senderRegion, setSenderRegion] = useState('');
    const [receiverRegion, setReceiverRegion] = useState('');
    const locations = useLoaderData();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const generateTrackingId = () => {
        const timestamp = Date.now().toString(36);
        const randomNum = Math.floor(Math.random() * 10000).toString(36);
        return `zapshif-${timestamp}${randomNum}`;
    };
      


    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const watchType = watch('type');

    const getCostBreakdown = (data) => {
        const isSameCity = data.senderServiceCenter === data.receiverServiceCenter;
        const type = data.type;
        const weight = parseFloat(data.weight || 0);

        let subtotal = 0;

        if (type === 'document') {
            subtotal = isSameCity ? 60 : 80;
        } else if (type === 'non-document') {
            if (weight <= 3) {
                subtotal = isSameCity ? 110 : 150;
            } else {
                const extraWeight = weight - 3;
                subtotal = isSameCity
                    ? 110 + extraWeight * 40
                    : 150 + extraWeight * 40 + 40;
            }
        }

        const vat = Math.round(subtotal * 0.15); // 15% VAT
        const deliveryFee = 0; // Already included in subtotal based on your logic
        const total = subtotal + vat + deliveryFee;

        return { subtotal, vat, deliveryFee, total };
    };
    
    

    const onSubmit = (data) => {
        const costBreakdown = getCostBreakdown(data);
          
        Swal.fire({
            title: '<span style="font-size: 24px; font-weight: 600;">Confirm Delivery</span>',
            html: `
              <div style="text-align: left; font-size: 16px; line-height: 1.6; padding: 10px;">
                  <p><strong>📦 Parcel Type:</strong> ${data.type === 'document' ? 'Document' : 'Non-Document'}</p>
                  ${data.type === 'non-document' ? `<p><strong>⚖️ Weight:</strong> ${data.weight} kg</p>` : ''}
                  <p><strong>🏢 From:</strong> ${data.senderServiceCenter}</p>
                  <p><strong>🏠 To:</strong> ${data.receiverServiceCenter}</p>
          
                  <hr style="margin: 12px 0; border-color: #ccc;" />
          
                  <div style="font-size: 15px;">
                      <p><strong>💼 Subtotal:</strong> ৳${costBreakdown.subtotal}</p>
                      <p><strong>🧾 VAT (15%):</strong> ৳${costBreakdown.vat}</p>
                  
                      <p style="font-size: 17px; margin-top: 10px;"><strong>💰 Total:</strong> <span style="color: #28a745;">৳${costBreakdown.total}</span></p>
                  </div>
              </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: '✅ Proceed to Payment',
            cancelButtonText: '✏️ Continue Editing',
            confirmButtonColor: '#A1DC4E',
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
                const parcelData = {
                    ...data,
                    userEmail: user?.email,
                    createdAt: new Date().toISOString(),
                    deliveryStatus: 'Not Collected',
                    paymentStatus: 'UnPaid',
                    trackingId: generateTrackingId(),       // ✅ tracking ID
                    totalCost: `${costBreakdown.total}`, // ✅ fixed line
                };                

                // console.log('Saving parcel:', parcelData);

                axiosSecure.post('/parcels', parcelData)
                    .then(res => {
                        // console.log(res.data)
                        // todo: redirect to payment page
                        if (res.data.insertedId) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Redirecting!',
                                text: 'Proceeding to payment gateway.',
                                timer: 1500,
                                showConfirmButton: false,
                            });
                        }
                    })

                reset();
            }
        });
        
    };

    return (
        <div className="shadow-lg p-5 my-10 rounded-2xl">
            <h1 className="text-5xl font-bold mb-2 pb-5 border-b-2 border-gray-400">Add Parcel</h1>
            {/* <Toaster /> */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Parcel Info */}
                <div className="rounded-box">
                    <h2 className="text-xl font-semibold mb-4 py-4">Enter your parcel details</h2>

                    <div className="form-control mb-4">
                        <div className="flex gap-4 mb-10">
                            <label className="flex items-center gap-2">
                                <input type="radio" value="document" {...register('type', { required: true })} className="radio text-green-500" />
                                Document
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" value="non-document" {...register('type', { required: true })} className="radio text-green-500" />
                                Non-Document
                            </label>
                        </div>
                        {errors.type && <p className="text-red-500 text-sm">Type is required</p>}
                    </div>

                    <div className='flex gap-10'>
                        <div className="form-control mb-4 flex-1">
                            <div className='flex flex-col'>
                                <label className="label">Parcel Title</label>
                                <input type="text" placeholder="Parcel title" className="input input-bordered w-full"
                                    {...register('title', { required: true })} />
                                {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                            </div>
                        </div>

                        {watchType === 'non-document' && (
                            <div className="form-control flex-1">
                                <div className='flex flex-col'>
                                    <label className="label">Weight (kg)</label>
                                    <input type="number" step="0.1" placeholder="Weight in kg" className="input input-bordered w-full"
                                        {...register('weight')} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender & Receiver Info */}
                <div className="lg:flex gap-6">
                    {/* Sender Info */}
                    <div className="flex-1 rounded-box">
                        <h2 className="text-xl font-semibold mb-4">Sender Information</h2>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Sender Name</label>
                                <input type="text" placeholder="Sender name" className="input input-bordered"
                                    {...register('senderName', { required: true })} />
                            </div>

                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Sender Contact</label>
                                <input type="text" placeholder="Contact number" className="input input-bordered"
                                    {...register('senderContact', { required: true })} />
                            </div>

                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Select Region</label>
                                <select
                                    className="select select-bordered"
                                    {...register("senderRegion", { required: true })}
                                    onChange={(e) => setSenderRegion(e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Region</option>
                                    {[...new Set(locations.map(loc => loc.region))].map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Select Service Center</label>
                                <select
                                    className="select select-bordered"
                                    {...register("senderServiceCenter", { required: true })}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Service Center</option>
                                    {locations
                                        .filter(loc => loc.region === senderRegion)
                                        .map(loc => (
                                            <option key={loc.city} value={loc.city}>{loc.city}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-control mb-3 flex flex-col">
                            <label className="label">Address</label>
                            <textarea placeholder="Pickup address" className="textarea textarea-bordered w-full"
                                {...register('senderAddress', { required: true })}></textarea>
                        </div>

                        <div className="form-control flex flex-col">
                            <label className="label">Pickup Instructions</label>
                            <input type="text" placeholder="Pickup instructions" className="input input-bordered w-full"
                                {...register('pickupInstruction', { required: true })} />
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="flex-1 rounded-box mt-6 lg:mt-0">
                        <h2 className="text-xl font-semibold mb-4">Receiver Information</h2>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Receiver Name</label>
                                <input type="text" placeholder="Receiver name" className="input input-bordered"
                                    {...register('receiverName', { required: true })} />
                            </div>

                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Receiver Contact</label>
                                <input type="text" placeholder="Contact number" className="input input-bordered"
                                    {...register('receiverContact', { required: true })} />
                            </div>

                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Select Region</label>
                                <select
                                    className="select select-bordered"
                                    {...register("receiverRegion", { required: true })}
                                    onChange={(e) => setReceiverRegion(e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Region</option>
                                    {[...new Set(locations.map(loc => loc.region))].map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control mb-3 flex flex-col">
                                <label className="label">Select Service Center</label>
                                <select
                                    className="select select-bordered"
                                    {...register("receiverServiceCenter", { required: true })}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Service Center</option>
                                    {locations
                                        .filter(loc => loc.region === receiverRegion)
                                        .map(loc => (
                                            <option key={loc.city} value={loc.city}>{loc.city}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-control mb-3 flex flex-col">
                            <label className="label">Address</label>
                            <textarea placeholder="Delivery address" className="textarea textarea-bordered w-full"
                                {...register('receiverAddress', { required: true })}></textarea>
                        </div>

                        <div className="form-control flex flex-col">
                            <label className="label">Delivery Instructions</label>
                            <input type="text" placeholder="Delivery instructions" className="input input-bordered w-full"
                                {...register('deliveryInstruction', { required: true })} />
                        </div>
                    </div>
                </div>
                <p className='my-10'>* PickUp Time 4pm-7pm Approx.</p>
                <button type="submit" className="btn rounded-lg bg-[#CAEB66] px-20 mt-4">Proceed to Confirm Booking</button>
            </form>
        </div>
    );
};

export default SendPercel;
