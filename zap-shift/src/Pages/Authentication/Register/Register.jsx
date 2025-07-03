import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from "react-hook-form"
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserPorfile } = useAuth();
    const location = useLocation();
    const from = location.state?.from || '/';
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState('');
    const axiosInstance = useAxios();

    const handleImageUpload = async (e) => {
        const ProfilePhoto = e.target.files[0];
        // console.log(ProfilePhoto);
        const formData = new FormData();
        formData.append('image', ProfilePhoto);

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgBB_key}`, formData);

        setProfilePic(res.data.data.display_url);

    }

    const onSubmit = (data) => {
        // console.log(data);
        createUser(data.email, data.password)
            .then(async () => {
                // console.log(res);
                // update user info in the db
                const userInfo = {
                    email: data.email,
                    role: 'user', //default role
                    createdAt: new Date().toISOString(),
                    lastLogIn: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('http://localhost:3000/users', userInfo);
                console.log(userRes.data);

                // update user info in the firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                }
                updateUserPorfile(userProfile)
                .then(() => {
                    console.log('profile pic upload done')
                })
                .catch(err => console.log(err))


        navigate(from);
    })
            .catch (err => console.log(err))
    }

return (
    <div>
        <h1 className='text-4xl font-bold'>Create an Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <fieldset className="fieldset">
                        {/* image */}
                        
                        <label className="label">Your Profile Photo</label>
                        <input
                            {...register('profilePhoto', { required: true })}
                            type="file"
                            onChange={handleImageUpload}
                            className="input"
                            placeholder="Your profile photo" />
                        {
                            errors.profilePhoto?.type === "required" && <p className='text-red-500'>Your Photo is required.</p>
                        }
                        {/* name */}
                        <label className="label">Your Name</label>
                        <input
                            {...register('name', { required: true })}
                            type="text" className="input" placeholder="Your Name" />
                        {
                            errors.name?.type === "required" && <p className='text-red-500'>Your name is required.</p>
                        }
                        {/* email */}
                        <label className="label">Email</label>
                        <input
                            {...register('email', { required: true })}
                            type="email" className="input" placeholder="Email" />
                        {
                            errors.email?.type === "required" && <p className='text-red-500'>Email is required.</p>
                        }
                        {/* password */}
                        <label className="label">Password</label>
                        <input
                            {...register('password', { required: true, minLength: 6 })}
                            type="password" className="input" placeholder="Password" />
                        {
                            errors.password?.type === "required" && <p className='text-red-500'>Password is required.</p>
                        }
                        {
                            errors.password?.type === "minLength" && <p className='text-red-500'>Password must be 6 character or longer.</p>
                        }
                        <button className="btn btn-neutral mt-4">Register</button>
                    </fieldset>
                    <p>Already have an account? <Link className='btn btn-link' to="/login">Login</Link></p>
                </div>
            </div>
        </form>
        <SocialLogin></SocialLogin>
    </div>
);
};

export default Register;