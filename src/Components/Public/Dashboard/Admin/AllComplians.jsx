import React, { useEffect, useState } from 'react';
import { db } from "@/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { UseUserAuth, Popup } from "@/Components"
import { useForm } from 'react-hook-form';


export const AllComplians = () => {

  let [data, setData] = useState([])
  let [isReport, setIsReport] = useState(false)

  const complainRef = collection(db, "Complains")

  const { user } = UseUserAuth();

  const getData = async () => {
    const complainData = await getDocs(complainRef)
    setData(complainData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  };

  useEffect(() => {
    getData();
  }, [])

  const { register, setValue, formState: { errors } } = useForm()

  const showReportDetail = (object) => {
    setValue("maidName", object.maidName)
    setValue("description", object.description)
    setIsReport(true)
  }

  return (
    <>
      <Popup
        title="Report Maid"
        open={isReport}
        width="md:w-1/2 w-11/12"
        close={() => setIsReport(false)}
      >
        <div className="flex flex-col gap-0">
          <div className="flex flex-col w-full">
            <label htmlFor="maidName" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Maid Name</label>
            <input disabled type="text" {...register("maidName", { required: true })} id="maidName" className={(errors.maidName ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="description" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Description</label>
            <textarea disabled type="text" {...register("description", { required: true })} id="description" className={(errors.description ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
          </div>
        </div>
      </Popup>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">Complains</h1>
        </div>
        <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
          <table className="text-white text-left w-full mt-4">
            <thead className="">
              <tr className="border-b-transparent text-sm text-zinc-600">
                <th className="bg-violet-300 p-4 w-20">Maid Name</th>
                <th className="bg-violet-300 p-4 text-ellipsis overflow-hidden w-80">Description</th>
                <th className="bg-violet-300 p-4 rounded-tr-md text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {
                data == undefined ? null : data.map((e, i) => (
                  <tr key={i} className="text-sm text-zinc-600 font-light hover:bg-violet-100 hover:text-zinc-700 whitespace-nowrap border-b border-b-violet-300">
                    <td className="p-4 w-20">{e.maidName}</td>
                    <td className="p-4 w-80">
                      <p className="text-ellipsis overflow-hidden w-80">
                        {e.description}
                      </p>
                    </td>
                    <td className="p-4 text-center w-20">
                      <button onClick={() => showReportDetail(e)} type="button" className="">
                        Show
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
