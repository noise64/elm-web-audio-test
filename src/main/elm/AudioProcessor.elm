module AudioProcessor
  ( stereoAudioProcessor
  ) where

import Native.AudioProcessor

type StereoAudioProcessor = StereoAudioProcessor

stereoAudioProcessor : (Int -> (Float, Float)) -> StereoAudioProcessor
stereoAudioProcessor = Native.AudioProcessor.stereoAudioProcessor
