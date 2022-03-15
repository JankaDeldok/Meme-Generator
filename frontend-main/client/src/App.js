import React from "react";
import Container from 'react-bootstrap/Container';

//loading css (always load boostrap first, so you can override it with custom css):
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


//for navigation:
import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Account from "./pages/Account";
import ApiDoku from "./pages/ApiDoku";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import SingleView from "./pages/Singleview";
import Editor_2 from "./components/editor/Editor_2";
import Uploads from "./pages/Uploads";
import Dictaphone from "./components/Dictaphone";
import {Col, Row} from "react-bootstrap";


function App() {
    return (
        <Container className="p-3">
            <Row>
                <Col>
                    <Navbar />
                </Col>
                <Col md="auto">
                    <Dictaphone/>
                </Col>
            </Row>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route exact path='/home' element={<Home />}> </Route>
                <Route path='/account' element={<Account />}/>
                <Route path='/apidocu' element={<ApiDoku />}/>
                <Route path='/editor' element={<Editor />}/>
                <Route path='/editorYourMeme' element={<Editor_2 />}/>
                <Route path='/memes' element={<Overview />}/>
                <Route path='/single_meme' element={<SingleView />}/>
                <Route path='/single_meme/:memename' element={<SingleView />}/>
                <Route path='/uploads' element={<Uploads />}/>
            </Routes>
        </Router>
        </Container>
    );
}

export default App;
