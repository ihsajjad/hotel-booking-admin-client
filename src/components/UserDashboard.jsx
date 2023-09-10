import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import "react-phone-number-input/style.css";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import MyBookings from "./MyBookings";
import { Store } from "react-notifications-component";

const UserDashboard = () => {
  const { user, userData, myBookings, refetchMybookings } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

    // adding new booking to the database
    fetch("http://localhost:5000/add-booking", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          Store.addNotification({
            title: "Sent the booking request",
            message: "Manager will send you the room info.",
            type: "success",
            insert: "top",
            isMobile: true,
            breakpoint: "768px",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });

          setPhoneNumber("");
          form.reset();
          refetchMybookings();
        }
      });
  };

  return (
    <div className="w-full h-full md:px-10 p-2 ">
      <h3 className="md:text-4xl text-2xl text-center text-[var(--main-color)] font-bold md:my-8 mb-5">
        User Dashboard
      </h3>
      <div className="flex md:flex-row flex-col items-start justify-center gap-10">
        {/* booking form container */}
        <div className="flex-1 md:p-0 p-2 flex justify-center w-full">
          <div
            className={`${
              myBookings.length < 1 ? "lg:w-1/3" : "lg:w-3/4"
            }  w-fit  bg-white border-2 border-[var(--main-color)] px-5 py-3 rounded-lg shadow-2xl shadow-[#887b7b] md:mb-20 mb-5`}
          >
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

        {myBookings.length > 0 && <MyBookings />}
      </div>
    </div>
  );
};

export default UserDashboard;
