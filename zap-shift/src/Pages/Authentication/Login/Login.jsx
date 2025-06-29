import React from 'react';
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';


const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    const { signInUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = data => {
        console.log(data);
        signInUser(data.email, data.password)
            .then(res => {
                // console.log(res);
                navigate(from);
            })
            .catch(err => console.log(err))
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
                    </div>
                </div>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Login;