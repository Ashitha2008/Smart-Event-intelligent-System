import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { EVENT_CATEGORIES } from "../utils/constants";

/**
 * Event Form Component
 * Used for creating and editing events
 */
export default function EventForm({
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      category: "Technology",
      date: "",
      time: "10:00",
      location: "",
      capacity: "",
      ticketPrice: "",
      image: null,
    },
  );

  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            image: "Please upload a valid image file",
          }));
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            image: "Image must be smaller than 5MB",
          }));
          return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            image: reader.result,
          }));
          setImagePreview(reader.result);
          // Clear error if file was valid
          if (errors.image) {
            setErrors((prev) => ({
              ...prev,
              image: "",
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = "Capacity must be at least 1";
    if (!formData.ticketPrice || formData.ticketPrice < 0)
      newErrors.ticketPrice = "Ticket price must be valid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 space-y-6 shadow-2xl shadow-purple-500/20"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
        {initialData ? "Edit Event" : "Create New Event"}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-purple-300 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`glass-input w-full ${
            errors.title ? "border-red-500/50 bg-red-500/10" : ""
          }`}
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-purple-300 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`glass-input w-full ${
            errors.description ? "border-red-500/50 bg-red-500/10" : ""
          }`}
          placeholder="Describe your event"
        ></textarea>
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-purple-300 mb-2">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="glass-input w-full"
        >
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`glass-input w-full ${
              errors.date ? "border-red-500/50 bg-red-500/10" : ""
            }`}
          />
          {errors.date && (
            <p className="text-red-400 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Time *
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="glass-input w-full"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-purple-300 mb-2">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`glass-input w-full ${
            errors.location ? "border-red-500/50 bg-red-500/10" : ""
          }`}
          placeholder="Event location"
        />
        {errors.location && (
          <p className="text-red-400 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      {/* Event Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-purple-300 mb-2">
          Event Image (Optional)
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="image-input"
          />
          <label
            htmlFor="image-input"
            className="glass-card-interactive backdrop-blur-sm border-2 border-dashed border-purple-500/50 rounded-xl p-6 cursor-pointer flex items-center justify-center hover:border-purple-400 transition"
          >
            <div className="text-center">
              <Upload className="text-purple-400 mx-auto mb-2" size={32} />
              <p className="text-gray-300 font-medium">Click to upload image</p>
              <p className="text-gray-500 text-sm">or drag and drop</p>
              <p className="text-gray-600 text-xs mt-1">
                (Max 5MB, PNG/JPG/GIF)
              </p>
            </div>
          </label>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Event preview"
              className="w-full h-48 object-cover rounded-xl border border-purple-500/30"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setFormData((prev) => ({
                  ...prev,
                  image: null,
                }));
                document.getElementById("image-input").value = "";
              }}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {errors.image && (
          <p className="text-red-400 text-sm mt-2">{errors.image}</p>
        )}
      </div>

      {/* Capacity and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Capacity *
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className={`glass-input w-full ${
              errors.capacity ? "border-red-500/50 bg-red-500/10" : ""
            }`}
            placeholder="Number of seats"
          />
          {errors.capacity && (
            <p className="text-red-400 text-sm mt-1">{errors.capacity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Ticket Price ($) *
          </label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`glass-input w-full ${
              errors.ticketPrice ? "border-red-500/50 bg-red-500/10" : ""
            }`}
            placeholder="Price per ticket"
          />
          {errors.ticketPrice && (
            <p className="text-red-400 text-sm mt-1">{errors.ticketPrice}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-glass-primary flex-1"
        >
          {loading
            ? "Processing..."
            : initialData
              ? "Update Event"
              : "Create Event"}
        </button>
      </div>
    </form>
  );
}
