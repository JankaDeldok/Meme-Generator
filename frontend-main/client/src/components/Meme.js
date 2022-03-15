import {Button, ButtonGroup, Col, Form, Image, Row} from "react-bootstrap";
import React, {useState} from "react";
import Speech from 'react-speech';

import {BsCaretDown, BsCaretUpFill, BsChatLeftFill} from "react-icons/bs";
import {Link, useNavigate} from "react-router-dom";

function Meme(props) {

    const commentPlaceholder = "Add your comment here";
    const [comment, setComment] = useState('')
    const [showComments, setShowComments] = useState(false)

    async function upvote() {
        const response = await fetch('http://localhost:5000/api/upvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: props.memeData._id
            }),
        })
        const data = await response.json()
        //console.log(data)
        if (props.triggerUpdateInParent) {
            props.triggerUpdateInParent();
        }
    }

    async function downvote() {
        const response = await fetch('http://localhost:5000/api/downvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: props.memeData._id
            }),
        })
        const data = await response.json()
        //console.log(data)
        if (props.triggerUpdateInParent) {
            props.triggerUpdateInParent();
        }
    }

    async function submitComment(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/addcomment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: props.memeData._id,
                comment: comment
            }),
        })
        const data = await response.json().then()
        if (data) {
            setComment('')
            event.target.reset();
        }
        //console.log(data)
        if (props.triggerUpdateInParent) {
            props.triggerUpdateInParent();
        }
    }

    function getMemeText() {
        let readoutString = `The title of this meme is ${props.memeData.name}. 
                            It shows ${props.memeData.desc}. `;
        let memetexts = JSON.parse(props.memeData.memetexts);
        if (memetexts.text1) {
            readoutString += "The first text is " + memetexts.text1.text;
        }
        if (memetexts.text2) {
            readoutString += "The second text is " + memetexts.text2.text;
        }
        if (memetexts.text3) {
            readoutString += "The third text is " + memetexts.text3.text;
        }
        if (props.memeData.comments.length) {
            readoutString += "The comments for this meme are ";
            props.memeData.comments.map(element => {
                readoutString += element.comment + ". "
            })
        } else {
            readoutString += "It has no comments.";
        }
        return readoutString;
    }

    const navigate = useNavigate();
    const toComponent = () => {
        navigate('/editor', {state: props.memeData});
    }
    if (props.isHistory) {
        return (
            <Col md={6}>
                <h4>{props.memeData.name}</h4>
                <Row onClick={toComponent}>
                    {/*from https://www.w3docs.com/snippets/html/how-to-display-base64-images-in-html.html*/}
                    <Image className={"img-fluid"} src={props.memeData.img} alt={props.memeData.desc}/>

                </Row>
                <Row className={"pt-3"}>
                    <Col className={"dark ms-3"}><Button
                        onClick={() => setShowComments(!showComments)}><BsChatLeftFill/> {props.memeData.comments ? props.memeData.comments.length : 0}
                    </Button></Col>
                    <Col/>
                    <Col sm={4}>
                        <Button
                            onClick={() => upvote()}><BsCaretUpFill/> {props.memeData.upvotes ? props.memeData.upvotes : 0}
                        </Button>
                        <Button
                            onClick={() => downvote()}><BsCaretDown/> {props.memeData.downvotes ? props.memeData.downvotes : 0}
                        </Button>
                    </Col>
                </Row>
                {showComments &&
                <div>
                    <Row>
                        <Col className={"pe-5 d-flex flex-column"}>
                            {props.memeData.comments.map((element) => (
                                <Row key={element._id}>
                                    <BsChatLeftFill/> <p>{element.comment}</p>
                                </Row>
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        {/*    https://reactjs.org/docs/forms.html*/}
                        <Form className="mb-md-5" onSubmit={submitComment}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="comment" placeholder={commentPlaceholder}
                                              onChange={(e) => setComment(e.target.value)}/>
                            </Form.Group>
                            <ButtonGroup>
                                <Button disabled={!comment.length} variant="secondary" type="submit">
                                    Submit
                                </Button>
                            </ButtonGroup>
                        </Form>
                    </Row>
                </div>}
            </Col>
        );
    }

    return (
        <Row>
            <Col md={2}></Col>
            <Col>
                <Row>
                    <Col>
                        <h4>{props.memeData.name}</h4>
                    </Col>
                    <Col md={1}>
                        {/*Text to speech with https://www.npmjs.com/package/react-speech*/}
                        <Speech
                            text={getMemeText()}
                        />
                    </Col>
                </Row>
                <Row>
                    {/*from https://www.w3docs.com/snippets/html/how-to-display-base64-images-in-html.html*/}
                    <Link to={`/single_meme/${props.memeData.name}`}>
                        <Image className={"img-fluid"} src={props.memeData.img} alt={props.memeData.desc}/>
                    </Link>
                </Row>
                <Row className={"pt-3"}>
                    <Col className={"dark ms-3"}><Button
                        onClick={() => setShowComments(!showComments)}><BsChatLeftFill/> {props.memeData.comments ? props.memeData.comments.length : 0}
                    </Button></Col>
                    <Col/>
                    <Col sm={4}>
                        <Button
                            onClick={() => upvote()}><BsCaretUpFill/> {props.memeData.upvotes ? props.memeData.upvotes : 0}
                        </Button>
                        <Button
                            onClick={() => downvote()}><BsCaretDown/> {props.memeData.downvotes ? props.memeData.downvotes : 0}
                        </Button>
                    </Col>
                </Row>
                {showComments &&
                <div>
                    <Row>
                        <Col className={"pe-5 d-flex flex-column"}>
                            {props.memeData.comments.map((element) => (
                                <Row key={element._id}>
                                    <BsChatLeftFill/> <p>{element.comment}</p>
                                </Row>
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        {/*    https://reactjs.org/docs/forms.html*/}
                        <Form className="mb-md-5" onSubmit={submitComment}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="comment" placeholder={commentPlaceholder}
                                              onChange={(e) => setComment(e.target.value)}/>
                            </Form.Group>
                            <ButtonGroup>
                                <Button disabled={!comment.length} variant="secondary" type="submit">
                                    Submit
                                </Button>
                            </ButtonGroup>
                        </Form>
                    </Row>
                </div>}
            </Col>
            <Col md={2}></Col>
        </Row>
    );
}

export default Meme;
