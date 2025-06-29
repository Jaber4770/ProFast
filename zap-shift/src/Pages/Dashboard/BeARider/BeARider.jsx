import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const BeARider = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const serviceCenters = useLoaderData();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, reset } = useForm();

    const [districts, setDistricts] = useState([]);
    const selectedRegion = watch('region');

    // Extract unique regions
    const regions = Array.from(new Set(serviceCenters.map(center => center.region)));

    useEffect(() => {
        const filteredDistricts = serviceCenters
            .filter(center => center.region === selectedRegion)
            .map(center => center.district);

        const uniqueDistricts = Array.from(new Set(filteredDistricts));
        setDistricts(uniqueDistricts);
    }, [selectedRegion, serviceCenters]);

    const onSubmit = async (data) => {
        const riderData = {
            ...data,
            name: user?.displayName,
            email: user?.email,
            status: 'pending',
            appliedAt: new Date().toISOString()
        };

        try {
            const res = await axiosSecure.post('/riders', riderData);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application submitted successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
                reset();
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Submit failed:', error);
            alert('Something went wrong!');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 rounded-lg shadow-lg mb-10">
            <div className="mb-10 border-b-2 border-gray-400">
                <div className='w-1/2 py-5'>
                    <h1 className="text-4xl font-bold text-gray-800">Be a Rider</h1>
                    <p className="text-gray-600 mt-2">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center rounded-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Tell us about yourself</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={user?.displayName || ''}
                            readOnly
                            className="input bg-gray-100"
                        />
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="input bg-gray-100"
                        />

                        <input
                            type="number"
                            placeholder="Your Age"
                            {...register('age', { required: true })}
                            className="input"
                        />

                        <select {...register('region', { required: true })} className="input">
                            <option value="">Select Region</option>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>

                        <select {...register('district', { required: true })} className="input">
                            <option value="">Select District</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <input
                            type="text"
                            placeholder="Phone Number"
                            {...register('contact', { required: true })}
                            className="input"
                        />

                        <input
                            type="text"
                            placeholder="NID Number"
                            {...register('nid', { required: true })}
                            className="input"
                        />

                        <input
                            type="text"
                            placeholder="Bike Brand"
                            {...register('bikeBrand', { required: true })}
                            className="input"
                        />

                        <input
                            type="text"
                            placeholder="Bike Registration Number"
                            {...register('bikeRegistration', { required: true })}
                            className="input"
                        />
                    </div>

                    <button type="submit" className="w-full bg-lime-400 hover:bg-lime-500 text-white py-2 rounded">
                        Submit
                    </button>
                </form>

                <div className="flex justify-center">
                    <img
                        src="https://i.ibb.co/vxJVHPFB/agent-pending.png"
                        alt="Rider"
                        className="w-3/4 md:w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default BeARider;
