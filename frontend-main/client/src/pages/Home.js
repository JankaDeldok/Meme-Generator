import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

// so würde man SVGs importieren: import {ReactComponent as AccountSVG, ReactComponent as API_SVG} from '../assets/home/apidoku_2.svg';
class Home extends React.Component {
    render() {
        return (
            <div>
                <Container className="home">
                    <Row className="my-2">
                        <Col id="editor" sm={8} className="p-2"> <a href="./editor" >
                            <div className="filler"/>
                        </a></Col>
                        <Col id="api" sm={4} className="p-2"> <a href="./apidocu">
                            <div className="filler"/></a></Col>
                    </Row>
                    <Row className="my-2">
                        <Col id="overview" className="p-2"><a href="./memes">
                            <div className="filler"/></a></Col>
                    </Row>
                    <Row className="my-2">
                        <Col id="singleView" className="p-2"><a href="./single_meme">
                            <div className="filler"/></a></Col>
                        <Col id="account" className="p-2"><a href="./account">
                            <div className="filler"/></a>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Home;
