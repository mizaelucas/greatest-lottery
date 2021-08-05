import React, { useState } from "react";
import { Container, Form, H3 } from "./LoginStyles";
import { Input } from "../../components/Input";
import GreatestApp from "../../components/GreatestApp";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { selectUsers } from "../../store/regSlice";
import { useAppSelector } from "../../hooks/reduxhooks";
import { useAppDispatch } from "../../hooks/reduxhooks";
import { currentUser } from "../../store/regSlice";
import { useHistory } from "react-router";

const Login: React.FC = () => {

    const history = useHistory();
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    console.log(users);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const emailResetter = () => {
        setEmail('');
    };

    const passwordResetter = () => {
        setPassword('');
    };

    const formHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (email.length === 0 || password.length === 0) {
            return;
        };

        const emailAuth = users.find((user: any) => user.email === email);
        const passwordAuth = users.find((user: any) => user.password === password);

        console.log(email, password);
        console.log(emailAuth, passwordAuth);
        

        if (emailAuth === undefined || passwordAuth === undefined) {
            return alert('Invalid email/password combination');
        } else {
            let index = users.findIndex((user: any) => user.email === email);
            console.log(index);
            dispatch(currentUser(users[index]));
            history.push('/');
        }

        emailResetter();
        passwordResetter();
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
        <Footer>Copyright 2021  Luby Software</Footer>
        </>
    );
};

export default Login;