import React, {useState} from "react";
import {Form, FormControl} from "react-bootstrap";
import axios from "axios";


const Uploads = () => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState(null);


    async function uploadImg(typeOfUpload) {
        console.log("uploadImgTriggered")
        if (name === "") {
            console.log("please specify a name");
            return;
        } else {
            //console.log(name);
        }
        if (desc === "") {
            console.log("please specify a description");
            return;
        } else {
            //console.log(desc);
        }

        if (img === "") {
            console.log("please specify an image");
            return;
        } else {
            //console.log(img);
        }


        var memetexts = "Not available";
        var creator =  localStorage.getItem('currentUserMail') ? localStorage.getItem('currentUserMail') : "anonym"; // TODO
        var apiCall = "";
        var bodyJson;
        
        switch (typeOfUpload){
            case "meme": // meme and draft have the same upload patern
            case "draft": {
                apiCall = typeOfUpload;
                bodyJson = JSON.stringify({
                    creator,
                    name,
                    desc,
                    img,
                    memetexts,
                });
                break;
            }
            case "template": {
                apiCall = typeOfUpload;
                bodyJson = JSON.stringify({
                    creator,
                    name,
                    desc,
                    img,
                })
                break;
            }
            
            default: {
                console.log("Wrong api call specified")
                return;
            }
        }

        const response = await fetch('http://localhost:5000/api/post' + apiCall , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyJson,
        });
        const data = await response.json()
        console.log(data)
    }

    function onImageChange(e) {
        var tempImg = e.target.files[0];
        //console.log(tempImg)

        var tempUrl = URL.createObjectURL(tempImg);
        //console.log(tempUrl)

        var reader = new FileReader();
        reader.readAsDataURL(tempImg);
        reader.onloadend = function () {
            var base64data = reader.result;
            //console.log(base64data);
            setImg(base64data);
        }
    }


    return (
        <div>
            <div>
                <form>
                    <label>
                        Name:
                        <input
                            name="Name"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            required/>
                    </label>
                    <br/>
                    <label>
                        Description:
                        <input
                            name="Desc"
                            type="text"
                            onChange={(e) => setDesc(e.target.value)}
                            required/>
                    </label>
                    <br/>
                    <label>
                        Image:
                        <input
                            name="img"
                            type="file"
                            accept="image/png, image/jpeg"
                            required
                            onChange={onImageChange}
                        />
                    </label>
                    <br/>
                    <button type="button" onClick={() => uploadImg("meme")}>Upload as Meme</button>
                    <br/>
                    <button type="button" onClick={() => uploadImg("template")}>Upload as Template</button>
                    <br/>
                    <button type="button" onClick={() => uploadImg("draft")}>Upload a Draft</button>
                </form>
            </div>


        </div>

    );
}

export default Uploads;
