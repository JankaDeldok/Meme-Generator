import React, {useEffect, useState} from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import Meme from "../components/Meme";

// AJAX calls in accordance to https://reactjs.org/docs/faq-ajax.html

function History () {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [memes, setMemes] = useState([]);

    useEffect(() => {
        let didCancel = false;
        // ToDo: Only fetch MY memes
        fetch("http://localhost:5000/api/draftcreator?creator=test@test.org") //api/draftcreator?creator=anonym
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    if (!didCancel) {
                        setMemes(result);
                    }
                    setIsLoaded(true);
                },

                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        return function cleanup() {
            didCancel = true;
        };
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <Container className={"overview memes"}>
                    {memes.map(meme => (
                        <Meme key={meme._id} memeData={meme} isHistory={true}>
                        </Meme>
                    ))}
                </Container>
            </div>
        );
    }
}

export default History;
