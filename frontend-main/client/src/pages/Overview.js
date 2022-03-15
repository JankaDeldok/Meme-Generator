import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Container, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import Meme from "../components/Meme";
import {BsFillFunnelFill, BsFillXSquareFill} from "react-icons/bs";

// AJAX calls in accordance to https://reactjs.org/docs/faq-ajax.html
// useEffect cleanup from https://overreacted.io/a-complete-guide-to-useeffect/#so-what-about-cleanup
// infinite scroll from https://dev.to/hunterjsbit/react-infinite-scroll-in-few-lines-588f
// and https://thewebdev.info/2021/09/25/how-to-detect-when-a-user-scrolls-to-bottom-of-div-with-react/

const baseUrl = "http://localhost:5000/api/memes";
const limit = 10;
const filterPlaceholder = "text";
const defaultOrder = "asc";

function Overview() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [memes, setMemes] = useState([]);
    const [sort, setSort] = useState("");
    const [order, setOrder] = useState(defaultOrder);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [isInit, setIsInit] = useState(true);

    // for endless scroll
    // tracking on which page we currently are
    const [page, setPage] = useState(1);
    // ref to scrollable container
    const listInnerRef = useRef();

    const onScroll = () => {
        if (listInnerRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight) {
                setPage((page) => page + 1)
            }
        }
    };


    function getFilterParams() {
        let filterParams = ""
        if (filterCategory.length && filterValue.length) {
            filterParams = `?${filterCategory}=${filterValue}`
        }
        return filterParams;
    }


    function getSortParams() {
        let sortParams = "";
        if (sort.length) {
            sortParams = (filterCategory.length && filterValue.length) ? "&" : "?";
            sortParams += `sort=${sort}&order=${order}`;
        }
        return sortParams;
    }

    function getPageParams() {
        return ((sort.length || (filterCategory.length && filterValue.length)) ? "&" : "?")
            + "page=" + page + "&limit=" + limit;
    }

    useEffect(() => {
        let didCancel = false;
        let url = baseUrl + getFilterParams() + getSortParams() + getPageParams();
        console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    if (!didCancel) {
                        // add more memes to list if page greater than 1
                        if (page > 1) {
                            let newMemes = memes.concat(result)
                            setMemes(newMemes);
                            console.log("fetched next page");
                        } else {
                            setMemes(result)
                            console.log("fetched page 1")
                            setIsInit(false)
                        }
                    }
                    setIsLoaded(true);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        return function cleanup() {
            didCancel = true;
        };
    }, [page])

    useEffect(() => {
        let didCancel = false;
        if (!didCancel) {
            setIsLoaded(false);
            updateAllMemes();
        }
        return function cleanup() {
            didCancel = true;
        };
    }, [filterValue, sort, order])

    function updateAllMemes() {
        if (isInit) {
            return;
        }
        setIsLoaded(false);
        if (page !== 1) {
            setPage(1);
        } else {
            let url = baseUrl + getFilterParams() + getSortParams() + getPageParams();
            console.log(url)
            fetch(url)
                .then(res => res.json())
                .then(
                    (result) => {
                        setMemes(result)
                        console.log("refetched page 1")
                        setIsLoaded(true);
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                );
        }
    }


    function resetFilterText() {
        setFilterValue("");
        document.getElementById("filterValue").value = "";
    }

    function resetFilter() {
        setFilterCategory("");
        document.getElementById("selectFilter").value = "";
        resetFilterText()
    }

    function resetSort() {
        setSort("");
        setOrder(defaultOrder);
        document.getElementById("selectSort").value = "";
        document.getElementById("selectOrder").value = defaultOrder;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <div>
                <Container className="overview my-5 border-bottom border-2 dark">
                    <Row className={"mb-2 border-bottom border-1 dark"}>
                        <Col>
                            <h4>Filter</h4>
                        </Col>
                        <Col sm={8}>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>Sort by:</InputGroup.Text>
                                <Form.Select
                                    id="selectSort"
                                    onChange={(e) => setSort(e.target.value)}>
                                    <option value="">none</option>
                                    <option value="name">title</option>
                                    <option value="desc">description</option>
                                    <option value="upvotes">upvotes</option>
                                    <option value="downvotes">downvotes</option>
                                </Form.Select>
                                <Form.Select
                                    id="selectOrder"
                                    onChange={(e) => setOrder(e.target.value)}>
                                    <option value="asc">ascending</option>
                                    <option value="desc">descending</option>
                                </Form.Select>
                                <Button variant={"dark"} className={"ms-1"}
                                        onClick={() => resetSort()}> <BsFillXSquareFill/> </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup className="mb-2">
                                <InputGroup.Text><BsFillFunnelFill/> Filter value:</InputGroup.Text>
                                <Form.Select
                                    id="selectFilter"
                                    onChange={(e) => {
                                        setFilterCategory(e.target.value);
                                        resetFilterText();
                                    }}>
                                    <option value="">none</option>
                                    <option value="name">title</option>
                                    <option value="desc">description</option>
                                    <option value="upvotes">upvotes</option>
                                    <option value="downvotes">downvotes</option>
                                </Form.Select>
                                <FormControl id="filterValue" placeholder={filterPlaceholder}
                                             onChange={(e) => setFilterValue(e.target.value)}/>
                                <Button
                                    variant={"dark"}
                                    className={"ms-1"}
                                    onClick={() => resetFilter()}
                                > <BsFillXSquareFill/> </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
                {isLoaded ?
                    <Container className={"overview memes"}
                               onScroll={onScroll}
                               ref={listInnerRef}>
                        {memes.map(meme => (
                            <Meme key={meme._id} memeData={meme} triggerUpdateInParent={() => updateAllMemes()}>
                            </Meme>
                        ))}
                        {(memes.length < 1) &&
                        <div>No memes found.</div>}
                    </Container>
                    :
                    <div>Loading memes...</div>
                }

            </div>
        );
    }

}

export default Overview;