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
  return (
    <div className="flex flex-col gap-4 p-2 container" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="text-3xl">Login</div>
      <input className="p-2" placeholder="id" />
      <button className={btn}>login</button>
    </div>
  )
}

export default Login
