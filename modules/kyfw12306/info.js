module.exports = (req, res) => {
  const info = {
    latest_version: "2.6",
    url: "https://www.icloud.com/shortcuts/a91b6cb2f5d5482c9776dbeb41ab12dc",
    update: "2018-09-19"
  }

  res.send(JSON.stringify(info));
}