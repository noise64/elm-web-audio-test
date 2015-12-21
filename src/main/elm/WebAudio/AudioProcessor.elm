module WebAudio.AudioProcessor
  ( Command(..)
  , State(..)
  , StereoAudioProcessor

  , stereoAudioProcessor
  ) where

import Debug
import Native.WebAudio.AudioProcessor
import Signal
import Task

type Command
  = PlayFromStart
  | PlayFrom Float
  | Continue
  | Stop

type State
  = StoppedAt Float
  | Playing Float

type alias StereoAudioProcessor =
    { commandAddress : Signal.Address Command
    , stateSignal : Signal.Signal State
    }

stereoAudioProcessor : (Float -> (Float, Float)) -> StereoAudioProcessor
stereoAudioProcessor processAudio =
  let
    commandMailbox = Signal.mailbox Stop
    stateMailbox = Signal.mailbox (StoppedAt 0)

    sendStatePlaying timeInSamples = Signal.send stateMailbox.address (Playing timeInSamples)
    sendStateStoppedAt timeInSamples = Signal.send stateMailbox.address (StoppedAt timeInSamples)

    _ =
      Native.WebAudio.AudioProcessor.stereoAudioProcessor
        processAudio
        commandMailbox.signal
        sendStatePlaying
        sendStateStoppedAt

  in
    { commandAddress = commandMailbox.address
    , stateSignal = stateMailbox.signal
    }
