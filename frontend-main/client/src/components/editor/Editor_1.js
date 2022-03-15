import React from 'react';
import {Button, Card, Col, Container, Image, Modal, Row} from "react-bootstrap";
import {
    BsBoxArrowInRight, BsBoxArrowUpRight,
    BsFillCloudArrowUpFill,
    BsFillFileEarmarkImageFill,
    BsFillFileEarmarkPlusFill
} from "react-icons/bs";
import placeholder from '../../assets/Memes/Platzhalterklein.png';
import Templates from "../Templates";
import Uploads from "../../pages/Uploads";

//Original card example from https://react-bootstrap.github.io/components/cards/

class Editor extends React.Component {
    setState(state, callback) {
        super.setState(state, callback);
    }
    parentProbs;
    constructor(props) {
        super(props);
        this.parentProbs  = props;
        this.state = {
            activeTemplate: {
                img: undefined,
                alt: "please select a template",
            },
            activeTemplateId: 0,
            show: false,
        };
    }
    handleClose = () =>{
        this.setState({show: false})
    }
    handleShow = () => {
        this.setState({show: true})
    }

    render() {
        return (
            <div>
                <Container>
                    <div>
                        <Row className="dark upload text-center my-4">
                            <Col/>
                            <Col className="border-end border-4 border-secondary">
                                <a variant="primary" onClick={this.handleShow}>
                                    <BsFillFileEarmarkImageFill/>
                                    Upload
                                </a>
                            </Col>
                            <Col className="">
                               <p>Upload a meme template from your computer or choose an already existing one.</p>
                            </Col>
                            <Col/>
                        </Row>
                    </div>

                    {/* From https://react-bootstrap.netlify.app/components/modal/#modals */}
                    {/* Builds a modal popup which is used for the template upload */}
                        <Modal variant={"dark"} show={this.state.show} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Upload an image</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Uploads/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>


                    <Templates setState={p=>{this.setState(p)}} />  {/* Meme templates*/}

                    <div>  {/* Template Preview and start creating links*/}
                        <Card className="mb-3" bg="dark">
                            <Card.Body>
                                <Card.Title>Selected template:</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Meme template</Card.Subtitle>
                                <Image className={"img-fluid"} src={this.state.activeTemplate.img ? this.state.activeTemplate.img: placeholder}
                                       alt={"Platzhalter"} />
                                <Card.Text>
                                    Hier kommt später mal die Statistik hin.
                                </Card.Text>
                                <a onClick={() => this.parentProbs.onChange(this.state.activeTemplate)} className="my-2 me-4">start creating
                                    local <BsBoxArrowInRight/></a>
                                <a onClick={() => this.parentProbs.onChange(this.state.activeTemplate)} className="my-2">start creating on
                                    Server <BsBoxArrowUpRight/></a>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>

            </div>
        );
    }
}

export default Editor;