import {useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import History from '../components/History';
import {BsGoogle} from "react-icons/bs";
import {Button, ButtonGroup, Container, Form} from "react-bootstrap";

// example from https://react-bootstrap.github.io/forms/overview/ used for the html


const Account = () => {

    // state variables for Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // state variables for Register
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // check if user is logged in. If user is logged in, his userToken and currentUserMail are accessable from everywhere
    let isLoggedIn = false;
    const userToken = localStorage.getItem('userToken');
    const userMail = localStorage.getItem('currentUserMail');
    if (userToken !== null && userToken !== '' && userMail !== null && userMail !== ''){
        isLoggedIn = true;
    }
    else{
        isLoggedIn = false;
    }

    // function to log user in and load history instead of Login Page
    async function login(event){
        event.preventDefault()
        const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            loginEmail,
            loginPassword,
            }),
        })
        const data = await response.json();

        if(data.user){
            localStorage.setItem('userToken', data.user);
            localStorage.setItem('currentUserMail', loginEmail);
            isLoggedIn = true;
            window.location.reload();
            }
        else{
            alert('Please check your username and password');
        }
    }

    // function to create user account
    async function register(event){
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
        const data = await response.json();

        if (data.status === 'ok'){
            alert("Account erfolgreich erstellt, Sie können sich nun einloggen");
        }
    }

    // function to log user in with his google account and load history instead of Login Page
    const googleLoginSuccesful = res => {
        localStorage.setItem('userToken', res.tokenId);
        localStorage.setItem('currentUserMail', res.profileObj.email);
        
        isLoggedIn = true;
        window.location.reload();
    };

    // function if log in with google failed
    const googleFailure = () => {
        alert("Google Sign In was unsuccessful.")
    };

    // function to log user out
    function logout(event){
        event.preventDefault();
        localStorage.setItem('userToken', '');
        localStorage.setItem('currentUserMail', '');
        isLoggedIn = false;
        window.location.reload();
        alert("Sign Out was successful.")
    }

    const googleLogoutSuccesful = () => {
        localStorage.setItem('userToken', '');
        localStorage.setItem('currentUserMail', '');
        isLoggedIn = false;
        window.location.reload();
        alert("Sign Out was successful.")
    }

    // return sign in/ log in page if user is not logged in
    if (!isLoggedIn){
        return (
            <div className={"account"}>
                <Container className="account">
                    <h2>Sign in</h2>
                    <Form className="mb-md-5" onSubmit={login}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setLoginEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control  type="current-password" placeholder="Password" onChange={(e) => setLoginPassword(e.target.value)}/>
                        </Form.Group>
                        <ButtonGroup>
                            <Button variant="secondary" type="submit">
                                Sign in with Email
                            </Button>
                            <GoogleLogin 
                                clientId='' // enter google client ID here
                                render={(renderProps) => (
                                    <Button 
                                        variant="outline-light"
                                        onClick={renderProps.onClick} 
                                        disabled={renderProps.disabled} 
                                        >
                                            Sign in with <BsGoogle/> 
                                    </Button>
                                )}
                                onSuccess={googleLoginSuccesful}
                                //isSignedIn={true}
                                onFailure={googleFailure}
                                cookiePolicy='single_host_origin'
                            />
    
                        </ButtonGroup>
    
                    </Form>
                    <h2>Register</h2>
                    <Form className="mb-md-5" onSubmit={register}>
                    <Form.Group className="mb-3" controlId="formBasicEmail2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control  type="current-password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Accept data policy"  />
                        </Form.Group>
                        <ButtonGroup>
                            <Button variant="secondary" type="submit">
                                Register new account
                            </Button>
                            <GoogleLogin 
                                clientId='' // enter google client ID here
                                render={(renderProps) => (
                                    <Button 
                                        variant="outline-light"
                                        onClick={renderProps.onClick} 
                                        disabled={renderProps.disabled} 
                                        >
                                            Sign in with  <BsGoogle/>
                                    </Button>
                                )}
                                onSuccess={googleLoginSuccesful}
                                onFailure={googleFailure}
                                cookiePolicy='single_host_origin'
                                
                            />
                        </ButtonGroup>
                    </Form>
                </Container>
            </div>
        );
    }

    // return history, if user is logged in
    else{
        return (
        <div className={"account"}>
            <Container className="my-5 border-bottom border-1 border-secondary">
            <h2>History</h2>
                <History/>
                <h2>Sign out</h2>
                <Form className="mb-md-5" onSubmit={logout}>
                    <ButtonGroup>
                        <Button variant="secondary" type="submit">
                            Sign Out
                        </Button>
                        <GoogleLogout
                            clientId='' // enter google client ID here
                            //buttonText="Logout"
                            render={(renderProps) => (
                                <Button 
                                    variant="outline-light"
                                    onClick={renderProps.onClick} 
                                    disabled={renderProps.disabled} 
                                    >
                                        Sign out with <BsGoogle/>
                                </Button>
                            )}
                            onLogoutSuccess={googleLogoutSuccesful}
                            cookiePolicy='single_host_origin'
                            //onFailure={googleFailure}
                            >
                        </GoogleLogout>
                    </ButtonGroup>
                </Form>
            </Container>
        </div>
        );
    }
}
export default Account;
