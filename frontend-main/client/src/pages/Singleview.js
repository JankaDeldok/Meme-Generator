import React, {useEffect, useState} from 'react';
import {Button, Carousel, CarouselItem, Col, Container, Row} from "react-bootstrap";
import {ImLoop, ImShuffle} from "react-icons/im";
import {BsFillBarChartFill, BsFillSquareFill, BsPauseFill, BsPlayFill} from "react-icons/bs";
import Meme from "../components/Meme";
import {useNavigate, useParams} from "react-router-dom";
import BarChart from "../components/BarChart";
// Using the Carousel from: https://react-bootstrap.github.io/components/carousel/
// eg. https://react-bootstrap.netlify.app/components/carousel/#carousel-props

// The amount of time to delay between automatically cycling an item in autoplay mode
const interval = 5000;
const memeUrl = "http://localhost:5000/api/memes";

function Singleview() {
    let {memename} = useParams(); // get memename from url params
    let navigate = useNavigate(); // for modifying url with current memename on slidechange

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [memes, setMemes] = useState([]);

    const [autoplay, setAutoplay] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [shuffleRandomizer, setShuffleRandomizer] = useState(0);
    const [index, setIndex] = useState(0);
    const [stats, setStats] = useState(null);

    async function handleSelect(selectedIndex) {
        setIndex(selectedIndex);
        loadStats(selectedIndex);
        const response = await fetch(memeUrl)
        const data = await response.json().then()
        if (data) {
            if (shuffle) {
                let shuffledMemes = data;
                shuffleArray(shuffledMemes, shuffleRandomizer)
                setMemes(shuffledMemes);
            } else {
                setMemes(data);
            }
            navigate(`/single_meme/${data[selectedIndex].name}`);
            setIsLoaded(true);
        } else if (error) {
            setIsLoaded(true);
            setError(error);
        }
    }

    function loadStats(selectedIndex) {
        console.log("loading stats");
        let memeDisplayed = memes[selectedIndex];
        let memeStats = [{
            upvotes: memeDisplayed.upvotes,
            downvotes: memeDisplayed.downvotes,
            comments: memeDisplayed.comments.length
        }];
        let memesWithSameTemplate = memes.filter(function (memeToFilter) {
                return memeToFilter.template_id === memeDisplayed.template_id
            }
        );
        let allUpvotes = [3, 5, 6, 7]; //TODO: remove values before handing in, just needed since we do not have any memes in db
        let allDownvotes = [2, 1, 3, 4]; //TODO: remove
        let allCommentsInt = [2, 5, 6, 6];
        memesWithSameTemplate.forEach((memeOther) => {
            allUpvotes.push(memeOther.upvotes);
            allDownvotes.push(memeOther.downvotes);
            allCommentsInt.push(memeOther.comments.length);
        })
        const average = (array) => array.reduce((a, b) => a + b) / array.length;
        memeStats.push({
            upvotes: average(allUpvotes),
            downvotes: average(allDownvotes),
            comments: average(allCommentsInt)
        })
        setStats(memeStats);
        console.log("Stats should be loaded");
    }

    // from https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
    function shuffleArray(arr, random) {
        arr.sort(() => random - 0.5);
    }

    useEffect(() => {
        fetch(memeUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    setMemes(result);
                    if (memename) {
                        // show the meme from url
                        setIndex(result.findIndex(element => element.name === memename))
                    } else {
                        // if no meme preselected, show meme at random place
                        const randomIndex = Math.floor(Math.random() * result.length);
                        setIndex(randomIndex)
                        // and modify url accordingly
                        navigate(`/single_meme/${result[randomIndex].name}`);
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []); // just happens in componentDidMount because of empty dependencies array

    async function toggleAutoplay() {
        if (!autoplay) {
            // go to next slide
            let hasNext = index < memes.length - 1
            await handleSelect((hasNext ? (index + 1) : 0));
        }
        setAutoplay(!autoplay);
    }

    async function toggleShuffle() {
        setIsLoaded(false);
        if (!shuffle) {
            await activateShuffle()
        } else {
            await deactivateShuffle()
        }
    }

    async function activateShuffle() {
        // set new randomizer so that memes will be shuffled in the same way until shuffle is toggled again
        setShuffleRandomizer(Math.random());
        setShuffle(true);
        const response = await fetch(memeUrl)
        const data = await response.json().then()
        if (data) {
            let shuffledMemes = data;
            shuffleArray(shuffledMemes, shuffleRandomizer)
            navigate(`/single_meme/${data[index].name}`);
            setMemes(shuffledMemes);
            setIsLoaded(true);
        } else if (error) {
            setIsLoaded(true);
            setError(error);
        }
    }

    async function deactivateShuffle() {
        setShuffle(false);
        const response = await fetch(memeUrl)
        const data = await response.json().then()
        if (data) {
            let correctIndex = data.findIndex(elem => elem.name === memename);
            setIndex(correctIndex); // go to correct index
            navigate(`/single_meme/${data[correctIndex].name}`);
            setMemes(data);
            setIsLoaded(true);
        } else if (error) {
            setIsLoaded(true);
            setError(error);
        }
    }



    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded || memes.length < 1) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <Container className="singleView my-4 pb-3 border-bottom border-1 border-secondary">
                    <div className={"dark"}>
                        <div className={"d-flex justify-content-end mb-3"}>
                            <Button onClick={() => toggleAutoplay()} variant={"outline-primary"}>
                                {autoplay
                                    ? <BsPauseFill className="right px-3"/>
                                    : <BsPlayFill className="right px-3"/>
                                }
                            </Button>
                            <span className={"m-2"}/>
                            <Button onClick={toggleShuffle} variant={"outline-primary"}>
                                {shuffle
                                    ? <ImLoop className="right px-3"/>
                                    : <ImShuffle className="right px-3"/>
                                }
                            </Button>
                        </div>
                        <Carousel
                            interval={autoplay ? interval : null}
                            activeIndex={index}
                            onSelect={handleSelect}
                        >
                            {memes.map(meme => (
                                <CarouselItem key={meme._id}>
                                    <Meme memeData={meme}>
                                    </Meme>
                                </CarouselItem>
                            ))}
                        </Carousel>
                    </div>
                </Container>

                <Container>  {/*Stats*/}
                    <Row>
                        <Col md={6}>  {/*Stats*/}
                            <h5>How popular is the meme?</h5>
                            <BarChart data={stats}/>
                            <p>
                                <BsFillSquareFill className={"blue"}/> Shown Meme<br/>
                                <BsFillSquareFill className={"turquoise"}/> Average for same template
                            </p>
                        </Col>
                        <Col>
                            <p className={"py-2 dark fs-little"}>
                                In the Barchart you can see how the meme performs in comparison to all the other memes
                                using the same template. <br/></p>
                            <p className={"fs-little"}>
                                <BsFillBarChartFill className={"blue"}/> Shows how many upvotes, downvotes eg.
                                the meme has.<br/>
                                <BsFillBarChartFill className={"turquoise"}/> Show how many upvotes, downvotes, eg.
                                all other memes, using the same template, have on average.
                            </p>
                        </Col>
                    </Row>
                </Container>
                {/*  
                <Container>
                    <video id="videoPlayer" controls>
                        <source src="http://localhost:5000/api/memevideo" type="video/mp4"></source>
                    </video>
                </Container>
                */}
            </div>
        );
    }
}

export default Singleview;