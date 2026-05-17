import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Zap } from "lucide-react";

/**
 * Event Card Component - Professional Modern Design
 */
export default function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const seatsAvailable = Math.max(0, event.capacity - event.attendees);
  const occupancyPercentage = (
    (event.attendees / event.capacity) *
    100
  ).toFixed(0);

  const categoryColors = {
    Technology: "from-blue-500 to-cyan-500",
    Business: "from-purple-500 to-pink-500",
    Entertainment: "from-pink-500 to-red-500",
    Sports: "from-green-500 to-emerald-500",
    Education: "from-indigo-500 to-blue-500",
    Health: "from-red-500 to-orange-500",
    Music: "from-purple-500 to-indigo-500",
    Art: "from-orange-500 to-yellow-500",
    Food: "from-yellow-500 to-orange-500",
    Other: "from-gray-500 to-slate-500",
  };

  const gradientClass = categoryColors[event.category] || categoryColors.Other;

  return (
    <Link to={`/events/${event._id}`}>
      <div className="group relative glass-card-interactive shadow-xl shadow-purple-500/10 h-full flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-md">
          <img
            src={
              event.image || "https://via.placeholder.com/300x200?text=Event"
            }
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent backdrop-blur-sm" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <div
              className={`inline-block bg-gradient-to-r ${gradientClass} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md bg-opacity-90 hover:shadow-lg hover:shadow-purple-500/40 transition transform group-hover:scale-110`}
            >
              {event.category}
            </div>
          </div>

          {/* Occupancy Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={`text-white font-bold text-sm px-3 py-1 rounded-full backdrop-blur-sm ${
                occupancyPercentage > 80
                  ? "bg-red-500/80 shadow-lg shadow-red-500/40"
                  : occupancyPercentage > 50
                    ? "bg-yellow-500/80 shadow-lg shadow-yellow-500/40"
                    : "bg-green-500/80 shadow-lg shadow-green-500/40"
              } transition hover:scale-110`}
            >
              {occupancyPercentage}%
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition duration-300">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow group-hover:text-gray-200 transition">
            {event.description}
          </p>

          {/* Event Info Grid */}
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex items-center space-x-3 text-gray-300 group-hover:text-purple-300 transition">
              <Calendar size={16} className="text-purple-400 flex-shrink-0" />
              <span>
                {formattedDate} at {event.time}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-gray-300 group-hover:text-purple-300 transition">
              <MapPin size={16} className="text-purple-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-300 group-hover:text-purple-300 transition">
              <Users size={16} className="text-purple-400 flex-shrink-0" />
              <span>
                {event.attendees}/{event.capacity} attending
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-bold text-pink-400 text-lg group-hover:text-pink-300 transition">
                ₹{event.ticketPrice}
              </span>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/5 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 shadow-lg shadow-purple-500/50"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 group-hover:text-purple-300 transition">
              {seatsAvailable} seats available
            </p>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center space-x-2 transform group-hover:translate-x-1 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
            <span>View Details</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Highlight Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-transparent group-hover:to-purple-500/20 pointer-events-none transition duration-300" />
      </div>
    </Link>
  );
}
