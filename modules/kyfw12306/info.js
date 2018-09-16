module.exports = (req, res) => {
  const info = {
    latest_version: "2.4",
    url: "https://workflow.is/workflows/355dfce33b5f4876a709b1990e0e2661",
    update: "2018-09-17"
  }

  res.send(JSON.stringify(info));
}