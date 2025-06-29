import React from 'react';
import { Link } from 'react-router';
import { useForm } from "react-hook-form"
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser } = useAuth();

    const onSubmit = (data) => {
        console.log(data);
        createUser(data.email, data.password)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div>
            <h1 className='text-4xl font-bold'>Create an Account!</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <label className="label">Email</label>
                            <input
                                {...register('email', { required: true })}
                                type="email" className="input" placeholder="Email" />
                            {
                                errors.email?.type === "required" && <p className='text-red-500'>Email is required.</p>
                            }

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