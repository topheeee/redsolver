export default (req, res) => {
  const {
    query: { health },
  } = req

  if (!parseInt(health)) return res.end()

  const flail100 = Math.floor(0.20312 * health)
  const flail150 = Math.floor(0.09375 * health)
  const flail200 = Math.floor(0.03125 * health)

  res.end(
    `
    100 -> ${flail100} ||
    150 -> ${flail150} ||
    200 -> ${flail200}
    `
  )
}
