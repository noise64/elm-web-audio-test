Elm.Native.AudioProcessor = {};
Elm.Native.AudioProcessor.make = function(localRuntime) {

  localRuntime.Native = localRuntime.Native || {};
  localRuntime.Native.AudioProcessor = localRuntime.Native.AudioProcessor || {};
  if (localRuntime.Native.AudioProcessor.values) {
    return localRuntime.Native.AudioProcessor.values;
  }

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function stereoAudioProcessor(onAudioProcess) {
    "use strict";

    var bufferSize = 8192;
    var timeInSamples = 0;
    var processor = audioCtx.createScriptProcessor(8192, 0, 2);

    processor.onaudioprocess = function(audioProcessingEvent) {
      var outputBuffer = audioProcessingEvent.outputBuffer;
      var left = outputBuffer.getChannelData(0);
      var right = outputBuffer.getChannelData(1);
      var idx;

      for(idx = 0; idx < bufferSize; idx++, timeInSamples++) {
        var leftAndRightSample = onAudioProcess(timeInSamples);
        left[idx] = leftAndRightSample._0;
        right[idx] = leftAndRightSample._1;
      }
    }

    processor.connect(audioCtx.destination);

    return {
      ctor: "StereoAudioProcessor"
    };
  }

  return localRuntime.Native.AudioProcessor.values = {
    stereoAudioProcessor: stereoAudioProcessor
  };

};