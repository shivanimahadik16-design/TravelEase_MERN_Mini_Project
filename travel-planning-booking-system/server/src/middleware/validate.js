import Joi from "joi";

const objectId = Joi.string().hex().length(24);
const imageUrl = Joi.string().uri({ scheme: ["http", "https"] });
const optionalImageUrl = imageUrl.allow("");
const optionalText = (max = 2000) => Joi.string().trim().max(max).allow("");

const schemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().trim().email().max(254).required(),
    password: Joi.string().min(8).max(128).required()
  }).unknown(false),
  login: Joi.object({
    email: Joi.string().trim().email().max(254).required(),
    password: Joi.string().min(1).max(128).required()
  }).unknown(false),
  changePassword: Joi.object({
    currentPassword: Joi.string().min(1).max(128).required(),
    newPassword: Joi.string().min(8).max(128).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required()
  }).with("newPassword", "confirmPassword").unknown(false),
  destination: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    state: Joi.string().trim().min(2).max(100).required(),
    country: Joi.string().trim().max(100),
    description: Joi.string().trim().min(1).max(2000).required(),
    image: imageUrl.required(),
    bestTime: optionalText(100),
    tags: Joi.array().items(Joi.string().trim().max(40)).max(20)
  }).unknown(false),
  hotel: Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    destination: objectId.required(),
    description: optionalText(),
    image: optionalImageUrl,
    pricePerNight: Joi.number().positive().required(),
    facilities: Joi.array().items(Joi.string().trim().max(60)).max(30),
    availableRooms: Joi.number().integer().min(0)
  }).unknown(false),
  activity: Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    destination: objectId.required(),
    description: optionalText(),
    image: optionalImageUrl,
    price: Joi.number().positive().required(),
    duration: Joi.string().trim().max(100).allow("")
  }).unknown(false),
  booking: Joi.object({
    type: Joi.string().valid("hotel", "activity").required(),
    hotel: objectId.when("type", { is: "hotel", then: Joi.required(), otherwise: Joi.forbidden() }),
    activity: objectId.when("type", { is: "activity", then: Joi.required(), otherwise: Joi.forbidden() }),
    travelDate: Joi.date().greater("now").required(),
    guests: Joi.number().integer().min(1).max(30).default(1)
  }).unknown(false),
  trip: Joi.object({
    destination: objectId.required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    itinerary: Joi.array().items(Joi.object({
      day: Joi.number().integer().min(1).required(),
      title: Joi.string().trim().max(100).required(),
      details: optionalText()
    }).unknown(false)).max(60).default([])
  }).unknown(false),
  bookingStatus: Joi.object({
    status: Joi.string().valid("confirmed", "cancelled").required()
  }).unknown(false),
  destinationQuery: Joi.object({
    q: Joi.string().trim().max(100).allow("")
  }).unknown(false),
  catalogQuery: Joi.object({
    destination: objectId
  }).unknown(false),
  id: Joi.object({
    id: objectId.required()
  }).unknown(false)
};

export function validate(schemaName, target = "body") {
  return (req, res, next) => {
    const { error, value } = schemas[schemaName].validate(req[target], {
      abortEarly: false,
      convert: true
    });

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    if (target === "body") {
      req.body = value;
    } else {
      req.validated = { ...req.validated, [target]: value };
    }
    next();
  };
}
