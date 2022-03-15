import React from 'react';
import {Button, Col, Image, Row, Form, Toast} from "react-bootstrap";
import {
    BsChevronLeft,
    BsCloudDownloadFill,
    BsFileFontFill,
    BsFillCapslockFill, BsFillDashCircleFill,
    BsFillPencilFill,
    BsFillTrashFill,
    BsSaveFill,
    BsType,
    BsTypeBold,
} from "react-icons/bs";
import {BiFontSize} from "react-icons/bi";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import Templates from "../Templates";
import DraggableText from "./DraggableText";
import FormRange from "react-bootstrap/FormRange";
import {wait} from "@testing-library/user-event/dist/utils";


let dragContainer, draggable1, draggable2, draggable3; //ref to draggable elements
let image, //ref to the image tag
    toolbox; //ref to the tool-sub menu


/**
 * Toggles the visibility of the textboxes
 * @param n = the number of the draggable (1-3)
 */
function toggleTextOpacity(n) {
    let opa = 0;
    switch (n) {
        case 3:
            if (draggable3.current.state.opacity === 0) {
                opa = 1;
            }
            draggable3.current.setOpacity(opa);
            break;
        case 2:
            if (draggable2.current.state.opacity === 0) {
                opa = 1;
            }
            draggable2.current.setOpacity(opa);
            break;
        case 1:
            if (draggable1.current.state.opacity === 0) {
                opa = 1;
            }
            draggable1.current.setOpacity(opa);
            break;
        default:
            break; //do nothing
    }
    // button status
    if (opa === 1) {
        document.getElementById("buttontext" + n).classList.add("active");
    } else {
        document.getElementById("buttontext" + n).classList.remove("active");
    }
}

// Memes:
// id
// creator
// name
// desc
// img (base64)
// upvotes
// downvotes
// comments (Array string)
// memetexte (ein json string für janina :D)
// template_id

/**
 * Posts the meme on the server
 * @returns {Promise<void>}
 */
async function sendMemeToServer(memeState, draft) {
    const url = draft ? 'http://localhost:5000/api/postdraft' : 'http://localhost:5000/api/postmeme';
    const button = document.getElementById("share");
    button.classList.add("turquoise");
    const text = document.getElementById("shareState");
    text.innerText = "Sharing";
    await fetch(
        url, {
            method: 'POST',
            headers:
                {'Content-Type': 'application/json',}
            ,
            body: JSON.stringify(await writeMemeAsJson(memeState, draft)),
        }
    );

    text.innerText = "Meme shared";
    wait(5000).then(() => {text.innerText = "Share"; button.classList.remove("turquoise");});
}

/**
 * Writes a JSON for storing the current state of the meme and the meme itself
 */
async function writeMemeAsJson(state, draft) {
    //let imageNode = image.current
    //let imageDimensions = {width: imageNode.width, height: imageNode.height}
    //TODO calculate text position relative to image dimensions

    let filebase;

    if (draft) {
        filebase = state.activeTemplate.img; //use template filebase
    } else {
       setSavingStyle();
       filebase = await htmlToFilebas64().then((r) => {
           resetStyling(); //first reset styling then return filebase string
           return r;
       });


    }
    //saving the styling of the placed texts
    let draggableNodes = {
        text1: draggable1.current.state,
        text2: draggable2.current.state,
        text3: draggable3.current.state,
    }

    //checking fur null values
    if(! state.title) state.title = "Generic Title";
    if(! state.desc) state.desc = "no description";
    if(! state.activeTemplateId) state.activeTemplate = 1;

    return {
        creator: localStorage.getItem('currentUserMail') ? localStorage.getItem('currentUserMail') : "anonym",
        name: state.title,
        desc: state.desc,
        img: filebase, //Filebase 64 String
        memetexts: draggableNodes,
        templateId: state.activeTemplateId,
    };
}

function resetStyling(){
    draggable1.current.endSaving();
    draggable2.current.endSaving();
    draggable3.current.endSaving();
}
function setSavingStyle(){
    draggable1.current.startSaving();
    draggable2.current.startSaving();
    draggable3.current.startSaving();
}
/**
 * Downloads the image currently shown in the editor to your device
 */
const downloadImage = () => {
    const memetitle = 'title.png';
    let downloads = document.getElementById("download");
    downloads.classList.add("blue");
    console.log("Downloading meme named " + memetitle)
    setSavingStyle();
    htmlToFilebas64().then((dataUrl) => {
        download(dataUrl, memetitle);
        resetStyling()});
    downloads.classList.remove("blue");

}
/**
 * Using: https://github.com/bubkoo/html-to-image
 * Generates a filebase png out of the meme.
 */
