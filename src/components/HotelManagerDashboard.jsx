import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Store } from "react-notifications-component";
import CreateableSelect from "react-select/creatable";

const HotelManagerDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [singleBooking, setSingleBooking] = useState({});
  const [selectedOption, setSelectedOption] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  // loading single booking based on id
  const handleModal = (id) => {
    fetch(`http://localhost:5000/single-booking/${id}`)
      .then((res) => res.json())
      .then((data) => setSingleBooking(data));
    setOpenModal(true);
    setBookingId(id);
  };

  // loading all bookings
  const { refetch, data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/all-bookings");
      const data = await res.json();
      return data;
    },
  });

  // handling confirm bookin and updating the booking status to the database
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError("");
    const managerPhone = e.target?.managerPhone?.value;
    const roomQuantity = parseInt(
      document.getElementById("roomQuantity").innerHTML
    );

    const rooms = [];
    selectedOption.map((item) => rooms.push(item.value));

    // validating room info before sending to the database
    if (managerPhone?.length < 10 || managerPhone?.length > 10) {
      return setError("Invalid Number");
    } else if (rooms.length < 1) {
      return setError("Select at least one room");
    } else if (rooms.length !== roomQuantity) {
      return setError(
        `${roomQuantity} ${roomQuantity > 1 ? "Rooms" : "Room"} needed`
      );
    }
    fetch(`http://localhost:5000/update-single-booking/${bookingId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        bookedRoom: { managerPhone, rooms },
        status: "booked",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.error) {
          Store.addNotification({
            title: "Accepeted booking",
            message: "Sent the room info the guest.",
            type: "success",
            insert: "top",
            isMobile: true,
            breakpoint: "668px",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
          refetch();
          e.target.reset();
          setOpenModal(false);
          setSelectedOption([]);
        }
      });
  };

  return (
    <div className="w-full">
      <h3 className="md:text-4xl text-2xl text-center text-[var(--main-color)] font-bold md:my-8 my-5">
        Manager Dashboard
      </h3>
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra mb-20 w-full">
          {/* head */}
          <thead className="bg-blue-100">
            <tr className="md:text-2xl text-[var(--main-color)] text-center">
              <th>SL</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Guest Quantity</th>
              <th>Room Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings &&
              bookings?.map((booking, i) => (
                <tr key={booking.id} className="text-center">
                  <th>{i + 1}</th>
                  <td>{booking.guestName}</td>
                  <td>{booking.guestEmail}</td>
                  <td>{booking.guestPhone}</td>
                  <td>{booking.guestQuantity}</td>
                  <td>
                    {booking.status === "pending"
                      ? booking.roomQuantity
                      : booking.bookedRoom?.rooms?.map((item, i) => (
                          <span
                            key={i}
                            className="inline-block bg-green-500 text-white mx-1 text-xl font-bold rounded p-1"
                          >
                            {item}
                          </span>
                        ))}
                  </td>
                  <td>
                    <button
                      disabled={booking.status === "booked"}
                      onClick={() => handleModal(booking.id)}
                      className={`${
                        booking.status === "pending"
                          ? "bg-orange-400"
                          : "bg-green-500"
                      } table-btn-layout`}
                    >
                      {booking.status === "pending" ? "Accept" : "Accepted"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* modal */}
      <div
        className={`w-screen p-2 mt-8 min-h-screen overflow-y-scroll bg-slate-500 top-0 left-0 bg-opacity-40 flex items-center justify-center fixed overflow-scroll ${
          openModal ? "block" : "hidden"
        }`}
      >
        <div className="md:w-1/3 mx-2 my-8 h-fit bg-white border-2 border-[var(--main-color)] p-5 rounded-lg  shadow-2xl shadow-black relative">
          {/* close modal btn */}
          <button onClick={() => setOpenModal(false)} className="modal-cls-btn">
            X
          </button>
          <h3 className="text-3xl text-center text-[var(--main-color)] font-bold mb-4">
            Confirm Booking
          </h3>
          <form onSubmit={handleConfirmBooking} className="flex flex-col gap-1">
            <div>
              <label className="md:text-xl">Guest Name : </label>
              <span className="form-input block">
                {singleBooking.guestName}
              </span>
            </div>
            <div>
              <label className="md:text-xl">Guest Number : </label>
              <span className="form-input block">
                {singleBooking.guestPhone}
              </span>
            </div>
            <div>
              <label className="md:text-xl">Guest Email : </label>
              <span className="form-input block">
                {singleBooking.guestEmail}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <label className="md:text-xl">Guest Quantity : </label>

                <span className="form-input block">
                  {singleBooking.guestQuantity}
                </span>
              </div>
              <div className="flex-1">
                <label className="md:text-xl">Room Needed: </label>
                <span id="roomQuantity" className="form-input block">
                  {singleBooking.roomQuantity}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className=" w-1/2">
                <label className="md:text-xl">Manager&apos;s Number: </label>
                <input type="tel" name="managerPhone" className="form-input" />
              </div>
              <div className=" w-1/2">
                <label className="md:text-xl">Room Number : </label>
                <CreateableSelect
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  name="rooms"
                  className="border-0 outline-none w-full"
                  isMulti
                />
              </div>
            </div>
            <span className="text-red-500">{error}</span>
            <input
              type="submit"
              value="Confirm"
              className="custom-btn-outline w-full"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelManagerDashboard;
