import React, { useState, useEffect } from "react";
import { Container, Form, H3 } from "./LoginStyles";
import { Input } from "../../components/Input";
import GreatestApp from "../../components/GreatestApp";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxhooks";
import { authSession, token } from "../../store/regSlice";
import { useHistory } from "react-router";
import { VscError } from 'react-icons/vsc';
import Modal from "../../components/Modal/Modal";
import axios from 'axios';

const Login: React.FC = () => {

    const userToken = useAppSelector(token);
    const history = useHistory();

    const userCheck = (): void => {
        if (userToken) {
            history.push('/');
        };
    };

    useEffect(() => {
        userCheck();
    }, []);

    const dispatch = useAppDispatch();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState(false);

    const errorHandler = (): void => {
        setError(!error);
    }

    const formHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (email.length === 0 || password.length === 0) {
            return;
        };

        axios.post('http://localhost:3333/sessions', {
            "email": email,
            "password": password
        })
          .then(function (response) {
            console.log(response);
            dispatch(authSession(response.data.token));
            history.push('/');
        })
          .catch(function (error) {
            console.log(error);
            errorHandler();
        });
    };

    return (
        <>
        <Container jc="space-evenly" ai="space-around" mt="5rem">
            <GreatestApp />
            <Container fd="column" mw="22rem">
                <H3 className="center">Authentication</H3>
                <Form onSubmit={formHandler}>
                    <Input type="email" 
                        placeholder="Email" 
                        id="radius" 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <Link to="/recover">I forgot my password</Link>
                    <button>Log In ➝</button>
                </Form>
                <H3 id="signup" className="center"><Link to="/signup">Sign Up ➝</Link></H3>
            </Container>
        </Container>
        {error && <Modal onClose={errorHandler}>
            <div className="errorHeader">
                <h2 onClick={errorHandler}><VscError /></h2>
            </div>
            <div className="errorText">
                <p>Wrong email/password combination!</p>
                <button onClick={errorHandler}>Try again</button>
            </div>
        </Modal>}
        </>
    );
};

export default Login;