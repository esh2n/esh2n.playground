module Main exposing (main)

import Browser
import Dict exposing (update)
import Html exposing (Html, button, div, text)
import Html.Attributes as Attr
import Html.Events exposing (onClick)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ div [ Attr.class model.color ]
            [ text model.title ]
        , div
            [ Attr.class model.color ]
            [ text model.content ]
        , button [ onClick ToggleColor ] [ text "change color" ]
        ]



-- MODEL


type alias Model =
    { title : String
    , content : String
    , color : String
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( { title = "Elm in NextJS"
      , content = "Hello Elm"
      , color = "red"
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = ToggleColor


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleColor ->
            ( toggleColor model, Cmd.none )


toggleColor : Model -> Model
toggleColor model =
    case model.color of
        "red" ->
            { model
                | color = "blue"
            }

        _ ->
            { model
                | color = "red"
            }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
