import Booking from "./booking/Booking";
import "./booking/Booking.css";
import "./booking/BookingCoutureSkin.css";

/**
 * Mounts the booking-system module within the Couture layout.
 * The layout (CoutureHeader + CoutureFooter) is already provided
 * by CoutureLayout via the Outlet — no need to add them here.
 *
 * Couture-specific styling is applied via BookingCoutureSkin.css
 * which overrides the default Booking.css variables.
 */
export default function CoutureBookAppointment() {
  return (
    <div className="couture-booking-wrapper">
      <Booking />
    </div>
  );
}
