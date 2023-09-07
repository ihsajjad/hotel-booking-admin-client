import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import "react-phone-number-input/style.css";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

const UserDashboard = () => {
  const { user, userData } = useContext(AuthContext);
  const [myBookings, setMyBookings] = useState([]);
  const [booking, setBooking] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const loadMyBookings = (email) => {
      if (email) {
        fetch(`http://localhost:5000/my-bookings/${email}`)
          .then((res) => res.json())
          .then((data) => setMyBookings(data));
      }
    };

    loadMyBookings(user?.email);
  }, [user?.email]);

  const handleAddBooking = (event) => {
    event.preventDefault();
    setError("");
    const form = event.target;

    const internationalNumber = formatPhoneNumberIntl(phoneNumber);
    const guestPhone = internationalNumber;
    const guestQuantity = parseInt(form.guestQuantity.value);
    const roomQuantity = parseInt(form.roomQuantity.value);

    const isValidNumber = isValidPhoneNumber(guestPhone);

    const requiredRoom = Math.ceil(guestQuantity / 3);

    // validating booking data
    if (!isValidNumber) {
      return setError("Please input a valid number");
    } else if (isNaN(guestQuantity)) {
      return setError("Invalid guest quantity");
    } else if (isNaN(roomQuantity)) {
      return setError("Invalid room quantity");
    } else if (requiredRoom > roomQuantity) {
      return setError(`You have to book at least ${requiredRoom} rooms`);
    }

    const newBooking = {
      guestName: userData?.name,
      guestEmail: user?.email,
      guestPhone,
      guestQuantity,
      roomQuantity,
      status: "pending",
      bookedRoom: {},
    };

    console.log(newBooking);

    // adding new booking to the database
    fetch("http://localhost:5000/add-booking", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setPhoneNumber("");
          form.reset();
        }
      });
  };

  const handleOpenModal = (id) => {
    fetch(`http://localhost:5000/single-booking/${id}`)
      .then((res) => res.json())
      .then((data) => setBooking(data));
    setOpenModal(true);
  };

  return (
    <div className="w-full h-full md:px-10 p-2 ">
      <h3 className="md:text-4xl text-2xl text-center text-[var(--main-color)] font-bold md:my-8 mb-5">
        User Dashboard
      </h3>
      <div className="flex md:flex-row flex-col items-start justify-center gap-10">
        {/* booking form container */}
        <div className="flex-1 md:p-0 p-2 flex justify-center w-full">
          <div className="lg:w-3/4 w-fit  bg-white border-2 border-[var(--main-color)] px-5 py-3 rounded-lg shadow-2xl shadow-[#887b7b] md:mb-20 mb-5">
            <h3 className="form-title">Book Hotel</h3>
            <form onSubmit={handleAddBooking} className="flex flex-col gap-1">
              <div>
                <label className="md:text-xl">Your Phone : </label>
                <PhoneInput
                  placeholder="Enter phone number"
                  name="phone"
                  defaultCountry="MY"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  className="form-input sokina"
                />
              </div>
              <div>
                <label className="md:text-xl">Guset Quantity : </label>
                <input
                  type="number"
                  placeholder="Number of guests"
                  name="guestQuantity"
                  min={1}
                  className="form-input"
                />
              </div>
              <div>
                <label className="md:text-xl">Room Quantity : </label>
                <input
                  type="number"
                  name="roomQuantity"
                  placeholder="Needed rooms"
                  min={1}
                  className="form-input"
                />
              </div>
              <span className="text-red-500">{error}</span>
              <input
                type="submit"
                value="Book"
                className="custom-btn-outline w-full md:mt-2 "
              />
            </form>
          </div>
        </div>

        {myBookings.length > 0 && (
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
                            {booking.status === "pending"
                              ? "Pending"
                              : "Booked"}
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
          </div>
        )}
      </div>
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

export default UserDashboard;
