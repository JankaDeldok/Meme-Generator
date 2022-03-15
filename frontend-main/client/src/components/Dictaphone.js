// resources:
// speech-recognition: https://www.npmjs.com/package/react-speech-recognition
// find node: https://de.reactjs.org/docs/react-dom.html#finddomnode
// https://www.geeksforgeeks.org/reactjs-finddomnode-method/
// click on node: https://stackoverflow.com/questions/40091000/simulate-click-event-on-react-element

import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {BsArrowCounterclockwise, BsMic, BsMicMute, BsRecordFill, BsStopFill} from "react-icons/bs";
import ReactDOM from "react-dom";
import {Button} from "react-bootstrap";

const Dictaphone = () => {
    const commands = [
        {
            command: ['go to *', 'click *', 'click on *', 'klick *'],
            callback: (buttonId) => clickElementWithId(buttonId)
        },
        {
            command: ['clear', 'download'],
            callback: (buttonId) => clickElementWithId(buttonId),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7,
            bestMatchOnly: true
        },
        {
            command: ['share', 'cher', 'sheer', 'chair'],
            callback: () => clickElementWithId('share'),
        },
        {
            command: ['clear transcript', 'reset transcript', 'delete transcript'],
            callback: ({resetTranscript}) => resetTranscript()
        }
    ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands});


    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    // click on any element with id id
    function clickElementWithId(id) {
        console.log("select element with id " + id.toLowerCase())
        var node = document.getElementById(id.toLowerCase());
        var a = ReactDOM.findDOMNode(node);
        if (a) {
            a.click()
        }
    }

    return (
        <div>
            {listening ? <BsMic className="turquoise"/> : <BsMicMute/>}
            &nbsp;
            <Button
                variant={"outline-light"}
                id="start listening" onClick={() => SpeechRecognition.startListening({language: 'en-US'})}>
                <BsRecordFill/></Button>
            <Button
                variant={"outline-light"}
                onClick={SpeechRecognition.stopListening}><BsStopFill/></Button>
            <Button
                variant={"outline-light"}
                onClick={resetTranscript}><BsArrowCounterclockwise/></Button>
            <p>{transcript}</p>
        </div>
    );
};
export default Dictaphone;