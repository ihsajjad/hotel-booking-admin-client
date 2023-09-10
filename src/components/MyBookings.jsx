import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";

const MyBookings = () => {
  const { myBookings } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [booking, setBooking] = useState({});

  const handleOpenModal = (id) => {
    fetch(`http://localhost:5000/single-booking/${id}`)
      .then((res) => res.json())
      .then((data) => setBooking(data));
    setOpenModal(true);
  };

  console.log(myBookings);
  return (
    <div className="flex-1 overflow-x-hidden w-full">
      <h3 className="md:text-3xl text-xl text-center text-[var(--main-color)] font-bold md:mb-4 mb-2">
        Your Bookings
      </h3>

      <div className="overflow-x-scroll mx-2 mb-20 w-full">
        <table className="table table-zebra 	">
          {/* head */}
          <thead className="bg-blue-100">
            <tr className="md:text-2xl text-[var(--main-color)] text-center">
              <th>Guests</th>
              <th>Rooms</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myBookings &&
              myBookings?.map((booking) => (
                <tr key={booking.id} className="text-center">
                  <td>{booking.guestQuantity}</td>
                  <td>{booking.roomQuantity}</td>
                  <td className="flex gap-2">
                    <button
                      className={`${
                        booking.status === "pending"
                          ? "bg-orange-400"
                          : "bg-green-500"
                      } table-btn-layout`}
                    >
                      {booking.status === "pending" ? "Pending" : "Booked"}
                    </button>
                    {booking.status === "booked" && (
                      <button
                        onClick={() => handleOpenModal(booking.id)}
                        className="bg-[var(--main-color)] table-btn-layout"
                      >
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      <div
        className={`w-screen h-screen bg-slate-500 top-0 left-0 bg-opacity-50 flex items-center justify-center overflow-y-scroll ${
          openModal ? "fixed" : "hidden"
        }`}
      >
        <div className="md:w-1/3 mx-3 h-fit bg-white border-2 border-[var(--main-color)] p-5 rounded-lg  shadow-2xl shadow-black relative">
          {/* close modal btn */}
          <button onClick={() => setOpenModal(false)} className="modal-cls-btn">
            X
          </button>
          <div className="flex flex-col space-y-2 text-xl font-semibold">
            <div className="">
              Manager&apos;s Number : {booking?.bookedRoom?.managerPhone}
            </div>
            <div>
              <span>Your Rooms: </span>
              {booking.bookedRoom?.rooms?.map((item, i) => (
                <span
                  key={i}
                  className="bg-blue-500 text-white mx-1 text-xl font-bold rounded p-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
