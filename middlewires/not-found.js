const notFound = (req, res) => res.status(404).send('Route not Exists');
module.exports = notFound;
