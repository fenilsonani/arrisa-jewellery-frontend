import { BlogDetails } from '@/components/blog-details'
import axios from 'axios'
import React from 'react'

const page = ({ params }) => {

    console.log(params.id)

    return (
        <div>
            <BlogDetails data={params.id} />
        </div>
    )
}

export default page
