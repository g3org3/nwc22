interface Props {
  //
}

const MatchSkeleton = (props: Props) => {
  return (
    <div
      className="animate-pulse flex flex-col p-4 bg-white gap-2 border my-2 shadow"
      style={{ width: '100%', height: '207px' }}
    >
      <div className="flex">
        <div className="flex flex-col items-center gap-2" style={{ width: '35%' }}>
          <div className="bg-slate-300" style={{ height: '60px', width: '60px' }}></div>
          <div className="text-center bg-slate-200 text-slate-200 rounded-full">props.match.AwayTeam</div>
        </div>
        <div className="flex flex-col gap-2" style={{ width: '30%' }}>
          <div className="flex flex-col items-center">
            <div>Group</div>
            <div>00:00 PM</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2" style={{ width: '35%' }}>
          <div className="bg-slate-300" style={{ height: '60px', width: '60px' }}></div>
          <div className="text-center bg-slate-200 text-slate-200 rounded-full">props.match.AwayTeam</div>
        </div>
      </div>
    </div>
  )
}

export default MatchSkeleton
