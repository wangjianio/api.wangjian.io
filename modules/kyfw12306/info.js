module.exports = (req, res) => {
  const info = {
    latest_version: "2.3",
    url: "https://workflow.is/workflows/9854ff939a9442879d7430d773ebe3c0",
    update: "2018-07-03"
  }

  res.send(JSON.stringify(info));
}