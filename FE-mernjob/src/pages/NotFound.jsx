import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <>
    <div className="notfound">
      <div className="content">
        <h1>404 Not Found</h1>
        <p>Your visited page not found. You may ho to home page</p>
        <Link to={"/"} className='btn'> Back to home Page </Link>
      </div>
    </div>
    </>
  )
}

export default NotFound