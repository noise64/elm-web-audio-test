import Array
import Debug
import Graphics.Element as GraphElem
import Graphics.Input as GraphInput
import List
import Signal
import Text
import WebAudio.AudioProcessor as AudioProcessor

processAudio : Float -> (Float, Float)
processAudio =
  let
    sine (t, p, v) = sin(t / p) * v
    sumSine tps = List.sum <| List.map sine tps

    freqModLeft t = sin (t / 441000.0) * 10
    freqModRight t = sin ((t + 20000.0) / 441000.0) * 5

    fmModLeft t = 1 - (sin (t / (10000 + sin (t / 3000) * 500 )) * 0.01)
    fmModRight t = 1 - (cos (t / (5000 + sin (t / 400) * 50 )) * 0.01)

    ampModLeft1 t = (sin (t / 441000.0 * 1.0) + 1.0)
    ampModLeft2 t = (cos (t / 441000.0 * 2.0) + 1.0)

    ampModRight1 t = (sin (t / 441000.0 * 2.2) + 1.0)
    ampModRight2 t = (cos (t / 441000.0 * 1.7) + 1.0)

    leftMono t =
      sumSine
        [ (t, 18.0 + (freqModLeft t), (ampModLeft1 t))
        , (t, 12.0 * (fmModLeft t), 1.0)
        , (t, 40.1 + (freqModLeft t), (ampModLeft1 t))
        , (t, 12.0, (ampModLeft2 t))
        , (t, 48.0, 1)
        ]
    rightMono t =
      sumSine
        [ (t, 18.0, (ampModRight1 t))
        , (t, 15.0 + (freqModRight t), 1.0)
        , (t, 40.0 + (freqModRight t), 1.0)
        , (t, 12.1 * (fmModRight t), (ampModRight2 t))
        , (t, 62.0, 1.0)
        ]

    leftPoly t =
      (leftMono t) * 0.5 + ((rightMono (t - 441000.0 * 0.2)) * 0.21) + ((leftMono (t - 441000.0 * 0.15)) * 0.3)
    
    rightPoly t =
      (rightMono t) * 0.5 + ((leftMono (t - 441000.0 * 0.3)) * 0.2) + ((rightMono (t - 441000.0 * 0.2)) * 0.3)
  in
    \t -> (leftPoly t, rightPoly t)


main : Signal GraphElem.Element
main =
  let
    audioProcessor = AudioProcessor.stereoAudioProcessor processAudio
    guiSpacer = GraphElem.spacer 10 10

    renderGui state =
      GraphElem.flow
        GraphElem.right
        [ GraphInput.button
            (Signal.message
              audioProcessor.commandAddress
              AudioProcessor.PlayFromStart
            )
            "Play"

        , guiSpacer

        , GraphInput.button
            (Signal.message
              audioProcessor.commandAddress
              AudioProcessor.Continue
            )
            "Continue"

        , guiSpacer

        , GraphInput.button
            (Signal.message
              audioProcessor.commandAddress
              AudioProcessor.Stop
            )
            "Stop"

        , guiSpacer

        , GraphElem.show (Debug.log "state" state)
        ]
  in
    Signal.map
      renderGui
      audioProcessor.stateSignal
