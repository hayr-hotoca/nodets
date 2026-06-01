'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: any) => {
    if (data.username === 'admin' && data.password === 'admin') {
      login(data.username, 'admin');
      router.push('/');
    } else {
      setError('root', { 
        type: 'manual', 
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác' 
      });
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-white rounded-xl paper-shadow p-stack-lg border border-outline-variant">
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-headline-md text-primary">Đăng nhập</h1>
          <p className="text-on-surface-variant font-body-sm mt-2">Hệ thống Quản lý Vimes</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tên đăng nhập</label>
            <input
              {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
              className={`border-outline-variant rounded-lg font-body-md text-body-md p-3 focus:ring-secondary focus:border-secondary ${errors.username ? 'border-error' : ''}`}
              placeholder="admin"
              type="text"
            />
            {errors.username && (
              <span className="text-error text-[12px]">{errors.username.message as string}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Mật khẩu</label>
            <input
              {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
              className={`border-outline-variant rounded-lg font-body-md text-body-md p-3 focus:ring-secondary focus:border-secondary ${errors.password ? 'border-error' : ''}`}
              placeholder="••••••••"
              type="password"
            />
            {errors.password && (
              <span className="text-error text-[12px]">{errors.password.message as string}</span>
            )}
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 text-error rounded-lg text-center font-body-sm">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform mt-2"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
