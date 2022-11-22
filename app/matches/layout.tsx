import Link from 'next/link'

const MatchLayout = async ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex justify-between py-2">
        <Link style={{ width: '32%' }} className="text-center bg-white p-2 shadow" href="/matches/past">
          <button>past</button>
        </Link>
        <Link style={{ width: '32%' }} className="text-center bg-white p-2 shadow" href="/matches/today">
          <button>today</button>
        </Link>
        <Link style={{ width: '32%' }} className="text-center bg-white p-2 shadow" href="/matches/tomorrow">
          <button>tomorrow</button>
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  )
}

export default MatchLayout