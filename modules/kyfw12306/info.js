module.exports = (req, res) => {
  const info = {
    latest_version: "2.5",
    url: "https://www.icloud.com/shortcuts/b9001e8898a34b5f86d0128eabf1602a",
    update: "2018-09-19"
  }

  res.send(JSON.stringify(info));
}