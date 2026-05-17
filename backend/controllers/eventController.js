const Event = require("../models/Event");
const Booking = require("../models/Booking");

/**
 * Get All Events
 * GET /api/events
 * Query params: category, search, date, location
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { category, search, location } = req.query;

    // Build filter object
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Get events and sort by date
    const events = await Event.find(filter)
      .populate("organizerId", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};

/**
 * Get Single Event
 * GET /api/events/:id
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizerId",
      "name email",
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error while fetching event" });
  }
};

/**
 * Create Event (Organizer only)
 * POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      ticketPrice,
      image,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !location ||
      !capacity ||
      !ticketPrice
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Create event
    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      ticketPrice,
      image: image || "https://via.placeholder.com/300x200?text=Event",
      organizerId: req.user.id,
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error while creating event" });
  }
};

/**
 * Update Event (Organizer only)
 * PUT /api/events/:id
 */
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    // Update fields
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      ticketPrice,
      image,
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (capacity) event.capacity = capacity;
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
    if (image) event.image = image;

    event.updatedAt = Date.now();
    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error while updating event" });
  }
};

/**
 * Delete Event (Organizer only)
 * DELETE /api/events/:id
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    // Delete associated bookings
    await Booking.deleteMany({ eventId: req.params.id });

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error while deleting event" });
  }
};

/**
 * Get Organizer Events
 * GET /api/events/organizer/my-events
 */
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};

/**
 * Get Event Statistics
 * GET /api/events/:id/stats
 */
exports.getEventStats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get booking stats
    const bookings = await Booking.find({ eventId: req.params.id });
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0,
    );

    res.status(200).json({
      stats: {
        totalBookings,
        totalRevenue,
        capacity: event.capacity,
        availableSeats: event.capacity - totalBookings,
        occupancyRate: ((totalBookings / event.capacity) * 100).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
};
