
gyTools.storage.getData().then((data) => {
  console.log(data)
  gyTools.storage.saveData('123')
})

gyTools.custom.getSystemHosts().then((hosts) => {
  console.log(hosts)
  // gyTools.custom.setSystemHosts('')
})
