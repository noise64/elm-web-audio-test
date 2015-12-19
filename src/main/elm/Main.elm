import Array
import AudioProcessor
import List
import Graphics.Element as GraphElem
import Signal
import Text

main : GraphElem.Element
main =
  let
    audioProcessor =
      AudioProcessor.stereoAudioProcessor
      (\time ->
          let
            floatTime = toFloat time
            sine x = sin(floatTime / x)
            sumSine xs = List.sum <| List.map sine xs
          in
            (sumSine [18.0, 15.0, 20.0, 10.0], sine (30.0))
      )
  in
    GraphElem.centered <| Text.fromString "Hello WebAudio!"