import React, { useState } from 'react'
import Header from '../../components/Header';

const MainLayout = ({children}:React.PropsWithChildren) => {
    const [showMore, setShowMore] = useState(true); 
    return (
        <div className='flex flex-col w-full h-full' >
            {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Error rendering all informations from header</h1>
                </div>
            )}
            <Header/>  
            {children}
        </div>
    )
}

export default MainLayout