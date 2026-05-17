import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { getEventById } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import BookingModal from "../components/BookingModal";

/**
 * Event Detail Page
 */
export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data.event);
    } catch (err) {
      setError(err.message || "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    // Refresh event data to update attendees
    fetchEvent();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center px-4">
        <div className="glass-card backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => navigate("/events")}
            className="btn-glass-primary w-full"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const seatsAvailable = event.capacity - event.attendees;
  const occupancyPercentage = (
    (event.attendees / event.capacity) *
    100
  ).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/events")}
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Events</span>
        </button>

        {/* Event Card */}
        <div className="glass-card hover:glass-card-hover backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
          {/* Event Image */}
          <img
            src={
              event.image || "https://via.placeholder.com/800x400?text=Event"
            }
            alt={event.title}
            className="w-full h-96 object-cover"
          />

          {/* Event Details */}
          <div className="p-8">
            {/* Category */}
            <span className="inline-block glass-card backdrop-blur-sm border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg shadow-purple-500/20">
              {event.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {event.title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-8">{event.description}</p>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-purple-500/20">
              {/* Date & Time */}
              <div className="glass-card-interactive backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Calendar
                    className="text-purple-400 mt-1 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="text-lg font-semibold text-white">
                      {formattedDate} at {event.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="glass-card-interactive backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <MapPin
                    className="text-pink-400 mt-1 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-lg font-semibold text-white">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="glass-card-interactive backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Users
                    className="text-purple-400 mt-1 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <p className="text-gray-400 text-sm">Attendees</p>
                    <p className="text-lg font-semibold text-white">
                      {event.attendees}/{event.capacity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="glass-card-interactive backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <p className="text-gray-400 text-sm">Ticket Price</p>
                    <p className="text-lg font-semibold text-pink-400">
                      ₹{event.ticketPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Seats Availability</span>
                <span>{occupancyPercentage}% filled</span>
              </div>
              <div className="w-full bg-white/5 border border-purple-500/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all shadow-lg shadow-purple-500/50"
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {seatsAvailable} seats available
              </p>
            </div>

            {/* Organizer Info */}
            <div className="glass-card-interactive backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 mb-8">
              <p className="text-gray-400 text-sm">Organized by</p>
              <p className="font-semibold text-white">
                {event.organizerId?.name || "Unknown Organizer"}
              </p>
            </div>

            {/* Book Button */}
            {user && user.role === "user" && seatsAvailable > 0 ? (
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn-glass-primary w-full"
              >
                Book Tickets Now
              </button>
            ) : user && user.role === "user" ? (
              <button
                disabled
                className="w-full py-3 rounded-lg font-semibold text-lg bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed"
              >
                Event is Full
              </button>
            ) : !user ? (
              <button
                onClick={() => navigate("/login")}
                className="btn-glass-primary w-full"
              >
                Login to Book
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {event && (
        <BookingModal
          event={event}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
