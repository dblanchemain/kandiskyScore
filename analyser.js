
function drawSvgWaveform (audioBuffer, canvas, pos = 0.5, zoom=1) {
  var txt=""

  const fillStyle  = document.getElementById("waveFormColor").value
	var width=600
	var height=300
  // calculate displayed part of audio 
  // and slice audio buffer to only process that part
  const bufferLength = audioBuffer.length
  const zoomLength = bufferLength / zoom
  const start =0// Math.max(0, bufferLength * pos - zoomLength / 2)
  const end = Math.min(bufferLength, start + zoomLength)
  const rawAudioData = audioBuffer.getChannelData(0).slice(start, end)

  // process chunks corresponding to 1 pixel width
  const chunkSize = Math.max(1, Math.floor(rawAudioData.length / width))
  const values = []
  for (let x = 1; x < width; x++) {1,1
    const start = x*chunkSize
    const end = start + chunkSize
    const chunk = rawAudioData.slice(start, end)
    // calculate the total positive and negative area
    let positive = 0
    let negative = 0
    chunk.forEach(val => 
      val > 0 && (positive += val) || val < 0 && (negative += val)
    )
    // make it mean (this part makes dezommed audio smaller, needs improvement)
    negative /= chunk.length
    positive /= chunk.length
    // calculate amplitude of the wave
    chunkAmp = -(negative - positive)
    // draw the bar corresponding to this pixel
    txt=txt+"<rect x='"+x+"' y='"+(height/3 - positive * height)+"' width='1' height='"+(Math.max(1, chunkAmp * height))+"' fill='"+fillStyle+"' />"
  }
 
  document.getElementById("dfWave").firstChild.firstChild.innerHTML=txt
  //console.log(document.getElementById("dfWave").firstChild.firstChild)
  document.getElementById("dfWave").firstChild.setAttribute("width",600*zoom)
}