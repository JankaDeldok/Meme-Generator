import {Col, Image, Row} from "react-bootstrap";
import React from "react";
import SpiderGraph from "./SpiderGraph";

//Templates:
// id
// creator
// name
// desc
// img (base64)


//stats


class Templates extends React.Component{
    setParentState;
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            dataStats: null,
            activeTemplate: null,
            activeTemplateId: 0,
            isAlive: true,
        };
        this.setParentState = props;
    }

    //fetches all tenplates from server, fetch all meta data fro memes with templates
    componentDidMount() {
        let url = "http://localhost:5000/api/templates";
        let dataStats = [];
        fetch(url)
            .then(response => response.json())
            .then(data => {
                        this.setState({data});
                        data.forEach((template) => {
                            this.buildStats(template.id)
                                .then(memes => {
                                    dataStats = []; //clean out data
                                    memes.forEach(meme => {
                                        dataStats.push({
                                            id: meme.template_id,
                                            upvotes: meme.upvotes,
                                            downvotes: meme.downvotes
                                        }); //TODO: add more as soon as texts work
                                    })
                                    //set the state thereafter to recalculate the graph
                                    this.setState({
                                        dataStats: {[template.id]: dataStats}
                                    })
                                });
                        })

            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.state.isAlive = false;
    }

    graph = (id) => (
        <SpiderGraph data= {this.state.dataStats[id]}/>//
    )

    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    async buildStats(id) {
        let statsUrl = "http://localhost:5000/api/memes?template_id=" + 42424242 + "&noimg=true"; //TODO + id
        let memes = fetch(statsUrl)
            .then(response => response.json())
            .then(dataMemes => {return dataMemes});

        return await memes;
    }
    /**
     * where i = templateId
     */
    onImageSelect = (i) =>{
        this.setState({
            activeTemplate: this.state.data.at(i),
            activeTemplateId: i,
        })
        this.setParentState.setState(  {
            activeTemplate: this.state.data.at(i),
            activeTemplateId: i,
        })
    }

    templateRow = (template, i) =>(
        <Row key={i} id={template.name? template.name : "template " + i} onClick={() => this.onImageSelect(i)} className={"mx-0 py-3 px-3"} >
            <Col>
                <Image className={"img-fluid fluid"}  onClick={this.onImageSelect.bind(this)}
                       src={template.img}  //template.img
                       alt={template.desc}/>
            </Col>
            <Col className={"mx-3"}>
                <h5>{template.name}</h5>
                {this.state.dataStats ? this.graph(template.id) : <p>Loading Stats...</p>}
            </Col>
        </Row>
    );

    render() {
        if(this.state.data){
        return (
            <div className="templates my-5">
                <h3>Select a template</h3>
                <div>
                    {this.state.data.map((memeTemplate, i) => this.templateRow(memeTemplate, i))}
                </div>
            </div>
        );
        } else {
            return (<div className="templates my-5">
                <h3>Select a template</h3>
                <div>
                  <p>Loading templates...</p>
                </div>
            </div>);
        }
    }
}
export default Templates;
