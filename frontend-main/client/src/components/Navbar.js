import React from "react";
import {Navbar, NavLink} from "react-bootstrap";
import {FaBeer} from "react-icons/fa";
import {BsPersonFill} from "react-icons/bs";

// Original code from: https://react-bootstrap.github.io/components/navs/
const navbar = () => {
    return (
            <Navbar expand="lg"  variant={"dark"} className="border-bottom border-1 border-secondary" >
                <Navbar.Brand href="/home">Gruppe085</Navbar.Brand>
                    <NavLink id="home" href="/home">
                        Home <FaBeer />
                    </NavLink>
                    <NavLink id="editor" href="/editor">
                        Editor
                    </NavLink>
                    <NavLink id="memes" href="/memes">
                        Memes
                    </NavLink>
                    <NavLink id="single meme" href="/single_meme">
                        Single Meme
                    </NavLink>
                    <NavLink id="api docu" href="/apidocu">
                        API Docu
                    </NavLink>
                    <NavLink id="account"  href="/account">
                        Account <BsPersonFill/>
                    </NavLink>
            </Navbar>
    );
}
export default navbar;