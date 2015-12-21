Elm.Native = Elm.Native || {};
Elm.Native.WebAudio = Elm.Native.WebAudio || {};
Elm.Native.WebAudio.AudioProcessor = Elm.Native.WebAudio.AudioProcessor || {};

Elm.Native.WebAudio.AudioProcessor = {};
Elm.Native.WebAudio.AudioProcessor.make = function(localRuntime) {

  localRuntime.Native = localRuntime.Native || {};
  localRuntime.Native.AudioProcessor = localRuntime.Native.AudioProcessor || {};
  if (localRuntime.Native.AudioProcessor.values) {
    return localRuntime.Native.AudioProcessor.values;
  }

  var NativeSignal = Elm.Native.Signal.make(localRuntime);

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function stereoAudioProcessor(
      onAudioProcess,
      commandSignal,
      sendStatePlaying,
      sendStateStoppedAt
  ){
    "use strict";

    var bufferSize = 8192;
    var UPDATE_STATE_SAMPLE_COUNT = 1200;
    var timeInSamples = 0;
    var processor = audioCtx.createScriptProcessor(8192, 0, 2);

    processor.onaudioprocess = function(audioProcessingEvent) {
      var outputBuffer = audioProcessingEvent.outputBuffer;
      var left = outputBuffer.getChannelData(0);
      var right = outputBuffer.getChannelData(1);
      var idx;
      var updateStateDownCounter = UPDATE_STATE_SAMPLE_COUNT;

      for(idx = 0; idx < bufferSize; idx++, timeInSamples++, updateStateDownCounter--) {
        var leftAndRightSample = onAudioProcess(timeInSamples);
        left[idx] = leftAndRightSample._0;
        right[idx] = leftAndRightSample._1;

        if (!updateStateDownCounter) {
          sendStatePlaying(timeInSamples);
          updateStateDownCounter = UPDATE_STATE_SAMPLE_COUNT;
        }
      }
    }

    function playFrom(startTimeInSamples) {
      timeInSamples = startTimeInSamples;
      processor.connect(audioCtx.destination);
      sendStatePlaying(timeInSamples);
    }

    function stop() {
      processor.disconnect();
      sendStateStoppedAt(timeInSamples);
    }

    window.output = NativeSignal.output(
      "audio-processor-command-output",
      function(value) {
        switch(value.ctor) {
          case "PlayFromStart":
            playFrom(0);
            break;

          case "PlayFrom":
            playFrom(value._0);
            break;

          case "Continue":
            playFrom(timeInSamples + 1);
            break;

          case "Stop":
            stop();
            break;

          default:
            throw "Unexpected AudioProcessor.Command: " + value.ctor;
        }
      },
      commandSignal
    );
  }
  stereoAudioProcessor.arity = 4;
  stereoAudioProcessor.func = stereoAudioProcessor;

  return localRuntime.Native.AudioProcessor.values = {
    stereoAudioProcessor: stereoAudioProcessor
  };

};