import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Edit2, Trash2, Plus } from "lucide-react";
import {
  getOrganizerEvents,
  deleteEvent,
  getEventStats,
} from "../services/eventService";
import { getOrganizerBookingStats } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

/**
 * Organizer Dashboard
 */
export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "organizer") {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        getOrganizerEvents(),
        getOrganizerBookingStats(),
      ]);
      setEvents(eventsData.events || []);
      setStats(statsData.stats);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        setEvents(events.filter((e) => e._id !== eventId));
      } catch (err) {
        setError(err.message || "Failed to delete event");
      }
    }
  };

  const chartData = stats
    ? [
        { name: "Events Created", value: stats.totalEvents },
        { name: "Total Bookings", value: stats.totalBookings },
      ]
    : [];

  const COLORS = ["#A855F7", "#EC4899"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Organizer Dashboard
          </h1>
          <button
            onClick={() => navigate("/create-event")}
            className="btn-glass-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Event</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card hover:glass-card-hover backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
                  <p className="text-gray-400 text-sm">Total Events</p>
                  <p className="text-4xl font-bold text-purple-400 mt-2">
                    {stats.totalEvents}
                  </p>
                </div>

                <div className="glass-card hover:glass-card-hover backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
                  <p className="text-gray-400 text-sm">Total Bookings</p>
                  <p className="text-4xl font-bold text-pink-400 mt-2">
                    {stats.totalBookings}
                  </p>
                </div>

                <div className="glass-card hover:glass-card-hover backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-4xl font-bold text-green-400 mt-2">
                    ₹{stats.totalRevenue?.toFixed(2)}
                  </p>
                </div>

                <div className="glass-card hover:glass-card-hover backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
                  <p className="text-gray-400 text-sm">Avg Revenue/Event</p>
                  <p className="text-4xl font-bold text-orange-400 mt-2">
                    ₹{stats.averageRevenuePerEvent}
                  </p>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Bar Chart */}
              <div className="glass-card backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
                <h3 className="text-lg font-bold text-purple-300 mb-4">
                  Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(168,85,247,0.2)"
                    />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(168,85,247,0.5)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="#A855F7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              {stats && (
                <div className="glass-card backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">
                    Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#A855F7"
                        dataKey="value"
                        label={{ fill: "rgba(255,255,255,0.7)" }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(168,85,247,0.5)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Events Table */}
            <div className="glass-card backdrop-blur-md border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Your Events
              </h2>

              {events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 mb-4">
                    You haven't created any events yet
                  </p>
                  <button
                    onClick={() => navigate("/create-event")}
                    className="btn-glass-primary"
                  >
                    Create Your First Event
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">
                          Event Title
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">
                          Attendees
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr
                          key={event._id}
                          className="border-b border-purple-500/20 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300"
                        >
                          <td className="px-6 py-4 text-sm text-purple-200">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {event.attendees}/{event.capacity}
                          </td>
                          <td className="px-6 py-4 text-sm text-emerald-400 font-semibold">
                            ₹{event.ticketPrice}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/events/${event._id}`)}
                                className="text-purple-400 hover:text-purple-300 hover:scale-110 transition-all duration-200"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event._id)}
                                className="text-pink-400 hover:text-pink-300 hover:scale-110 transition-all duration-200"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
