import React from 'react';
import { useForm } from "react-hook-form"
import { Link } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';


const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = data => {
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={(handleSubmit(onSubmit))}>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <h1 className='text-4xl font-bold'>Login</h1>
                        <fieldset className="fieldset">
                            <label className="label">Email</label>
                            <input type="email" {...register('email')} className="input" placeholder="Email" />

                            <label className="label">Password</label>
                            <input type="password" {...register('password',
                                { required: true, minLength: 6 })}
                                className="input" placeholder="Password" />
                            {
                                errors.password?.type === "required" && <p className='text-red-500'>password is required</p>
                            }
                            {
                                errors.password?.type === "minLength" && <p className='text-red-500'>password must be at least 6 character.</p>
                            }

                            <div><a className="link link-hover">Forgot password?</a></div>


                        </fieldset>
                        <button className="btn btn-neutral mt-4">Login</button>
                        <p>New to ProFast? <Link className='btn btn-link' to="/register">Register</Link></p>
                        <SocialLogin></SocialLogin>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default Login;