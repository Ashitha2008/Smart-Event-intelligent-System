import React, { useState } from "react";
import { X } from "lucide-react";
import { createBooking } from "../services/bookingService";

/**
 * Booking Modal Component
 */
export default function BookingModal({ event, isOpen, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const seatsAvailable = event.capacity - event.attendees;
  const totalPrice = event.ticketPrice * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createBooking({
        eventId: event._id,
        quantity: parseInt(quantity),
      });

      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card backdrop-blur-2xl border border-purple-500/40 rounded-2xl max-w-md w-full shadow-2xl shadow-purple-500/30">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Book Tickets
          </h2>
          <button
            onClick={handleClose}
            className="text-purple-400 hover:text-purple-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Event Title */}
          <div>
            <p className="text-sm text-gray-400">Event</p>
            <p className="font-semibold text-white">{event.title}</p>
          </div>

          {/* Ticket Price */}
          <div>
            <p className="text-sm text-gray-400">Price per Ticket</p>
            <p className="font-semibold text-purple-400">
              ₹{event.ticketPrice}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              Number of Tickets
            </label>
            <input
              type="number"
              min="1"
              max={seatsAvailable}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="glass-input w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Available seats: {seatsAvailable}
            </p>
          </div>

          {/* Total Price */}
          <div className="glass-card-interactive backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Price:</span>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-glass-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || seatsAvailable === 0}
              className="btn-glass-primary flex-1"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