async function htmlToFilebas64() {
    let dataUrl = htmlToImage.toPng(document.getElementById('meme'))
        .then(function (dataUrl) {
            return dataUrl
        })
        .catch(function (error) {
            console.error('was not able to display generated meme!', error)
        });
    return await dataUrl;
}

/**
 * Clears the canvas and resets the text styling to initial
 */
function clearCanvas() {
    let draggables = [draggable1, draggable2, draggable3];
    draggables.forEach((draggable, index) => {
        draggable.current.setState({
            //text out of textarea
            text: "",
            //position of text left upper corner
            deltaPosition: {
                x: 0, y: 0
            },
            opacity: 0,
            fontFamily: "Impact",
            fontSize: "10",
            color: "white",
            border: "2px black",
            stroke: true,
        });
        document.getElementById("buttontext" + (index + 1)).classList.remove("active");
    })
}

class Editor extends React.Component {
    parentProbs;

    constructor(props) {
        super(props);
        this.parentProbs = props;
        this.state = {
            activeTemplate: {
                img: props.template.img,
                alt: props.template.desc,
            },
            activeTemplateId: 0,
            activeDraggable: null,
            title: "",
            desc: "",
            style: { //of the las active draggable
                fontSize: 10,
                color: "#000000",
                fontWeight: true,
                fontFamily: "Impact",
                stroke: true,
            }
        };
        //init refs
        dragContainer = React.createRef();
        draggable1 = React.createRef();
        draggable2 = React.createRef();
        draggable3 = React.createRef();
        image = React.createRef();
        toolbox = React.createRef();
    }

    componentDidMount() {
        if (this.parentProbs.template.memetexts) {
            this.loadDraftTexts(this.parentProbs.template.memetexts);
        }
        this.setState({activeDraggable: draggable1.current})
    }

    loadDraftTexts(memetexts) {
        let drafts = JSON.parse(memetexts);
        let draftsList = [drafts.text1, drafts.text2, drafts.text3];
        let draggables = [draggable1, draggable2, draggable3];
        draftsList.forEach((dstate, i) => {
            draggables[i].current.setState({
                //text out of textarea
                text: dstate.text,
                //position of text left upper corner
                deltaPosition: {
                    x: dstate.deltaPosition.x, y: dstate.deltaPosition.y
                },
                opacity: dstate.opacity,
                stroke: dstate.stroke,
                fontFamily: dstate.fontFamily,
                fontSize: dstate.fontSize,
                color: dstate.color,
                border: dstate.border,
                fontWeight: dstate.fontWeight,
                width: dstate.width,
                height: dstate.height,
            });
        })
    };

    /**
     * Change Text on meme
     */
    toggleTextOnMeme = (n, text) => {
        let draggable = [draggable1, draggable2, draggable3];
        console.log(draggable[parseInt(n)-1]);
        draggable[parseInt(n)-1].current.setText(text);
    }

    /**
     * Toggles the visibility of the textboxes
     * @param n = the number of the draggable (1-3)
     */
     toggleTextOpacity(n) {
        let opa = 0;
        switch (n) {
            case 3:
                if (draggable3.current.state.opacity === 0) {
                    opa = 1;
                }
                draggable3.current.setOpacity(opa);
                break;
            case 2:
                if (draggable2.current.state.opacity === 0) {
                    opa = 1;
                }
                draggable2.current.setOpacity(opa);
                break;
            case 1:
                if (draggable1.current.state.opacity === 0) {
                    opa = 1;
                }
                draggable1.current.setOpacity(opa);
                break;
            default:
                break; //do nothing
        }
        // button status
        if (opa === 1) {
            document.getElementById("buttontext" + n).classList.add("active");
        } else {
            document.getElementById("buttontext" + n).classList.remove("active");
        }
    }


    /**
     * Share current Meme and send to Server
     */
    shareMeme = () => {
        sendMemeToServer(this.state).then(() => console.log("Sent meme "));
    }

    /**
     * Save draft on Server
     */
    saveDraft = () => {
        sendMemeToServer(this.state, true).then(() => console.log("Sent draft"));
    }

    /**
     * When event = null, title is used
     * @param evt
     * @param title String
     */
    handleTitelChange = (evt, title) => {
        let titleInput;
        if(evt) {
            titleInput= evt.target.value;
        }
        else {
            titleInput = title;
        }
        this.setState({
                title: titleInput,
            }
        );
    }
    /**
     * When event = null, desc is used
     * @param evt
     * @param desc String
     */
    handleDescChange = (evt, desc) => {
        let descInput;
        if(evt) {
            descInput= evt.target.value;
        }
        else {
            descInput = desc;
        }
        this.setState({
                desc: descInput,
            }
        );
    }

    /**
     * Just for safety if there is a draggable selected
     */
    checkfordraggable(){
        if (this.state.activeDraggable){
            return true;
        } else {
            console.log("No draggable selected");
        }
    }

