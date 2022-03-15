// resources:
// speech-recognition: https://www.npmjs.com/package/react-speech-recognition

import React, {useRef, useState} from 'react';
import Editor_1 from "../components/editor/Editor_1";
import Editor_2 from "../components/editor/Editor_2";
import {useLocation} from "react-router-dom";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

function Editor() {
    const location = useLocation();
    //init or a draft safes as state from component history>meme
    const [val, setVal] = useState(location.state ? location.state : "init")
    const editor2 = useRef(null)

    //voice control
    const commands = [
        {
            command: ["(add) (set) title (to) *"],
            callback: (title) => editor2.current.handleTitelChange(null, title)
        },
        {
            command: ["(add) (set) description (to) *"],
            callback: (desc) => editor2.current.handleDescChange(null, desc)
        },
        {
            command: ["select first text"],
            callback: () => editor2.current.handleSelectOfDraggable(null, 1)
        },
        {
            command: ["set first text (to) *", "add first text *"],
            callback: (text) => editor2.current.toggleTextOnMeme(1, text)
        },
        {
            command: ["toggle first text", "tog first text", "show first text", "hide first text", "first text"],
            callback: () => editor2.current.toggleTextOpacity(1)
        },

        {
            command: ["select second text"],
            callback: () => editor2.current.handleSelectOfDraggable(null, 2)
        },
        {
            command: ["set second text (to) *", "add second text *"],
            callback: (text) => editor2.current.toggleTextOnMeme(2, text)
        },
        {
            command: ["toggle second text", "tog second text", "show second text", "hide second text", "second text"],
            callback: () => editor2.current.toggleTextOpacity(2)
        },

        {
            command: ["select third text"],
            callback: () => editor2.current.handleSelectOfDraggable(null, 3)
        },
        {
            command: ["set third text (to) *", "add third text *"],
            callback: (text) => editor2.current.toggleTextOnMeme(3, text)
        },
        {
            command: ["toggle third text", "tog third text", "show third text", "hide third text", "third text"],
            callback: () => editor2.current.toggleTextOpacity(3)
        },
        //for the selected text:
        {
            command: ["* stroke", "stroke"],
            callback: () => editor2.current.handleStrokeChange()
        },
        {
            command: ["set font (to) *", "change font (to) *"],
            callback: (fontname) => editor2.current.handleFontChange(null, fontname)
        },
        {
            command: ["set bold", "bold", "toggle bold"],
            callback: () => editor2.current.handleSetBold()
        },
        {
            command: ["(set) (change) (font) size (to) :number"],
            callback: (number) => editor2.current.handleFontSizeChange(number)
        },
        {
            command: ["(set) (change) color (to) *", "(set) (change) colour (to) *"],
            callback: (color) => editor2.current.handleColorChange(color.toLowerCase())
        },
        {
            command: ["(set) (change) color (to) hashtag *", "(set) (change) colour (to) hashtag *"],
            callback: (color) => editor2.current.handleColorChange('#' + color)
        },
        {
            command: ["save (as) draft", "save (as) draught", "safe (as) draft", "safe (as) draught"],
            callback: () => editor2.current.saveDraft()
        }

    ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands});

    const selectComponent = () => {
        if (val !== "init") {
            return <Editor_2 ref={editor2} template={val} onChange={(value) => setVal(value)}/>;
        } else {
            return <Editor_1 onChange={(value) => setVal(value)}/>;
        }
    }
    return (
        <div className={"editor"}>
            {selectComponent()}
        </div>
    )
}

export default Editor;