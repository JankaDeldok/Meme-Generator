import {BsDashLg} from "react-icons/bs";
import React from 'react';
import Draggable from 'react-draggable';

/**
 * Uses react-Draggable from https://github.com/react-grid-layout/react-draggable/blob/master/example/example.js
 */
class DraggableText extends React.Component {

    constructor(props) {
        super(props);
        this.textRef = React.createRef();

        this.state = {
            //text out of textarea
            text: "",
            //position of text left upper corner
            deltaPosition: {
                x: 0, y: 0
            },
            opacity: 0,
            stroke: true,
            fontFamily: "Impact",
            fontSize: "30",
            fontWeight: "bold",
            color: "#FFFFFF",
            border: "2px black",
            width: "300px",
            height: "100px",
            saving: false,
        }
    }


    setText = (text) => {
        this.setState({text: text});
    }
    /**
     * Adds the saving class to the element, which removes bars from the draggables
     */
    startSaving = () =>{
        this.setState({saving: true});
    }
    /**
     * Removes the saving class from the draggable to show bars and handles again
     */
    endSaving = () => {
        this.setState({saving: false});
    }
    setOpacity = (opacity) => {
        this.setState({
            opacity: opacity,
        })
    }
    setFontsize = (fontsize) => {
        this.setState({
                fontSize: fontsize,
        })
    }
    setFont = (font) => {
        this.setState({
                fontFamily: font,
        })
    }
    setTextColor = (color) => {
        this.setState({
                color: color,
        })
    }
    /**
     * @param stroke true or false
     */
    setStrokeChange = (stroke) => {
      this.setState({
          stroke: stroke,
      })
    }
    /**
     * Toggles boldness of text
     */
    setTextBold = () => {
        if (this.state.fontWeight == "bold"){
            this.setState({
                fontWeight: "normal",
            })
        } else {
            this.setState({
                fontWeight: "bold",
            })
        }
    }
    handleDrag = (e, ui) => {
        const {x, y} = this.state.deltaPosition;
        this.setState({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    };
    //changes the state of the text
    onChangeText = (evt) => {
        let textarea = evt.target;
        this.setState({
                text: textarea.value,
            }
        );
    };

    render(){
        let styling = {
            width: this.state.width,
            height: this.state.height,
            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize + "px",
            fontWeight: this.state.fontWeight,
            color: this.state.color,
        };

        let elementClasses = "";
        if(this.state.opacity === 0){
            elementClasses += 'collapse'
        } else {
            if(this.state.saving){
                elementClasses += 'saving';
            }
        }
        let textAreaClasses = "";
        if(this.state.stroke === true){
            textAreaClasses += 'textstroke'
        } else {
            textAreaClasses = "";
        }
        return (
            <Draggable onDrag={this.handleDrag} axis={"both"} handle={"strong"} bounds="parent">
                <div className={elementClasses} >
                    <strong className={"cursor"}><div><BsDashLg/></div></strong>
                    <textarea
                        className={textAreaClasses}
                        style={styling}
                        value={this.state.text}
                        onChange={this.onChangeText}
                        ref={this.textRef} placeholder={"SAMPLE"}/>
                </div>
            </Draggable>

        );
    }
}
export default DraggableText;