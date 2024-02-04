import React from 'react'

const Pill = ({img,name,onClick}) => {
  return (
      <div className='w-fit mr-2 mb-1 py-0.5 px-2 rounded-xl bg-black text-white flex justify-center items-center'>
        <img className='w-6 h-6 mr-1 rounded-full border-rose-100 border-1' src={img} alt={name} />
        <span className='text-white'>{name}</span>
        <span onClick={onClick} className='ml-2 px-1 cursor-pointer text-xs bg-black rounded-full'>x</span>
      </div>
  )
}

export default Pill