    /**
     * After setState invoke callback to apply changes to active draggable
     * @param fontsize in Int
     */
    handleFontSizeChange = (fontsize) => {
        if(fontsize){ //for speech recognition
            this.setState({style: {fontSize: parseInt(fontsize)}}, () => {  if(this.checkfordraggable) this.state.activeDraggable.setFontsize(this.state.style.fontSize);});
        }
        if(this.checkfordraggable) this.state.activeDraggable.setFontsize(this.state.style.fontSize);
    }

    /**
     * Color gets set to state color or the given color.
     * @param color String (red, blue or hex)
     */
    handleColorChange = (color) => {
        if(color){
            this.setState({style: {color: color}}, () => {  if(this.checkfordraggable) this.state.activeDraggable.setTextColor(this.state.style.color);});
        }
        if(this.checkfordraggable) this.state.activeDraggable.setTextColor(this.state.style.color);
    }

    /**
     * Toogle set bold
     */
    handleSetBold = () => {
        if(this.checkfordraggable) this.state.activeDraggable.setTextBold();
    }

   /**
    * Hand an event or a font to change font.
    * @param event
    * @param font Name of the font
    */
    handleFontChange = (event, font) => {
        if(font){ //for speech recognition
            this.setState({style: {fontFamily: font}}, () => {  if(this.checkfordraggable) this.state.activeDraggable.setFont(this.state.style.fontFamily);});
        } else {
            this.setState({style: {fontFamily: event.target.value}}, () => { if(this.checkfordraggable) this.state.activeDraggable.setFont(event.target.value);});
        }
    }

    /**
     * toggle Stroke
     */
    handleStrokeChange = () => {
        let stroke = ! this.state.style.stroke;
        this.setState({style: {stroke: stroke}}, () => {
            if (this.checkfordraggable) this.state.activeDraggable.setStrokeChange(this.state.style.stroke);
        })
    }

    /**
     * Handle select input of the draggable which should be styled. Either send the event or the number
     * of the draggable
     * @param e
     * @param number from speech recognition
     */
    handleSelectOfDraggable = (e, number) => {
        let draggables = [draggable1, draggable2, draggable3];
        //Styling buttons to be active
        let buttons = document.getElementsByClassName("textbutton");
        for (let button of buttons){
            button.classList.remove("active");
        }
        if(number) { //speech recognition
            document.getElementById("buttontext" + (parseInt(number))).classList.add("active");
            this.setState({ activeDraggable: draggables[parseInt(number)-1].current });
        } else { //handle event
            document.getElementById("buttontext" + (parseInt(e.target.value) + 1)).classList.add("active");
            this.setState({ activeDraggable: draggables[e.target.value].current });
        }

    }
    options = [
        {
            label: "1st text",
            value: "0" //array starts counting from 0
        },
        {
            label: "2nd text",
            value: "1"
        },
        {
            label: "3rd text",
            value: "2"
        },
    ]

