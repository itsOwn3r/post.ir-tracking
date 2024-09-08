
export default function Home() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center min-h-[90dvh]">
      <h1 className="text-4xl">Api Route Only</h1>
      <div className="flex flex-col text-center md:text-start mt-2">
        <h3 className="text-2xl mt-4"><span className="bg-slate-600 hover:bg-slate-500 cursor-pointer p-1 rounded-md">/api/post/?code=24CharacterCodeHere</span> for seeing the updates and set cron job</h3>
        <h3 className="text-2xl mt-4"><span className="bg-yellow-700 hover:bg-yellow-600 cursor-pointer p-1 rounded-md">/api/post/set/?code=24CharacterCodeHere</span> for seting a tracking code</h3>
      </div>

    </div>
  );
}
