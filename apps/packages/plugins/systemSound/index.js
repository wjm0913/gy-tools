document.addEventListener('DOMContentLoaded', function () {
  let soundOnButton = document.getElementById('soundOn');
  let soundOffButton = document.getElementById('soundOff');

  soundOnButton.addEventListener('click', async function () {
    console.log(11111);
    // alert(JSON.stringify(window.gyTools));
    // window.gyTools.showNotification();
    const hasDarkColors = await gyTools.env.hasDarkColors();
    console.log(hasDarkColors);
    gyTools.logOutput.info('log ...');
  });

  soundOffButton.addEventListener('click', function () {
    // alert(222)
    gyTools.view.showNotification('测试通知', '通知内容');
  });

  console.log(require('gy-tools'));
});
