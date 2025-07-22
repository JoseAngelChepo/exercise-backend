export const delay = (req, res) => {
  const ms = parseInt(req.query.ms, 10) || 5000;
  setTimeout(() => res.json({ message: `Waited ${ms} ms` }), ms);
};
