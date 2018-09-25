module.exports = (req, res) => {
  const info = {
    latest_version: "3.0",
    url: "https://www.icloud.com/shortcuts/b768dfdbe9a9433c8ec3ac4ea590bace",
    update: "2018-09-26"
  }

  res.send(JSON.stringify(info));
}