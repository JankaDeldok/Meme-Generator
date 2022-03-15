import React from 'react';
import {Container} from "react-bootstrap";
import ex from '../assets/creatememeexample.JPG';


async function sendapi() {
    console.log("Sendapi")
    let inputs = [];
    let text = "hello WORLD!";
    let color = "black";
    let posx = "10";
    let posy = "10";
    let template_id = "3";
    let texts = []; // array for texts for one meme
    let textarray = []; // array for texts arrays for more memes

    texts.push({text, posx, posy});
    posx = "10";
    posy = "400";
    texts.push({text, posx, posy});
    posx = "500";
    posy = "100";

    textarray.push(texts);
    texts = [];

    texts.push({text, posx, posy});
    posx = "500";
    posy = "10";
    texts.push({text, posx, posy});

    textarray.push(texts);

    inputs.push({template_id, color, textarray});
    color = "white";
    template_id = "2";
    inputs.push({template_id, color, textarray});

    let bodyJson = JSON.stringify({
        inputs
    });
    const response = await fetch('http://localhost:5000/api/creatememe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyJson,
    });
    const data = await response.json()
    console.log(data)
}

class ApiDoku extends React.Component {
    render() {
        return (
            <div>
                <Container className="my-5">
                    <h1>API Documentation</h1>
                    <p className="lead">Short introduction for our API. What the API can be used for.</p>
                    <h3>How to use the API</h3>
                    <p>Here is text on how <mark>API</mark> can be used.</p>
                    <p>hosted on http://localhost:3000/</p>
                    <h3>Get Requests</h3>
                    <p><code>api/meme-retrieval </code>single random meme</p>
                    <p><code>api/meme-retrieval?name=</code> single meme with name </p>
                    <p><code>api/memecreator?creator=</code> all memes from a single creator</p>
                    <p><code>api/memetemplate?template_id=</code> all memes which use a template</p>
                    <p><code>api/memes</code> get all memes with filters.
                        Filters are given in the query as ?parameters. Possible Parameters
                        <code> sort, order, name, creator, template_id, desc, upvotes, downvotes, noimg, limit</code></p>

                    <p><code>api/templates</code> gets all templates</p>

                    <h3>Api specific Requests</h3>
                    <h6>Meme Retrieval Get Request</h6>
                    <p><code>api/memesurl</code> Same as <code>api/memes</code> but aditionaly returns singleview urls
                        of memes Example: http://localhost:5000/api/memesurl?noimg=true&sort=upvotes&order=desc&upvoted=0&downvotes=0&creator=api&limit=3&template_id=3&desc=api created</p>
                    <h6>Meme Creation POST Request</h6>
                    <p><code>api/creatememe</code> requires a body which defines an array with templates, colors and an array of arrays of texts for each template. A text object in a texts array contains a text, posx and posy</p>

                    <img src={ex}/>

                </Container>
                <Container>
                    <button onClick={sendapi}>TEST CREATEMEME</button>
                    <p>This will create 4 memes, 2 with the template id 2 and 2 with the template id 3</p>
                    <p>Use the url given in <code>api/memesurl</code> to check the memes with id 3 (or just check the console for returned urls)</p>
                </Container>
            </div>
        );
    }
}

export default ApiDoku;