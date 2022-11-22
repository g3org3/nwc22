'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  //
}

const btn = [
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-slate-400',
  'focus:ring-offset-2',
  'focus:ring-offset-slate-50',
  'text-white',
  'font-semibold',
  'h-10',
  'px-6',
  'rounded-lg',
  'w-full',
  'flex',
  'items-center',
  'justify-center',
  'sm:w-auto',
  'bg-sky-500',
  'highlight-white/20',
  'hover:bg-sky-400',
].join(' ')

const Login = (props: Props) => {
  const [name, setName] = useState('')
  const router = useRouter()

  const onLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    localStorage.setItem('login', name.toLocaleLowerCase().trim())
    router.push('/matches/tomorrow')
  }

  return (
    <form
      onSubmit={onLogin}
      className="flex flex-col gap-4 p-2 container"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <div className="text-3xl">Login</div>
      <input
        value={name}
        onChange={({ target: { value } }) => setName(value)}
        className="p-2"
        placeholder="name"
      />
      <button className={btn}>login</button>
    </form>
  )
}

export default Login
