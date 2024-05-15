import Image from 'next/image';

export default function Loading() {
  return (
    <>
      <main>
        <div className='className="fixed h-full laptop:w-[225px] w-full shadow-md border-r-2 border-gray-100'>
          <aside className="flex flex-col h-[99vh] justify-between">
            <div>
              <div className="overflow-hidden w-full h-52 laptop:w-[223px] laptop:h-[129px]">
                <Image
                  src="/health-check-in.png"
                  alt="health check in logo"
                  width={1024}
                  height={1024}
                  className="object-cover object-[center_49%] w-full h-full transform laptop:scale-[1.75] sm:scale-[1] scale-[1.25]"
                  priority={true}
                />
              </div>
              <div className="block text-black animate-pulse laptop:mt-0 mt-10">
                <div className="flex p-4">
                  <div className="rounded-full bg-slate-700 h-10 w-10 mt-1"></div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3 w-full">
                    <div className="grid grid-cols-3 gap-4 p-2">
                      <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                    </div>
                  </div>
                </div>
                <div className="flex p-4">
                  <div className="rounded-full bg-slate-700 h-10 w-10 mt-1"></div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3 w-full">
                    <div className="grid grid-cols-3 gap-4 p-2">
                      <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                    </div>
                  </div>
                </div>
                <div className="flex p-4 laptop:hidden">
                  <div className="rounded-full bg-slate-700 h-10 w-10 mt-1"></div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="space-y-3 w-full">
                    <div className="grid grid-cols-3 gap-4 p-2">
                      <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                      <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center animate-pulse">
              <div className="laptop:w-44 w-[80%] h-14 m-2 bg-slate-300 rounded-md"></div>
              <div className="laptop:w-44 w-[80%] h-14 m-2 bg-slate-700 rounded-md laptop:mb-0 mb-20"></div>

              <div className="flex w-full h-[62px] items-center justify-between p-2 shadow-md border-t-[1px] border-gray-100">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 p-2">
                    <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-9"></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="laptop:block hidden fixed left-[225px] top-0 right-0 bg-[#F6F8FA] min-h-screen border shadow rounded-md p-4">
          <header className="animate-pulse h-[88px] w-full relative pl-8 pr-8 flex justify-between items-center">
            <div className="">
              <div className="h-10 w-80 bg-slate-700 rounded"></div>
            </div>
            <div className="flex">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            </div>
            <div className="absolute left-8 right-8 top-[100%] h-1 shadow-black border-b-2 border-gray-200"></div>
          </header>

          <div className="h-auto w-auto mt-14 animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
