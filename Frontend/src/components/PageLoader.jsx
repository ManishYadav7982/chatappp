import React from 'react'
import { LoaderIcon } from "lucide-react";

const pageLoader = () => {
    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <LoaderIcon className="animate-spin" />
        </div>

    )
}

export default pageLoader
