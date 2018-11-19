module.exports = (req, res) => {
  const info = {
    latest_version: "3.1",
    url: "https://www.icloud.com/shortcuts/a4626693baca46e786095ecfe4f001ab",
    update: "2018-11-19"
  }

  res.send(JSON.stringify(info));
}