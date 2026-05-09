import { useState } from 'react'
 
const MyDeals = () => {
    const [ticketType, setTicketType] = useState('sell')
 
    return (
        <div className="flex w-full justify-center items-center">
          <h1>My Deals</h1>
        </div>
    )
}
 
export default MyDeals;
