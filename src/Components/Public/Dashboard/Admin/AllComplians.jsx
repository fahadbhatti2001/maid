import React, { useState } from 'react'
import { Spinner } from '@/Components';

export const AllComplians = () => {

  let [spin, setSpin] = useState(false);

  return (
    <>
      <Spinner isBlinking={false} isSpinner={spin}></Spinner>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">Complains</h1>
        </div>
      </div>
    </>
  )
}