    render() {
        return (
            <div>
                <div className="py-4"> {/* meme editor */}
                    <Row> {/* back and mode */}
                        <Col className={"dark"}>
                            <a onClick={() => this.parentProbs.onChange("init")}> <BsChevronLeft/> Back to upload template </a></Col>
                        <Col className={"float-end text-end"}><p className="">Mode: Create on Server or local</p></Col>
                    </Row>

                    <Row className={"my-3"}> {/* Menu left, Meme, Menu right*/}

                        {/* left menu */}{/* color, font, background*/}
                        <Col className={".flex-column-reverse menu-left"} md={1}>
                            <Form.Select onChange={(e) => {this.handleSelectOfDraggable(e)}} className={"pb-2"}>
                                {this.options.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </Form.Select>

                            {/* Toggle black stroke */}
                            <Button onClick={this.handleStrokeChange} className={"mt-3 py-2 mb-lg-4 mb-md-2"}
                                    variant={"outline-light"}><BsFillDashCircleFill/></Button>

                            {/* Toggle fontweight FontWeight*/}
                            <Button onClick={this.handleSetBold}
                                    className={"pb-2 mb-1"} variant={"outline-light"}><BsTypeBold/></Button>

                            {/* Fontsize */}
                                <span className={"py-2"}>
                                <p className={"pt-2 mb-0 text-center"}> <BiFontSize/></p>
                            {/* Fontsize of active Draggable Text*/}
                                <FormRange min={"10"} max={"100"} value={this.state.style.fontSize} onChange={(e) => {
                                this.setState( {style: {fontSize: e.target.value}}, this.handleFontSizeChange)
                            }}/>
                            {/*if the user given string are just numbers --> set fontsize, else revert*/}
                                <Form.Control value={this.state.style.fontSize} placeholder={"font"}
                                onChange={(e) => {
                                (e.target.validity.valid ? this.setState({style: {fontSize: e.target.value}}, this.handleFontSizeChange) : (e.target.value = this.state.style.fontSize))
                            }}
                                pattern={'^[0-9]+$'}/>
                                </span>

                            {/* Color picker */}
                                <span className={"py-4"}>
                                <input className={"color"}  type={"color"} value={this.state.style.color} onChange={(e) => {
                                this.setState({style: {color: e.target.value}}, this.handleColorChange)}} />
                                <Form.Control pattern={'!/^#[0-9a-f]{4,6}$/i'} value={this.state.style.color} placeholder={"#000"}
                                onChange={(e) => {
                                (e.target.validity.valid ? this.setState({style: {color: e.target.value}}, this.handleColorChange) : (e.target.value = this.state.style.color))
                            }}
                                /> {/*pattern={'/^#[0-9a-f]{3,6}$/i'}*/}
                                </span>

                            {/* up to three movable and resizeable textboxes*/}
                                <Button id={"buttontext1"} onClick={() => this.toggleTextOpacity(1)} className={"textbutton py-2 mt-3 mb-1"}
                                variant={"outline-light"}><BsFileFontFill/></Button>
                                <Button id={"buttontext2"} onClick={() => this.toggleTextOpacity(2)} className={"textbutton pb-2 mb-1"}
                                variant={"outline-light"}><BsFileFontFill/></Button>
                                <Button id={"buttontext3"} onClick={() => this.toggleTextOpacity(3)} className={"textbutton pb-2 mb-1"}
                                variant={"outline-light"}><BsFileFontFill/></Button>

                            {/*TODO: Font-Picking https://www.npmjs.com/package/font-picker-react*/}

                                </Col>
                                <Col lg={9} md={8} sm={12}> {/* editor */}
                                <input onChange={this.handleTitelChange} className={"input-group-text fs-4 fw-bold"}
                                type={"text"} placeholder={"meme title"}
                                value={this.state.title}/>
                                <div id={'meme'} ref={dragContainer} className={"draggContainer"}>
                                <DraggableText ref={draggable1}/>
                                <DraggableText ref={draggable2}/>
                                <DraggableText ref={draggable3}/>

                                <Image ref={image} src={this.state.activeTemplate.img}/>
                                </div>
                                <input value={this.state.desc} onChange={this.handleDescChange} className={"input-group-text text-start my-4"}
                                type={"text"} placeholder={"please add a description for your meme"}/>

                                </Col>

                                <Col className={"dark menu text-center"}> {/* right menu, download, send, draft */}
                                <div className={"pb-3 border-bottom border-4 dark"}><a id={"download"} onClick={downloadImage}>
                                <BsCloudDownloadFill/>
                                <span className={"align-bottom"}>Download</span></a></div>
                                <div className={"py-2 border-bottom border-4 dark"}><a id={"share"} onClick={this.shareMeme}><BsFillCapslockFill/>

                                <span id={"shareState"} className={"align-bottom"}>Share</span></a></div>
                                <div className={"pt-2"}><a href={"/account"}><BsFillPencilFill/>
                                <span id={"drafts"} className={"align-bottom"}>Drafts</span></a></div>
                                </Col>
                                </Row>
                                <Row className={"pb-5 border-bottom border-2 light_blue"}>
                                    <Col ref={toolbox}>
                                        <Form.Select value={this.state.fontFamily} onChange={(e) => {this.handleFontChange(e)}}>
                                            <option style={ {fontFamily: "Impact"}} value={"impact"}>Impact</option>
                                            <option style={ {fontFamily: "Comic Sans MS, Comic Sans"}} value={"comic sans ms"}>Comic Sans MS</option>
                                            <option style={ {fontFamily: "Times New Roman"}} value={"times new roman"}>Times New Roman</option>
                                            <option style={ {fontFamily: "Arial"}} value={"arial"}>Arial</option>
                                            <option style={ {fontFamily: "Arial Black"}} value={"arial black"}>Arial Black</option>
                                            <option style={ {fontFamily: "Courier New"}} value={"Courier New"}>Courier New</option>
                                            <option style={ {fontFamily: "Consolas"}} value={"consolas"}>Consolas</option>
                                        </Form.Select>
                                    </Col>
                                <Col className={"d-flex flex-row-reverse"}>
                                <Button onClick={this.saveDraft}
                                variant={"secondary"}><BsSaveFill/> SAVE DRAFT</Button>
                                <Button id="clear" onClick={clearCanvas} className={"mx-3"}
                                variant={"secondary"}><BsFillTrashFill/> CLEAR</Button>
                                </Col>
                                <Col sm={2}/>
                                </Row>
                                </div>

                                <div>
                                <Templates setState={p => {
                                this.setState(p)
                            }}/>
                                </div>

                                </div>
                                );
                            }
                            }

                            export default Editor;