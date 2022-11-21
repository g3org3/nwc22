import Link from 'next/link'

const MatchLayout = async ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between p-2">
        <Link style={{ width: '24%' }} className="text-center bg-white p-1" href="/matches/past">
          <button>past</button>
        </Link>
        <Link style={{ width: '24%' }} className="text-center bg-white p-1" href="/matches/today">
          <button>today</button>
        </Link>
        <Link style={{ width: '24%' }} className="text-center bg-white p-1" href="/matches/tomorrow">
          <button>tomorrow</button>
        </Link>
        <Link style={{ width: '24%' }} className="text-center bg-white p-1" href="/matches/next">
          <button>next</button>
        </Link>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export default MatchLayout
